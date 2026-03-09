// ============================================================
// sidebar.js — Dynamic Sidebar + Topbar Renderer (v2)
// ============================================================

const Sidebar = (() => {

    const adminLinks = [
        { href: 'admin-dashboard.html', icon: '📊', label: 'Dashboard' },
        { href: 'admin-bookings.html', icon: '📋', label: 'Bookings' },
        { href: 'admin-drivers.html', icon: '🚗', label: 'Drivers' },
        { href: 'admin-cabs.html', icon: '🚕', label: 'Cabs' },
        { href: 'admin-payments.html', icon: '💳', label: 'Payments' },
    ];

    const userLinks = [
        { href: 'book-cab.html', icon: '🚖', label: 'Book a Cab' },
        { href: 'my-bookings.html', icon: '📋', label: 'My Bookings' },
        { href: 'user-payments.html', icon: '💳', label: 'My Payments' },
    ];

    function render() {
        const user = Auth.getCurrentUser();
        if (!user) return;

        const links = user.role === 'admin' ? adminLinks : userLinks;
        const currentPage = window.location.pathname.split('/').pop();

        const navHTML = links.map(l => `
      <a href="${l.href}" class="nav-link ${currentPage === l.href ? 'active' : ''}">
        <span class="nav-icon">${l.icon}</span>
        <span>${l.label}</span>
      </a>
    `).join('');

        const sidebarHTML = `
      <div class="sidebar-logo">
        <div class="logo-icon">🚖</div>
        <div class="logo-text">
          <span class="logo-title">CabEase</span>
          <span class="logo-sub">${user.role === 'admin' ? 'Admin Panel' : 'User Portal'}</span>
        </div>
      </div>
      <nav class="sidebar-nav">${navHTML}</nav>
      <div class="sidebar-footer">
        <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
        <div class="user-details">
          <span class="user-name">${user.name}</span>
          <span class="user-role">${user.role}</span>
        </div>
        <button class="logout-btn" onclick="Auth.logout()" title="Logout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    `;

        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.innerHTML = sidebarHTML;
    }

    function renderTopbar(title) {
        const user = Auth.getCurrentUser();
        const topbar = document.getElementById('topbar');
        if (!topbar || !user) return;
        topbar.innerHTML = `
      <button class="menu-toggle" onclick="document.getElementById('sidebar').classList.toggle('open')" aria-label="Toggle menu">☰</button>
      <h1 class="page-title">${title}</h1>
      <div class="topbar-right">
        <span class="topbar-user">👤 ${user.name}</span>
      </div>
    `;
    }

    return { render, renderTopbar };
})();
