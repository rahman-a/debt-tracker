import React from 'react'
import style from './style.module.scss'
import { useTranslation } from 'react-i18next'
import { FilterSearch } from '@/src/icons'

const FilterButton = ({ onClick }) => {
  const { t } = useTranslation()
  return (
    <button className={style.filter} onClick={onClick}>
      <span>
        <FilterSearch />
      </span>
      <span> {t('filter')} </span>
    </button>
  )
}

export default FilterButton
