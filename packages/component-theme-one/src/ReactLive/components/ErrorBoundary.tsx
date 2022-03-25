import React, { Component } from 'react'
import LiveError from './LiveError'

export default class ErrorBoundary extends Component {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps: { error: string; onError: () => void }

  componentDidCatch(error) {
    const { onError } = this.props as any

    onError(error)
  }

  render() {
    const { error, children } = this.props as any

    return error ? <LiveError error={error} /> : children
  }
}

ErrorBoundary.defaultProps = {
  error: '',
  onError: () => {},
}
