import { Box, Card, IconButton, Text } from "@chakra-ui/react";
import { ReactNode, Suspense, useCallback, useRef, useState } from 'react';
import './App.css';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { AtomUi } from './AtomUI';
import { useKeyControls } from './hooks/use-key-controls';
import { useLoop } from './hooks/use-loop';
import { gameOfLife as gameOfLifeAtom } from './state/game-of-life';
import { ITERATION_STATE, iterationState } from './state/iteration-state';
import { windowSize } from './state/size';
import { canvas as canvasAtom } from './state/webgpu-context';

export function App(): ReactNode {
  const [, setCanvas] = useAtom(canvasAtom)


  useKeyControls()

  const pingPong = useRef<0 | 1>(0)
  const gameOfLife = useAtomValue(gameOfLifeAtom)
  const setState = useSetAtom(iterationState)

  const { width, height } = useAtomValue(windowSize)

  useLoop(useCallback(() => {
    gameOfLife?.(pingPong.current)
    setState(state => state === ITERATION_STATE.STEP ? ITERATION_STATE.STOP : state)
    pingPong.current = (pingPong.current + 1) % 2 as 0 | 1
  }, [gameOfLife, setState]))

  return (
    <Suspense fallback={<Loading />}>
      <canvas className="canvas" ref={setCanvas} width={width} height={height} />
      <AtomUi />
      { gameOfLife ? <Info /> : <Fallback /> }
    </Suspense>
  )
}

function Loading(): ReactNode {
  return <div>Loading...</div>
}

function Info(): ReactNode {
  const [infoMinimized, setInfoMinimized] = useState(false)

  return (
    <Card variant="" className={`info ${infoMinimized ? 'minimized' : ''}`}>
      <Box>
        <IconButton size="sm" isRound aria-label="Toggle Minimized" icon={<MinimizeSvg />} onClick={onClick} />
      </Box>
      <Box p={2}>
        <Text fontSize="sm"><a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">Conway&apos;s Game of Life</a>
        &nbsp;. I deviate from it superficially: each alive cell is assigned a colour. Initially this is at random; later any cell
        that is &quot;born&quot; gets the colour of an adjacent cell. Cells that die are immediately dead for the purposes
        of the algorithm, but the cooldown parameter adjust how quickly they fade to black.</Text>
        <Text fontSize="sm">Use right arrow key to step through the algorithm (works best with a low cooldown and low scale).</Text>
        <Text fontSize="sm">For me, the most interesting aspect of this implementation is the use
          of <a href="https://jotai.org/">Jotai</a> to drive both application state, and the derived WebGPU state.&nbsp;
          The UI integration is really elegant. <a href="https://github.com/alecmce/game-of-life">Check out the source code</a>.
        </Text>
      </Box>
    </Card>
  )

  function onClick(): void {
    setInfoMinimized(value => !value)
  }
}

function MinimizeSvg(): ReactNode {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
      <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
    </svg>
  )
}

function Fallback() {
  return (
    <div className="info">
      <p>Sorry, this demo only works in WebGPU enabled browsers.</p>
    </div>
  )
}
