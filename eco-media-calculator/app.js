// app.js - Handles Cloudinary upload and image comparison
// NOTE: Replace 'YOUR_CLOUD_NAME' and 'YOUR_UPLOAD_PRESET' with your Cloudinary account details.

document.addEventListener('DOMContentLoaded', () => {
  const uploadBtn = document.getElementById('uploadBtn');
  const resultsSection = document.getElementById('results');
  const originalImg = document.getElementById('originalImg');
  const optimizedImg = document.getElementById('optimizedImg');

  // Initialize Cloudinary Upload Widget
  const widget = cloudinary.createUploadWidget(
    {
      cloudName: 'dmvuzwlxs', // <-- replace with actual cloud name
      uploadPreset: 'ecofriendly', // <-- replace with actual unsigned preset
      sources: ['local', 'url', 'camera'],
      multiple: false,
      maxFileSize: 2000000, // 2 MB limit (optional)
      cropping: false,
      singleUploadAutoClose: false,
    },
    (error, result) => {
      if (!error && result && result.event === 'success') {
        const secureUrl = result.info.secure_url;
        // Show original image
        originalImg.src = secureUrl;
        // Build optimized URL using Cloudinary auto format and quality
        const optimizedUrl = secureUrl.replace('/upload/', '/upload/f_auto,q_auto/');
        optimizedImg.src = optimizedUrl;
        // Reveal the results section
        resultsSection.classList.remove('hidden');
        // Calculate and display optimization metrics
        (async () => {
          try {
            // Original file size in bytes from upload result
            const originalSize = result.info.bytes;
            // Fetch optimized image HEAD to get content-length
            const headResp = await fetch(optimizedUrl, { method: 'HEAD' });
            const optimizedSizeStr = headResp.headers.get('content-length');
            const optimizedSize = optimizedSizeStr ? parseInt(optimizedSizeStr, 10) : 0;
            // Compute savings
            const savedBytes = originalSize - optimizedSize;
            const savedKB = (savedBytes / 1024).toFixed(2);
            const percentSaved = ((savedBytes / originalSize) * 100).toFixed(2);
            const savedMB = savedBytes / (1024 * 1024);
            const co2Saved = (savedMB * 0.02).toFixed(4);
            // Populate carbon saved value
            const carbonSaved = co2Saved; // grams of CO₂ saved
            const carbonElem = document.getElementById('carbonSaved');
            if (carbonElem) {
              carbonElem.textContent = carbonSaved;
            }
            // Reveal sustainability impact box
            document.getElementById('metrics').classList.remove('hidden');
            document.getElementById('savedKB').textContent = savedKB;
            document.getElementById('percentSaved').textContent = percentSaved;
            document.getElementById('co2Saved').textContent = co2Saved;
            // Reveal metrics section
            document.getElementById('metrics').classList.remove('hidden');
          } catch (e) {
            console.error('Metrics calculation failed', e);
          }
        })();
      }
    }
  );

  uploadBtn.addEventListener('click', () => {
    widget.open();
  }, false);
});
