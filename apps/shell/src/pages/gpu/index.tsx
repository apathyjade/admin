import { useCallback, useEffect, useRef } from "react"
import { useAsync } from '@jelper/hooks';
import { Button } from "antd";

import { init as spriteInit, getContext as getSpriteContext } from './sprite';
import { init as iconRanderInit, getContext as getIconRanderContext } from './iconRander';

const getDevice = (() => {
  let device: GPUDevice;
  const cbs: Array<[res: (device: GPUDevice) => void, rej: (reason?: any) => void]> = [];
  let loading = false;
  return async (): Promise<GPUDevice> => {
    if (device) return device;
    let p = new Promise<GPUDevice>((res, rej) => {
      cbs.push([res, rej]);
    });
    if (loading) return p;
    loading = true;
    (async () => {
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        throw new Error('当前环境不支持 WebGPU');
      };
      device = await adapter.requestDevice();
      cbs.forEach(([res]) => res(device));
    })().catch((_) => {
      throw new Error('Device 初始化失败');
    });
    return p;
  };
})();

const initDeviceContext = async (canvas: HTMLCanvasElement, opts?: { signal: AbortSignal }): Promise<Project.GpuContext> => {
  if (opts?.signal?.aborted) {
    throw new DOMException('Operation was aborted', 'AbortError');
  }
  if (!navigator.gpu) {
    throw new Error('当前环境不支持 WebGPU');
  };
  let device = await getDevice();

  const context = canvas.getContext('webgpu');
  if (!context) {
    throw new Error('当前环境不支持 WebGPU');
  };
  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({
    device,
    format,
    alphaMode: 'premultiplied',
  });

  return {
    device,
    format,
    context,
    canvas,
  };
}

const rander = async (data: Project.GpuContext) => {
  let cancelAnimationFrameId: number;
  await Promise.all([spriteInit(data), iconRanderInit(data)]);
  const spriteContetxt = getSpriteContext();
  const iconRanderContetxt = getIconRanderContext();

  const { device, context } = data;

  function frame() {
    const encoder = device.createCommandEncoder();
    const passCom = encoder.beginComputePass();
    passCom.setPipeline(iconRanderContetxt.computePipeline);
    passCom.setBindGroup(0, iconRanderContetxt.computeBindGroup);
    passCom.dispatchWorkgroups(Math.ceil(1024 / 64));
    passCom.end();
    // device.queue.submit([encoder.finish()]);

    const pass = encoder.beginRenderPass({
      colorAttachments: [{
        view: context.getCurrentTexture().createView(),
        clearValue: { r: 0, g: 0, b: 0, a: 0 },
        loadOp: 'clear',
        storeOp: 'store',
      }],
    });

    pass.setPipeline(iconRanderContetxt.pipeline);
    pass.setBindGroup(0, iconRanderContetxt.bindGroup);
    pass.setVertexBuffer(0, iconRanderContetxt.buffer);
    pass.draw(4, 1, 0, 0);
    pass.setPipeline(spriteContetxt.pipeline);
    pass.setVertexBuffer(0, spriteContetxt.buffer);
    pass.draw(2, 50, 0, 0);

    pass.end();
    device.queue.submit([encoder.finish()]);
    cancelAnimationFrameId = requestAnimationFrame(frame);
  }
  frame();
  return () => {
    if (cancelAnimationFrameId) {
      // device.destroy();
      cancelAnimationFrame(cancelAnimationFrameId);
    };
  };
};
const GpuPage = () => {
  const ref = useRef(null);
  const [data, initApi] = useAsync(initDeviceContext);

  useEffect(() => {
    if (!ref.current) return;
    initApi.run(ref.current);
    return () => {
      initApi.cancel();
    };
  }, []);


  useEffect(() => {
    if (!data) return;
    rander(data);
  }, [data]);

  const clean = useCallback(() => {
    if (!data) return;
    const { device } = data;
    const { buffer } = getIconRanderContext();

    const vertices = new Float32Array([
      // 第一个三角形 (左下角到右上角)
      -1.0, -1.0,  // 左下角
      1.0, -1.0,  // 右下角
      -1.0,  1.0,  // 左上角
      1.0,  1.0   // 右上角
    ]).map(v => v / 2);
    device.queue.writeBuffer(buffer, 0, vertices);
  }, [data]);

  return (<>
    <Button onClick={clean}>clear</Button>
    <canvas ref={ref} width={400} height={400} style={{ width: '400px', height: '400px' }}></canvas>
  </>);
}

export default GpuPage
