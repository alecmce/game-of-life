# Game Of Life

This is a change of tack for my WebGPU explorations, as I used it primarily to explore using Jotai to drive application
state and derived WebGPU state. The UI integration is elegant, and I like how derived state can be graphed without it
polluting the front-end (as is my experience with most Redux applications).

A Conway's Game Of Life implementation. I deviate from it superficially: each alive cell is assigned a colour. Initially
this is at random; later any cell that is "born" gets the colour of an adjacent cell. Cells that die are immediately dead
for the purposes of the algorithm, but the cooldown parameter adjust how quickly they fade to black.

Live demo here: https://alecmce.com/game-of-life.

## References

- [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
- [Jotai](https://jotai.org/)
- [WebGPU Function Reference](https://webgpufundamentals.org/webgpu/lessons/webgpu-wgsl-function-reference.html)
