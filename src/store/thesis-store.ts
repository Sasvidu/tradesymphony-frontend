// lib/stores/thesisStore.ts
import { create } from "zustand";
import { Thesis } from "@/lib/types/thesis.types";

interface ThesisState {
  theses: Thesis[];
  loading: boolean;
  error: string | null;
  setTheses: (theses: Thesis[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchThesisData: () => Promise<void>;
}

export const useThesisStore = create<ThesisState>((set) => ({
  theses: [],
  loading: false,
  error: null,
  setTheses: (theses) => set({ theses }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  fetchThesisData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/insights/thesis");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.investments) {
        set({ theses: data.investments as Thesis[], loading: false });
      } else {
        set({
          error: "Invalid data format received from API.",
          loading: false,
        });
      }
    } catch {
      set({
        error: "Failed to fetch thesis data.",
        loading: false,
      });
    }
  },
}));
