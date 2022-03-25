import React, { FC } from 'react'
import { Button } from 'antd'
import Loadable from 'react-loadable'

type IProps = {
  error: boolean
  retry: () => void
}

const RouteLoading: FC<IProps> = ({ error, retry }) => {
  if (error) {
    return (
      <div>
        Error!
        <Button onClick={retry}>Retry</Button>
      </div>
    )
  }

  return <div>Loading...</div>
}

const lazyLoadComponent = (component) => {
  return Loadable({
    loader: component,
    loading: RouteLoading,
  })
}

export default lazyLoadComponent
