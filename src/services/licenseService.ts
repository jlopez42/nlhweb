import { License } from '../types';
import { mockLicenses } from '../data/mockData';

export const licenseService = {
  // Get all licenses
  getLicenses: async (): Promise<License[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockLicenses]), 400);
    });
  },

  // Get licenses by user ID
  getLicensesByUserId: async (userId: string): Promise<License[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userLicenses = mockLicenses.filter(l => l.userId === userId);
        resolve(userLicenses);
      }, 400);
    });
  },

  // Create license
  createLicense: async (licenseData: Omit<License, 'id' | 'status'>): Promise<License> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date();
        const expiryDate = new Date(licenseData.expiryDate);
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        let status: License['status'] = 'active';
        if (daysUntilExpiry < 0) {
          status = 'expired';
        } else if (daysUntilExpiry <= 30) {
          status = 'expiring';
        }

        const newLicense: License = {
          ...licenseData,
          id: Date.now().toString(),
          status
        };
        mockLicenses.push(newLicense);
        resolve(newLicense);
      }, 600);
    });
  },

  // Update license
  updateLicense: async (id: string, updates: Partial<License>): Promise<License | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockLicenses.findIndex(l => l.id === id);
        if (index !== -1) {
          const updatedLicense = { ...mockLicenses[index], ...updates };
          
          // Recalculate status if expiry date changed
          if (updates.expiryDate) {
            const now = new Date();
            const expiryDate = new Date(updates.expiryDate);
            const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysUntilExpiry < 0) {
              updatedLicense.status = 'expired';
            } else if (daysUntilExpiry <= 30) {
              updatedLicense.status = 'expiring';
            } else {
              updatedLicense.status = 'active';
            }
          }
          
          mockLicenses[index] = updatedLicense;
          resolve(updatedLicense);
        } else {
          resolve(null);
        }
      }, 500);
    });
  },

  // Delete license
  deleteLicense: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockLicenses.findIndex(l => l.id === id);
        if (index !== -1) {
          mockLicenses.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 400);
    });
  }
};