import React from 'react'
import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from '../../icons'

const BackButton = ({ page, position, text }) => {
  const navigate = useNavigate()

  const getStyle = (_) => {
    let style = {
      top: '2rem',
      left: '12rem',
    }
    if (window.matchMedia('(max-width:61.99em)').matches) {
      style = {
        top: '1.5rem',
        left: '1rem',
      }
    }
    if (position === 'right') {
      style = {
        top: '2rem',
        right: '12rem',
      }
      if (window.matchMedia('(max-width:61.99em)').matches) {
        style = {
          top: '1.5rem',
          right: '1rem',
        }
      }
    }

    return style
  }

  const arrowStyle = (_) => {
    let style = {
      transform: 'rotate(180deg) translate(0, -2px)',
    }
    if (position === 'right') {
      style = {
        transform: 'translate(0px, -2px)',
        position: 'absolute',
        right: '-2rem',
        top: '1px',
      }
    }
    return style
  }

  const navigateTo = (_) => {
    if (typeof page === 'function') {
      page()
    } else {
      navigate(`/${page}`)
    }
  }

  return (
    <button
      className={style.back}
      onClick={() => navigateTo()}
      style={getStyle()}
    >
      <span style={arrowStyle()}>
        <ArrowRight />
      </span>
      <span> {text} </span>
    </button>
  )
}

export default BackButton
