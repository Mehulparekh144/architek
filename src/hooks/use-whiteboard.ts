import { redis } from '@/lib/redis';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Shape {
  id: string;
  type: string;
  text: string;
  position: {
    x: number;
    y: number;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface TextShapeData {
  shapes: Shape[]
  setShapes: (shapes: Shape[]) => void;
  prevShapes: Shape[];
  setPrevShapes: (prevShapes: Shape[]) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

export const useWhiteboard = create<TextShapeData>()(
  persist((set) => ({
    shapes: [],
    prevShapes: [],
    setPrevShapes: (prevShapes: Shape[]) => set({ prevShapes }),
    setShapes: (shapes: Shape[]) => set({ shapes }),
    messages: [],
    setMessages: (messages: Message[]) => set({ messages }),
  }), {
    name: "whiteboard",
    storage: {
      getItem: async (name: string) => {
        const item = await redis.get(name);
        console.log(item);
        return item ? JSON.parse(item as string) : null;
      },
      setItem: async (name: string, value: unknown) => {
        await redis.set(name, JSON.stringify(value));
      },
      removeItem: async (name) => {
        await redis.del(name);
      },
    },
  })
)
