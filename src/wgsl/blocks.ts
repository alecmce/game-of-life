import { compileCode } from './compile'
import golCompute from './game-of-life-compute.wgsl?raw'
import golRender from './game-of-life-render.wgsl?raw'
import golTypes from './game-of-life-types.wgsl?raw'
import random from './random.wgsl?raw'

export function getCode(id: string, replacements: Record<string, string> = {}): string {
  const entries = Object.entries(replacements)
  return entries.reduce(replace, compileCode({ blocks: CODE_BLOCKS, id }))

  function replace(code: string, [input, output]: [string, string]): string {
    return code.replace(input, output)
  }
}

const CODE_BLOCKS = [
  { id: 'random', code: random, dependencies: [] },
  { id: 'golRender', code: golRender, dependencies: ['golTypes'] },
  { id: 'golTypes', code: golTypes, dependencies: [] },
  { id: 'golCompute', code: golCompute, dependencies: ['random', 'golTypes'] },
];
