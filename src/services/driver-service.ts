
import { supabase } from "@/integrations/supabase/client";
import { DriverData } from "@/lib/verification-utils";

class DriverService {
  private static instance: DriverService;
  private adminDriverCache: DriverData[] | null = null;

  // Create a singleton instance
  public static getInstance(): DriverService {
    if (!DriverService.instance) {
      DriverService.instance = new DriverService();
    }
    return DriverService.instance;
  }

  // Get all drivers
  async getAllDrivers(): Promise<DriverData[]> {
    try {
      // First check if there are local admin-saved drivers
      const localDrivers = this.getLocalAdminDrivers();
      
      // Log the local drivers for debugging
      console.log("Local admin drivers:", localDrivers);
      
      // Fetch from Supabase
      const { data, error } = await supabase
        .from("drivers")
        .select("*");

      if (error) {
        console.error("Error fetching drivers from Supabase:", error);
        // If Supabase fetch fails, return local drivers or empty array
        return localDrivers;
      }

      // Map Supabase results to DriverData
      const supabaseDrivers = data.map((driver) => ({
        id: driver.id,
        name: driver.name,
        licenseNumber: driver.license_number,
        validUntil: driver.valid_until || "",
        vehicleClass: driver.vehicle_class || "",
        photoUrl: driver.photo_url || "https://via.placeholder.com/150",
        status: (driver.status as DriverData["status"]) || "valid",
        address: driver.address || "",
        age: driver.age || "",
        notes: driver.notes || ""
      }));
      
      console.log("Supabase drivers:", supabaseDrivers);
      
      // Combine both sources of drivers, ensuring no duplicates by license number
      const allDrivers = [...supabaseDrivers];
      
      // Only add local drivers that don't exist in supabase (by license number)
      for (const localDriver of localDrivers) {
        const exists = supabaseDrivers.some(
          d => d.licenseNumber.toLowerCase() === localDriver.licenseNumber.toLowerCase()
        );
        if (!exists) {
          allDrivers.push(localDriver);
        }
      }
      
      console.log("All drivers after combining:", allDrivers);
      
      // Cache the combined results
      this.adminDriverCache = allDrivers;
      
      return allDrivers;
    } catch (error) {
      console.error("Unexpected error fetching drivers:", error);
      // Return local drivers as a fallback
      return this.getLocalAdminDrivers();
    }
  }

  // Get driver by ID
  async getDriverById(id: string): Promise<DriverData | null> {
    // Check local cache first
    const localDrivers = this.getLocalAdminDrivers();
    const localMatch = localDrivers.find(driver => driver.id === id);
    if (localMatch) return localMatch;
    
    try {
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Error fetching driver:", error);
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        licenseNumber: data.license_number,
        validUntil: data.valid_until || "",
        vehicleClass: data.vehicle_class || "",
        photoUrl: data.photo_url || "https://via.placeholder.com/150",
        status: (data.status as DriverData["status"]) || "valid",
        address: data.address || "",
        age: data.age || "",
        notes: data.notes || ""
      };
    } catch (error) {
      console.error("Unexpected error fetching driver:", error);
      return null;
    }
  }

  // Add new driver
  async addDriver(driver: Omit<DriverData, "id">): Promise<DriverData | null> {
    try {
      const { data, error } = await supabase
        .from("drivers")
        .insert([{
          name: driver.name,
          license_number: driver.licenseNumber,
          valid_until: driver.validUntil,
          vehicle_class: driver.vehicleClass,
          photo_url: driver.photoUrl,
          status: driver.status,
          address: driver.address || "",
          age: driver.age || "",
          notes: driver.notes || ""
        }])
        .select()
        .single();

      if (error || !data) {
        console.error("Error adding driver to Supabase:", error);
        return null;
      }

      // Invalidate cache
      this.adminDriverCache = null;

      return {
        id: data.id,
        name: data.name,
        licenseNumber: data.license_number,
        validUntil: data.valid_until || "",
        vehicleClass: data.vehicle_class || "",
        photoUrl: data.photo_url || "https://via.placeholder.com/150",
        status: (data.status as DriverData["status"]) || "valid",
        address: data.address || "",
        age: data.age || "",
        notes: data.notes || ""
      };
    } catch (error) {
      console.error("Unexpected error adding driver:", error);
      return null;
    }
  }

  // Update driver
  async updateDriver(id: string, updates: Partial<DriverData>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("drivers")
        .update({
          name: updates.name,
          license_number: updates.licenseNumber,
          valid_until: updates.validUntil,
          vehicle_class: updates.vehicleClass,
          photo_url: updates.photoUrl,
          status: updates.status,
          address: updates.address || "",
          age: updates.age || "",
          notes: updates.notes || ""
        })
        .eq("id", id);

      if (error) {
        console.error("Error updating driver:", error);
        return false;
      }

      // Invalidate cache
      this.adminDriverCache = null;
      return true;
    } catch (error) {
      console.error("Unexpected error updating driver:", error);
      return false;
    }
  }

  // Delete driver
  async deleteDriver(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("drivers")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting driver:", error);
        return false;
      }

      // Invalidate cache
      this.adminDriverCache = null;
      return true;
    } catch (error) {
      console.error("Unexpected error deleting driver:", error);
      return false;
    }
  }

  // Search drivers by license number or name
  async searchDrivers(query: string): Promise<DriverData[]> {
    // First check local drivers
    const localDrivers = this.getLocalAdminDrivers();
    const localMatches = localDrivers.filter(driver => 
      driver.name.toLowerCase().includes(query.toLowerCase()) || 
      driver.licenseNumber.toLowerCase().includes(query.toLowerCase())
    );
    
    try {
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .or(`name.ilike.%${query}%,license_number.ilike.%${query}%`);

      if (error) {
        console.error("Error searching drivers:", error);
        return localMatches;
      }

      const supabaseMatches = data.map((driver) => ({
        id: driver.id,
        name: driver.name,
        licenseNumber: driver.license_number,
        validUntil: driver.valid_until || "",
        vehicleClass: driver.vehicle_class || "",
        photoUrl: driver.photo_url || "https://via.placeholder.com/150",
        status: (driver.status as DriverData["status"]) || "valid",
        address: driver.address || "",
        age: driver.age || "",
        notes: driver.notes || ""
      }));
      
      // Combine both sources of search results, avoiding duplicates
      const allMatches = [...supabaseMatches];
      
      // Add local matches that don't exist in supabase results
      for (const localMatch of localMatches) {
        const exists = supabaseMatches.some(
          d => d.licenseNumber.toLowerCase() === localMatch.licenseNumber.toLowerCase()
        );
        if (!exists) {
          allMatches.push(localMatch);
        }
      }
      
      return allMatches;
    } catch (error) {
      console.error("Unexpected error searching drivers:", error);
      return localMatches;
    }
  }
  
  // Get drivers stored in localStorage by admin panel
  private getLocalAdminDrivers(): DriverData[] {
    // Return cached drivers if available
    if (this.adminDriverCache) {
      return this.adminDriverCache;
    }
    
    try {
      const savedDrivers = localStorage.getItem('adminDriverRecords');
      if (!savedDrivers) {
        console.log("No drivers found in localStorage");
        return [];
      }
      
      const localDrivers = JSON.parse(savedDrivers);
      console.log("Drivers loaded from localStorage:", localDrivers);
      return localDrivers;
    } catch (error) {
      console.error("Error loading drivers from localStorage:", error);
      return [];
    }
  }
  
  // Find a driver by license number (combining both sources)
  async findDriverByLicense(licenseNumber: string): Promise<DriverData | null> {
    console.log("Finding driver by license number:", licenseNumber);
    
    // First clear the cache to ensure we're getting fresh data
    this.adminDriverCache = null;
    
    // Get all drivers from both sources
    const allDrivers = await this.getAllDrivers();
    
    console.log("Total drivers to search through:", allDrivers.length);
    
    // Normalize input
    const normalizedLicense = licenseNumber.trim().toLowerCase();
    
    // Search for a match
    const matchedDriver = allDrivers.find(
      driver => driver.licenseNumber.toLowerCase() === normalizedLicense
    );
    
    console.log("Driver match result:", matchedDriver ? "Found" : "Not found");
    
    return matchedDriver || null;
  }
}

export default DriverService.getInstance();
