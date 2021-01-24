import create from 'zustand';
import { DiceType } from '../modules/dice/hooks/useCreateDice';

export const useActiveDiceStore = create<{
    dice: { diceType: DiceType, result: number }[],
    setDice: (dice: { diceType: DiceType, result: number }[]) => void
}>(set => ({
    dice: [],
    setDice: (dice) => set({ dice })
}));
