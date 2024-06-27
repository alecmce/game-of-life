import { useAtom } from "jotai";
import { useEffect } from "react";
import { iterationState as iterationStateAtom } from "../state/iteration-state";

export enum ITERATION_STATE {
  PLAY = 'play',
  STOP = 'stop',
  STEP = 'step',
}

const { PLAY, STOP, STEP } = ITERATION_STATE

export function useKeyControls(): void {
  const [, setIterationState] = useAtom(iterationStateAtom)

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)

    return function unmount(): void {
      window.removeEventListener('keydown', onKeyDown)
    }

    function onKeyDown(event: KeyboardEvent): void {
      switch (event.code) {
        case 'Space':      return togglePlayStop(event)
        case 'ArrowRight': return step(event)
      }
    }

    function togglePlayStop(event: KeyboardEvent): void {
      event.stopImmediatePropagation()
      event.preventDefault()
      setIterationState(state => state === PLAY ? STOP : PLAY)
    }

    function step(event: KeyboardEvent): void {
      event.stopImmediatePropagation()
      event.preventDefault()
      setIterationState(STEP)
    }
  }, [setIterationState])
}
