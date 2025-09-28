// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';

const lc = (v) => String(v ?? '').toLowerCase();

function makeAuthMiddleware(roles = []) {
  const allowed = (Array.isArray(roles) ? roles : [roles])
    .filter(Boolean)
    .map(lc);

  return function (req, res, next) {
    try {
      const h = req.headers?.authorization || '';
      const token = h.startsWith('Bearer ') ? h.slice(7) : null;
      if (!token) return res.status(401).json({ error: 'Missing Authorization' });

      const secret = process.env.JWT_SECRET;
      if (!secret) return res.status(500).json({ error: 'Server auth misconfigured' });

      const payload = jwt.verify(token, secret);
      req.user = payload;

      if (allowed.length) {
        // accept either a single role or an array of roles on the token
        const claimRole = lc(payload.role);
        const claimRoles = Array.isArray(payload.roles) ? payload.roles.map(lc) : [];
        const ok =
          (claimRole && allowed.includes(claimRole)) ||
          claimRoles.some(r => allowed.includes(r));
        if (!ok) return res.status(403).json({ error: 'Forbidden' });
      }

      next();
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

export function authOptional(req, res, next) {
  try {
    const h = req.headers?.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return next();

    const secret = process.env.JWT_SECRET;
    if (!secret) return next();

    const payload = jwt.verify(token, secret);
    req.user = payload; // { id, name, role, ... } (or roles)
  } catch {
    // ignore invalid tokens in optional mode
  }
  return next();
}

export const requireAuth = (roles) => {
  const allowed = (Array.isArray(roles) ? roles : (roles ? [roles] : []))
    .map(lc); // normalize roles
  const debug = (process.env.DEBUG_AUTH === '1' || lc(process.env.DEBUG_AUTH) === 'true');

  return function (req, res, next) {
    try {
      const h = req.headers?.authorization || '';
      const token = h.startsWith('Bearer ') ? h.slice(7) : null;
      if (!token) return res.status(401).json({ error: 'Missing Authorization' });

      const secret = process.env.JWT_SECRET;
      if (!secret) return res.status(500).json({ error: 'Server auth misconfigured' });

      const payload = jwt.verify(token, secret);
      req.user = payload;

      if (allowed.length) {
        // accept either a single role or an array claim
        const claimRole = lc(payload.role);
        const claimRoles = Array.isArray(payload.roles) ? payload.roles.map(lc) : [];
        const ok =
          (claimRole && allowed.includes(claimRole)) ||
          claimRoles.some(r => allowed.includes(r));

        if (!ok) {
          if (debug) {
            console.warn('[AUTH] Forbidden', {
              allowed, claimRole, claimRoles, payloadSubset: { id: payload.id, role: payload.role, roles: payload.roles }
            });
          }
          return res.status(403).json({ error: 'Forbidden' });
        }
      }

      return next();
    } catch (err) {
      if (debug) console.warn('[AUTH] Invalid token', err?.message);
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
};

// Convenience alias if some routes use `requireRole('admin')`
export const requireRole = (...roles) => {
  const list = roles.flat ? roles.flat() : [].concat(...roles);
  return makeAuthMiddleware(list);
};