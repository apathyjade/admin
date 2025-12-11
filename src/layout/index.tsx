
import { NavLink, Outlet, useNavigate  } from 'react-router';
import {Row, Column} from '@jelper/component';

import $css from './index.module.scss';
import { Suspense } from 'react';
import { Menu, } from 'antd';
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
const Layout = () => {
  let navigate = useNavigate();
  return (
    <Row className={$css.container} align="stretch">
      <Row.Item className={$css.side} width="240px" fixed>
        <NavLink to="/home">home</NavLink>
        <br />
        <NavLink to="/about">about</NavLink>
        <br />
        <NavLink to="/baidu">about</NavLink>
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          // theme="dark"
          inlineCollapsed={false}
          items={items}
          onClick={({key}) => navigate(key)}
        />
      </Row.Item>
      <Row.Item>
        <Column>
          <Column.Item fixed height="180px"></Column.Item>
          <Column.Item>
            <Suspense fallback={<div>加载中...</div>}>
              <Outlet />
            </Suspense>
          </Column.Item>
        </Column>
      </Row.Item>
    </Row>
  );
};

export default Layout;
