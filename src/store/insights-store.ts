import { create } from 'zustand';
import { Company } from '@/lib/types/company.types';

interface InvestmentState {
  companies: Company[];
  loading: boolean;
  error: string | null;
  setCompanies: (companies: Company[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchInvestmentData: () => Promise<void>;
}

export const useInvestmentStore = create<InvestmentState>((set) => ({
  companies: [],
  loading: false,
  error: null,
  setCompanies: (companies) => set({ companies }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  fetchInvestmentData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/insights/investment');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.companies) {
        set({ companies: data.companies as Company[], loading: false });
      } else {
        set({ error: 'Invalid data format received from API.', loading: false });
      }
    } catch {
      set({ error: 'Failed to fetch investment data.', loading: false });
    }
  },
}));