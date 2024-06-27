import { Atom, Getter, atom } from 'jotai'
import { atomEffect } from 'jotai-effect'
import { BufferWithUpdate, createBufferWithUpdate } from '../lib/webgpu/create-buffer'
import { WebGpuContext } from '../lib/webgpu/webgpu-context'
import { calculatedSize } from './size'
import { webGpuContext } from './webgpu-context'

/** A readonly atom that maintains the render shaders' uniforms. */
export const gameOfLifeRenderUniforms = makeRenderUniforms()

function makeRenderUniforms(): Atom<GPUBuffer | null> {
  const bufferWithUpdate = makeBufferWithUpdateAtom()
  const updateState = atomEffect(applyUpdate)

  return atom(getBuffer)

  function makeBufferWithUpdateAtom(): Atom<BufferWithUpdate | null> {
    return atom(init)

    function init(get: Getter): BufferWithUpdate | null {
      const context = get(webGpuContext)
      return context ? makeBuffer(context) : null

      function makeBuffer(context: WebGpuContext): BufferWithUpdate {
        return createBufferWithUpdate({
          context,
          initial: new Float32Array([0, 0, 0, 0]),
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })
      }
    }
  }

  function getBuffer(get: Getter): GPUBuffer | null {
    get(updateState)

    const value = get(bufferWithUpdate)
    return value ? value[0] : null
  }

  function applyUpdate(get: Getter): void {
    const base = get(bufferWithUpdate)
    const { width, height } = get(calculatedSize)

    if (base) {
      const [, update] = base
      update(new Float32Array([width, height]))
    }
  }
}
