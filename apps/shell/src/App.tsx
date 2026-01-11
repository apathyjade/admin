import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';

import router from './router';
import { RouterProvider } from 'react-router';
import { themeCtxComposer } from './composers';
import { useMemo } from 'react';

const App = () => {
  const { themeData } = themeCtxComposer.useComposerCtx();
  const theme = useMemo(() => {
    return {
      token: {
        colorPrimary: themeData.primary_color,
        colorPrimaryActive: themeData.primary_color_active,
        colorPrimaryHover: themeData.primary_color_hover,

        colorPrimaryBg: themeData.primary_bgc,
        colorPrimaryBgHover: themeData.primary_bgc_hover,

        colorPrimaryBorder: themeData.primary_color,
        colorPrimaryBorderHover: themeData.primary_color_hover,

        colorPrimaryText: themeData.primary_color,
        colorPrimaryTextActive: themeData.primary_color_active,
        colorPrimaryTextHover: themeData.primary_color_hover,

        colorTextBase: themeData.text_color,
        colorBgBase: themeData.block_bgc,
        colorBorder: themeData.border_color,

        colorBgContainer: themeData.block_bgc,
        colorBgElevated: themeData.block_bgc,
        borderRadius: 2,
      },
      cssVar: {
        prefix: 'antd-admin'
      },
      components: {
        Menu: {
          activeBarBorderWidth: '0px',
          collapsedWidth: '64px',
        }
      }
    }
  }, [themeData]);
  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default themeCtxComposer.forwardComposer(App);