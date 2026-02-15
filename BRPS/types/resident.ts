export interface Resident {
  id: string;
  profilePicture?: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix?: string;
  birthDate: string;
  age: number;
  gender: 'Male' | 'Female';
  civilStatus: 'Single' | 'Married' | 'Widowed' | 'Separated';
  contactNumber: string;
  email?: string;
  address: string;
  purok: string;
  occupation?: string;
  monthlyIncome?: string;
  householdHead: boolean;
  householdId?: string;
  voterStatus: 'Registered' | 'Not Registered';
  pwdStatus: boolean;
  seniorCitizen: boolean;
  indigent: boolean;
  dateRegistered: string;
  remarks?: string;
}

export interface HouseholdStats {
  totalHouseholds: number;
  averageHouseholdSize: number;
}