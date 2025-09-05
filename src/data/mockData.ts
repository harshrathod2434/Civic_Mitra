import { Issue, Category, Department, CityStats } from '../types';

// Pune areas for realistic data
const puneAreas = [
  'FC Road', 'JM Road', 'Karve Road', 'Baner Road', 'Aundh', 'Kothrud', 'Viman Nagar', 
  'Koregaon Park', 'Hinjewadi', 'Wakad', 'Pimple Saudagar', 'Bavdhan', 'Katraj', 
  'Kondhwa', 'Hadapsar', 'Magarpatta', 'Kharadi', 'Vadgaon Sheri', 'Dhanori', 
  'Lohegaon', 'Chinchwad', 'Pimpri', 'Bhosari', 'Nigdi', 'Akurdi', 'Ravet', 
  'Tathawade', 'Thergaon', 'Sangvi', 'Dighi', 'Alandi', 'Talegaon', 'Dehu Road',
  'Shivajinagar', 'Swargate', 'Pune Station', 'Deccan', 'Shaniwar Wada', 'Kasba Peth',
  'Budhwar Peth', 'Tilak Road', 'Laxmi Road', 'Tulsi Baug', 'Appa Balwant Chowk',
  'Senapati Bapat Road', 'University Road', 'Ganeshkhind Road', 'Sinhagad Road',
  'Paud Road', 'Katraj-Kondhwa Bypass', 'Mumbai-Pune Expressway', 'Hinjewadi IT Park'
];

// Mumbai areas for some data
const mumbaiAreas = [
  'Andheri', 'Bandra', 'Dadar', 'Kurla', 'Powai', 'Goregaon', 'Malad', 'Borivali',
  'Thane', 'Navi Mumbai', 'Vashi', 'Chembur', 'Ghatkopar', 'Mulund', 'Bhandup'
];

// Nagpur areas for some data
const nagpurAreas = [
  'Dharampeth', 'Sitabuldi', 'Civil Lines', 'Ramdaspeth', 'Shankar Nagar', 'Wardha Road',
  'Amravati Road', 'Kamptee Road', 'Hingna', 'Koradi', 'Butibori', 'Mihan'
];

// Priority levels
const priorities: Issue['priority'][] = ['Low', 'Medium', 'High', 'Very High'];

// Status options
const statuses: Issue['status'][] = ['Pending', 'In Progress', 'Resolved'];

// Categories
const categories: Category[] = ['Pothole', 'Garbage', 'Electric Hazard', 'Stray cattle', 'Construction Debris', 'Stagnant water', 'Burning waste'];

// Cloudinary image URLs for different issue categories
const cloudinaryImages = {
  'Pothole': [
    'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089918/civic-mitra/civic-mitra/pothole.webp',
    'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089918/civic-mitra/civic-mitra/pothole.webp',
    'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089918/civic-mitra/civic-mitra/pothole.webp'
  ],
  'Garbage': [
    'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089915/civic-mitra/civic-mitra/garbagel.avif',
    'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089915/civic-mitra/civic-mitra/garbagel.avif',
    'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089915/civic-mitra/civic-mitra/garbagel.avif'
  ],
  'Electric Hazard': [
    'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089914/civic-mitra/civic-mitra/electric%20hazard.webp',
    'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089914/civic-mitra/civic-mitra/electric%20hazard.webp',
    'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089914/civic-mitra/civic-mitra/electric%20hazard.webp'
  ],
  'Stray cattle': [
    'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089910/civic-mitra/civic-mitra/Stray%20Cattle.avif',
    'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089910/civic-mitra/civic-mitra/Stray%20Cattle.avif',
    'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089910/civic-mitra/civic-mitra/Stray%20Cattle.avif'
  ],
  'Construction Debris': [
    'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089912/civic-mitra/civic-mitra/construction%20debris.avif',
    'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089912/civic-mitra/civic-mitra/construction%20debris.avif',
    'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089912/civic-mitra/civic-mitra/construction%20debris.avif'
  ],
  'Stagnant water': [
    'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089920/civic-mitra/civic-mitra/stagnant%20water.jpg',
    'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089920/civic-mitra/civic-mitra/stagnant%20water.jpg',
    'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089920/civic-mitra/civic-mitra/stagnant%20water.jpg'
  ],
  'Burning waste': [
    'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089911/civic-mitra/civic-mitra/burning%20waste.webp',
    'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089911/civic-mitra/civic-mitra/burning%20waste.webp',
    'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089911/civic-mitra/civic-mitra/burning%20waste.webp'
  ]
};

// Proof photos for resolved issues (before/after comparison)
const proofPhotos = [
  'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089918/civic-mitra/civic-mitra/pothole.webp',
  'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089915/civic-mitra/civic-mitra/garbagel.avif',
  'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089914/civic-mitra/civic-mitra/electric%20hazard.webp',
  'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089912/civic-mitra/civic-mitra/construction%20debris.avif',
  'https://res.cloudinary.com/dyzvzef89/image/upload/v1757089920/civic-mitra/civic-mitra/stagnant%20water.jpg'
];

// Helper function to get random item from array
const getRandomItem = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

// Helper function to get random date within last 30 days
const getRandomDate = (): string => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return date.toISOString().split('T')[0];
};

// Helper function to get random image for category
const getCategoryImage = (category: Category): string => {
  const images = cloudinaryImages[category];
  return getRandomItem(images);
};

// Helper function to generate random coordinates within city bounds
const getCityCoordinates = (city: string): [number, number] => {
  const cityBounds = {
    'Pune': { lat: [18.4, 18.7], lng: [73.7, 74.0] },
    'Mumbai': { lat: [19.0, 19.3], lng: [72.7, 73.0] },
    'Nagpur': { lat: [21.0, 21.3], lng: [78.9, 79.2] }
  };
  
  const bounds = cityBounds[city as keyof typeof cityBounds] || cityBounds['Pune'];
  const lat = bounds.lat[0] + Math.random() * (bounds.lat[1] - bounds.lat[0]);
  const lng = bounds.lng[0] + Math.random() * (bounds.lng[1] - bounds.lng[0]);
  
  return [lat, lng];
};

// Helper function to get area based on city
const getAreaForCity = (city: string): string => {
  switch (city) {
    case 'Pune': return getRandomItem(puneAreas);
    case 'Mumbai': return getRandomItem(mumbaiAreas);
    case 'Nagpur': return getRandomItem(nagpurAreas);
    default: return getRandomItem(puneAreas);
  }
};

// Map categories to departments
const categoryToDepartment: Record<Category, Department> = {
  'Pothole': 'Roads',
  'Garbage': 'Garbage',
  'Electric Hazard': 'Electricity',
  'Stray cattle': 'Garbage',
  'Construction Debris': 'Roads',
  'Stagnant water': 'Water Supply',
  'Burning waste': 'Garbage'
};

// Global ID counter to ensure unique IDs across all categories
let globalIdCounter = 1;

// Generate issues for each category
const generateIssuesForCategory = (category: Category, count: number, cityDistribution: { [key: string]: number }): Issue[] => {
  const issues: Issue[] = [];
  
  for (const [city, cityCount] of Object.entries(cityDistribution)) {
    for (let i = 0; i < cityCount; i++) {
      const area = getAreaForCity(city);
      const priority = getRandomItem(priorities);
      const status = getRandomItem(statuses);
      const location = getCityCoordinates(city);
      const department = categoryToDepartment[category];
      
      // Generate category-specific descriptions
      let description = '';
      switch (category) {
        case 'Pothole':
          description = `Large pothole on ${area} causing traffic issues and vehicle damage`;
          break;
        case 'Garbage':
          description = `Garbage accumulation near ${area} creating unhygienic conditions`;
          break;
        case 'Electric Hazard':
          description = `Exposed electrical wires or damaged electric pole near ${area}`;
          break;
        case 'Stray cattle':
          description = `Stray cattle roaming on ${area} causing traffic obstruction`;
          break;
        case 'Construction Debris':
          description = `Construction debris dumped on ${area} blocking pedestrian path`;
          break;
        case 'Stagnant water':
          description = `Stagnant water accumulation near ${area} breeding mosquitoes`;
          break;
        case 'Burning waste':
          description = `Waste burning near ${area} causing air pollution and health hazards`;
          break;
      }
      
      issues.push({
        id: globalIdCounter++,
        city,
        category,
        description,
        photo: getCategoryImage(category),
        priority,
        status,
        location,
        reportedDate: getRandomDate(),
        address: `${area}, ${city}`,
        department,
        proofPhoto: status === 'Resolved' ? getRandomItem(proofPhotos) : undefined
      });
    }
  }
  
  return issues;
};

// City distribution - mostly Pune, some Mumbai and Nagpur
const cityDistribution = {
  'Pune': 100,    // 100 issues for Pune
  'Mumbai': 15,   // 15 issues for Mumbai
  'Nagpur': 10    // 10 issues for Nagpur
};

// Generate all issues
export const ISSUES: Issue[] = categories.flatMap(category => 
  generateIssuesForCategory(category, 125, cityDistribution)
);

export const CITY_LOCATIONS: Record<string, [number, number]> = {
  "Mumbai": [19.0760, 72.8777],
  "Pune": [18.5204, 73.8567],
  "Nagpur": [21.1458, 79.0882],
  "Nashik": [19.9975, 73.7898],
  "Aurangabad": [19.8762, 75.3433]
};

export const DEPARTMENTS: Department[] = [
  "Roads",
  "Garbage",
  "Water Supply",
  "Electricity",
  "Streetlights"
];

export const CATEGORIES: Category[] = categories;

export const USERS = {
  government: { email: "gov@maharashtra.in", password: "gov123", role: "government" },
  municipal: { email: "muni@pune.in", password: "muni123", role: "municipal", city: "Pune" }
};

// Helper function to get category statistics
export const getCategoryStats = (): { [key in Category]: { total: number; byPriority: { [key in Issue['priority']]: number }; byStatus: { [key in Issue['status']]: number } } } => {
  const stats = {} as any;
  
  categories.forEach(category => {
    const categoryIssues = ISSUES.filter(issue => issue.category === category);
    
    stats[category] = {
      total: categoryIssues.length,
      byPriority: {
        'Low': categoryIssues.filter(issue => issue.priority === 'Low').length,
        'Medium': categoryIssues.filter(issue => issue.priority === 'Medium').length,
        'High': categoryIssues.filter(issue => issue.priority === 'High').length,
        'Very High': categoryIssues.filter(issue => issue.priority === 'Very High').length
      },
      byStatus: {
        'Pending': categoryIssues.filter(issue => issue.status === 'Pending').length,
        'In Progress': categoryIssues.filter(issue => issue.status === 'In Progress').length,
        'Resolved': categoryIssues.filter(issue => issue.status === 'Resolved').length
      }
    };
  });
  
  return stats;
};

// Helper function to generate city stats from issues
export const generateCityStats = (): CityStats[] => {
  const cities = Object.keys(CITY_LOCATIONS);
  
  return cities.map(city => {
    const cityIssues = ISSUES.filter(issue => issue.city === city);
    const resolvedIssues = cityIssues.filter(issue => issue.status === "Resolved");
    
    const departmentBreakdown = DEPARTMENTS.reduce((acc, dept) => {
      acc[dept] = cityIssues.filter(issue => issue.category === dept).length;
      return acc;
    }, {} as Record<Department, number>);
    
    return {
      city,
      totalIssues: cityIssues.length,
      resolvedIssues: resolvedIssues.length,
      departmentBreakdown,
      location: CITY_LOCATIONS[city]
    };
  });
};