import axiosInstance from '@/lib/axios';
import { type DashboardData, type Invoice } from '@/types';

export const getDashboardData = async (): Promise<DashboardData> => {
  const { data } = await axiosInstance.get<DashboardData>(
    '/invoices/aggregate'
  );
  return data;
};

export const getInvoices = async (): Promise<Invoice[]> => {
  const { data } = await axiosInstance.get<Invoice[]>('/invoices');
  return data;
};
