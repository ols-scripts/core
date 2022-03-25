import React, { Component } from 'react'

const errorBoundary = (Element, errorCallback) => {
  return class ErrorBoundary extends Component {
    componentDidCatch(error) {
      errorCallback(error)
    }

    render() {
      // eslint-disable-next-line react/jsx-filename-extension
      return typeof Element === 'function' ? <Element /> : Element
    }
  }
}

export default errorBoundary
