export interface Item {
  name: string;
  value: number;
}

export interface DashboardData {
  energyConsumption: number;
  compensatedEnergy: number;
  totalWithoutGD: number;
  gdEconomy: number;
  totalValue: number;
  financialResults: Item[];
  energyResults: Item[];
}

export interface Invoice {
  id: string;
  clientNumber: string;
  referenceMonth: string;
  month: string;
  year: number;
  electricEnergyKwh: number;
  electricEnergyR: number;
  energySCEEKwh: number;
  energySCEER: number;
  energyCompensationKwh: number;
  energyCompensationR: number;
  publicLightingR: number;
  totalR: number;
  createdAt: Date;
  updatedAt: Date;
}
