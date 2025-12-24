
import { NavLink, Outlet, useNavigate  } from 'react-router';
import {Row, Column} from '@jelper/component';

import $css from './index.module.css';
import { Suspense } from 'react';
import { ConfigProvider, Menu, } from 'antd';
import { ContainerOutlined, DesktopOutlined, MailOutlined, PieChartOutlined } from '@ant-design/icons';

import type { MenuProps } from 'antd';
type MenuItem = Required<MenuProps>['items'][number];
const items: MenuItem[] = [
  { key: '1', icon: <PieChartOutlined />, label: 'Option 1' },
  { key: '2', icon: <DesktopOutlined />, label: 'Option 2' },
  { key: '3', icon: <ContainerOutlined />, label: 'Option 3' },
  {
    key: 'sub1',
    label: 'Navigation One',
    icon: <MailOutlined />,
    children: [
      { key: 'home', label: 'home' },
      { key: 'about', label: 'about' },
    ],
  },
];

const theme: any = {
  token: {
    activeBarBorderWidth: 0,
  },
};

const HeadHeight = 48;

const Layout = () => {
  let navigate = useNavigate();
  return (
    <ConfigProvider theme={theme}>
      <Row className={$css.container} align="stretch">
        <Row.Item className={$css.side} width="240px" fixed>
          <Column>
            <Column.Item height={HeadHeight} fixed>

            </Column.Item>
            <Column.Item>
              <Menu
                mode="inline"
                inlineCollapsed={false}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                items={items}
                onClick={({key}) => navigate(key)}
              />
            </Column.Item>
          </Column>
        </Row.Item>
        <Row.Item>
          <Column>
            <Column.Item fixed height={HeadHeight}></Column.Item>
            <Column.Item>
              <Suspense fallback={<div>加载中...</div>}>
                <Outlet />
              </Suspense>
            </Column.Item>
          </Column>
        </Row.Item>
      </Row>
    </ConfigProvider>
  );
};

export default Layout;
