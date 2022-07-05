import React from 'react'
import style from './style.module.scss'

const Table = ({ children, show }) => {
  return (
    <div className={`${style.records} ${show ? style.records__show : ''}`}>
      <table>{children}</table>
    </div>
  )
}

export default Table
