
import CryptoJS from 'crypto-js';
import { adminUsers } from '@/lib/adminConfig';

class AuthService {
  private static instance: AuthService;
  private isAuthenticated: boolean = false;
  private currentOTP: string | null = null;
  private otpExpiry: number | null = null;
  private otpAttempts: number = 0;
  private lockedUntil: number | null = null;
  private adminEmail: string | null = null;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public isLoggedIn(): boolean {
    // Check if session is still valid
    const sessionExpiry = localStorage.getItem('adminSessionExpiry');
    if (sessionExpiry && parseInt(sessionExpiry) > Date.now()) {
      this.isAuthenticated = true;
      this.adminEmail = localStorage.getItem('adminEmail');
      return true;
    }
    
    // Session expired
    this.logout();
    return false;
  }

  public isAccountLocked(): boolean {
    if (this.lockedUntil && Date.now() < this.lockedUntil) {
      return true;
    }
    return false;
  }

  public getLockedTimeRemaining(): number {
    if (this.lockedUntil) {
      return Math.ceil((this.lockedUntil - Date.now()) / 1000 / 60); // minutes
    }
    return 0;
  }

  public verifyCredentials(email: string, password: string): boolean {
    // Trim whitespace from inputs to prevent login issues
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    
    // Debug login credentials
    console.log("Attempting login with:", trimmedEmail);
    
    // Fix the admin credentials check - exact matching needed
    if (trimmedEmail === "saikumarpanchagiri058@gmail.com" && trimmedPassword === "$@!|<u|\\/|@r") {
      this.adminEmail = trimmedEmail;
      return true;
    }
    
    // For OpenAI API access specifically
    if (trimmedEmail === "adminopenaiapi.com" && trimmedPassword === "OPENAIAPIKEY") {
      this.adminEmail = trimmedEmail;
      return true;
    }
    
    // Check against admin users config
    const adminMatch = adminUsers.find(admin => admin.email === trimmedEmail);
    if (adminMatch) {
      this.adminEmail = trimmedEmail;
      return true;
    }
    
    return false;
  }

  public generateOTP(): string {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.currentOTP = CryptoJS.SHA256(otp).toString();
    
    // Set expiry to 5 minutes from now
    this.otpExpiry = Date.now() + 5 * 60 * 1000;
    this.otpAttempts = 0;
    
    // In a real app, we would send this OTP via email
    console.log("Generated OTP (in a real app, this would be sent via email):", otp);
    
    return otp; // Only returning for demo purposes, real app would not return this
  }

  public verifyOTP(otp: string): boolean {
    if (this.isAccountLocked()) {
      return false;
    }
    
    // Check if OTP has expired
    if (!this.otpExpiry || Date.now() > this.otpExpiry) {
      return false;
    }
    
    const hashedInput = CryptoJS.SHA256(otp).toString();
    const isValid = this.currentOTP === hashedInput;
    
    if (!isValid) {
      this.otpAttempts++;
      
      // Lock account after 3 failed attempts
      if (this.otpAttempts >= 3) {
        this.lockedUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
      }
      
      return false;
    }
    
    // OTP is valid
    this.currentOTP = null;
    this.otpExpiry = null;
    this.otpAttempts = 0;
    
    return true;
  }

  public completeAuthentication(): void {
    this.isAuthenticated = true;
    
    // Set session to expire in 24 hours
    const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem('adminSessionExpiry', expiryTime.toString());
    if (this.adminEmail) {
      localStorage.setItem('adminEmail', this.adminEmail);
    }
    
    // Log successful login with timestamp
    this.logAuthEvent("Login successful", true);
  }

  public logout(): void {
    this.isAuthenticated = false;
    this.adminEmail = null;
    localStorage.removeItem('adminSessionExpiry');
    localStorage.removeItem('adminEmail');
    
    // Log logout with timestamp
    this.logAuthEvent("Logout", true);
  }

  public getAdminEmail(): string | null {
    return this.adminEmail;
  }

  public isAdminByEmail(email: string): boolean {
    return adminUsers.some(user => user.email === email);
  }

  private logAuthEvent(action: string, success: boolean): void {
    const timestamp = new Date().toISOString();
    const event = {
      timestamp,
      action,
      success,
      email: this.adminEmail || "unknown"
    };
    
    // In a real app, we would store this securely in a database
    console.log("Auth event logged:", event);
    
    // For demo, store in localStorage
    const logs = JSON.parse(localStorage.getItem('authLogs') || '[]');
    logs.push(event);
    localStorage.setItem('authLogs', JSON.stringify(logs));
  }
}

export default AuthService.getInstance();
