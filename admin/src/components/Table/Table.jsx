import React from 'react'
import classnames from 'classnames'
import style from './style.module.scss'

const Table = ({ children, show }) => {
  const recordsClasses = classnames(style.records, {
    [style.records__show]: show,
  })
  return (
    <div className={recordsClasses}>
      <table>{children}</table>
    </div>
  )
}

export default Table
