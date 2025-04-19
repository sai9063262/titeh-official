
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

      const apiKey = this.getApiKey();
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are T-Helper, a knowledgeable AI assistant for the TITEH (Telangana Integrated Traffic Enforcement Helper) app. You can answer questions about traffic rules, driver verification, vehicle management, app features, and any general questions. Provide clear, accurate, and helpful responses. Be professional yet friendly. If you're not sure about something, be honest and provide the most helpful guidance you can."
            },
            {
              role: "user",
              content: question
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API Error:", errorData);
        
        // If quota exceeded or API key issue, enable mock responses
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
        
        // If quota exceeded or API key issue, enable mock responses
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

  // Generate fallback responses when the API is unavailable
  private generateMockResponse(question: string): string {
    // Normalize the question for easier matching
    const normalizedQuestion = question.toLowerCase().trim();
    
    // Common traffic rule questions
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
    
    // About the app
    if (normalizedQuestion.includes('what can you do') || normalizedQuestion.includes('what do you do') || normalizedQuestion.includes('how can you help')) {
      return "I'm T-Helper, your AI assistant for the TITEH app. I can help you with: information about traffic rules in Telangana, driver verification procedures, vehicle management details, challan payment processes, license renewals, and general questions about road safety or the TITEH app features. Just ask me anything traffic-related, and I'll do my best to assist you!";
    }
    
    // General greeting or hello
    if (normalizedQuestion.includes('hello') || normalizedQuestion.includes('hi') || normalizedQuestion.includes('hey') || normalizedQuestion === '') {
      return "Hello! I'm T-Helper, your AI assistant for the TITEH (Telangana Integrated Traffic Enforcement Helper) app. How can I help you today with traffic rules, driver verification, or other traffic-related information?";
    }
    
    // Default response for other questions
    return "Thank you for your question. As T-Helper, I provide information about Telangana traffic rules, driver verification, vehicle management, and TITEH app features. For this specific query, please try rephrasing or ask about traffic regulations, license procedures, or app features for more accurate information.";
  }
}

export default OpenAIService.getInstance();
