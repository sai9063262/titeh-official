export const checkBiometricSupport = async (): Promise<boolean> => {
  try {
    // Check if device supports biometric authentication
    if ('PublicKeyCredential' in window) {
      const publicKeyCredentialSupport = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      return publicKeyCredentialSupport;
    }
    return false;
  } catch (error) {
    console.error("Error checking biometric support:", error);
    return false;
  }
};

export const authenticateWithBiometrics = async (): Promise<{ fingerprint: string | null; error?: string }> => {
  try {
    const challenge = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);

    // Configure the authentication options for biometric verification
    const authenticationOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      timeout: 60000,
      userVerification: "required",
      rpId: window.location.hostname,
    };

    // Request biometric authentication
    const credential = await navigator.credentials.get({
      publicKey: authenticationOptions,
    }) as PublicKeyCredential;

    if (!credential) {
      throw new Error("No credential received");
    }

    // Convert the raw biometric data into a fingerprint template
    const rawId = Array.from(new Uint8Array(credential.rawId));
    const fingerprintTemplate = btoa(String.fromCharCode.apply(null, rawId));

    return { fingerprint: fingerprintTemplate };
  } catch (error) {
    console.error("Biometric authentication error:", error);
    return { fingerprint: null, error: "Biometric authentication failed" };
  }
};

export const enrollBiometric = async (userId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const challenge = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);

    // Configure the credential creation options for biometric enrollment
    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: "Telangana Traffic Hub",
        id: window.location.hostname,
      },
      user: {
        id: Uint8Array.from(userId, c => c.charCodeAt(0)),
        name: userId,
        displayName: "Driver",
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },
        { type: "public-key", alg: -257 },
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        requireResidentKey: true,
        userVerification: "required",
      },
      timeout: 60000,
      attestation: "direct",
    };

    // Create biometric credential
    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    });

    return { success: true };
  } catch (error) {
    console.error("Biometric enrollment error:", error);
    return { success: false, error: "Biometric enrollment failed" };
  }
};

// Enhanced facial recognition features
export const preprocessFacialImage = (imageData: ImageData): ImageData => {
  // Apply basic preprocessing to enhance facial features
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  // Create a new ImageData object for the processed image
  const processedData = new ImageData(width, height);
  const processedPixels = processedData.data;
  
  // Apply basic image enhancements
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Apply simple brightness and contrast adjustments
      for (let c = 0; c < 3; c++) {
        const pixel = data[idx + c];
        // Simple contrast enhancement
        processedPixels[idx + c] = Math.min(255, Math.max(0, 
          (pixel - 128) * 1.2 + 128
        ));
      }
      
      // Keep alpha channel
      processedPixels[idx + 3] = data[idx + 3];
    }
  }
  
  return processedData;
};

// Simulate facial feature extraction (in a real app, this would use ML libraries)
export const extractFacialFeatures = (imageDataUrl: string): Promise<Float32Array> => {
  return new Promise((resolve) => {
    // Simulate feature extraction process
    setTimeout(() => {
      // Generate a 128-dimensional embedding (common in face recognition)
      const features = new Float32Array(128);
      for (let i = 0; i < 128; i++) {
        features[i] = Math.random() * 2 - 1; // Random values between -1 and 1
      }
      
      // Normalize the feature vector
      const magnitude = Math.sqrt(features.reduce((sum, val) => sum + val * val, 0));
      for (let i = 0; i < 128; i++) {
        features[i] /= magnitude;
      }
      
      resolve(features);
    }, 500);
  });
};

// Calculate similarity between two facial feature vectors
export const calculateFaceSimilarity = (features1: Float32Array, features2: Float32Array): number => {
  if (features1.length !== features2.length) {
    throw new Error("Feature vectors must have the same length");
  }
  
  // Compute cosine similarity
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  for (let i = 0; i < features1.length; i++) {
    dotProduct += features1[i] * features2[i];
    magnitude1 += features1[i] * features1[i];
    magnitude2 += features2[i] * features2[i];
  }
  
  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);
  
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }
  
  // Convert similarity to percentage (0-100)
  const similarity = (dotProduct / (magnitude1 * magnitude2) + 1) * 50;
  return Math.min(100, Math.max(0, similarity));
};
