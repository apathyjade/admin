
import { ConfigProvider, type ThemeConfig } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';

import router from './router';
import { RouterProvider } from 'react-router';
const theme: any = {
  token: {
    borderRadius: 2,
    colorPrimary: '#1765ad',
  },
};


const App = () => {
  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
