import { create } from 'zustand';

export interface CarModel {
  id: string;
  name: string;
  category: string;
  path: string;
  defaultColor?: string;
  description: string;
}

export const CATEGORIES = [
  'Supercars',
  'JDM & Tuners',
  'Classics',
  'Electric',
  'Off-Road'
];

export const CARS: CarModel[] = [
  { id: 'porsche_911', name: 'Porsche 911', category: 'Supercars', path: '/cars/porsche_911/scene.gltf', description: 'Iconic rear-engined sports car with timeless curves.', defaultColor: '#eab308' },
  { id: 'lambo_huracan', name: 'Lamborghini Huracán', category: 'Supercars', path: '/cars/lambo_huracan/scene.gltf', description: 'V10 Italian exotic with sharp, aggressive geometry.', defaultColor: '#ef4444' },
  { id: 'nissan_gtr', name: 'Nissan Skyline GT-R R34', category: 'JDM & Tuners', path: '/cars/nissan_gtr/scene.gltf', description: 'The legendary Godzilla of Japanese tuning.', defaultColor: '#3b82f6' },
  { id: 'supra_mk4', name: 'Toyota Supra MK4', category: 'JDM & Tuners', path: '/cars/supra_mk4/scene.gltf', description: 'Iconic 2JZ powerhouse, famously featured in racing culture.', defaultColor: '#ffffff' },
  { id: 'mustang_69', name: 'Ford Mustang 1969', category: 'Classics', path: '/cars/mustang_69/scene.gltf', description: 'The defining American muscle car of the late 60s.', defaultColor: '#000000' },
  { id: 'delorean', name: 'DeLorean DMC-12', category: 'Classics', path: '/cars/delorean/scene.gltf', description: 'Stainless steel body panels and gull-wing doors. Time machine material.', defaultColor: '#a1a1aa' },
  { id: 'cybertruck', name: 'Tesla Cybertruck', category: 'Electric', path: '/cars/cybertruck/scene.gltf', description: 'Ultra-hard 30X cold-rolled stainless-steel structural skin.', defaultColor: '#d4d4d8' },
  { id: 'taycan', name: 'Porsche Taycan', category: 'Electric', path: '/cars/taycan/scene.gltf', description: 'Pure electric Porsche DNA with incredible acceleration.', defaultColor: '#22d3ee' },
  { id: 'wrangler', name: 'Jeep Wrangler', category: 'Off-Road', path: '/cars/wrangler/scene.gltf', description: 'The ultimate go-anywhere, do-anything utility vehicle.', defaultColor: '#4ade80' },
  { id: 'defender', name: 'Land Rover Defender', category: 'Off-Road', path: '/cars/defender/scene.gltf', description: 'Rugged British engineering designed for the toughest terrains.', defaultColor: '#94a3b8' }
];

interface CarStore {
  selectedCategory: string;
  selectedCarId: string;
  carColor: string;
  setSelectedCategory: (category: string) => void;
  setSelectedCarId: (id: string) => void;
  setCarColor: (color: string) => void;
}

export const useCarStore = create<CarStore>((set) => ({
  selectedCategory: CATEGORIES[0],
  selectedCarId: CARS[0].id,
  carColor: CARS[0].defaultColor || '#ffffff',
  setSelectedCategory: (category) => {
    // When changing category, auto-select the first car in that category
    const firstCarInCategory = CARS.find((c) => c.category === category);
    set({ 
      selectedCategory: category, 
      selectedCarId: firstCarInCategory?.id || CARS[0].id,
      carColor: firstCarInCategory?.defaultColor || '#ffffff'
    });
  },
  setSelectedCarId: (id) => {
    const car = CARS.find(c => c.id === id);
    set({ 
      selectedCarId: id,
      ...(car?.defaultColor ? { carColor: car.defaultColor } : {})
    });
  },
  setCarColor: (color) => set({ carColor: color }),
}));
