document.addEventListener('DOMContentLoaded', function () {
    const imageGenForm = document.getElementById('imageGenForm');
    const generatedImages = document.getElementById('generatedImages');
    const imagePreview = document.getElementById('imagePreview');
    const referenceImageInput = document.getElementById('referenceImage');

    // Handle reference image upload and preview
    referenceImageInput.addEventListener('change', function (e) {
        const files = e.target.files;

        // Clear previous previews
        imagePreview.innerHTML = '';

        // Validate number of files
        if (files.length > 5) {
            alert('You can only upload up to 5 images');
            this.value = '';
            return;
        }

        // Create preview for each image
        Array.from(files).forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const previewDiv = document.createElement('div');
                    previewDiv.className = 'col-md-4 col-6';
                    previewDiv.innerHTML = `
                        <div class="position-relative">
                            <img src="${e.target.result}" class="img-thumbnail" alt="Preview ${index + 1}">
                            <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1" 
                                onclick="this.closest('.col-md-4').remove()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `;
                    imagePreview.appendChild(previewDiv);
                };
                reader.readAsDataURL(file);
            }
        });
    });

    imageGenForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!this.checkValidity()) {
            e.stopPropagation();
            this.classList.add('was-validated');
            return;
        }

        const formData = new FormData(this);
        const generatedImages = document.getElementById('generatedImages'); // This is where we'll show suggestions

        try {
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating Ideas...';
            submitButton.disabled = true;

            // Make API call
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

            if (!response.ok) {
                throw new Error('Failed to generate ideas');
            }

            const data = await response.json();

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

            // Reset form
            this.reset();
            this.classList.remove('was-validated');

        } catch (error) {
            console.error('Error:', error);
            alert('Error generating ideas. Please try again.');
        } finally {
            // Reset button state
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });

    // Add helper function to copy suggestion to clipboard
    function copyToClipboard(button) {
        const suggestionText = button.closest('.card-body').querySelector('.suggestion-text').textContent;
        navigator.clipboard.writeText(suggestionText).then(() => {
            // Show feedback
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

    // Add helper function to delete suggestion
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
}); 