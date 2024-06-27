import { beforeEach, describe, expect, it } from "vitest";
import { Vec2, vec2 } from "wgpu-matrix";
import { CONWAYS_RULE } from "../state/rule";

describe('A TypeScript copy of the compute shader', () => {
  const GLIDER = [[1, 2], [2, 1], [0, 0], [1, 0], [2, 0]]

  function makeGliderGameOfLifeInitialData(width: number, height: number): number[] {
    const cells = Array.from({ length: width * height }).fill(0) as number[]
    GLIDER.forEach(([x, y]) => addCell(x + 3, y + 3))
    return cells

    function addCell(x: number, y: number): void {
      cells[x + y * width] = 1
    }
  }

  let gridA: Grid
  let gridB: Grid
  let parameters: Parameters
  beforeEach(() => {
    gridA = makeGliderGameOfLifeInitialData(8, 8)
    gridB = []
    parameters = { rule: CONWAYS_RULE, width: 8, height: 8, cooldown: 0 }
  })

  it('is setup as expected', () => {
    expect(gridA).toEqual([
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 1, 1, 1, 0, 0,
      0, 0, 0, 0, 0, 1, 0, 0,
      0, 0, 0, 0, 1, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
    ])
  })

  it('runs as expected', () => {
    runSimulation(gridA, gridB, parameters)
    expect(gridB).toEqual([
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 1, 0, 0, 0,
      0, 0, 0, 0, 1, 1, 0, 0,
      0, 0, 0, 1, 0, 1, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
    ])
  })
})

const OFFSETS = [
  vec2.create(-1, -1), vec2.create( 0, -1), vec2.create( 1, -1),
  vec2.create(-1,  0),                      vec2.create( 1,  0),
  vec2.create(-1,  1), vec2.create( 0,  1), vec2.create( 1,  1)
]

type Grid = number[]


interface Parameters {
  rule:     number,
  cooldown: number,
  width:    number,
  height:   number,
}

const SURVIVES_VALUE = 1
const BORN_VALUE     = 2

function runSimulation(readGrid: Grid, writeGrid: Grid, parameters: Parameters): void {
  for (let x = 0; x < parameters.width; x++) {
    for (let y = 0; y < parameters.height; y++) {
      simulate(vec2.create(x, y))
    }
  }

  function simulate(xy: Vec2): void {
    const index = getIndex(xy);
    writeGrid[index] = getNextCell(index, xy);
  }

  function getNextCell(index: number, xy: Vec2): number {
    const cell = readGrid[index];
    const isAlive = isCellAlive(index);
    const isAliveNext = isCellAliveNext(isAlive, xy);

    if (isAlive && isAliveNext) {
      return cell;
    } else if (isAliveNext) {
      return 1
    } else {
      return cell * parameters.cooldown
    }
  }

  function isCellAliveNext(isAlive: boolean, xy: Vec2): boolean {
    const neighbor_count = countAliveNeighbors(xy);
    const value = decodeRule(parameters.rule, neighbor_count);
    return isAlive ? (value & SURVIVES_VALUE) !== 0 : (value & BORN_VALUE) !== 0
  }

  function countAliveNeighbors(xy: Vec2): number {
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      const index = getIndex(vec2.add(xy, OFFSETS[i]));
      sum += isCellAlive(index) ? 1 : 0
    }
    return sum;
  }

  function decodeRule(bitfield: number, neighbor_count: number): number {
    const shift_amount = 2 * neighbor_count;
    return (bitfield >> shift_amount) & 3
  }

  function getIndex(xy: Vec2): number {
    const width = parameters.width
    const height = parameters.height
    return positiveMod(xy[1], height) * width + positiveMod(xy[0], width);
  }

  function positiveMod(n: number, modulo: number): number {
    return (n % modulo + modulo) % modulo;
  }

  function isCellAlive(index: number): boolean {
    return readGrid[index] == 1.0;
  }
}
