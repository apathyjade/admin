import classNames from 'classnames';
import { Outlet, useNavigate  } from 'react-router';
import { Row, Col } from '@jelper/component';

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

const HeadHeight = 64;

const Layout = () => {
  const navigate = useNavigate();
  return (
    <ConfigProvider theme={theme}>
      <Col className={classNames($css.layout)}> 
        <Col.Item className={$css.top} $height={48} $fixed>
          test
        </Col.Item>
        <Col.RowItem className={$css.main}>
          <Row.Item className={$css.side} $width={240} $fixed>
            <Col>
              <Col.Item $height={HeadHeight} $fixed>

              </Col.Item>
              <Col.Item>
                <Menu
                  mode="inline"
                  inlineCollapsed={false}
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  items={items}
                  onClick={({key}) => navigate(key)}
                />
              </Col.Item>
            </Col>
          </Row.Item>
          <Row.Item>
            <Col>
              <Col.Item className={$css.head} $fixed $height={HeadHeight}>
              </Col.Item>
              <Col.Item>
                <Suspense fallback={<div>加载中...</div>}>
                  <Outlet />
                </Suspense>
              </Col.Item>
            </Col>
          </Row.Item>
        </Col.RowItem>
      </Col>
    </ConfigProvider>
  );
};

export default Layout;
