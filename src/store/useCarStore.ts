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
  { id: 'lambo_huracan', name: 'Lamborghini Huracán', category: 'Supercars', path: '/cars/lambo_huracan/source/2016_lamborghini_huracan.glb', description: 'V10 Italian exotic with sharp, aggressive geometry.', defaultColor: '#ef4444' },
  { id: 'ferrari_f40', name: 'Ferrari F40 (1987)', category: 'Classics', path: '/cars/ferrari_f40/scene.gltf', description: 'The legendary twin-turbo V8 supercar from Maranello.', defaultColor: '#ef4444' },
  { id: 'subaru_22b', name: 'Subaru Impreza 22B STi', category: 'JDM & Tuners', path: '/cars/subaru_22b/scene.gltf', description: 'The widebody rally icon.', defaultColor: '#1d4ed8' },
  { id: 'supra_mk5', name: 'Toyota GR Supra', category: 'JDM & Tuners', path: '/cars/supra_mk5/scene.glb', description: 'Modern revival of the legendary Supra.', defaultColor: '#ffffff' },
  { id: 'bmw_m4', name: 'BMW M4 GT3 (2022)', category: 'Supercars', path: '/cars/bmw_m4/scene.glb', description: 'Track-focused GT3 racing machine.', defaultColor: '#ffffff' }
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
