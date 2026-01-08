import classNames from 'classnames';
import { Outlet, useNavigate  } from 'react-router';
import { Row, Col } from '@jelper/component';
import { useBoolState } from '@jelper/hooks';

import $css from './index.module.css';
import { Suspense } from 'react';
import { Avatar, Button, ConfigProvider, Divider, Dropdown, Menu, Switch, } from 'antd';
import { ContainerOutlined, DesktopOutlined, MailOutlined, MenuFoldOutlined, MenuUnfoldOutlined, MoonOutlined, PieChartOutlined, SettingOutlined, SunOutlined, UserOutlined } from '@ant-design/icons';

import type { MenuProps } from 'antd';
import { themeCtxComposer } from '../composers';
import { tokens } from 'storybook/theming';
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
      { key: 'product', label: 'product' },
    ],
  },
];



const HeadHeight = 48;

const Layout = () => {
  const navigate = useNavigate();
  const { theme, switchTheme} = themeCtxComposer.useComposerCtx();
  const [sideCollapsed, switchSideCollapsed] = useBoolState(true);

  const menus = [
    {
      key: '4',
      label: 'Settings',
      icon: <SettingOutlined />,
      extra: '⌘S',
    },
  ]

  return (
    <Col className={classNames($css.layout)}> 
      {/* <Col.Item className={$css.top} $height={48} $fixed>
        test
      </Col.Item> */}
      <Col.RowItem className={$css.main}>
        <Row.Item className={$css.side} $width={sideCollapsed ? 240 : 64} $fixed>
          <Col>
            <Col.RowItem $justify="center" $align="center" $height={HeadHeight} $fixed>
              { sideCollapsed ? <Row.Item className={classNames($css.title, 'pl-16')} >AJ 后台系统</Row.Item> : undefined}
              <Button color="default" size="large" variant="link" onClick={() => switchSideCollapsed()}>
                { sideCollapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
              </Button>
            </Col.RowItem>
            <Col.Item>
              <Menu
                mode="inline"
                inlineCollapsed={!sideCollapsed}
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
            <Col.RowItem $gap={16} className={classNames($css.head, 'pl-24 pr-24')} $fixed $height={HeadHeight} $justify="space-between">
              <Row.Item $maxWidth={'70%'}>

              </Row.Item>
              <Row.RowItem $gap={8} $justify="flex-end" $align="center" >
                <Switch
                  className={'mr-16'}
                  checkedChildren={<SunOutlined />}
                  unCheckedChildren={<MoonOutlined />}
                  defaultChecked={theme === 'light'}
                  onChange={switchTheme}
                />
                <Divider vertical size="large" />
                <Avatar className={'mr-8'} size="small" icon={<UserOutlined />} />
                <Dropdown menu={{ items: menus}}>
                  <span className={'mr-8'}>jade</span>
                </Dropdown>
                
              </Row.RowItem>
            </Col.RowItem>
            <Col.Item className="p-16">
              <Suspense fallback={<div>加载中...</div>}>
                <Outlet />
              </Suspense>
            </Col.Item>
          </Col>
        </Row.Item>
      </Col.RowItem>
    </Col>
  );
};

export default Layout;
