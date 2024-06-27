import { Setter, atom } from "jotai";
import { Getter } from "jotai/experimental";
import { atomWithStorage } from "jotai/utils";
import { clamp } from "../lib/math";

const stored = atomWithStorage('gol:cooldown', 0.98)

/** A read/write atom that relfects how quickly dead cells' colors fade away. */
export const cooldown = atom(getCooldown, setCooldown)

function getCooldown(get: Getter): number {
  return get(stored)
}

function setCooldown(_: Getter, set: Setter, value: number): void {
  set(stored, clamp(value, 0, 0.99))
}
