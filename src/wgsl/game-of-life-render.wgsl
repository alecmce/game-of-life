const HALF = 0.5;

struct Uniforms {
  width:  f32,
  height: f32,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read> grid: Grid;

const VERTICES = array<vec2f, 4>(
  vec2<f32>(-1, -1),
  vec2<f32>(-1,  1),
  vec2<f32>( 1, -1),
  vec2<f32>( 1,  1),
);

struct VertexShaderOutput {
   @builtin(position) position: vec4<f32>,
   @location(0) coordinate: vec4<f32>,
}

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex : u32) -> VertexShaderOutput {
  let vertex = VERTICES[vertexIndex];
  let x = (vertex.x + 1.0) / 2.0;
  let y = (vertex.y + 1.0) / 2.0;

  return VertexShaderOutput(vec4<f32>(vertex, 0.0, 1.0), vec4<f32>(x, y, 0.0, 1.0));
}

@fragment
fn fs_main(input: VertexShaderOutput) -> @location(0) vec4<f32> {
  let x = u32(input.coordinate.x * uniforms.width);
  let y = u32(input.coordinate.y * uniforms.height);
  let cell = grid.cells[getIndex(x, y)];
  return vec4f(cell.color * cell.warmth, 1.0);
}

fn getIndex(x: u32, y: u32) -> u32 {
  let width = u32(uniforms.width);
  let height = u32(uniforms.height);
  return (y % height) * width + (x % width);
}
