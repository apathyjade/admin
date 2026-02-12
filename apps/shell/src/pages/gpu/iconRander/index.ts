import { getTextureImg, getImgRangerSize } from '../utils';
import shaderCode from './index.wgsl';


let uniformData: Float32Array<ArrayBuffer>;
let uniformBuffer: GPUBuffer;

let texture: GPUTexture;

let pipeline: GPURenderPipeline;
let bindGroup: GPUBindGroup;
let bindGroupLayout: GPUBindGroupLayout;


let computePipeline: GPUComputePipeline;
let computeBindGroup: GPUBindGroup;
let computeBindGroupLayout: GPUBindGroupLayout;

let vertices: Float32Array<ArrayBuffer>;
let buffer: GPUBuffer;
const initData = (data: Pick<Project.GpuContext, "device">) => {
  const { device } = data;
  vertices = new Float32Array([
    // 第一个三角形 (左下角到右上角)
    -1.0, -1.0,  // 左下角
    1.0, -1.0,  // 右下角
    -1.0,  1.0,  // 左上角
    1.0,  1.0   // 右上角
  ]).map(v => v / 2);
  buffer = device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE, // | GPUBufferUsage.COPY_DST, // 或 VERTEX | COPY_DST 等
    mappedAtCreation: true
  });
  new Float32Array(buffer.getMappedRange()).set(vertices);
  buffer.unmap();
};

const initGroup = async (data: Pick<Project.GpuContext, 'device'|'canvas'|'format'>) => {
  const { device, canvas, format } = data;
  uniformData = new Float32Array([
    canvas.clientWidth, canvas.clientHeight,  // 顶点位置
    0.0, 0.0,   // UV 坐标
    performance.now(), 2 / data.canvas.width,
  ]);
  uniformBuffer = device.createBuffer({
      size: uniformData.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  device.queue.writeBuffer(uniformBuffer, 0, uniformData);

  const img = await getTextureImg('/favicon.png');
  // const [width, height] = await getImgRangerSize(img);
  texture = device.createTexture({
    size: { width: img.width, height: img.height },
    format,
    usage: GPUTextureUsage.TEXTURE_BINDING |
            GPUTextureUsage.COPY_DST |
            GPUTextureUsage.RENDER_ATTACHMENT
  });

  device.queue.copyExternalImageToTexture(
    { source: img },          // 外部图像源
    { texture: texture },     // 目标纹理
    [ img.width, img.height ]   // 尺寸
  );

  const sampler = device.createSampler({
    magFilter: 'linear',
    minFilter: 'linear'
  });

  bindGroupLayout = device.createBindGroupLayout({
    entries: [
      { binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
      { binding: 1, visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX, sampler: {} },
      { binding: 2, visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX, texture: {} },
    ]
  });
  bindGroup = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [
      { binding: 0, resource: uniformBuffer },
      { binding: 1, resource: sampler },
      { binding: 2, resource: texture.createView() },
    ]
  });
};

const initComGroup = (data: Project.GpuContext) => {
  const { device } = data;
  computeBindGroupLayout = device.createBindGroupLayout({
    entries: [
      { binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
      { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }
    ]
  });
  computeBindGroup = device.createBindGroup({
    layout: computeBindGroupLayout,
    entries: [
      { binding: 0, resource: uniformBuffer },
      { binding: 3, resource: buffer }
    ]
  });
}

const initPipeline = async (data: Project.GpuContext) => {
  const { device, format } = data;
  // 创建着色器模块
  const shaderModule = device.createShaderModule({
    code: shaderCode
  });
  const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [bindGroupLayout] // 可包含多个 bind group
  });
  pipeline = device.createRenderPipeline({
    label: 'pipeline',
    layout: pipelineLayout,
    vertex: {
      module: shaderModule,
      entryPoint: 'vs_main',
      buffers: [{
          arrayStride: 8,
          attributes: [{
              shaderLocation: 0,
              offset: 0,
              format: 'float32x2'
          }]
      }]
    },
    fragment: {
      module: shaderModule,
      entryPoint: 'fs_main',
      targets: [{
        format: format,
      }]
    },
    primitive: {
      topology: 'triangle-strip'
    }
  });


  const computePipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [computeBindGroupLayout] // 可包含多个 bind group
  });
  computePipeline = device.createComputePipeline({
    label: 'computePipeline',
    layout: computePipelineLayout,
    compute: {
      module: shaderModule,
      entryPoint: 'compute_main' // ← 指定入口
    }
  });
};

export const getContext = () => ({
  buffer,
  pipeline,
  computePipeline,
  bindGroup,
  computeBindGroup,
});

export const init = async (data: Project.GpuContext) => {
  initData(data);
  await initGroup(data);
  await initComGroup(data);
  await initPipeline(data)
};
