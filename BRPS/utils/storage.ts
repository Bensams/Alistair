import { Resident } from '../types/resident';

const STORAGE_KEY = 'barangay_residents';

export const saveResidents = (residents: Resident[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(residents));
};

export const loadResidents = (): Resident[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse residents data:', e);
      return [];
    }
  }
  return [];
};

export const addResident = (resident: Resident): void => {
  const residents = loadResidents();
  residents.push(resident);
  saveResidents(residents);
};

export const updateResident = (id: string, updatedResident: Resident): void => {
  const residents = loadResidents();
  const index = residents.findIndex(r => r.id === id);
  if (index !== -1) {
    residents[index] = updatedResident;
    saveResidents(residents);
  }
};

export const deleteResident = (id: string): void => {
  const residents = loadResidents();
  const filtered = residents.filter(r => r.id !== id);
  saveResidents(filtered);
};

export const getResidentById = (id: string): Resident | undefined => {
  const residents = loadResidents();
  return residents.find(r => r.id === id);
};

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};
