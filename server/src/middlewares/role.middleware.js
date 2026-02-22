export const requireRole = (role) => {

  return (req, res, next) => {

    console.log("in the require role")
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    console.log("role from requiest is ",role)
    console.log("role from the user is ",req.user.role)
    if (req.user.role !== role) return res.status(403).json({ message: "Forbidden" });

    console.log("leavving the requireRole")
    next();

  };
};


