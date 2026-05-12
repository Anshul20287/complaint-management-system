export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied for this role"
      });
    }

    if (req.user.role === "staff" && req.user.staffApprovalStatus !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Staff access is not approved yet"
      });
    }

    next();
  };
};