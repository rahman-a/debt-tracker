import React from 'react'
import style from './style.module.scss'
import { FilterSearch } from '@/src/icons'

const FilterButton = ({ onClick }) => {
  return (
    <button className={style.filter} onClick={onClick}>
      <span>
        {' '}
        <FilterSearch />{' '}
      </span>
      <span> Filter </span>
    </button>
  )
}

export default FilterButton
