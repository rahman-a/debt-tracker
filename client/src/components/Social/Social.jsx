import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import style from './style.module.scss'
import {
  Facebook,
  Linkedin,
  Whatsapp,
  Twitter,
  Instagram,
  Youtube,
} from '../../icons'
import actions from '../../actions'
import i18next from 'i18next'

const Social = () => {
  const dispatch = useDispatch()
  const { socials } = useSelector((state) => state.listSocial)
  const lang = i18next.language
  const socialIcon = {
    facebook: <Facebook />,
    linkedin: <Linkedin />,
    whatsup: <Whatsapp />,
    twitter: <Twitter />,
    instagram: <Instagram />,
    youtube: <Youtube />,
  }

  useEffect(() => {
    dispatch(actions.content.listSocial())
  }, [])
  return (
    <div className={`${style.social} ${lang === 'ar' ? style.social_ar : ' '}`}>
      {socials?.length > 0 &&
        socials.map((item) => (
          <a key={item._id} href={item.link} target='_blank' rel='noreferrer'>
            {socialIcon[item.name]}
          </a>
        ))}
    </div>
  )
}

export default Social
