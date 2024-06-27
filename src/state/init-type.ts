import { atomWithStorage } from "jotai/utils"

export enum INIT_TYPE {
  RANDOM = 'random',
  GLIDER = 'glider',
}

export const INIT_TYPE_OPTIONS = Object.values(INIT_TYPE).map(value => ({ label: value, value }))

/** A read/write initialisation type that allows users to toggle between starting with a "glider" or random noise. */
export const initType = atomWithStorage<INIT_TYPE>('gol:initType', INIT_TYPE.RANDOM)
