import React, { useEffect, useState, useRef } from 'react'
import style from './style.module.scss'
import flags from 'country-flag-emoji-json'
import { v4 as uuidv4 } from 'uuid'
import { useTranslation } from 'react-i18next'
import { Globe } from '../../icons'

const Countries = ({ selectedCountry, country, styles, wrapperClassName }) => {
  const [showDropDown, setShowDropDown] = useState(false)
  const [list, setList] = useState([])
  const inputRef = useRef(null)

  const { t } = useTranslation()

  const filterListHandler = (e) => {
    const value = e.target.value.toLowerCase()
    const filteredList = countries().filter((item) =>
      item.text.toLowerCase().includes(value)
    )
    setList(filteredList)
  }

  const toggleDropdownHandler = () => {
    setTimeout(() => {
      setShowDropDown(!showDropDown)
    }, 150)
  }

  const selectItemHandler = (item) => {
    setShowDropDown(false)
    inputRef.current.value = item.text
    selectedCountry(item)
  }

  const countries = (_) => {
    return flags
      .map((flag) => ({
        _id: uuidv4(),
        text: flag.name,
        abbr: flag.emoji,
        value: flag.name,
        svg: flag.image,
      }))
      .sort((a, b) => {
        if (a.text > b.text) return 1
        if (a.text < b.text) return -1
        return 0
      })
  }

  useEffect(() => {
    country && console.log({ country })
  }, [country])

  useEffect(() => {
    setList(countries())
  }, [])

  return (
    <div
      className={`${style.countries} ${
        wrapperClassName ? wrapperClassName : ''
      }`}
      style={styles}
    >
      <div className={style.countries__dropdown}>
        <input
          ref={inputRef}
          placeholder={t('choose-country')}
          onKeyUp={filterListHandler}
          onFocus={toggleDropdownHandler}
          onBlur={toggleDropdownHandler}
          defaultValue={country ? country.name : ''}
        />
        <span className={style.countries__icon}>
          <Globe />
        </span>
        <div
          className={style.countries__list}
          style={{ display: showDropDown ? 'block' : 'none' }}
        >
          {list.map((item) => (
            <span key={item._id} onClick={() => selectItemHandler(item)}>
              <img src={item.svg} alt={item.abbr} /> {item.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Countries
