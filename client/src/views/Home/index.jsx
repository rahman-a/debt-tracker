import React, { useRef } from 'react'
import style from './style.module.scss'
import {
  Carousel,
  About,
  Video,
  QuickNews,
  Contact,
  PageFooter,
} from '../../components'

const Index = () => {
  const aboutRef = useRef(null)
  return (
    <div className={style.container}>
      <Carousel aboutRef={aboutRef} />
      <About aboutRef={aboutRef} />
      <Video />
      <QuickNews />
      <Contact />
      <PageFooter />
    </div>
  )
}

export default Index
