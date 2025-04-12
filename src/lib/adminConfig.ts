
// Admin user configuration
export const adminUsers = [
  { 
    name: "Sai Kumar Panchagiri (Main)", 
    email: "saikumarpanchagiri393@gmail.com",
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
