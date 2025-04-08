document.addEventListener('DOMContentLoaded', function() {
    // Create navbar container
    const navbarContainer = document.createElement('div');
    navbarContainer.id = 'tailor-navbar-container';
    document.body.insertBefore(navbarContainer, document.body.firstChild);

    // Load navbar HTML
    fetch('/html/components/tailor-navbar.html')
        .then(response => response.text())
        .then(html => {
            navbarContainer.innerHTML = html;

            // Load navbar CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/stylesheets/tailor-navbar.css';
            document.head.appendChild(link);

            // Add padding to body to account for fixed navbar
            document.body.style.paddingTop = '56px';

            // Initialize Bootstrap dropdowns
            const dropdowns = document.querySelectorAll('.dropdown-toggle');
            dropdowns.forEach(dropdown => {
                dropdown.addEventListener('click', function(e) {
                    e.preventDefault();
                    const dropdownMenu = this.nextElementSibling;
                    dropdownMenu.classList.toggle('show');
                });
            });

            // Close dropdowns when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.matches('.dropdown-toggle')) {
                    const dropdowns = document.querySelectorAll('.dropdown-menu');
                    dropdowns.forEach(dropdown => {
                        dropdown.classList.remove('show');
                    });
                }
            });

            // Update active link based on current page
            const currentPath = window.location.pathname;
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPath) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        })
        .catch(error => {
            console.error('Error loading tailor navbar:', error);
        });
});