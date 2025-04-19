import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface Shape {
  id: string;
  type: string;
  text: string;
  position: {
    x: number;
    y: number;
  };
}

interface TextShapeData {
  shapes: Shape[]
  setShapes: (shapes: Shape[]) => void;
  prevShapes: Shape[];
  setPrevShapes: (prevShapes: Shape[]) => void;
}

export const useWhiteboard = create<TextShapeData>()(
  persist((set) => ({
    shapes: [],
    prevShapes: [],
    setPrevShapes: (prevShapes: Shape[]) => set({ prevShapes }),
    setShapes: (shapes: Shape[]) => set({ shapes }),
  }), {
    name: 'whiteboard',
    storage: createJSONStorage(() => localStorage),
  })
)