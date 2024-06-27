import { Getter, atom } from "jotai";
import { rnd } from "../lib/random";
import { BYTES_PER_FLOAT } from "../lib/types";
import { GetRandomColor } from "../state/colors";
import { randomColor } from "./colors";
import { INIT_TYPE, initType } from "./init-type";
import { calculatedSize } from "./size";
import { version as versionAtom } from "./version";

// https://webgpufundamentals.org/webgpu/lessons/resources/wgsl-offset-computer.html#x=5d000001009b00000000000000003d888b0237284d3025f2381bcb2887e905f21cadf36e21f5b66dc44d78da63216be604a237ff2473ae8f12eeaa81551e637a95dd10f6e344f530db00a80a94de9a767754df871a374c0c7c3e3e1e08f4745839e3186e7a430077eb6c97ff4877d9c45b8db560ff93a132a002b486d750deca198abde2086d86b3f7e2e3fffe1c2d00
const BYTES_PER_CELL = 16
const FLOATS_PER_CELL = BYTES_PER_CELL / BYTES_PER_FLOAT

/** A readonly atom that creates a simulation's initial data. */
export const initialSimulationData = atom(getInitialSimulationData)

const { RANDOM, GLIDER } = INIT_TYPE

const GLIDER_PATTERN = [[0, 1], [1, 0], [-1, -1], [0, -1], [1, -1]]

function getInitialSimulationData(get: Getter): Float32Array {
  const type = get(initType)
  const { width, height } = get(calculatedSize)
  const getRandomColor = get(randomColor)
  const version = get(versionAtom)

  switch (type) {
    case GLIDER: return makeGlider({ getRandomColor, height, width, version })
    case RANDOM: return makeRandom({ getRandomColor, height, width, version })
  }
}

interface Props {
  getRandomColor: GetRandomColor
  height:         number
  width:          number
  version:        number
}

function makeGlider(props: Props): Float32Array {
  const { width, height, getRandomColor } = props

  const ox = Math.floor(width / 2)
  const oy = Math.floor(height / 2)

  const array = new Float32Array(width * height * FLOATS_PER_CELL)
  GLIDER_PATTERN.forEach(([x, y]) => addCell(x + ox, y + oy))
  return array

  function addCell(x: number, y: number): void {
    array.set([...getRandomColor(), 1], (x + y * width) * FLOATS_PER_CELL)
  }
}

function makeRandom(props: Props): Float32Array {
  const { width, height, getRandomColor } = props

  const array = new Float32Array(width * height * FLOATS_PER_CELL)
  for (let i = 0; i < width * height; i++) addCell(i)
  return array

  function addCell(index: number): void {
    array.set([...getRandomColor(), Math.round(rnd(0, 1))], index * FLOATS_PER_CELL)
  }
}
