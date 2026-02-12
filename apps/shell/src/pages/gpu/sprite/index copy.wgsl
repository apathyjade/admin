
// particle.wgsl
struct Particle {
  position: vec2<f32>,
  velocity: vec2<f32>,
  color: vec4<f32>,
  life: f32,        // 当前生命 [0, maxLife]
  maxLife: f32,
  size: f32,
  cus_active: u32,      // 1=活跃, 0=死亡
}

struct ExplosionParams {
  center: vec2<f32>,
  strength: f32,
  count: u32,
  timestamp: u32,   // 防止重复触发
}

struct SimulationParams {
  deltaTime: f32,
  gravity: f32,
  drag: f32,
  explosionStrength: f32,
  pixelToWorldRatio: f32,
  ndcScale: vec2<f32>,
  viewportCenter: vec2<f32>,
}
struct RenderParams {
  pixelToWorldRatio: f32,
  ndcScale: vec2<f32>,
  viewportCenter: vec2<f32>,
}

fn getUV(uv: vec2<f32>) -> vec2<f32> {
  return uv * 2.0 - 1.0;
}

// compute.wgsl
// @group(0) @binding(0) var<storage, read_write> particles: array<Particle>;
// @group(0) @binding(1) var<uniform> params: ExplosionParams;
// @group(0) @binding(2) var<uniform> simParams: SimulationParams;
// @group(0) @binding(3) var<uniform> renderParams: RenderParams;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let i = id.x;
  if (i >= arrayLength(&particles)) { return; }

  var p = particles[i];

  // 发射新粒子（仅当触发且 slot 空闲）
  if (params.count > 0u && p.cus_active == 0u && i < params.count) {
    let angle = f32(i) * 6.28 / f32(params.count);
    let speed = simParams.explosionStrength * (0.8 + 0.4 * rand(f32(i)));
    
    p.position = params.center;
    p.velocity = vec2<f32>(cos(angle), sin(angle)) * speed;
    p.color = mix(vec4<f32>(1.0, 0.2, 0.1, 1.0), vec4<f32>(1.0, 1.0, 0.2, 1.0), rand(f32(i)));
    p.life = 0.0;
    p.maxLife = 1.0 + 0.5 * rand(f32(i));
    p.size = 8.0 + 12.0 * rand(f32(i));
    p.cus_active = 1u;
  }

  // 更新活跃粒子
  if (p.cus_active == 1u) {
    p.life += simParams.deltaTime;
    
    // 物理更新
    p.velocity += vec2<f32>(0.0, simParams.gravity) * simParams.deltaTime;
    p.velocity *= pow(simParams.drag, simParams.deltaTime);
    p.position += p.velocity * simParams.deltaTime;

    // 死亡检测
    if (p.life >= p.maxLife) {
      p.cus_active = 0u;
    }
  }

  particles[i] = p;
}

// 简易随机函数
fn rand(seed: f32) -> f32 {
  return fract(sin(seed * 12.9898) * 43758.5453);
}

// vertex.wgsl
struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
  @location(1) color: vec4<f32>,
  @location(2) alpha: f32,
}

@vertex
fn vs_main(
  @builtin(vertex_index) vIdx: u32,
  @builtin(instance_index) iIdx: u32
) -> VertexOutput {
  let p = particles[iIdx];
  if (p.cus_active == 0u) {
    return VertexOutput(vec4<f32>(0.0), vec2<f32>(0.0), vec4<f32>(0.0), 0.0);
  }
  var corner: vec2<f32>;
  if (vIdx == 0u) {
    corner = vec2<f32>(-1.0, -1.0);
  } else if (vIdx == 1u) {
    corner = vec2<f32>( 1.0, -1.0);
  } else if (vIdx == 2u) {
    corner = vec2<f32>(-1.0,  1.0);
  } else {
    corner = vec2<f32>( 1.0,  1.0);
  }
  
  var worldPos = p.position + corner * p.size * renderParams.pixelToWorldRatio;
  let ndc = (worldPos - renderParams.viewportCenter) * renderParams.ndcScale;
  
  return VertexOutput(
    vec4<f32>(ndc.x, ndc.y, 0.0, 1.0),
    corner * 0.5 + 0.5, // UV [0,1]
    p.color,
    1.0 - p.life / p.maxLife   // 透明度随生命衰减
  );
}

@fragment
fn fs_main(uv: vec2<f32>, color: vec4<f32>, alpha: f32) -> @location(0) vec4<f32> {
  // 可添加噪声纹理增强细节
  return vec4<f32>(color.rgb, color.a * alpha);
}