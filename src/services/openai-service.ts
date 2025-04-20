import CryptoJS from 'crypto-js';

// Encrypted API key storage (AES-256 encryption)
const encryptApiKey = (apiKey: string, secretKey: string): string => {
  return CryptoJS.AES.encrypt(apiKey, secretKey).toString();
};

const decryptApiKey = (encryptedApiKey: string, secretKey: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedApiKey, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Default encrypted API key - this is just a placeholder and will be replaced by admin
const DEFAULT_ENCRYPTED_API_KEY = encryptApiKey(
  "sk-this-is-a-placeholder-api-key-please-set-your-own",
  "T-HELPER-SECRET-KEY"
);

class OpenAIService {
  private static instance: OpenAIService;
  private encryptedApiKey: string = DEFAULT_ENCRYPTED_API_KEY;
  private secretKey: string = "T-HELPER-SECRET-KEY";
  private mockResponses: boolean = false; // Fallback to mock responses when API is unavailable

  private constructor() {
    const storedKey = localStorage.getItem('encryptedApiKey');
    if (storedKey) {
      this.encryptedApiKey = storedKey;
    }
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  public setApiKey(apiKey: string): void {
    this.encryptedApiKey = encryptApiKey(apiKey, this.secretKey);
    localStorage.setItem('encryptedApiKey', this.encryptedApiKey);
    this.mockResponses = false; // Reset mock responses when new API key is set
  }

  public getApiKey(): string {
    const storedKey = localStorage.getItem('encryptedApiKey');
    return decryptApiKey(storedKey || this.encryptedApiKey, this.secretKey);
  }

  public enableMockResponses(): void {
    this.mockResponses = true;
  }

  public async askTHelper(question: string): Promise<string> {
    try {
      if (this.mockResponses) {
        return this.generateMockResponse(question);
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getApiKey()}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are T-Helper, an AI assistant for the TITEH (Telangana Integrated Traffic Enforcement Helper) app. You are knowledgeable about:

1. Traffic Rules & Regulations:
- Telangana traffic laws and regulations
- Road safety guidelines
- Traffic violation penalties
- License requirements and procedures

2. App Features & Services:
- Driver verification processes
- Vehicle management
- Traffic challan payments
- Road condition reporting
- Emergency services
- Safety scores and monitoring
- Biometric authentication
- RTO exam preparation

3. General Information:
- Local traffic conditions
- Road safety tips
- Vehicle maintenance
- Emergency procedures
- Weather-related driving advice

4. Administrative Procedures:
- License renewal
- Vehicle registration
- Document requirements
- RTO office locations
- Payment procedures

You should be helpful, friendly, and provide accurate information. If a question is outside your knowledge base, acknowledge it and suggest relevant traffic or safety-related information instead.`
            },
            {
              role: "user",
              content: question
            }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API Error:", errorData);
        
        if (errorData.error?.code === 'insufficient_quota' || 
            errorData.error?.type === 'insufficient_quota' ||
            errorData.error?.type === 'invalid_request_error') {
          this.enableMockResponses();
          return this.generateMockResponse(question);
        }
        
        throw new Error(errorData.error?.message || "Failed to get response from AI");
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error in T-Helper:", error);
      this.enableMockResponses();
      return this.generateMockResponse(question);
    }
  }

  public async transcribeAudio(audioData: Blob): Promise<string> {
    try {
      if (this.mockResponses) {
        // Simulate transcription delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return "This is a simulated transcription response as the API is unavailable.";
      }

      const apiKey = this.getApiKey();
      const formData = new FormData();
      formData.append('file', audioData, 'audio.webm');
      formData.append('model', 'whisper-1');
      formData.append('language', 'en');
      
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI Transcription API Error:", errorData);
        
        if (errorData.error?.code === 'insufficient_quota' || 
            errorData.error?.type === 'insufficient_quota' ||
            errorData.error?.type === 'invalid_request_error') {
          this.enableMockResponses();
          return "I heard you speaking but couldn't transcribe accurately. Please try typing your question.";
        }
        
        throw new Error(errorData.error?.message || "Failed to transcribe audio");
      }
      
      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error("Error transcribing audio:", error);
      this.enableMockResponses();
      return "I heard you speaking but couldn't transcribe accurately. Please try typing your question.";
    }
  }

  private generateMockResponse(question: string): string {
    const normalizedQuestion = question.toLowerCase().trim();
    
    if (normalizedQuestion.includes('what can you do') || 
        normalizedQuestion.includes('help me') || 
        normalizedQuestion.includes('about you')) {
      return `I'm T-Helper, your AI assistant for the TITEH app. I can help you with:

1. Traffic & Driving:
- Traffic rules and regulations
- License procedures
- Vehicle registration
- Challan payments
- Road safety information

2. App Features:
- Driver verification
- Vehicle management
- Safety monitoring
- Emergency services
- RTO exam preparation

3. General Information:
- Local traffic updates
- Weather-related driving tips
- Vehicle maintenance advice
- Emergency procedures
- Nearby facilities

Feel free to ask me anything about these topics, and I'll do my best to help!`;
    }
    
    if (normalizedQuestion.includes('weather') || normalizedQuestion.includes('rain')) {
      return "I can provide real-time weather updates and driving recommendations based on current conditions. During adverse weather, I recommend: reducing speed, maintaining safe distance, using headlights appropriately, and ensuring your vehicle is properly maintained.";
    }
    
    if (normalizedQuestion.includes('license points') || normalizedQuestion.includes('check points')) {
      return "To check license points in Telangana, you can: 1) Visit the Telangana RTA website (transport.telangana.gov.in), 2) Use the TITEH app and navigate to Driver Verification section, 3) Visit your nearest RTA office with your license, or 4) Use the mParivahan app. Your license points reflect your driving record, with points deducted for traffic violations.";
    }
    
    if (normalizedQuestion.includes('renew') && normalizedQuestion.includes('license')) {
      return "To renew your driving license in Telangana: 1) Apply online through transport.telangana.gov.in or the TITEH app, 2) Submit required documents (proof of identity, address, existing license), 3) Pay the renewal fee, 4) Schedule an appointment for biometric verification if needed, 5) Collect your renewed license. Start the process at least 30 days before expiration.";
    }
    
    if (normalizedQuestion.includes('challan') || normalizedQuestion.includes('pay fine')) {
      return "You can pay traffic challans in Telangana through: 1) The TITEH app's Pay Challan section, 2) The Telangana Traffic Police website (echallan.tspolice.gov.in), 3) The mParivahan app, 4) Visiting your nearest traffic police station or e-Seva center with your vehicle details and payment.";
    }
    
    if (normalizedQuestion.includes('verify') && (normalizedQuestion.includes('driver') || normalizedQuestion.includes('license'))) {
      return "To verify a driver's license in Telangana: 1) Use the TITEH app's Driver Verification feature, 2) Visit the Telangana RTA website (transport.telangana.gov.in), 3) Use the mParivahan app, or 4) Send an SMS as per the format provided by RTA Telangana. You'll need the license number for verification.";
    }
    
    if (normalizedQuestion.includes('about the app') || 
        normalizedQuestion.includes('what do you do') || 
        normalizedQuestion.includes('how can you help')) {
      return "I'm T-Helper, your AI assistant for the TITEH (Telangana Integrated Traffic Enforcement Helper) app. I can help you with: information about traffic rules, driver verification, vehicle management, app features, and any general questions. Just ask me anything traffic-related, and I'll do my best to assist you!";
    }
    
    if (normalizedQuestion.includes('hello') || normalizedQuestion.includes('hi') || normalizedQuestion.includes('hey') || normalizedQuestion === '') {
      return "Hello! I'm T-Helper, your AI assistant for the TITEH (Telangana Integrated Traffic Enforcement Helper) app. How can I help you today with traffic rules, driver verification, or other traffic-related information?";
    }
    
    return "Thank you for your question. As T-Helper, I provide information about Telangana traffic rules, driver verification, vehicle management, and TITEH app features. For this specific query, please try rephrasing or ask about traffic regulations, license procedures, or app features for more accurate information.";
  }
}

export default OpenAIService.getInstance();
