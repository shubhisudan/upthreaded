function loadNavbar() {
    fetch('/html/components/user-navbar.html')
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('afterbegin', html);
        })
        .catch(error => console.error('Error loading navbar:', error));
}

// Load navbar when DOM is ready
document.addEventListener('DOMContentLoaded', loadNavbar); 