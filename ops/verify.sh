#!/usr/bin/env bash
# ops/verify.sh: the repository's own gate. zops runs it before every push.
# © 1993–2026 Abhishek Choudhary. All rights reserved. AyeAI.
# Licensed under GPL-3.0-only.
#
# It refuses only on what a release needs: the harness's own tests, both verifiers on both
# samples (INCOMPLETE is the designed outcome for the generic samples; FAIL is not), the staging
# tests, workflow and citation files that parse, version agreement, no secrets, no oversized
# files, and, once sealed, a manifest that verifies. Scratch files stay inside this folder.
set -euo pipefail
cd "$(dirname "$0")/.."
export PYTHONDONTWRITEBYTECODE=1
SCRATCH="$PWD/.verify-tmp"; rm -rf "$SCRATCH"; mkdir -p "$SCRATCH"; export TMPDIR="$SCRATCH" TMP="$SCRATCH" TEMP="$SCRATCH"
trap 'rm -rf "$SCRATCH"; find . -name __pycache__ -type d -prune -exec rm -rf {} + 2>/dev/null || true' EXIT
FAILED=0
run(){
  local name="$1"; shift; local out
  if out="$("$@" 2>&1)"; then printf '   ok    %s\n' "$name"
  else printf '   FAIL  %s\n' "$name"; printf '%s\n' "$out" | tail -8 | sed 's/^/         /'; FAILED=$((FAILED+1)); fi
}
not_fail(){ local rc=0; "$@" >/dev/null 2>&1 || rc=$?; [ "$rc" -eq 0 ] || [ "$rc" -eq 2 ]; }
yaml_ok(){
  python3 - "$1" <<'PY'
import re, sys
p = sys.argv[1]; text = open(p, encoding="utf-8").read()
try:
    import yaml
    yaml.safe_load(text)
except ImportError:
    first = next((l for l in text.splitlines() if l.strip() and not l.lstrip().startswith("#")), "")
    if not re.match(r"^[A-Za-z_][A-Za-z0-9_-]*:", first):
        sys.exit(f"{p}: the first content line is not a YAML key: {first[:60]!r}")
PY
}
versions_agree(){
  python3 - <<'PY'
import json, re, sys
cff = re.search(r"(?m)^version:\s*['\"]?([^'\"\s]+)", open("CITATION.cff", encoding="utf-8").read())
meta = json.load(open("misty.json", encoding="utf-8")).get("version")
if not cff or cff.group(1) != meta:
    sys.exit(f"CITATION.cff version {cff.group(1) if cff else None} != misty.json version {meta}")
PY
}
no_secrets(){
  local pat hits
  pat='ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{50,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|xox[baprs]-[A-Za-z0-9-]{10,}|AIza[0-9A-Za-z_-]{35}|pypi-AgEI''cHlwaS5vcmc'
  hits="$(grep -rIoE "$pat" --exclude-dir=.git --exclude-dir=.verify-tmp . | grep -vE ':AKIA[0-9A-Z]{9}EXAMPLE$' || true)"
  [ -z "$hits" ] || { printf '%s\n' "$hits"; return 1; }
}
no_oversized(){ local big; big="$(find . -path ./.git -prune -o -type f -size +50M -print)"; [ -z "$big" ] || { printf '%s\n' "$big"; return 1; }; }
syntax_ok(){ local f; for f in pipeline/*.mjs staging/*.mjs examples/sample-component/*.mjs templates/*.mjs docs/assets/*.js docs/sw.js; do node --check "$f" || return 1; done; }
manifest_ok(){
  [ -f MANIFEST.sha256 ] || return 0
  if git rev-parse --is-inside-work-tree >/dev/null 2>&1 && [ -n "$(git status --porcelain --untracked-files=no)" ]; then return 0; fi
  sha256sum --quiet -c MANIFEST.sha256
}

echo "verify: $(basename "$PWD")"
run "verifier unit tests (python -m unittest)"                  python3 -m unittest discover -s tests
run "JavaScript verifier on the Node sample: not FAIL"          not_fail node pipeline/verify.mjs examples/sample-component
run "JavaScript verifier on the Python sample: not FAIL"        not_fail node pipeline/verify.mjs examples/python-sample
run "Python verifier on the Python sample: not FAIL"            not_fail python3 pipeline/verify.py examples/python-sample
run "staging tests"                                             node staging/test.mjs
run "plagiarism tests"                                          node staging/test-plagiarism.mjs
run "global-check tests"                                        node staging/test-global.mjs
run "JavaScript syntax"                                         syntax_ok
run "CITATION.cff and misty.json declare the same version"      versions_agree
run "no secrets"                                                no_secrets
run "no file over 50 MB"                                        no_oversized
run "manifest verifies, when sealed"                            manifest_ok
for f in .github/workflows/*.yml CITATION.cff; do run "parses: $f" yaml_ok "$f"; done
if [ "$FAILED" -eq 0 ]; then echo "verify: PASS"; else echo "verify: $FAILED check(s) failed"; exit 1; fi
