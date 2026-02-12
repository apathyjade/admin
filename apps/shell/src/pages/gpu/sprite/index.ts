
import shaderCode from './index.wgsl';
// const PARTICLE_COUNT = 4096; // 最大粒子数
// const particleSize = 6;

let vertices: Float32Array<ArrayBuffer>;
let buffer: GPUBuffer;
let pipeline: GPURenderPipeline;

const initPipeline = (data: Pick<Project.GpuContext, 'device'|'format'>) => {
  const { device, format } = data;
  const shaderModule = device.createShaderModule({
    code: shaderCode
  });

  pipeline = device.createRenderPipeline({
    layout: 'auto',
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
      topology: 'point-list',
      stripIndexFormat: undefined,
      frontFace: 'ccw',
      cullMode: 'none',
      // 确保点大小是可编程的
      unclippedDepth: false,
    }
  });
};
export const init = ({ device, format }: Pick<Project.GpuContext, 'device'|'format'>) => {
  vertices = new Float32Array([
    0.0,  0.0
  ]);
  buffer = device.createBuffer({
    size: vertices.byteLength * 50,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(buffer, 0, vertices);
  initPipeline({ device, format });
}

export const getContext = () => ({ pipeline, buffer, vertices});

export default init;

