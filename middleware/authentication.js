const authMiddleware = (req, res, next) => {
    const loginPath = '/api/login';
    const dashboardPath = '/api/dashboard';

    if (req.originalUrl === dashboardPath && !req.session.isAuthenticated) {
        res.redirect(loginPath);
    }

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