
export type WORKGROUPS = WORKGROUP_1D | WORKGROUP_2D | WORKGROUP_3D
export type WORKGROUP_1D = number
export type WORKGROUP_2D = [number, number]
export type WORKGROUP_3D = [number, number, number]

export type NNN = [number, number, number]

export interface Workgroups {
  workgroupCounts:      NNN // How many workgroups will be dispatched
  threadsPerWorkgroup:  NNN // The internal size of each
}

export function getWorkgroups<T = WORKGROUPS>(count: T, threads: T): Workgroups {
  const workgroupCounts = toNNN(count)
  const threadsPerWorkgroup = toNNN(threads)
  return { workgroupCounts, threadsPerWorkgroup }
}

function toNNN<T = WORKGROUPS>(value: T): NNN {
  if (!Array.isArray(value)) {
    return [value, 1, 1] as NNN
  } else if (value.length === 3) {
    return value as NNN
  } else {
    return [value[0], value[1], 1]
  }
}
