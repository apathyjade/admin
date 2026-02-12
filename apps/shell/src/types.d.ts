
declare module '*.wgsl' {
  const content: string;
  export default content;
}

declare module Project {
  export type GpuContext = {
    device: GPUDevice;
    format: GPUTextureFormat;
    context: GPUCanvasContext;
    canvas: HTMLCanvasElement;
  }
}
