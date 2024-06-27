import { Getter, atom } from "jotai"
import { scale as scaleAtom } from "../state/scale"
import { SetAtom } from "../types"
import { workgroupSize as workgroupSizeAtom } from "./workgroups"

interface Size {
  width: number
  height: number
}

const DEBOUNCE_TIME_MS = 500

/** A readonly atom that reflects the window size. */
export const windowSize = atom<Size>({ width: window.innerWidth, height: window.innerHeight })
windowSize.onMount = listenForResize

function listenForResize(set: SetAtom<[size: Size], void>): VoidFunction {
  let id = -1

  window.addEventListener('resize', onResize)

  return function unmount(): void {
    window.removeEventListener('resize', onResize);
  };

  function onResize(): void {
    clearTimeout(id)
    id = setTimeout(update, DEBOUNCE_TIME_MS)
  }

  function update(): void {
    set({ width: window.innerWidth, height: window.innerHeight })
  }
}

export const calculatedSize = atom(getCalculatedSize)

function getCalculatedSize(get: Getter): Size {
  const size = get(windowSize)
  const scale = get(scaleAtom)
  const workgroupSize = get(workgroupSizeAtom)

  return {
    width: Math.ceil(size.width * scale / workgroupSize) * workgroupSize,
    height: Math.ceil(size.height * scale / workgroupSize) * workgroupSize,
  }
}
