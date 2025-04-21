/**
 * Enhanced face detection and validation for uploaded/captured images.
 * This utility provides more accurate facial recognition feedback.
 */

// Returns detailed validation results for the uploaded/captured image
export async function validateFaceInImage(imageDataUrl: string): Promise<{ 
  valid: boolean; 
  message: string; 
  status: "success" | "warning" | "error";
  faceBox?: {x: number, y: number, width: number, height: number};
}> {
  try {
    // 1. Basic validation for image data
    if (!imageDataUrl || !imageDataUrl.startsWith("data:image/")) {
      return {
        valid: false,
        message: "Invalid image format. Please provide a clear photo.",
        status: "error"
      };
    }

    // 2. Create an image element to analyze the uploaded image
    const img = document.createElement("img");
    img.src = imageDataUrl;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    // 3. Check image dimensions (minimum resolution requirements)
    if (img.width < 200 || img.height < 200) {
      return {
        valid: false,
        message: "Image resolution too low. Please provide a clearer photo.",
        status: "error"
      };
    }

    // 4. Check image ratio (to ensure it's likely a face photo)
    const aspectRatio = img.width / img.height;
    if (aspectRatio < 0.5 || aspectRatio > 2) {
      return {
        valid: false,
        message: "Image doesn't appear to be a proper portrait. Please capture only the face.",
        status: "error"
      };
    }

    // 5. Analyze image content using canvas
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return {
        valid: false,
        message: "Unable to process image. Please try again.",
        status: "error"
      };
    }

    // Draw the image on canvas
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    
    // 6. Detect face-like features in the image (enhanced)
    const faceDetectionResult = await detectFaceFeatures(imageData, img.width, img.height);
    if (!faceDetectionResult.faceDetected) {
      return {
        valid: false,
        message: "No face detected in the image. Please ensure face is clearly visible.",
        status: "error"
      };
    }

    // 7. Check image quality
    const { brightness, contrast, blur } = analyzeImageQuality(imageData);
    
    // Check for poor lighting conditions
    if (brightness < 40) {
      return {
        valid: false,
        message: "Image is too dark. Please take photo in better lighting.",
        status: "error",
        faceBox: faceDetectionResult.faceBox
      };
    }
    
    if (brightness > 215) {
      return {
        valid: false,
        message: "Image is overexposed. Please reduce lighting or avoid direct sunlight.",
        status: "error",
        faceBox: faceDetectionResult.faceBox
      };
    }
    
    // Check for poor contrast
    if (contrast < 30) {
      return {
        valid: false,
        message: "Image has poor contrast. Please take photo in better lighting conditions.",
        status: "error",
        faceBox: faceDetectionResult.faceBox
      };
    }
    
    // Check for blurry images
    if (blur > 0.8) {
      return {
        valid: false,
        message: "Image appears blurry. Please hold the camera steady and ensure proper focus.",
        status: "error",
        faceBox: faceDetectionResult.faceBox
      };
    }

    // 8. Position check (if face is centered)
    if (!isFaceCentered(faceDetectionResult.faceBox)) {
      return {
        valid: true, // Still valid but with warning
        message: "Face is detected but not centered. For best results, center your face in the frame.",
        status: "warning",
        faceBox: faceDetectionResult.faceBox
      };
    }

    // 9. All checks passed
    return {
      valid: true,
      message: "Face detected and image quality is good for verification.",
      status: "success",
      faceBox: faceDetectionResult.faceBox
    };
  } catch (error) {
    console.error("Face validation error:", error);
    return {
      valid: false,
      message: "Error processing image. Please try again with a different photo.",
      status: "error"
    };
  }
}

// Add: Facial recognition MATCH simulation
// This would normally call a backend or ML API, but we simulate for demo

export async function verifyFaceWithDatabase(imageDataUrl: string): Promise<{ matched: boolean; confidence: number; driverName?: string }> {
  // NOTE: In a real app, you would:
  //   - Extract facial embedding using a library (face-api.js or cloud API)
  //   - Compare with server/database stored features
  // Here we randomly simulate matching for user demo/testing
  await new Promise(res => setTimeout(res, 900));
  if (!imageDataUrl) return { matched: false, confidence: 0 };
  // Simulate a ~60% match rate, random confidence
  const demoNames = ["Suresh", "Arjun R", "Priya M", "Kiran Kumar"];
  const rand = Math.random();
  let confidence = 50 + rand * 50;
  if (rand > 0.42) {
    return {
      matched: true,
      confidence: Math.round(confidence * 100) / 100,
      driverName: demoNames[Math.floor(rand * demoNames.length)]
    };
  } else {
    return {
      matched: false,
      confidence: Math.round(rand * 40) // 0-40%
    };
  }
}

export { validateFaceInImage };

// Helper functions for face detection

// Simulates face detection (in a real app would use ML libraries like tensorflow.js/face-api.js)
async function detectFaceFeatures(imageData: ImageData, width: number, height: number): Promise<{
  faceDetected: boolean;
  confidence: number;
  faceBox?: {x: number, y: number, width: number, height: number};
}> {
  // This is a simplified simulation of face detection algorithms
  // For a real implementation, integrate a proper face detection API
  
  const data = imageData.data;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Analyze center region of the image (where face is likely to be)
  const centerRegionSize = Math.min(width, height) * 0.4;
  const startX = Math.max(0, centerX - centerRegionSize/2);
  const startY = Math.max(0, centerY - centerRegionSize/2);
  const endX = Math.min(width, centerX + centerRegionSize/2);
  const endY = Math.min(height, centerY + centerRegionSize/2);
  
  // Check pixel variation in the central region (faces have specific variation patterns)
  let skinTonePixels = 0;
  let totalPixels = 0;
  let variationSum = 0;
  
  // Sample the image (not every pixel for performance)
  const sampleStep = 4;
  
  for (let y = startY; y < endY; y += sampleStep) {
    for (let x = startX; x < endX; x += sampleStep) {
      const idx = ((y * width) + x) * 4;
      
      // Skip if we're out of bounds
      if (idx >= data.length - 4) continue;
      
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      
      // Check for skin-tone like colors (simplified)
      if (isSkinToneLike(r, g, b)) {
        skinTonePixels++;
      }
      
      // Calculate local variation (texture)
      if (x < endX - sampleStep && y < endY - sampleStep) {
        const idx2 = ((y * width) + (x + sampleStep)) * 4;
        const idx3 = (((y + sampleStep) * width) + x) * 4;
        
        // Skip if we're out of bounds
        if (idx2 >= data.length - 4 || idx3 >= data.length - 4) continue;
        
        // Calculate color difference with neighbors
        const diff1 = Math.abs(r - data[idx2]) + Math.abs(g - data[idx2 + 1]) + Math.abs(b - data[idx2 + 2]);
        const diff2 = Math.abs(r - data[idx3]) + Math.abs(g - data[idx3 + 1]) + Math.abs(b - data[idx3 + 2]);
        
        variationSum += (diff1 + diff2) / 2;
      }
      
      totalPixels++;
    }
  }
  
  // Calculate metrics
  const skinToneRatio = skinTonePixels / totalPixels;
  const variationAvg = variationSum / totalPixels;
  
  // Face detection heuristics (simplified)
  const skinThreshold = 0.3; // At least 30% skin tone pixels
  const variationThreshold = 15; // Minimum variation (texture)
  const variationMaxThreshold = 60; // Maximum variation (texture)
  
  const hasFaceCharacteristics = 
    skinToneRatio > skinThreshold && 
    variationAvg > variationThreshold && 
    variationAvg < variationMaxThreshold;
  
  // Calculate detection confidence
  let confidence = skinToneRatio * 70 + Math.min(1, variationAvg / variationThreshold) * 30;
  confidence = Math.min(98, confidence); // Cap at 98% without real ML
  
  // Generate a face box based on the image analysis
  // In a real implementation, this would come from the ML model
  const faceBox = hasFaceCharacteristics ? {
    x: startX / width,
    y: startY / height,
    width: (endX - startX) / width,
    height: (endY - startY) / height
  } : undefined;
  
  return {
    faceDetected: hasFaceCharacteristics,
    confidence,
    faceBox
  };
}

// Helper function to check if a color is skin-tone like
function isSkinToneLike(r: number, g: number, b: number): boolean {
  // Very simplified skin tone detection
  // In a real application, use a proper skin tone classifier
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  // Check if red channel is dominant (common in skin tones)
  const isRedDominant = r > g && r > b;
  
  // Check if the color is within skin tone range
  const isSkinHue = r > 60 && g > 40 && b > 20 && r > g && g > b;
  
  // Check saturation and brightness (skin tones aren't too saturated or too dark/bright)
  const saturation = (max - min) / (max + 0.001);
  const brightness = max / 255;
  
  const hasSkinSaturation = saturation > 0.05 && saturation < 0.65;
  const hasSkinBrightness = brightness > 0.2 && brightness < 0.95;
  
  return isSkinHue && hasSkinSaturation && hasSkinBrightness;
}

// Analyze image quality
function analyzeImageQuality(imageData: ImageData): { brightness: number; contrast: number; blur: number } {
  const data = imageData.data;
  let totalBrightness = 0;
  let brightnessSamples = 0;
  const histogramBins = new Array(256).fill(0);
  
  // Sample the image for brightness and histogram
  const sampleStep = 5; // Performance optimization
  
  for (let i = 0; i < data.length; i += 4 * sampleStep) {
    if (i + 2 >= data.length) break;
    
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    const pixelBrightness = (r + g + b) / 3;
    totalBrightness += pixelBrightness;
    
    // Update histogram
    const bin = Math.floor(pixelBrightness);
    if (bin >= 0 && bin < 256) {
      histogramBins[bin]++;
    }
    
    brightnessSamples++;
  }
  
  // Calculate average brightness
  const avgBrightness = totalBrightness / brightnessSamples;
  
  // Calculate contrast using histogram
  let minBin = 0;
  let maxBin = 255;
  
  // Find actual min/max bins that have data
  while (minBin < 255 && histogramBins[minBin] < brightnessSamples * 0.01) minBin++;
  while (maxBin > 0 && histogramBins[maxBin] < brightnessSamples * 0.01) maxBin--;
  
  const contrast = maxBin - minBin;
  
  // Estimate blur using edge detection
  // This is a simplified method - real applications would use more complex algorithms
  let edgeStrength = 0;
  const width = imageData.width;
  const height = imageData.height;
  
  for (let y = 1; y < height - 1; y += sampleStep) {
    for (let x = 1; x < width - 1; x += sampleStep) {
      const idx = (y * width + x) * 4;
      const idxUp = ((y - 1) * width + x) * 4;
      const idxDown = ((y + 1) * width + x) * 4;
      const idxLeft = (y * width + (x - 1)) * 4;
      const idxRight = (y * width + (x + 1)) * 4;
      
      if (idx >= data.length - 4 || idxUp >= data.length - 4 || 
          idxDown >= data.length - 4 || idxLeft >= data.length - 4 || 
          idxRight >= data.length - 4) continue;
      
      // Simple Sobel-like edge detection
      const gx = 
        (data[idxRight] - data[idxLeft]) / 2 + 
        (data[idxRight + 1] - data[idxLeft + 1]) / 2 + 
        (data[idxRight + 2] - data[idxLeft + 2]) / 2;
        
      const gy = 
        (data[idxDown] - data[idxUp]) / 2 + 
        (data[idxDown + 1] - data[idxUp + 1]) / 2 + 
        (data[idxDown + 2] - data[idxUp + 2]) / 2;
      
      const edgeMagnitude = Math.sqrt(gx * gx + gy * gy);
      edgeStrength += edgeMagnitude;
    }
  }
  
  // Normalize edge strength and invert (higher values = more blur)
  const normalizedEdgeStrength = edgeStrength / (width * height / (sampleStep * sampleStep));
  const blurFactor = 1 - Math.min(1, normalizedEdgeStrength / 20);
  
  return {
    brightness: avgBrightness,
    contrast,
    blur: blurFactor
  };
}

// Check if face is properly centered
function isFaceCentered(faceBox?: {x: number, y: number, width: number, height: number}): boolean {
  if (!faceBox) return false;
  
  // Check if face center is near image center
  const faceCenterX = faceBox.x + faceBox.width / 2;
  const faceCenterY = faceBox.y + faceBox.height / 2;
  
  // Allow some tolerance (face doesn't need to be exactly centered)
  return Math.abs(faceCenterX - 0.5) < 0.2 && Math.abs(faceCenterY - 0.5) < 0.2;
}
