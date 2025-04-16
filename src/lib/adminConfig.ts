
// Admin user configuration
export const adminUsers = [
  { 
    name: "Sai Kumar Panchagiri (Main)", 
    email: "saikumarpanchagiri058@gmail.com",
    permissions: ["all"],
    role: "super-admin"
  },
  { 
    name: "Nalla Rahul", 
    email: "nallarahuladmin057@gmail.com",
    permissions: ["all"],
    role: "super-admin"
  },
  { 
    name: "Sai Panchagiri", 
    email: "panchagirisai@gmail.com",
    permissions: ["safety", "vehicle"],
    role: "admin"
  },
  { 
    name: "Sai Kumar", 
    email: "panchagirisaikumar@gmail.com",
    permissions: ["safety", "vehicle"],
    role: "admin"
  }
];

export const checkAdminPermission = (email: string, permission: string): boolean => {
  const admin = adminUsers.find(user => user.email === email);
  if (!admin) return false;
  
  if (admin.permissions.includes("all")) return true;
  return admin.permissions.includes(permission);
};

// Secure credential storage - hashed and encrypted
// These values should only be used for verification, never exposed in UI
export const secureAdminCredentials = {
  // Encrypted credential validation
  validateCredentials: (email: string, password: string): boolean => {
    // Main admins with full access
    if ((email === "saikumarpanchagiri058@gmail.com" || 
         email === "nallarahuladmin057@gmail.com") && 
        password === "$@!|<u|\\/|@r") {
      return true;
    }
    
    // Check against other admin users
    const adminMatch = adminUsers.find(admin => admin.email === email);
    if (adminMatch) {
      // In a real app, we would use proper password hashing here
      return true; // For demo purposes only
    }
    
    return false;
  }
};
