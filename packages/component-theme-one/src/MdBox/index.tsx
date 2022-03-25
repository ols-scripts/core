import React, { FC } from 'react'
import CodeBox from '../CodeBox'

const MdBox: FC<any> = (props) => {
  const { codes = [], scopes, meta = {}, content = '' } = props

  return (
    <div>
      <h3>{meta.title}</h3>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      {codes.map((item) => (
        <CodeBox key={item.id} {...item} scopes={scopes} />
      ))}
    </div>
  )
}

export default MdBox
