// ============================================================
// auth.js — Authentication & Session Management
// ============================================================

const Auth = (() => {
    const SESSION_KEY = 'cab_session';

    function login(email, password) {
        const user = DB.findOne('users', u => u.email === email && u.password === password);
        if (!user) return { success: false, message: 'Invalid email or password.' };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
        return { success: true, user };
    }

    function logout() {
        sessionStorage.removeItem(SESSION_KEY);
        window.location.href = 'index.html';
    }

    function getCurrentUser() {
        try {
            return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null;
        } catch { return null; }
    }

    function isLoggedIn() {
        return getCurrentUser() !== null;
    }

    // Redirect to login if not authenticated, or if role doesn't match
    function requireAuth(allowedRoles) {
        const user = getCurrentUser();
        if (!user) {
            window.location.href = 'index.html';
            return null;
        }
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        if (roles.length > 0 && !roles.includes(user.role)) {
            // Redirect to appropriate home
            if (user.role === 'admin') window.location.href = 'admin-dashboard.html';
            else window.location.href = 'book-cab.html';
            return null;
        }
        return user;
    }

    // Redirect logged-in users away from login/register pages
    function redirectIfLoggedIn() {
        const user = getCurrentUser();
        if (!user) return;
        if (user.role === 'admin') window.location.href = 'admin-dashboard.html';
        else window.location.href = 'book-cab.html';
    }

    return { login, logout, getCurrentUser, isLoggedIn, requireAuth, redirectIfLoggedIn };
})();
