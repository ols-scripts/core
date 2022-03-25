export type MenuItemProps = {
  [propName: string]: any
  title: string
  link: string
  icon?: string
  children?: MenuItemProps[]
}

// 获取指定节点的路径
export default function getSelectedKeyPath(_menus: MenuItemProps[], _pathname: string, callback) {
  const paths: MenuItemProps[] = []
  try {
    const getNodePath = (nodes: MenuItemProps[]) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const node of nodes) {
        paths.push(node)
        if (node.link && node.link === _pathname) {
          throw new Error('get node')
        }
        if (Array.isArray(node.children) && node.children.length > 0) {
          getNodePath(node.children)
          paths.pop()
        } else {
          paths.pop()
        }
      }
    }
    getNodePath(_menus)
  } catch (err) {
    callback(paths)
  }
}
