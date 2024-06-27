import { Atom, Getter, Setter, WritableAtom, atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { clamp } from "../lib/math";

const target = atomWithStorage('gol:target-frame-rate', 60)

/** A read/write atom that stores the target frame rate in frames-per-second (FPS). */
export const targetFrameRate = makeTargetFrameRate()

/** A readonly atom that reflects the target frame rate in milliseconds per frame. */
export const targetFrameMs = makeTargetFrameMs()

function makeTargetFrameRate(): WritableAtom<number, [value: number], void> {
  return atom(getFrameRate, setFrameRate)

  function getFrameRate(get: Getter): number {
    return get(target)
  }

  function setFrameRate(_: Getter, set: Setter, value: number): void {
    set(target, clamp(value, 1, 200))
  }
}

function makeTargetFrameMs(): Atom<number> {
  return atom(getDelayMs)

  function getDelayMs(get: Getter): number {
    return 1000 / get(target)
  }
}
