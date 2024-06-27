import { Getter, atom } from 'jotai'
import { PingPongBuffers } from '../lib/webgpu/ping-pong-buffers'
import { WebGpuContext } from '../lib/webgpu/webgpu-context'
import { getCode } from '../wgsl/blocks'
import { gameOfLifeBuffers } from './game-of-life-compute-buffers'
import { gameOfLifeRenderUniforms } from './game-of-life-render-uniforms'
import { initialSimulationData as initialSimulationDataAtom } from './initial-state'
import { webGpuContext } from './webgpu-context'


export interface GameOfLifeRender {
  (encoder: GPUCommandEncoder, pingPong: 0 | 1): void,
}

/** A readonly atom that maintains the render shaders. */
export const gameOfLifeRender = atom(getGameOfLifeRender)

function getGameOfLifeRender(get: Getter): GameOfLifeRender | null {
  const context = get(webGpuContext)
  const initialSimulationData = get(initialSimulationDataAtom)
  const buffers = get(gameOfLifeBuffers)
  const uniforms = get(gameOfLifeRenderUniforms)

  return buffers && context && uniforms
    ? makeGameOfLifeRender({ buffers, context, initialSimulationData, uniforms })
    : null
}

interface Props {
  buffers:               PingPongBuffers
  context:               WebGpuContext
  initialSimulationData: Float32Array
  uniforms:              GPUBuffer
}

/** Constructs a render pipeline. */
function makeGameOfLifeRender(props: Props): GameOfLifeRender {
  const { buffers, context, initialSimulationData, uniforms } = props;
  const { device, format, context: gpuContext } = context

  const module = device.createShaderModule({ code: getCode('golRender') })

  const layout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        buffer: { type: 'uniform' },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.COMPUTE | GPUShaderStage.FRAGMENT,
        buffer: { type: 'read-only-storage' },
      }
    ]
  })

  const pipeline = device.createRenderPipeline({
    fragment:  { entryPoint: 'fs_main', module, targets: [{ format }] },
    layout:    device.createPipelineLayout({ bindGroupLayouts: [layout] }),
    primitive: { topology: 'triangle-strip' },
    vertex:    { entryPoint: 'vs_main', module },
  })

  const groups = buffers.map(makeGroup)

  return function render(encoder: GPUCommandEncoder, pingPong: 0 | 1): void {
    const view = gpuContext.getCurrentTexture().createView()

    const passEncoder = encoder.beginRenderPass({
      colorAttachments: [{
        clearValue: [0.0, 0.0, 0.0, 1.0],
        loadOp: 'clear',
        storeOp: 'store',
        view,
      }]
    });

    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, groups[pingPong]);
    passEncoder.draw(4, 1, 0, 0);
    passEncoder.end();
  }

  function makeGroup(_: unknown, index: number): GPUBindGroup {
    const dataSize = initialSimulationData.byteLength

    return device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: { buffer: uniforms },
        },
        {
          binding: 1,
          resource: { buffer: buffers[index], offset: 0, size: dataSize },
        },
      ],
    })
  }
}
