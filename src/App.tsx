import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';

import router from './router';
import { RouterProvider } from 'react-router';

const theme: any = {
  token: {
    borderRadius: 2,
    colorPrimary: '#f97316', // 橙色主题 - 橙色500
    colorBgBase: '#fef7ee'  // 橙色主题的浅色背景
  },
  cssVar: {
    prefix: 'antd-admin'
  }
};

const App = () => {
  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;