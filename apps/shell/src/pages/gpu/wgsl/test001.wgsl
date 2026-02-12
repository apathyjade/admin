// 1. 定义顶点输出结构体（必须包含 position + 插值变量）
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>  // ← 关键：声明要传递的 UV
};

struct Uniforms {
    canvas_size: vec2<f32>,  // width, height
};
@group(0) @binding(0)
var<uniform> uniforms: Uniforms;
// 5. 声明资源绑定
@group(0) @binding(1) var mySampler: sampler;
@group(0) @binding(2) var myTexture: texture_2d<f32>;


@vertex
fn vs_main(@location(0) position: vec2<f32>, @builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
    output.position = vec4<f32>(position.x, position.y, 0.0, 1.0);

    const UV_ARRAY_LENGTH: u32 = 4u;
    var uvs = array<vec2<f32>, UV_ARRAY_LENGTH>(
        vec2<f32>(0.0, 1.0), // 左下 → 纹理左下
        vec2<f32>(1.0, 1.0), // 右下 → 纹理右下
        vec2<f32>(0.0, 0.0), // 左上 → 纹理左上
        vec2<f32>(1.0, 0.0), // 右上 → 纹理右上
    );
    if (vertexIndex < UV_ARRAY_LENGTH && vertexIndex >= 0u) {
        output.uv = uvs[vertexIndex];
    } else {
        // output.uv = vec2<f32>(0.0, 1.0); // 超出范围时默认 UV
    }// ← 关键：赋值 UV
    return output;
}

// 6. 片段着色器：接收插值后的 UV
@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    // return vec4<f32>(1.0, 0.0, 0.0, 1.0);
    return textureSample(myTexture, mySampler, in.uv);
}