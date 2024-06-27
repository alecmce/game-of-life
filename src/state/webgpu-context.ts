import { Atom, Getter, atom } from "jotai";
import { unwrap } from "jotai/utils";
import { WebGpuContext } from "../lib/webgpu/webgpu-context";


export const canvas = atom<HTMLCanvasElement | null>(null)

/**
 * A readonly atom that curates a WebGPU context once a canvas is available. Note that this is async, but unwrapped
 * to isolate the async logic in here as far as possible. Not doing this massively complicates the downstream atoms'
 * implementations.
 */
export const webGpuContext = makeWebGpuContext()

function makeWebGpuContext(): Atom<WebGpuContext | undefined> {
  return unwrap(atom(getWebGpuContext))

  async function getWebGpuContext(get: Getter): Promise<WebGpuContext | undefined> {
    const target = get(canvas)

    return target ? init(target) : undefined

    async function init(canvas: HTMLCanvasElement): Promise<WebGpuContext | undefined> {
      const adapter = await navigator.gpu?.requestAdapter();
      const device = await adapter?.requestDevice();
      const context = canvas.getContext('webgpu')

      if (adapter && context && device) {
        const format = navigator.gpu.getPreferredCanvasFormat()
        context.configure({ device, format })
        return { adapter, context, device, format }
      } else {
        return undefined
      }
    }
  }
}

