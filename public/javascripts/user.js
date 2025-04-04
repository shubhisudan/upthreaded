// Sample data for discussions and matches (replace with actual API calls later)
const sampleDiscussions = [
    {
        id: 1,
        author: 'John Doe',
        content: 'Looking for a skilled user for wedding suits.',
        timestamp: '2 hours ago',
        likes: 5,
        replies: 3
    },
    {
        id: 2,
        author: 'Jane Smith',
        content: 'Any recommendations for traditional wear alterations?',
        timestamp: '5 hours ago',
        likes: 3,
        replies: 2
    }
];

const sampleMatches = [
    {
        name: 'Elite usering',
        rating: 4.9,
        specialization: 'Formal Wear, Suits',
        availability: 'Available Now'
    },
    {
        name: 'Modern Fits',
        rating: 4.7,
        specialization: 'Casual Wear, Alterations',
        availability: 'Available Tomorrow'
    }
];

// Load discussions
function loadDiscussions() {
    const discussionList = document.querySelector('.discussion-list');
    discussionList.innerHTML = '';

    sampleDiscussions.forEach(discussion => {
        const discussionElement = document.createElement('div');
        discussionElement.className = 'discussion-item p-3 mb-3 bg-white rounded shadow-sm';
        discussionElement.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">${discussion.author}</h6>
                <small class="text-muted">${discussion.timestamp}</small>
            </div>
            <p class="mb-2">${discussion.content}</p>
            <div class="d-flex align-items-center">
                <button class="btn btn-sm btn-outline-primary me-2" onclick="likeDiscussion(${discussion.id})">
                    <i class="fas fa-heart"></i> ${discussion.likes}
                </button>
                <button class="btn btn-sm btn-outline-secondary">
                    <i class="fas fa-reply"></i> ${discussion.replies}
                </button>
            </div>
        `;
        discussionList.appendChild(discussionElement);
    });
}

// Load matches
function loadMatches() {
    const matchesList = document.querySelector('.matches-list');
    matchesList.innerHTML = '';

    sampleMatches.forEach(match => {
        const matchElement = document.createElement('div');
        matchElement.className = 'match-item p-3 mb-3 bg-white rounded shadow-sm';
        matchElement.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <h6 class="mb-0">${match.name}</h6>
                <span class="badge bg-primary">${match.rating} ★</span>
            </div>
            <p class="text-muted mb-1 small">${match.specialization}</p>
            <span class="badge bg-success">${match.availability}</span>
        `;
        matchesList.appendChild(matchElement);
    });
}

// Post new discussion
function postDiscussion() {
    const discussionInput = document.querySelector('#discussionInput');
    const content = discussionInput.value.trim();

    if (content) {
        const newDiscussion = {
            id: sampleDiscussions.length + 1,
            author: 'You',
            content: content,
            timestamp: 'Just now',
            likes: 0,
            replies: 0
        };

        sampleDiscussions.unshift(newDiscussion);
        discussionInput.value = '';
        loadDiscussions();
    }
}

// Like a discussion
function likeDiscussion(id) {
    const discussion = sampleDiscussions.find(d => d.id === id);
    if (discussion) {
        discussion.likes++;
        loadDiscussions();
    }
}

// Search functionality
function handleSearch(event) {
    event.preventDefault();
    const searchInput = document.querySelector('#searchInput');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    // Filter discussions based on search term
    const filteredDiscussions = sampleDiscussions.filter(discussion =>
        discussion.content.toLowerCase().includes(searchTerm) ||
        discussion.author.toLowerCase().includes(searchTerm)
    );

    // Update discussions list with filtered results
    const discussionList = document.querySelector('.discussion-list');
    discussionList.innerHTML = '';
    
    if (filteredDiscussions.length === 0) {
        discussionList.innerHTML = '<p class="text-center text-muted mt-3">No discussions found</p>';
    } else {
        filteredDiscussions.forEach(discussion => {
            // ... (same discussion rendering code as in loadDiscussions)
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadDiscussions();
    loadMatches();

    // Add event listeners
    document.querySelector('#postButton').addEventListener('click', postDiscussion);
    document.querySelector('#searchForm').addEventListener('submit', handleSearch);
}); 