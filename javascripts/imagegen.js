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
            return;
        }

        const formData = new FormData(this);
        const files = referenceImageInput.files;

        // Validate number of files again
        if (files.length > 5) {
            alert('You can only upload up to 5 images');
            return;
        }

        try {
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';
            submitButton.disabled = true;

            // Here you would typically make an API call to your image generation service
            // For now, we'll simulate a delay and show a placeholder
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Create a new image card
            const imageCard = document.createElement('div');
            imageCard.className = 'col-md-4 mb-4';
            imageCard.innerHTML = `
                <div class="card h-100">
                    <img src="https://via.placeholder.com/300" class="card-img-top" alt="Generated Image">
                    <div class="card-body">
                        <h6 class="card-title">${formData.get('prompt').substring(0, 30)}...</h6>
                        <p class="card-text small text-muted">Style: ${formData.get('style')}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <button class="btn btn-sm btn-outline-primary">Download</button>
                            <button class="btn btn-sm btn-outline-danger">Delete</button>
                        </div>
                    </div>
                </div>
            `;

            // Remove the "no images" message if it exists
            const noImagesMessage = generatedImages.querySelector('.text-muted');
            if (noImagesMessage) {
                noImagesMessage.remove();
            }

            // Add the new image to the gallery
            generatedImages.prepend(imageCard);

            // Reset the form
            this.reset();
            this.classList.remove('was-validated');
            imagePreview.innerHTML = '';

        } catch (error) {
            console.error('Error generating image:', error);
            alert('There was an error generating the image. Please try again.');
        } finally {
            // Reset button state
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });

    // Handle image deletion
    generatedImages.addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-outline-danger')) {
            if (confirm('Are you sure you want to delete this image?')) {
                e.target.closest('.col-md-4').remove();

                // Show "no images" message if gallery is empty
                if (generatedImages.children.length === 0) {
                    generatedImages.innerHTML = `
                        <div class="col-12 text-center py-5">
                            <p class="text-muted">No images generated yet. Create your first image!</p>
                        </div>
                    `;
                }
            }
        }
    });

    // Handle image download
    generatedImages.addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-outline-primary')) {
            // Here you would typically implement the download functionality
            alert('Download functionality will be implemented here');
        }
    });
}); 