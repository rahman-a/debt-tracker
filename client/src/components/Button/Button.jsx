import React from 'react'
import style from './style.module.scss'
import { ArrowRight } from '@/src/icons'
import { Loader } from '@/src/components'
const Button = ({ value, handler, loading }) => {
  return (
    <button className={style.button} onClick={handler} disabled={loading}>
      {loading ? (
        <Loader size='4' center options={{ animation: 'border' }} />
      ) : (
        <p>
          {value} {value === 'next' && <ArrowRight />}
        </p>
      )}
    </button>
  )
}

export default Button
