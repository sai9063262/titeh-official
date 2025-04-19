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
  "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",
  "T-HELPER-SECRET-KEY"
);

class OpenAIService {
  private static instance: OpenAIService;
  private encryptedApiKey: string = DEFAULT_ENCRYPTED_API_KEY;
  private secretKey: string = "T-HELPER-SECRET-KEY";

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
  }

  public getApiKey(): string {
    const storedKey = localStorage.getItem('encryptedApiKey');
    return decryptApiKey(storedKey || this.encryptedApiKey, this.secretKey);
  }

  public async askTHelper(question: string): Promise<string> {
    try {
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
              content: "You are T-Helper, a knowledgeable AI assistant for the TITEH (Telangana Integrated Traffic Enforcement Helper) app. You can answer questions about traffic rules, driver verification, vehicle management, app features, and any general questions. Provide clear, accurate, and helpful responses. Be professional yet friendly."
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
        throw new Error(errorData.error?.message || "Failed to get response from AI");
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error in T-Helper:", error);
      throw error;
    }
  }
}

export default OpenAIService.getInstance();
