export type AnimalGender = 'Jantan' | 'Betina';
export type AnimalStatus = 'Tersedia' | 'Dipesan';
export type AnimalBreed = 'Garut' | 'Merino' | 'Dorper' | 'Batur' | 'Ekor Gemuk';

export interface Animal {
  id: string;
  name: string;
  breed: AnimalBreed;
  gender: AnimalGender;
  weight: number;      // kg
  pricePerKg: number;  // Rp per kg
  totalPrice: number;  // Rp
  status: AnimalStatus;
  isVaccinated: boolean;
  imageSrc?: string;
}

export const animals: Animal[] = [
  { id: 'TRN-0041', name: 'Domba Garut',      breed: 'Garut',     gender: 'Jantan', weight: 15, pricePerKg: 100000, totalPrice: 1500000,  status: 'Tersedia', isVaccinated: true },
  { id: 'TRN-0042', name: 'Domba Merino',     breed: 'Merino',    gender: 'Jantan', weight: 20, pricePerKg: 100000, totalPrice: 2000000,  status: 'Tersedia', isVaccinated: true },
  { id: 'TRN-0043', name: 'Domba Garut',      breed: 'Garut',     gender: 'Betina', weight: 12, pricePerKg: 80000,  totalPrice: 960000,   status: 'Tersedia', isVaccinated: true },
  { id: 'TRN-0044', name: 'Domba Garut',      breed: 'Garut',     gender: 'Jantan', weight: 18, pricePerKg: 100000, totalPrice: 1800000,  status: 'Dipesan',  isVaccinated: true },
  { id: 'TRN-0045', name: 'Domba Ekor Gemuk', breed: 'Ekor Gemuk',gender: 'Betina', weight: 10, pricePerKg: 80000,  totalPrice: 800000,   status: 'Tersedia', isVaccinated: true },
  { id: 'TRN-0046', name: 'Domba Merino',     breed: 'Merino',    gender: 'Jantan', weight: 25, pricePerKg: 100000, totalPrice: 2500000,  status: 'Tersedia', isVaccinated: true },
  { id: 'TRN-0047', name: 'Domba Dorper',     breed: 'Dorper',    gender: 'Jantan', weight: 30, pricePerKg: 110000, totalPrice: 3300000,  status: 'Tersedia', isVaccinated: true },
  { id: 'TRN-0048', name: 'Domba Batur',      breed: 'Batur',     gender: 'Betina', weight: 14, pricePerKg: 90000,  totalPrice: 1260000,  status: 'Tersedia', isVaccinated: true },
  { id: 'TRN-0049', name: 'Domba Merino',     breed: 'Merino',    gender: 'Jantan', weight: 22, pricePerKg: 100000, totalPrice: 2200000,  status: 'Tersedia', isVaccinated: true },
  { id: 'TRN-0050', name: 'Domba Garut',      breed: 'Garut',     gender: 'Betina', weight: 16, pricePerKg: 80000,  totalPrice: 1280000,  status: 'Tersedia', isVaccinated: true },
  { id: 'TRN-0051', name: 'Domba Dorper',     breed: 'Dorper',    gender: 'Jantan', weight: 35, pricePerKg: 110000, totalPrice: 3850000,  status: 'Dipesan',  isVaccinated: true },
  { id: 'TRN-0052', name: 'Domba Batur',      breed: 'Batur',     gender: 'Jantan', weight: 28, pricePerKg: 95000,  totalPrice: 2660000,  status: 'Tersedia', isVaccinated: true },
];
