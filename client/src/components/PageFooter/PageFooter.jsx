import React, { useEffect } from 'react'
import style from './style.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import actions from '../../actions'
import {
  AddressCard,
  Phone,
  Facebook,
  Whatsapp,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
} from '../../icons'

const Footer = () => {
  const { isLoading, error, socials } = useSelector((state) => state.listSocial)
  const dispatch = useDispatch()

  const socialsList = {
    facebook: <Facebook />,
    twitter: <Twitter />,
    linkedin: <Linkedin />,
    whatsapp: <Whatsapp />,
    instagram: <Instagram />,
    youtube: <Youtube />,
  }

  useEffect(() => {
    dispatch(actions.content.listSocial())
  }, [])

  useEffect(() => {
    socials && console.log({ socials })
  }, [socials])

  return (
    <div className={style.footer}>
      <figure>
        <img src='/images/swtle-bg.png' alt='logo' />
      </figure>
      <ul className={style.footer__contact}>
        <li>
          <span>
            <AddressCard />
          </span>
          <span>13 ST ganuo City, Dubia Governamer</span>
        </li>
        <li>
          <span>
            <Phone />
          </span>
          <span>+9715486328</span>
        </li>
      </ul>
      <div className={style.footer__social}>
        {socials?.length &&
          socials.map((social) => (
            <a href={social.link} key={social._id}>
              {socialsList[social.name]}
            </a>
          ))}
      </div>
      <ul className={style.footer__laws}>
        <li>
          <Link to='/privacy-policy'>Privacy Policy</Link>
        </li>
        <li>
          <Link to='/terms-conditions'>Terms & Conditions</Link>
        </li>
      </ul>
      <span>Copyright &copy; reserved 2022</span>
    </div>
  )
}

export default Footer
