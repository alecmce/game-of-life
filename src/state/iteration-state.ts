import { atomWithStorage } from "jotai/utils";

export enum ITERATION_STATE {
  PLAY = 'play',
  STOP = 'stop',
  STEP = 'step',
}

export const ITERATION_STATE_OPTIONS = [
  { label: 'Play', value: ITERATION_STATE.PLAY },
  { label: 'Stop', value: ITERATION_STATE.STOP },
]

/**
 * A read/write atom that maintains whether the app is currently playing, or whether it is stopped.
 *
 * TODO: "step" functionality is surprisingly challenging, because of initial conditions. If the user has stopped the
 * simulation then changes the initial conditions, it should automatically step once, so that the screen is rendered.
 */
export const iterationState = atomWithStorage('gol:iteration-state', ITERATION_STATE.PLAY)
