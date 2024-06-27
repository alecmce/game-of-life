import { Getter, atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { WORKGROUP_2D, Workgroups, getWorkgroups } from "../lib/webgpu/workgroups";
import { calculatedSize } from "./size";
import { workgroupSize as workgroupSizeAtom } from './workgroups';


type WorkgroupSize = 1 | 2 | 4

const WORKGROUP_SIZES: WorkgroupSize[] = [1, 2, 4]
export const WORKGROUP_SIZE_OPTIONS = WORKGROUP_SIZES.map(value => ({ value, label: value.toString() }))

/** An atom that reflects the compute shader's underlying workgroup-size. */
export const workgroupSize = atomWithStorage<WorkgroupSize>('gol:workgroupSize', 1)

/** A reaonly atom that relfects the workgroup counts and threads per workgroup. */
export const workgroups = atom(getWorkgroupsAtom)

function getWorkgroupsAtom(get: Getter): Workgroups {
  const { width, height } = get(calculatedSize)
  const workgroupSize = get(workgroupSizeAtom)

  return getWorkgroups<WORKGROUP_2D>([width, height], [workgroupSize, workgroupSize])
}
