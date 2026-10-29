export const BASE='https://route-posts.routemisr.com';
export class ApiError extends Error {constructor(message,status){super(message);this.status=status;}}
export function createClient({token=()=>'',onUnauthorized=()=>{},fetcher=fetch}={}){
  return async function request(path,{method='GET',body}={}){
    const headers={};if(token())headers.Authorization=`Bearer ${token()}`;
    if(body && !(body instanceof FormData)){headers['Content-Type']='application/json';body=JSON.stringify(body);}
    let response;try{response=await fetcher(BASE+path,{method,headers,body,signal:AbortSignal.timeout(25000)});}catch{throw new ApiError('Could not reach Route. Check your connection and try again.',0);}
    const result=await response.json().catch(()=>({message:'The server returned an unreadable response.'}));
    if(!response.ok||result.success===false){if(response.status===401)onUnauthorized();const errors=Array.isArray(result.errors)?result.errors.map(x=>typeof x==='string'?x:x.message||x.msg||JSON.stringify(x)).join(' • '):'';throw new ApiError([result.message,errors].filter(Boolean).join(' — ')||'Request failed.',response.status);}
    return result;
  };
}
export const id=x=>typeof x==='string'?x:x?._id||x?.id||'';
export const data=r=>r?.data??r;
export const list=(r,key)=>{const d=data(r);return Array.isArray(d)?d:Array.isArray(d?.[key])?d[key]:[];};
export function multipart(values){const f=new FormData();for(const [k,v]of Object.entries(values))if(v!==undefined&&v!==null&&v!=='')f.append(k,v);return f;}
