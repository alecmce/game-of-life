import { WebGpuContext } from "./webgpu-context"
import { createBuffer } from "./create-buffer"


interface Props {
  context:               WebGpuContext
  initialSimulationData: Float32Array
}

export type PingPongBuffers = [GPUBuffer, GPUBuffer]

export function makePingPongBuffers(props: Props): PingPongBuffers {
  const { context, initialSimulationData } = props

  return [makeBuffer(0), makeBuffer(1)]

  function makeBuffer(index: number): GPUBuffer {
    return createBuffer({
      context,
      init,
      initial:          initialSimulationData,
      label:            `PingPongBuffer[${index}]`,
      mappedAtCreation: true,
      usage:            GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE,
    })
  }
}

function init(buffer: GPUBuffer, data: Float32Array): void {
  // await buffer.mapAsync(GPUMapMode.WRITE); // Is this needed?
  const arrayBuffer = buffer.getMappedRange();
  new Float32Array(arrayBuffer).set(data)
  buffer.unmap();
}
