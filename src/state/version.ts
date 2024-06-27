import { Setter, atom } from "jotai";
import { Getter } from "jotai/experimental";
import { ITERATION_STATE, iterationState } from "./iteration-state";

const innerVersion = atom(1)

/**
 * An atom that can be incremented. This is used to provoke new initial simulation data when no relevant settings
 * have changed otherwise.
 */
export const version = atom(getVersion)

function getVersion(get: Getter): number {
  return get(innerVersion)
}

export const incrementVersion = atom(null, increment)

const { STEP, STOP } = ITERATION_STATE

function increment(_: Getter, set: Setter): void {
  set(innerVersion, prev => prev + 1)
  set(iterationState, state => state === STOP ? STEP : state)
}
