export interface User {
  email: string;
  role: 'government' | 'municipal';
  city?: string;
}

export interface Issue {
  id: number;
  city: string;
  category: string;
  description: string;
  photo: string;
  priority: 'Low' | 'Medium' | 'High' | 'Very High';
  status: 'Pending' | 'In Progress' | 'Resolved';
  location: [number, number]; // [latitude, longitude]
  proofPhoto?: string;
  reportedDate: string;
  address: string;
  department: Department;
}

export type Category = 'Pothole' | 'Garbage' | 'Electric Hazard' | 'Stray cattle' | 'Construction Debris' | 'Stagnant water' | 'Burning waste';

export type Department = 'Roads' | 'Garbage' | 'Water Supply' | 'Electricity' | 'Streetlights';

export interface CityStats {
  city: string;
  totalIssues: number;
  resolvedIssues: number;
  departmentBreakdown: Record<Department, number>;
  location: [number, number];
}