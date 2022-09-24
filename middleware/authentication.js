const authMiddleware = (req, res, next) => {
    const loginPath = '/api/login';
    const dashboardPath = '/api/dashboard';

    // if (req.session.isAuthenticated && req.originalUrl == loginPath) {
    //     res.redirect(dashboardPath);
    // } else if (!req.session.isAuthenticated && req.originalUrl !== loginPath) {
    //     res.redirect(loginPath);
    // } else {
    //     next();
    // }
    next();
}

const disableCacheMiddleware = (req, res, next) => {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
}


module.exports = {
    authMiddleware,
    disableCacheMiddleware
}