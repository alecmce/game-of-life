import { Setter, WritableAtom, atom } from "jotai";
import { Getter } from "jotai/experimental";
import { atomWithStorage } from "jotai/utils";
import { clamp } from "../lib/math";

const stored = atomWithStorage('gol:scale', 1)

/**
 * How scaled the game of life simulation should be, from 1 which is 1 pixel per square, down to 0.01 which is 1% of
 * the screen resolution.
 */
export const scale = makeScaleAtom(250)

function makeScaleAtom(timeoutMs: number): WritableAtom<number, [value: number], void> {
  let timeoutId = -1

  return atom(getScale, setScale)

  function getScale(get: Getter): number {
    return get(stored)
  }

  function setScale(_: Getter, set: Setter, value: number): void {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      set(stored, clamp(value, 0.01, 1))
    }, timeoutMs)
  }
}

