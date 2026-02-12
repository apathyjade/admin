
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec3<f32>,
};

@vertex
fn vs_main(
  @location(0) position: vec2<f32>,
  @builtin(instance_index) iIdx: u32
) -> VertexOutput {
  var output: VertexOutput;
  var step = 0.001 * f32(iIdx);
  output.position = vec4<f32>(position.x + step, position.y + step, 0.0, 1.0);
  output.uv = vec3<f32>(0, 0, 255);
  return output;
}

@fragment
fn fs_main(@location(0) uv: vec3<f32>) -> @location(0) vec4<f32> {
  // 可添加噪声纹理增强细节
  return vec4<f32>(uv, 1);
}