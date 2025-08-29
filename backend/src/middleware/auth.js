import jwt from 'jsonwebtoken';
export function authOptional(req,res,next){const h=req.headers.authorization||'';const t=h.startsWith('Bearer ')?h.slice(7):null;try{if(t)req.user=jwt.verify(t,process.env.JWT_SECRET);}catch{}next();}
export function requireAuth(req,res,next){const h=req.headers.authorization||'';const t=h.startsWith('Bearer ')?h.slice(7):null;if(!t)return res.status(401).json({error:'Missing Authorization'});try{req.user=jwt.verify(t,process.env.JWT_SECRET);next();}catch{res.status(401).json({error:'Invalid token'});}}
export function requireRole(...roles){return (req,res,next)=>{if(!req.user)return res.status(401).json({error:'Auth required'});if(!roles.includes(req.user.role))return res.status(403).json({error:'Forbidden'});next();};}
