let currentImage = null;
const canvas = document.getElementById('photoCanvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('statusText');

// Image Upload Function
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    statusText.textContent = "Loading image...";
    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();
        
        img.onload = function() {
            // Limit maximum size to 800px
            const maxSize = 800;
            let width = img.width;
            let height = img.height;

            if (width > maxSize || height > maxSize) {
                const ratio = Math.min(maxSize/width, maxSize/height);
                width = width * ratio;
                height = height * ratio;
            }

            canvas.width = width;
            canvas.height = height;
            
            ctx.drawImage(img, 0, 0, width, height);
            currentImage = img;
            statusText.textContent = `Loaded: ${file.name} (${width}x${height})`;
        };

        img.onerror = () => {
            statusText.textContent = "Error loading image";
        };

        img.src = event.target.result;
    };

    reader.onerror = () => {
        statusText.textContent = "Error reading file";
    };

    reader.readAsDataURL(file);
});

// Filter Functions
function updateFilters() {
    if (!currentImage) return;

    const brightness = document.getElementById('brightness').value;
    const contrast = document.getElementById('contrast').value;

    ctx.filter = `
        brightness(${100 + parseInt(brightness)}%)
        contrast(${100 + parseInt(contrast)}%)
    `;
    
    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
}

// Add event listeners for sliders
document.getElementById('brightness').addEventListener('input', function() {
    document.querySelector('#brightness + .value').textContent = `${this.value}%`;
    updateFilters();
});

document.getElementById('contrast').addEventListener('input', function() {
    document.querySelector('#contrast + .value').textContent = `${this.value}%`;
    updateFilters();
});

// Apply Special Filters
function applyFilter(type) {
    if (!currentImage) return;

    switch(type) {
        case 'vintage':
            ctx.filter = 'sepia(80%) saturate(120%) contrast(90%)';
            break;
        case 'bw':
            ctx.filter = 'grayscale(100%) contrast(110%)';
            break;
        case 'blur':
            ctx.filter = 'blur(4px)';
            break;
    }
    
    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
}

// Save Image
function savePhoto() {
    if (!currentImage) {
        alert("Please upload an image first!");
        return;
    }

    const link = document.createElement('a');
    link.download = 'edited-photo.png';
    link.href = canvas.toDataURL();
    link.click();
}
