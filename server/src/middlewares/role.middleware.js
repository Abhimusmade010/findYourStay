// Role hierarchy: SuperAdmin > Admin > Customer
// SuperAdmin inherits all Admin permissions automatically.
const ROLE_HIERARCHY = {
  SuperAdmin: 3,
  Admin: 2,
  Customer: 1,
};

export const requireRole = (minimumRole) => {

  return (req, res, next) => {

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const userLevel = ROLE_HIERARCHY[req.user.role] || 0;
    const requiredLevel = ROLE_HIERARCHY[minimumRole] || 0;

    if (userLevel < requiredLevel) {
          return res.status(403).json({  
            message: `Only ${minimumRole}s can access this route` 
          });
    }
    
    next();

  };
};
