// =================================
// FLL History Hackers Shared Scripts
// Team #71494 - UNEARTHED 2025-2026
// =================================

// Mobile Menu Toggle - Define as global function immediately
function toggleMenu() {
    const menuToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    }
}

// Sidebar Toggle for mobile (used in tutorial and cheatsheet pages)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

// Make functions globally accessible
window.toggleMenu = toggleMenu;
window.toggleSidebar = toggleSidebar;

// Initialize event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        const menuToggle = document.getElementById('mobileToggle');
        const navLinks = document.getElementById('navLinks');
        
        if (navLinks && navLinks.classList.contains('active')) {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        }
    });
    
    // Close menu when clicking a nav link
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                const menuToggle = document.getElementById('mobileToggle');
                if (menuToggle) menuToggle.classList.remove('active');
                if (navLinks) navLinks.classList.remove('active');
            });
        });
    }
    
    // Add scroll effect to header
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 10) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinksAll = document.querySelectorAll('.nav-link');
    
    navLinksAll.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // Auto-close sidebar when clicking a filter button on mobile
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // If on mobile and sidebar is open, close it after selection
                if (window.innerWidth <= 768) {
                    const sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
                    const overlay = document.getElementById('sidebarOverlay');
                    if (sidebar && sidebar.classList.contains('active')) {
                        setTimeout(() => {
                            sidebar.classList.remove('active');
                            if (overlay) overlay.classList.remove('active');
                        }, 300);
                    }
                }
            });
        });
    }
    
    // Initialize collapsible sections
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            toggleSection(this);
        });
    });
    
    // Smooth scroll to anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// Copy to clipboard functionality for code blocks
function copyToClipboard(button, text) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = '✓ Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    });
}

// Section collapse/expand functionality
function toggleSection(element) {
    const section = element.closest('.section');
    if (section) {
        section.classList.toggle('collapsed');
    }
}

// Loading animation
window.addEventListener('load', function() {
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.style.display = 'none';
        }, 1500);
    }
});

// Export functions for use in individual pages
window.copyToClipboard = copyToClipboard;
window.toggleSection = toggleSection;