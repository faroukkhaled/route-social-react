// Read-only verification. No external mutations.
import {writeFile} from 'node:fs/promises';
const results=[];
for(const [path,expected] of [['/api/health',200],['/users/profile-data',401],['/posts?page=1&limit=1',401]]) {
 const r=await fetch('https://route-posts.routemisr.com'+path,{signal:AbortSignal.timeout(20000)});const b=await r.json();results.push({path,status:r.status,message:b.message,expected,pass:r.status===expected});
}
await writeFile(new URL('../docs/live-verification.json',import.meta.url),JSON.stringify({checkedAt:new Date().toISOString(),kind:'read-only unauthenticated checks',results},null,2));
console.log(results);if(results.some(r=>!r.pass))process.exitCode=1;
