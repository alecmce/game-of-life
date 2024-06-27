import { useAtomValue } from "jotai"
import { useEffect, useMemo, useState } from "react"
import { targetFrameMs } from "../state/frame-rate"

interface Loop {
  play: VoidFunction
  stop: VoidFunction
}

export function useLoop(fn: VoidFunction): Loop {
  const [isPlaying, setPlaying] = useState(true)

  const delayMs = useAtomValue(targetFrameMs)

  useEffect(() => {
    if (isPlaying) {
      let id = requestAnimationFrame(maybeIterate)
      let lastUpdate = -1

      return function dispose(): void {
        cancelAnimationFrame(id)
      }

      function maybeIterate(): void {
        lastUpdate === -1 ? iterate() : throttleIterateByFrameMs()
        id = requestAnimationFrame(maybeIterate)
      }

      function iterate(): void {
        fn()
        lastUpdate = performance.now()
      }

      function throttleIterateByFrameMs(): void {
        const now = performance.now()
        const sinceLastUpdate = now - lastUpdate
        if (sinceLastUpdate > delayMs) {
          fn()
          lastUpdate = now
        }
      }

    }
  }, [isPlaying, delayMs, fn])

  return useMemo(() => {
    return { play, stop }

    function play(): void {
      setPlaying(true)
    }

    function stop(): void {
      setPlaying(true)
    }
  }, [setPlaying])
}
