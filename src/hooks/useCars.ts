import { useState, useEffect } from 'react';
import { Car } from '../types';
import { CarsStorageService } from '../services/carsStorage';

export function useCars() {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const loadCars = async () => {
      const carsData = await CarsStorageService.getCars();
      setCars(Array.isArray(carsData) ? carsData : []);
    };

    loadCars();

    const handleUpdate = async () => {
      const carsData = await CarsStorageService.getCars();
      setCars(Array.isArray(carsData) ? carsData : []);
    };

    window.addEventListener(
      'royaljpcar-cars-updated',
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        'royaljpcar-cars-updated',
        handleUpdate
      );
    };
  }, []);

  return cars;
}