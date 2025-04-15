
import { supabase } from "@/integrations/supabase/client";
import { DriverData } from "@/lib/verification-utils";

class DriverService {
  private static instance: DriverService;

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
      const { data, error } = await supabase
        .from("drivers")
        .select("*");

      if (error) {
        console.error("Error fetching drivers:", error);
        return [];
      }

      return data.map((driver) => ({
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
    } catch (error) {
      console.error("Unexpected error fetching drivers:", error);
      return [];
    }
  }

  // Get driver by ID
  async getDriverById(id: string): Promise<DriverData | null> {
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
          address: driver.address,
          age: driver.age,
          notes: driver.notes
        }])
        .select()
        .single();

      if (error || !data) {
        console.error("Error adding driver:", error);
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
          address: updates.address,
          age: updates.age,
          notes: updates.notes
        })
        .eq("id", id);

      if (error) {
        console.error("Error updating driver:", error);
        return false;
      }

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

      return true;
    } catch (error) {
      console.error("Unexpected error deleting driver:", error);
      return false;
    }
  }

  // Search drivers by license number or name
  async searchDrivers(query: string): Promise<DriverData[]> {
    try {
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .or(`name.ilike.%${query}%,license_number.ilike.%${query}%`);

      if (error) {
        console.error("Error searching drivers:", error);
        return [];
      }

      return data.map((driver) => ({
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
    } catch (error) {
      console.error("Unexpected error searching drivers:", error);
      return [];
    }
  }
}

export default DriverService.getInstance();
