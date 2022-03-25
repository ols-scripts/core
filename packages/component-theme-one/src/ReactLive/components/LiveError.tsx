import React from 'react'

export default function LiveError(props) {
  const { error } = props
  return error ? <pre>{error}</pre> : null
}
