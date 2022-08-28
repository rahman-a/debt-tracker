import React, { useState } from 'react'
import style from './style.module.scss'
import i18next from 'i18next'
import Input from './Input'
import Filters from './Filters'

const Search = ({ setPeerInfo, mutuals }) => {
  const [filter, setFilter] = useState('username')
  const [searchValue, setSearchValue] = useState('')
  const lang = i18next.language

  return (
    <div className={style.search}>
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
      />
    </div>
  )
}

export default Search
