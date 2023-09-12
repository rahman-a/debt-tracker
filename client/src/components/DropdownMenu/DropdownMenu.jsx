import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import { ChevronDown } from '@/src/icons'

const DropdownMenu = ({
  data,
  onSelectHandler,
  disabled,
  className,
  custom,
  countries,
}) => {
  // data = {label, icon, items:[{icon:'', text:'', value:''}]}
  const [isMenuToggle, setIsToggleMenu] = useState(false)
  const [labelName, setLabelName] = useState(data.label)
  const { t } = useTranslation()
  const lang = i18next.language

  const toggleMenuHandler = (_) => {
    if (!disabled) {
      setIsToggleMenu((prev) => !prev)
    }
  }

  const toggleMenuItemHandler = (text, value, item) => {
    setIsToggleMenu(false)
    setLabelName(text)
    countries ? onSelectHandler(item) : onSelectHandler(value)
  }

  const dropdownClasses = classnames(style.dropdown, {
    [style.dropdown__disabled]: disabled,
    [className]: className,
  })
  const dropdownToggleClasses = classnames(style.dropdown__toggle, {
    [style.dropdown__toggle_ar]: lang === 'ar',
  })
  const dropdownListClasses = classnames(style.dropdown__list, {
    [style.dropdown__list_icon]: data.icon,
    [style.dropdown__list_ar]: lang === 'ar',
  })
  return (
    <div className={dropdownClasses} style={custom}>
      <div
        className={style.dropdown__actions}
        style={{ padding: data.icon ? '1.5rem 0' : '0.5rem 1rem' }}
        onClick={toggleMenuHandler}
      >
        {data.icon && <span className={style.dropdown__icon}>{data.icon}</span>}

        <span className={style.dropdown__label}>
          {typeof labelName === 'string' ? t(labelName) : labelName}
        </span>

        <span className={dropdownToggleClasses}>
          <ChevronDown />
        </span>
      </div>
      <ul
        className={dropdownListClasses}
        style={{ display: isMenuToggle ? 'block' : 'none' }}
      >
        {data.items.map((item) => {
          return (
            <li
              key={uuidv4()}
              onClick={() => toggleMenuItemHandler(item.text, item.value, item)}
              style={{
                padding: '1rem',
                direction: countries && 'ltr',
              }}
            >
              {item.icon && <span> {item.icon} </span>}
              {item.svg && (
                <img
                  src={item.svg}
                  alt={item.value}
                  width='25'
                  style={{ marginRight: '1rem' }}
                />
              )}
              <div>
                {item.abbr
                  ? `${item.abbr} ${item.text}`
                  : typeof item.text === 'string'
                  ? t(item.text)
                  : item.text}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default DropdownMenu
