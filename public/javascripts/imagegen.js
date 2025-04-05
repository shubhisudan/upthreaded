document.addEventListener('DOMContentLoaded', function () {
    // Get form elements
    const imageGenForm = document.getElementById('imageGenForm');
    const generatedImages = document.getElementById('generatedImages');

    // Add console log to verify form is found
    console.log('Form found:', imageGenForm);

    imageGenForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log('Form submitted'); // Debug log

        if (!this.checkValidity()) {
            e.stopPropagation();
            this.classList.add('was-validated');
            return;
        }

        const formData = new FormData(this);
        console.log('Form data:', {
            clothing: formData.get('prompt'),
            style: formData.get('style')
        }); // Debug log

        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = 'Get Upcycling Ideas'; // Store the original button text

        try {
            // Show loading state
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating Ideas...';
            submitButton.disabled = true;

            // Make API call
            console.log('Making API call...'); // Debug log
            const response = await fetch('/api/generate-upcycle-ideas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    clothing: formData.get('prompt'),
                    style: formData.get('style')
                })
            });

            console.log('Response received:', response.status); // Debug log

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Data received:', data); // Debug log

            // Clear previous suggestions
            generatedImages.innerHTML = '';

            // Create and add the new suggestion card
            const suggestionCard = document.createElement('div');
            suggestionCard.className = 'col-12';
            suggestionCard.innerHTML = `
                <div class="card border-0 shadow-sm mb-4">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h6 class="card-title mb-1">Upcycling Suggestions</h6>
                                <p class="text-muted small mb-0">For: ${formData.get('prompt').substring(0, 50)}...</p>
                                <p class="text-muted small">Style: ${formData.get('style')}</p>
                            </div>
                            <span class="badge bg-success">New</span>
                        </div>
                        
                        <div class="suggestion-content">
                            <pre class="suggestion-text" style="white-space: pre-wrap; font-family: inherit;">${data.suggestion}</pre>
                        </div>

                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <button class="btn btn-sm btn-outline-primary" onclick="copyToClipboard(this)">
                                <i class="fas fa-copy"></i> Copy
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteSuggestion(this)">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;

            generatedImages.appendChild(suggestionCard);
            console.log('Suggestion card added'); // Debug log

            // Reset form
            this.reset();
            this.classList.remove('was-validated');

        } catch (error) {
            console.error('Error:', error); // This will show in browser console
            alert('Error generating ideas. Please try again.');
        } finally {
            // Reset button state to original text
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
});

// Helper function to copy suggestion to clipboard
function copyToClipboard(button) {
    const suggestionText = button.closest('.card-body').querySelector('.suggestion-text').textContent;
    navigator.clipboard.writeText(suggestionText).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text:', err);
        alert('Failed to copy text to clipboard');
    });
}

// Helper function to delete suggestion
function deleteSuggestion(button) {
    if (confirm('Are you sure you want to delete this suggestion?')) {
        const card = button.closest('.col-12');
        card.remove();

        // Show "no suggestions" message if list is empty
        const generatedImages = document.getElementById('generatedImages');
        if (generatedImages.children.length === 0) {
            generatedImages.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-muted">No suggestions generated yet. Describe your clothes to get started!</p>
                </div>
            `;
        }
    }
} 