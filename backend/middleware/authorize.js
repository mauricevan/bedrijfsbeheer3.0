// Authorization middleware

/**
 * Require admin role
 * Must be used after authenticate middleware
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authenticatie vereist',
    });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({
      error: 'Alleen admins hebben toegang tot deze actie',
    });
  }

  next();
};

/**
 * Require ownership of resource
 * User must be admin OR own the resource
 * @param {string} resourceField - Field name that contains user ID (default: 'userId')
 */
export const requireOwnership = (resourceField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authenticatie vereist',
      });
    }

    const resource = req.resource; // Set by controller

    if (!resource) {
      return res.status(404).json({
        error: 'Resource niet gevonden'
      });
    }

    // Admin can access everything
    if (req.user.isAdmin) {
      return next();
    }

    // User can only access their own resources
    if (resource[resourceField] !== req.user.id) {
      return res.status(403).json({
        error: 'Je hebt geen toegang tot deze resource',
      });
    }

    next();
  };
};
