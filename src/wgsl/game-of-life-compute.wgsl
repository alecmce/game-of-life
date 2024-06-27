const OFFSETS = array<vec2<i32>, 8>(
  vec2<i32>(-1, -1), vec2<i32>( 0, -1), vec2<i32>( 1, -1),
  vec2<i32>(-1,  0),                    vec2<i32>( 1,  0),
  vec2<i32>(-1,  1), vec2<i32>( 0,  1), vec2<i32>( 1,  1)
);

override workgroupThreadsX = 8;
override workgroupThreadsY = 8;
override workgroupThreadsZ = 1;

struct Parameters {
  rule:     f32,
  cooldown: f32,
  width:    f32,
  height:   f32,
}

const DIE      = 0u;
const SURVIVES = 1u;
const BORN     = 2u;

@binding(0) @group(0) var<uniform>             parameters: Parameters;
@binding(1) @group(0) var<storage, read>       readGrid:  Grid;
@binding(2) @group(0) var<storage, read_write> writeGrid: Grid;

@compute @workgroup_size(workgroupThreadsX, workgroupThreadsY, workgroupThreadsZ)
fn simulate(@builtin(global_invocation_id) indices: vec3<u32>) {
  let xy = vec2<i32>(indices.xy);
  let index = getIndex(xy);
  writeGrid.cells[index] = getNextCell(index, xy);
}

fn getNextCell(index: i32, xy: vec2<i32>) -> Cell {
  let cell = readGrid.cells[index];
  let isAlive = isCellAlive(index);
  let isAliveNext = isCellAliveNext(isAlive, xy);

  if (isAlive && isAliveNext) {
    return cell;
  } else if (isAliveNext) {
    return Cell(getNeighborColor(xy, cell.color), 1.0);
  } else {
    return Cell(cell.color, max(0.0, cell.warmth * parameters.cooldown));
  }
}

fn isCellAliveNext(isAlive: bool, xy: vec2<i32>) -> bool {
  let neighbor_count = countAliveNeighbors(xy);
  let value = decodeRule(parameters.rule, neighbor_count);
  return select((value & BORN) != 0, (value & SURVIVES) != 0, isAlive);
}

fn countAliveNeighbors(xy: vec2<i32>) -> u32 {
  var sum = 0u;
  for (var i = 0u; i < 8u; i++) {
    let index = getIndex(xy + OFFSETS[i]);
    sum += select(0u, 1u, isCellAlive(index));
  }
  return sum;
}

fn decodeRule(bitfield: f32, neighbor_count: u32) -> u32 {
  let shift_amount = 2u * neighbor_count;
  return (u32(bitfield) >> shift_amount) & 3u;
}

fn getNeighborColor(xy: vec2<i32>, fallback_color: vec3<f32>) -> vec3<f32> {
  var neighbor_colors = array<vec3<f32>, 8>();
  var alive_count = 0u;
  for (var i = 0u; i < 8; i++) {
    let index = getIndex(xy + OFFSETS[i]);
    if (isCellAlive(index)) {
      neighbor_colors[alive_count] = getColor(index);
      alive_count += 1;
    }
  }

  return select(fallback_color, neighbor_colors[i32(rand() * f32(alive_count))], alive_count > 0);
}

fn getIndex(xy: vec2<i32>) -> i32 {
  let width = i32(parameters.width);
  let height = i32(parameters.height);
  return positiveMod(xy.y, height) * width + positiveMod(xy.x, width);
}

fn positiveMod(n: i32, modulo: i32) -> i32 {
  return (n % modulo + modulo) % modulo;
}

fn getColor(index: i32) -> vec3<f32> {
  return readGrid.cells[index].color;
}

fn isCellAlive(index: i32) -> bool {
  return readGrid.cells[index].warmth == 1.0;
}
