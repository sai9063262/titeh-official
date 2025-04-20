
export const checkBiometricSupport = async (): Promise<boolean> => {
  try {
    // Check if device supports biometric authentication
    const publicKeyCredentialSupport = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return publicKeyCredentialSupport;
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
