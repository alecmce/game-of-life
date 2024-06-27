struct Grid {
  cells: array<Cell>,
}

// https://webgpufundamentals.org/webgpu/lessons/resources/wgsl-offset-computer.html#x=5d000001009a00000000000000003d888b0237284d3025f2381bcb2887e905f21cadf36e21f5b66dc44d78da63216be604a237ff2473ae8f12eeaa81551e637a95dd10f6e3451e22847015be54ca420b705d77df09cf9c203c99043414ae1c29b6396038b96fec575fe41911fdad2495e2dac424f949df5fe79d866119eb15951e1d1404a059df68353ffff75e0b00
struct Cell {
  color:  vec3<f32>,
  warmth: f32,
}
