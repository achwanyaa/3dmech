import { create } from 'zustand';

type EnginePart = string;

interface MechanicStore {
  focusedPart: EnginePart;
  isExploded: boolean;
  setFocusedPart: (part: EnginePart) => void;
  toggleExplodedView: () => void;
}

export const useMechanicStore = create<MechanicStore>((set) => ({
  focusedPart: 'none',
  isExploded: false,
  setFocusedPart: (part) => set({ focusedPart: part }),
  toggleExplodedView: () => set((state) => ({ isExploded: !state.isExploded })),
}));
