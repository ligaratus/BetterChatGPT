import { StoreSlice } from './store';
import { CharacterInterface } from '@type/character';

export interface CharacterSlice {
  characters: CharacterInterface[];
  setCharacters: (characters: CharacterInterface[]) => void;
}

export const createCharacterSlice: StoreSlice<CharacterSlice> = (set, get) => ({
  characters: [],
  setCharacters: (characters: CharacterInterface[]) => {
    set((prev: CharacterSlice) => ({
      ...prev,
      characters: characters,
    }));
  },
});