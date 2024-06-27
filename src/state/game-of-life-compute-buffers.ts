import { Atom, Getter, atom } from "jotai";
import { PingPongBuffers, makePingPongBuffers } from "../lib/webgpu/ping-pong-buffers";
import { initialSimulationData as initialSimulationDataAtom } from "./initial-state";
import { webGpuContext } from "./webgpu-context";


/**
 * A readonly atom that generates buffers whenever initial simulation data is recalculated; if a WebGPU context is
 * available.
 *
 * TODO: Previoulsly generated buffers are not being destroyed when this is recalculated.
 */
export const gameOfLifeBuffers = makeBuffersAtom()

function makeBuffersAtom(): Atom<PingPongBuffers | null> {
  return atom(getBuffers)

  function getBuffers(get: Getter): PingPongBuffers | null {
    const context = get(webGpuContext)
    const initialSimulationData = get(initialSimulationDataAtom)
    return context ? makePingPongBuffers({ context, initialSimulationData }) : null
  }
}
