import React, { useState } from 'react'
import style from './style.module.scss'
import i18next from 'i18next'
import Input from './Input'
import Filters from './Filters'

const Search = ({ setPeerInfo, mutuals, type }) => {
  const [filter, setFilter] = useState('username')
  const [searchValue, setSearchValue] = useState('')
  const lang = i18next.language

  return (
    <div
      className={`${style.search} ${
        type === 'reports' ? style.search__reports : ''
      }`}
    >
      <Filters
        filter={filter}
        setFilter={setFilter}
        setSearchValue={setSearchValue}
        lang={lang}
      />

      <Input
        filter={filter}
        setPeerInfo={setPeerInfo}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        mutuals={mutuals}
        lang={lang}
        type={type}
      />
    </div>
  )
}

export default Search
