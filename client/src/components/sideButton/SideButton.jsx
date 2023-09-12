import React from 'react'
import i18next from 'i18next'
import classnames from 'classnames'
import style from './style.module.scss'
import { Plus, Minus } from '@/src/icons'
import { Loader } from '@/src/components'

const SideButton = ({ handler, text, minus, noIcon, loading, custom }) => {
  const lang = i18next.language
  const buttonSideClasses = classnames(style.button__side, {
    [style.button__side_ar]: lang === 'ar',
    [style.button__side_noIcon]: noIcon,
  })
  return (
    <button
      style={{ padding: loading ? '2.2rem 2rem' : '0', ...custom }}
      className={buttonSideClasses}
      onClick={handler}
    >
      {minus ? (
        <>
          <Minus />
          <p>{text}</p>
        </>
      ) : (
        <>
          {!noIcon && <Plus />}
          <p>
            {loading ? (
              <Loader center size='4' options={{ animation: 'border' }} />
            ) : (
              text
            )}
          </p>
        </>
      )}
    </button>
  )
}

export default SideButton
