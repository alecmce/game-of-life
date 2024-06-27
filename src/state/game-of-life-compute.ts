import { Getter, atom } from "jotai";
import { PingPongBuffers } from "../lib/webgpu/ping-pong-buffers";
import { WebGpuContext } from "../lib/webgpu/webgpu-context";
import { Workgroups } from "../lib/webgpu/workgroups";
import { getCode } from "../wgsl/blocks";
import { gameOfLifeBuffers } from "./game-of-life-compute-buffers";
import { gameOfLifeComputeUniforms } from "./game-of-life-compute-uniforms";
import { initialSimulationData as initialSimulationDataAtom } from './initial-state';
import { webGpuContext } from "./webgpu-context";
import { workgroups as workgroupsAtom } from './workgroups';


export interface GameOfLifeCompute {
  (encoder: GPUCommandEncoder, pingPong: 0 | 1): void
}

/** A readonly atom that maintains the compute shader. */
export const gameOfLifeCompute = atom<GameOfLifeCompute | null>(getCompute)

function getCompute(get: Getter): GameOfLifeCompute | null {
  const context = get(webGpuContext)
  const buffers = get(gameOfLifeBuffers)
  const uniforms = get(gameOfLifeComputeUniforms)
  const initialSimulationData = get(initialSimulationDataAtom)
  const workgroups = get(workgroupsAtom)

  return context && buffers && uniforms
    ? makeCompute({ buffers, context, initialSimulationData, uniforms, workgroups })
    : null
}

interface Props {
  buffers:               PingPongBuffers
  context:               WebGpuContext
  initialSimulationData: Float32Array
  uniforms:              GPUBuffer
  workgroups:            Workgroups
}

/**
 * Wraps PingPongCompute to generate a GameOfLifeCompute that iterates the Game Of Life.
 */
function makeCompute(props: Props): GameOfLifeCompute {
  const { buffers, context, initialSimulationData, uniforms, workgroups } = props
  const { device } = context

  const {
    workgroupCounts: [workgroupCountX, workgroupCountY, workgroupCountZ],
    threadsPerWorkgroup: [workgroupThreadsX, workgroupThreadsY, workgroupThreadsZ],
  } = workgroups

  const module = device.createShaderModule({ code: getCode('golCompute') })

  const pipeline = device.createComputePipeline({
    compute: {
      module,
      constants: { workgroupThreadsX, workgroupThreadsY, workgroupThreadsZ },
    },
    layout: 'auto',
  })

  const groups = buffers.map(makeGroup)

  return function compute(encoder: GPUCommandEncoder, pingPong: 0 | 1): void {
    const passEncoder = encoder.beginComputePass({});
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, groups[pingPong]);
    passEncoder.dispatchWorkgroups(workgroupCountX, workgroupCountY, workgroupCountZ);
    passEncoder.end();
  }

  function makeGroup(_: unknown, index: number): GPUBindGroup {
    const dataSize = initialSimulationData.byteLength

    return device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uniforms } },
        { binding: 1, resource: { buffer: buffers[index], offset: 0, size: dataSize } },
        { binding: 2, resource: { buffer: buffers[(index + 1) % 2], offset: 0, size: dataSize } },
      ],
    })
  }
}
