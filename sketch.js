const image_input = document.querySelector("#image_input");
var uploaded_image = "";
let firstClickColor = "";  // Variable to store the first click color
let secondClickColor = ""; // Variable to store the second click color
let r1, g1, b1; // Variables to store the r, g, b components of the first click color
let r2, g2, b2; // Variables to store the r, g, b components of the second click color
let Grey1, Grey2; // Variables to store the grey (luminance) values of the clicked colors
let difference;

image_input.addEventListener("change", function() {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    uploaded_image = reader.result;
    document.querySelector("#display_image").style.backgroundImage = `url(${uploaded_image})`;

    // Create a hidden canvas to get pixel color
    const img = new Image();
    img.src = uploaded_image;

    img.onload = function() {
      // Log image dimensions and ensure the image is loaded
      console.log("Image loaded with dimensions: ", img.width, img.height);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true }); // Added willReadFrequently attribute
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image on the canvas after it is loaded
      ctx.drawImage(img, 0, 0);

      let clickCount = 0;
      document.querySelector("#display_image").addEventListener("click", function(event) {
        if (clickCount < 2) {
          const rect = event.target.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;

          // Get the pixel data at the clicked position
          const pixel = ctx.getImageData(x, y, 1, 1).data;

          // Log the pixel data and check its value
          console.log("Pixel data at click position: ", pixel);
          const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

          // Check if RGB is not 0, 0, 0 (black)
          if (pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0) {
            console.log("Warning: Clicked pixel is black (0, 0, 0)!");
          }

          // Store and process the first and second color clicks
          if (clickCount === 0) {
            firstClickColor = color;
            [r1, g1, b1] = color.match(/\d+/g).map(Number);
            console.log('First click RGB:', r1, g1, b1);
            document.querySelector("#color1").textContent = color;
          } else if (clickCount === 1) {
            secondClickColor = color;
            [r2, g2, b2] = color.match(/\d+/g).map(Number);
            console.log('Second click RGB:', r2, g2, b2);
            document.querySelector("#color2").textContent = color;

            // Calculate the luminance (greyscale) values for both colors
            Grey1 = 0.299 * r1 + 0.587 * g1 + 0.114 * b1;
            Grey2 = 0.299 * r2 + 0.587 * g2 + 0.114 * b2;

            // Round luminance values to avoid floating-point precision issues
            Grey1 = Math.round(Grey1);
            Grey2 = Math.round(Grey2);

            document.querySelector("#grey1").textContent = `Grey1: ${Grey1}`;
            document.querySelector("#grey2").textContent = `Grey2: ${Grey2}`;

            // Calculate the contrast ratio based on luminance values
            let L1 = Math.max(Grey1, Grey2);
            let L2 = Math.min(Grey1, Grey2);
            let contrastRatio = (L1 + 0.05) / (L2 + 0.05);

            // Display the contrast ratio
            document.querySelector("#difference").textContent = `Contrast ratio: ${contrastRatio.toFixed(2)}`;

            if (contrastRatio < 4.5) {
              document.querySelector("#difference").textContent += ` (Contrast too low!)`;
            }
            if (contrastRatio >= 4.5) {
              document.querySelector("#difference").textContent += ` (Contrast ok!)`;
            }
          }

          clickCount++;
        }
      });
    };

    img.onerror = function() {
      console.error("Failed to load image.");
    };
  });
  reader.readAsDataURL(image_input.files[0]);
});
