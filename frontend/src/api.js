export const BASE='http://localhost:3000';
export async function apiGet(p,t){const r=await fetch(`${BASE}${p}`,{headers:t?{'Authorization':`Bearer ${t}`}:{}});if(!r.ok)throw new Error(await r.text());return r.json();}
export async function apiPost(p,b,t){const r=await fetch(`${BASE}${p}`,{method:'POST',headers:{'Content-Type':'application/json',...(t?{'Authorization':`Bearer ${t}`}:{})},body:JSON.stringify(b)});if(!r.ok)throw new Error(await r.text());return r.json();}
export async function apiPatch(p,b,t){const r=await fetch(`${BASE}${p}`,{method:'PATCH',headers:{'Content-Type':'application/json',...(t?{'Authorization':`Bearer ${t}`}:{})},body:JSON.stringify(b)});if(!r.ok)throw new Error(await r.text());return r.json();}
