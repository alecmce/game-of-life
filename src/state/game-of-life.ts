import { Atom, Getter, atom } from 'jotai'
import { WebGpuContext } from '../lib/webgpu/webgpu-context'
import { GameOfLifeCompute, gameOfLifeCompute } from './game-of-life-compute'
import { GameOfLifeRender, gameOfLifeRender } from './game-of-life-render'
import { ITERATION_STATE, iterationState } from './iteration-state'
import { webGpuContext } from './webgpu-context'

interface GameOfLife {
  (pingPong: 0 | 1): Promise<void>
}

/** A readonly atom that composites the compute and render shaders into a single callable function. */
export const gameOfLife = makeGameOfLife()

const VOID_FN = async () => void 0

function makeGameOfLife(): Atom<GameOfLife | null> {
  return atom(getGameOfLife)

  function getGameOfLife(get: Getter): GameOfLife | null {
    const context = get(webGpuContext)
    const compute = get(gameOfLifeCompute)
    const render = get(gameOfLifeRender)
    const state = get(iterationState)

    return context && compute && render
      ? makeGameOfLife({ compute, context, render, state })
      : null
  }

  interface Props {
    compute:     GameOfLifeCompute
    context:     WebGpuContext
    render:      GameOfLifeRender
    state:       ITERATION_STATE
  }

  function makeGameOfLife(props: Props): GameOfLife {
    const { compute, context, render, state } = props
    const { device } = context

    return state === ITERATION_STATE.STOP
      ? VOID_FN
      : iterate

    async function iterate(pingPong: 0 | 1): Promise<void> {
      const encoder = device.createCommandEncoder()
      compute(encoder, pingPong)
      render(encoder, pingPong)
      pingPong = (pingPong + 1) % 2 as 0 | 1
      device.queue.submit([encoder.finish()])
      await device.queue.onSubmittedWorkDone() // TODO: Why do I need to do this?
    }
  }
}
