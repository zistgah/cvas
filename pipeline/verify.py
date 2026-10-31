#!/usr/bin/env python3
"""CVAS component verifier - Iteration 2.\nCopyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.\n"""
from __future__ import annotations
import argparse, datetime as dt, hashlib, json, os, re, shutil, subprocess, sys, time
from pathlib import Path

COPYRIGHT = "Copyright © 1993-2026 Abhishek Choudhary"
REQUIRED = ["id","version","purpose","runtime","entrypoint","test","mutationTest","inputs","outputs",
            "interfaces","preconditions","postconditions","invariants","stateOwnership",
            "dependencies","failureBehaviour","replaceability","verification","riskClass",
            "license","copyright"]
MAX_FILES, MAX_BYTES, TIMEOUT_SECONDS = 500, 20*1024*1024, 120
SECRET_PATTERNS = [
 re.compile(r"""(?i)(api[_-]?key|access[_-]?token|password|client[_-]?secret)\s*[:=]\s*['"][^'"]{8,}['"]"""),
 re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----")
]
def sha256(path):
 h=hashlib.sha256()
 with path.open("rb") as f:
  for chunk in iter(lambda:f.read(1024*1024),b""): h.update(chunk)
 return h.hexdigest()
def hash_tree(root):
 h=hashlib.sha256()
 for p in sorted(x for x in root.rglob("*") if x.is_file()):
  h.update(str(p.relative_to(root)).encode()); h.update(bytes.fromhex(sha256(p)))
 return h.hexdigest()
def add(report,name,outcome,detail=""):
 report["checks"].append({"name":name,"outcome":outcome,"detail":str(detail)})
 if outcome=="FAIL": report["outcome"]="FAIL"
 elif outcome=="SKIP" and report["outcome"]=="PASS": report["outcome"]="INCOMPLETE"
def verify(component_dir, output_path=None):
 component_dir=Path(component_dir).resolve()
 report={"harness":"CVAS","iteration":2,"component_path":str(component_dir),
         "started_utc":dt.datetime.now(dt.timezone.utc).isoformat(),"checks":[],
         "outcome":"PASS","evidence":{},"review":{}}
 def check(name,ok,detail=""): add(report,name,"PASS" if ok else "FAIL",detail)
 try:
  if not component_dir.is_dir(): raise ValueError("Component directory does not exist")
  mp=component_dir/"manifest.json"
  if not mp.is_file(): raise ValueError("manifest.json is missing")
  manifest=json.loads(mp.read_text(encoding="utf-8"))
  check("manifest-json",isinstance(manifest,dict),"Valid JSON object")
  if not isinstance(manifest,dict): raise ValueError("Manifest must be an object")
  missing=[k for k in REQUIRED if k not in manifest or manifest[k] is None or manifest[k] == ""]
  check("manifest-required-fields",not missing,"Missing/empty: "+", ".join(missing))
  if missing: raise ValueError("Required manifest fields are missing")
  check("manifest-id",bool(re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._-]{1,100}",str(manifest["id"]))),"Stable identifier")
  check("manifest-version",bool(re.fullmatch(r"\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?",str(manifest["version"]))),"Semver-like version")
  check("license",manifest["license"]=="GPL-3.0-only","Expected GPL-3.0-only")
  check("copyright",COPYRIGHT in str(manifest["copyright"]),"Required notice present")
  check("risk-class",manifest["riskClass"] in ["A","B","C"],"A=replaceable, B=significant, C=critical")
  check("failure-policy",manifest["failureBehaviour"] in ["HOLD","ERROR","REJECT"],"Explicit fail-closed behaviour")
  check("replaceability",manifest["replaceability"] in ["contract-bound","adapter","not-replaceable-with-justification"],"Declared replacement policy")
  runtime=manifest["runtime"]
  check("runtime-supported",runtime in ["node","python"],"Supported adapters: node, python")
  if runtime not in ["node","python"]: raise ValueError("Unsupported runtime")
  for field in ["inputs","outputs","interfaces","preconditions","postconditions","invariants","dependencies","verification"]:
   check("manifest-type:"+field,isinstance(manifest[field],list),"Must be an array")
   if not isinstance(manifest[field],list): raise ValueError(field+" must be an array")
  paths={}
  for field in ["entrypoint","test","mutationTest"]:
   rel=manifest[field]
   safe=isinstance(rel,str) and bool(rel) and not Path(rel).is_absolute() and ".." not in Path(rel).parts
   check("path:"+field,safe,"Relative path inside component")
   if not safe: raise ValueError("Unsafe "+field+" path")
   target=(component_dir/rel).resolve()
   inside=(target==component_dir or component_dir in target.parents)
   check("exists:"+field,inside and target.is_file(),"File exists within component")
   if not inside or not target.is_file(): raise ValueError(field+" missing or escapes component")
   paths[field]=target
  all_files=[p for p in component_dir.rglob("*") if p.is_file()]
  total=sum(p.stat().st_size for p in all_files)
  check("package-file-count",len(all_files)<=MAX_FILES,f"{len(all_files)} files; limit {MAX_FILES}")
  check("package-size",total<=MAX_BYTES,f"{total} bytes; limit {MAX_BYTES}")
  if len(all_files)>MAX_FILES or total>MAX_BYTES: raise ValueError("Package exceeds resource limits")
  check("symlink-free",not any(p.is_symlink() for p in component_dir.rglob("*")),"Symlinks are not accepted")
  source=paths["entrypoint"].read_text(encoding="utf-8")
  check("source-copyright",COPYRIGHT in source,"Required copyright notice")
  suspicious=[]
  for p in all_files:
   if p.suffix.lower() in [".js",".mjs",".cjs",".py",".sh",".yml",".yaml"]:
    try: txt=p.read_text(encoding="utf-8")
    except UnicodeDecodeError: continue
    if COPYRIGHT not in txt: suspicious.append("missing-notice:"+str(p.relative_to(component_dir)))
    for pat in SECRET_PATTERNS:
     if pat.search(txt): suspicious.append("possible-secret:"+str(p.relative_to(component_dir)))
  check("source-notices-and-secret-heuristic",not suspicious,"; ".join(suspicious[:20]) if suspicious else "Notices present; heuristic secret scan clean")
  if suspicious: raise ValueError("Missing notice or possible embedded secret detected")
  if runtime=="node":
   node=shutil.which("node")
   if not node: add(report,"runtime-node","SKIP","Node.js unavailable")
   else:
    ver=subprocess.run([node,"--version"],capture_output=True,text=True,timeout=10)
    add(report,"runtime-node","PASS",ver.stdout.strip())
    env={"PATH":os.environ.get("PATH",""),"HOME":str(component_dir),"CI":"1"}
    started=time.monotonic()
    try:
     run=subprocess.run([node,str(paths["test"])],cwd=component_dir,capture_output=True,text=True,timeout=TIMEOUT_SECONDS,env=env)
     add(report,"executable-test","PASS" if run.returncode==0 else "FAIL",
         f"exit={run.returncode}; stdout={run.stdout[-4000:]}; stderr={run.stderr[-4000:]}")
    except subprocess.TimeoutExpired: add(report,"executable-test","FAIL",f"Timed out after {TIMEOUT_SECONDS} seconds")
    report["evidence"]["test_duration_seconds"]=round(time.monotonic()-started,3)
  else:
   ver=subprocess.run([sys.executable,"--version"],capture_output=True,text=True,timeout=10)
   add(report,"runtime-python","PASS",(ver.stdout or ver.stderr).strip())
   started=time.monotonic()
   try:
    env={"PATH":os.environ.get("PATH",""),"HOME":str(component_dir),"PYTHONNOUSERSITE":"1","CI":"1"}
    run=subprocess.run([sys.executable,str(paths["test"])],cwd=component_dir,capture_output=True,text=True,timeout=TIMEOUT_SECONDS,env=env)
    add(report,"executable-test","PASS" if run.returncode==0 else "FAIL",
        f"exit={run.returncode}; stdout={run.stdout[-4000:]}; stderr={run.stderr[-4000:]}")
   except subprocess.TimeoutExpired: add(report,"executable-test","FAIL",f"Timed out after {TIMEOUT_SECONDS} seconds")
   report["evidence"]["test_duration_seconds"]=round(time.monotonic()-started,3)
  # Mutation tests are mandatory: the test suite must detect a deliberately altered implementation.
  mut_path=paths["mutationTest"]
  started=time.monotonic()
  try:
   if runtime=="node":
    mutrun=subprocess.run([shutil.which("node"),str(mut_path)],cwd=component_dir,capture_output=True,text=True,timeout=TIMEOUT_SECONDS,
                          env={"PATH":os.environ.get("PATH",""),"HOME":str(component_dir),"CI":"1"})
   else:
    mutrun=subprocess.run([sys.executable,str(mut_path)],cwd=component_dir,capture_output=True,text=True,timeout=TIMEOUT_SECONDS,
                          env={"PATH":os.environ.get("PATH",""),"HOME":str(component_dir),"PYTHONNOUSERSITE":"1","CI":"1"})
   add(report,"mutation-test","PASS" if mutrun.returncode==0 else "FAIL",
       f"exit={mutrun.returncode}; stdout={mutrun.stdout[-3000:]}; stderr={mutrun.stderr[-3000:]}")
  except subprocess.TimeoutExpired: add(report,"mutation-test","FAIL",f"Timed out after {TIMEOUT_SECONDS} seconds")
  report["evidence"]["mutation_test_duration_seconds"]=round(time.monotonic()-started,3)
  report["review"]={"riskClass":manifest["riskClass"],"humanReviewRequired":manifest["riskClass"] in ["B","C"],
   "twoIndependentApprovalsRequired":manifest["riskClass"]=="C",
   "note":"Enforce approvals with upstream branch protection/CODEOWNERS; this script cannot grant approvals."}
  add(report,"independent-reference-evidence","SKIP","Generic harness cannot authenticate the independent origin of expected results; adopting project must supply and attest trusted reference evidence.")
  if manifest["riskClass"]=="A":
   add(report,"project-specific-integration","NOT_APPLICABLE","Isolated replaceable Class A component; project may impose additional checks.")
   add(report,"human-review","NOT_APPLICABLE","Class A has no generic human-review requirement; project policy may raise it.")
  else:
   add(report,"project-specific-integration","SKIP","Class B/C requires adopting-project integration and regression evidence.")
   add(report,"human-review","SKIP","Class B/C review must be completed upstream.")
  if report["outcome"]=="PASS" and any(c["outcome"]=="SKIP" for c in report["checks"]): report["outcome"]="INCOMPLETE"
 except Exception as exc: add(report,"verifier-exception","FAIL",f"{type(exc).__name__}: {exc}")
 report["evidence"].update({"manifest_sha256":sha256(component_dir/"manifest.json") if (component_dir/"manifest.json").is_file() else None,
                            "source_tree_sha256":hash_tree(component_dir) if component_dir.is_dir() else None})
 report["finished_utc"]=dt.datetime.now(dt.timezone.utc).isoformat()
 if output_path: Path(output_path).write_text(json.dumps(report,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
 return report
def main():
 ap=argparse.ArgumentParser()
 ap.add_argument("component")
 ap.add_argument("--json-out")
 a=ap.parse_args(); r=verify(a.component,a.json_out)
 print(json.dumps(r,indent=2,ensure_ascii=False))
 sys.exit(0 if r["outcome"]=="PASS" else 2 if r["outcome"]=="INCOMPLETE" else 1)
if __name__=="__main__": main()
