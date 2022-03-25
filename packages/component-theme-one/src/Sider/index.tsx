import { Layout, Menu } from 'antd'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import getSelectedKeyPath, { MenuItemProps } from '../utils/getSelectedKeyPath'
import './index.less'

const { Sider } = Layout
const { SubMenu } = Menu

type IProps = RouteComponentProps & {
  menus: MenuItemProps[]
}

const BgSider: FC<IProps> = ({ menus, location: { pathname } }) => {
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [collapsed, setCollapsed] = useState(false)

  // 菜单展开-收起
  const onOpenChange = useCallback((_openKeys) => {
    setOpenKeys(_openKeys)
  }, [])

  // 选中菜单
  const onSelect = useCallback((menu) => {
    setSelectedKeys(menu.selectedKeys)
  }, [])

  const renderMenus = useCallback((_menus: MenuItemProps[]) => {
    return _menus.map((menu: MenuItemProps) => {
      if (Array.isArray(menu.children) && menu.children.length > 0) {
        return (
          <SubMenu key={menu.link} title={menu.title}>
            {renderMenus(menu.children || [])}
          </SubMenu>
        )
      }
      return (
        <Menu.Item key={menu.link}>
          <Link to={menu.link}>{menu.title}</Link>
        </Menu.Item>
      )
    })
  }, [])

  useEffect(() => {
    getSelectedKeyPath(menus as MenuItemProps[], pathname, (paths: MenuItemProps[]) => {
      if (Array.isArray(paths) && paths.length > 0) {
        setSelectedKeys([paths.pop().link])
        setOpenKeys(paths.map((x) => x.link))
      }
    })
  }, [pathname, menus])

  return (
    <Sider
      className="ols-theme-one-sider-wrap"
      width={220}
      theme="light"
      collapsible
      collapsed={collapsed}
      onCollapse={() => setCollapsed(!collapsed)}
    >
      <Menu
        mode="inline"
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        style={{
          height: '100%',
          borderRight: 0,
          backgroundColor: '#fff',
        }}
        onOpenChange={onOpenChange}
        onSelect={onSelect}
      >
        {renderMenus(menus as MenuItemProps[])}
      </Menu>
    </Sider>
  )
}

export default withRouter(BgSider)
