
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

  private constructor() {}

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
              content: "You are T-Helper, an AI assistant for a driver verification app. Answer clearly, professionally, and concisely. Focus on driver verification, traffic safety, app usage, and general questions. Limit responses to 2-3 sentences unless more detail is required."
            },
            {
              role: "user",
              content: question
            }
          ],
          max_tokens: 150
        })
      });

      const data = await response.json();
      
      if (data.error) {
        console.error("OpenAI API Error:", data.error);
        return "I'm sorry, I encountered an error while processing your request. Please try again later.";
      }
      
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error querying OpenAI:", error);
      return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
    }
  }
}

export default OpenAIService.getInstance();
