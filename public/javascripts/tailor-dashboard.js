// Profile Page Functions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize profile page elements
    const editBioBtn = document.getElementById('editBioBtn');
    const editSpecialtiesBtn = document.getElementById('editSpecialtiesBtn');
    const editDesignsBtn = document.getElementById('editDesignsBtn');
    const editImageBtn = document.querySelector('.edit-image-btn');

    if (editBioBtn) {
        editBioBtn.addEventListener('click', function() {
            const bioText = document.getElementById('tailorBio');
            const currentBio = bioText.textContent;
            const newBio = prompt('Edit your bio:', currentBio);
            if (newBio) {
                bioText.textContent = newBio;
                // TODO: Send update to server
            }
        });
    }

    if (editSpecialtiesBtn) {
        editSpecialtiesBtn.addEventListener('click', function() {
            const specialtyTags = document.getElementById('specialtyTags');
            const currentSpecialties = Array.from(specialtyTags.children).map(tag => tag.textContent);
            const newSpecialties = prompt('Enter specialties (comma-separated):', currentSpecialties.join(', '));
            if (newSpecialties) {
                const specialties = newSpecialties.split(',').map(s => s.trim());
                specialtyTags.innerHTML = specialties.map(specialty => 
                    `<span class="tag">${specialty}</span>`
                ).join('');
                // TODO: Send update to server
            }
        });
    }

    if (editDesignsBtn) {
        editDesignsBtn.addEventListener('click', function() {
            // TODO: Implement design upload functionality
            alert('Design upload functionality coming soon!');
        });
    }

    if (editImageBtn) {
        editImageBtn.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        document.getElementById('profileImage').src = e.target.result;
                        // TODO: Send image to server
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });
    }

    // Initialize requests page elements
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filterRequests(this.value);
        });
    }

    // Initialize orders page elements
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', function() {
            filterOrders(this.value);
        });
    }
});

// Request Management Functions
function handleRequest(action, requestId) {
    const statusBadge = event.target.closest('.request-card').querySelector('.status-badge');
    const actionButtons = event.target.closest('.request-actions');
    
    if (action === 'accept') {
        statusBadge.textContent = 'Accepted';
        statusBadge.className = 'status-badge accepted';
        actionButtons.innerHTML = '<button class="view-details-btn" onclick="viewRequestDetails(\'' + requestId + '\')">View Details</button>';
    } else if (action === 'reject') {
        statusBadge.textContent = 'Rejected';
        statusBadge.className = 'status-badge rejected';
        actionButtons.innerHTML = '<button class="view-details-btn" onclick="viewRequestDetails(\'' + requestId + '\')">View Details</button>';
    }
    
    // TODO: Send update to server
}

function filterRequests(status) {
    const requests = document.querySelectorAll('.request-card');
    requests.forEach(request => {
        const requestStatus = request.querySelector('.status-badge').textContent.toLowerCase();
        if (status === 'all' || requestStatus === status) {
            request.style.display = 'block';
        } else {
            request.style.display = 'none';
        }
    });
}

function viewRequestDetails(requestId) {
    // TODO: Implement request details view
    alert('Request details view coming soon!');
}

// Order Management Functions
function updateOrderStatus(orderId, newStatus) {
    const orderCard = event.target.closest('.order-card');
    const statusBadge = orderCard.querySelector('.status-badge');
    const actionButtons = orderCard.querySelector('.order-actions');
    
    statusBadge.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    statusBadge.className = 'status-badge ' + newStatus;
    
    if (newStatus === 'shipped') {
        actionButtons.innerHTML = `
            <button class="update-status-btn" onclick="updateOrderStatus('${orderId}', 'completed')">
                Mark as Completed
            </button>
            <button class="view-details-btn" onclick="viewOrderDetails('${orderId}')">
                View Details
            </button>
        `;
    } else if (newStatus === 'completed') {
        actionButtons.innerHTML = `
            <button class="view-details-btn" onclick="viewOrderDetails('${orderId}')">
                View Details
            </button>
        `;
    }
    
    // TODO: Send update to server
}

function filterOrders(status) {
    const orders = document.querySelectorAll('.order-card');
    orders.forEach(order => {
        const orderStatus = order.querySelector('.status-badge').textContent.toLowerCase();
        if (status === 'all' || orderStatus === status) {
            order.style.display = 'block';
        } else {
            order.style.display = 'none';
        }
    });
}

function viewOrderDetails(orderId) {
    // TODO: Implement order details view
    alert('Order details view coming soon!');
}

// Utility Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Error Handling
function handleError(error) {
    console.error('An error occurred:', error);
    alert('An error occurred. Please try again later.');
} 