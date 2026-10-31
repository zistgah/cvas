#!/usr/bin/env node
// Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.
// CVAS Iteration 2 - JavaScript-first verifier. Python component execution remains supported.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
const NOTICE='Copyright © 1993-2026 Abhishek Choudhary';
const REQUIRED=['id','version','purpose','runtime','entrypoint','test','mutationTest','inputs','outputs','interfaces','preconditions','postconditions','invariants','stateOwnership','dependencies','failureBehaviour','replaceability','verification','riskClass','license','copyright'];
const MAX_FILES=500, MAX_BYTES=20*1024*1024, TIMEOUT=120000;
const args=process.argv.slice(2); const dirArg=args.find(x=>!x.startsWith('--'));
const outIdx=args.indexOf('--json-out'); const outPath=outIdx>=0?args[outIdx+1]:null;
function hashFile(p){return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');}
function filesUnder(dir){let out=[];for(const ent of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,ent.name);if(ent.isSymbolicLink()) throw Error(`Symlink not permitted: ${p}`);if(ent.isDirectory())out.push(...filesUnder(p));else if(ent.isFile())out.push(p);}return out;}
function safeRelative(v){return typeof v==='string'&&v.length>0&&!path.isAbsolute(v)&&!v.split(/[\\/]/).includes('..')&&!v.includes('\0');}
function run(cmd,argv,cwd){return spawnSync(cmd,argv,{cwd,encoding:'utf8',timeout:TIMEOUT,env:{PATH:process.env.PATH||'',HOME:os.tmpdir(),CI:'1',PYTHONNOUSERSITE:'1'}});}
export function verifyDir(dir){ return dir; }
function main(){
 const started=new Date().toISOString(); const report={harness:'CVAS',iteration:2,verifier:'JavaScript-first',checks:[],outcome:'PASS',evidence:{},review:{}};
 const add=(name,outcome,detail='')=>{report.checks.push({name,outcome,detail:String(detail)});if(outcome==='FAIL')report.outcome='FAIL';else if(outcome==='SKIP'&&report.outcome==='PASS')report.outcome='INCOMPLETE';};
 const check=(n,ok,d='')=>add(n,ok?'PASS':'FAIL',d);
 try{
  if(!dirArg)throw Error('Usage: node pipeline/verify.mjs COMPONENT_DIR [--json-out REPORT.json]');
  const dir=path.resolve(dirArg);if(!fs.statSync(dir).isDirectory())throw Error('Component directory does not exist');
  const mp=path.join(dir,'manifest.json');if(!fs.existsSync(mp))throw Error('manifest.json missing');
  const m=JSON.parse(fs.readFileSync(mp,'utf8'));check('manifest-object',!!m&&typeof m==='object'&&!Array.isArray(m),'JSON object');
  const missing=REQUIRED.filter(k=>m[k]===undefined||m[k]===null||m[k]==='');check('manifest-required-fields',missing.length===0,missing.join(', '));if(missing.length)throw Error('Required manifest fields missing');
  check('manifest-id',/^[A-Za-z0-9][A-Za-z0-9._-]{1,100}$/.test(String(m.id)),'Stable ID');
  check('manifest-version',/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(String(m.version)),'Semver-like version');
  check('license',m.license==='GPL-3.0-only','Expected GPL-3.0-only');check('copyright',String(m.copyright).includes(NOTICE),'Notice present');
  check('risk-class',['A','B','C'].includes(m.riskClass),'A replaceable, B significant, C critical');
  check('failure-policy',['HOLD','ERROR','REJECT'].includes(m.failureBehaviour),'Explicit failure behaviour');
  check('replaceability',['contract-bound','adapter','not-replaceable-with-justification'].includes(m.replaceability),'Replacement policy declared');
  check('runtime-supported',['node','python'].includes(m.runtime),'Node.js preferred; Python adapter retained');if(!['node','python'].includes(m.runtime))throw Error('Unsupported runtime');
  for(const k of ['inputs','outputs','interfaces','preconditions','postconditions','invariants','dependencies','verification']){check('manifest-type:'+k,Array.isArray(m[k]),'Must be array');if(!Array.isArray(m[k]))throw Error(k+' must be an array');}
  const targets={};for(const k of ['entrypoint','test','mutationTest']){const v=m[k];const safe=safeRelative(v);check('path:'+k,safe,'Relative package path');if(!safe)throw Error('Unsafe path: '+k);const p=path.resolve(dir,v);if(!(p===dir||p.startsWith(dir+path.sep))||!fs.existsSync(p)||!fs.statSync(p).isFile())throw Error('Missing or escaping '+k);targets[k]=p;}
  const all=filesUnder(dir),total=all.reduce((n,p)=>n+fs.statSync(p).size,0);check('package-file-count',all.length<=MAX_FILES,`${all.length}/${MAX_FILES}`);check('package-size',total<=MAX_BYTES,`${total}/${MAX_BYTES} bytes`);if(all.length>MAX_FILES||total>MAX_BYTES)throw Error('Package resource limit exceeded');
  let suspicious=[];for(const p of all){if(/\.(?:m?js|cjs|py|sh|ya?ml)$/i.test(p)){const t=fs.readFileSync(p,'utf8');if(!t.includes(NOTICE))suspicious.push('missing-notice:'+path.relative(dir,p));if(/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i.test(t)||/(?:api[_-]?key|access[_-]?token|password|client[_-]?secret)\s*[:=]\s*['"][^'"]{8,}['"]/i.test(t))suspicious.push('possible-secret:'+path.relative(dir,p));}}
  check('notices-and-secret-heuristic',suspicious.length===0,suspicious.join('; ')||'Notices present; heuristic scan clean');if(suspicious.length)throw Error('Notice or possible secret finding');
  const runner=m.runtime==='node'?'node':(process.env.PYTHON||'python3');const version=run(runner,m.runtime==='node'?['--version']:['--version'],dir);if(version.error){add('runtime-available','SKIP',version.error.message);}else add('runtime-available',version.status===0?'PASS':'FAIL',(version.stdout||version.stderr).trim());
  if(version.status===0){for(const [key,label] of [['test','executable-test'],['mutationTest','mutation-test']]){const res=run(runner,[targets[key]],dir);add(label,res.error?'FAIL':res.status===0?'PASS':'FAIL',`exit=${res.status}; stdout=${(res.stdout||'').slice(-3000)}; stderr=${(res.stderr||'').slice(-3000)}${res.error?' error='+res.error.message:''}`);}}
  report.review={riskClass:m.riskClass,humanReviewRequired:m.riskClass!=='A',twoIndependentApprovalsRequired:m.riskClass==='C',note:'Upstream repository rules and CODEOWNERS must enforce reviewer authority.'};
  if (fs.existsSync(path.join(dir,'reference.json'))) add('independent-reference-evidence','PASS','Reference file is present. Attestation is the adopting project duty.');
  else add('independent-reference-evidence','SKIP','Adopting project must provide and attest independent reference results.');
  if(m.riskClass==='A'){add('project-integration','SKIP','Project-specific integration is not supplied by the generic seed.');add('human-review','NOT_APPLICABLE','Class A baseline; adopting project may raise the requirement.');}
  else {add('project-integration','SKIP','Project-specific integration and regression evidence required.');add('human-review','SKIP',m.riskClass==='C'?'Critical review of complete change set and two independent approvals required.':'Independent technical review required.');}
  if(report.outcome==='PASS'&&report.checks.some(c=>c.outcome==='SKIP'))report.outcome='INCOMPLETE';
  report.evidence={...report.evidence,manifest_sha256:hashFile(mp),component_tree_sha256:crypto.createHash('sha256').update(all.sort().map(p=>path.relative(dir,p)+':'+hashFile(p)).join('\n')).digest('hex'),file_count:all.length,total_bytes:total};
 }catch(e){add('verifier-exception','FAIL',`${e.name}: ${e.message}`);}
 report.started_utc=started;report.finished_utc=new Date().toISOString();
 const output=JSON.stringify(report,null,2);console.log(output);if(outPath)fs.writeFileSync(path.resolve(outPath),output+'\n');process.exitCode=report.outcome==='FAIL'?1:report.outcome==='INCOMPLETE'?2:0;
}
main();
