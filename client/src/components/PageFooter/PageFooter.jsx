import React from 'react'
import style from './style.module.scss'
import {
  AddressCard,
  Phone,
  Facebook,
  Whatsapp,
  Twitter,
  Linkedin,
} from '../../icons'

const Footer = () => {
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
        <a href='#'>
          <Facebook />
        </a>
        <a href='#'>
          <Twitter />
        </a>
        <a href='#'>
          <Linkedin />
        </a>
        <a href='#'>
          <Whatsapp />
        </a>
      </div>
      <ul className={style.footer__laws}>
        <li>
          <a href='#'>Privacy Policy</a>
        </li>
        <li>
          <a href='#'>Terms & Conditions</a>
        </li>
      </ul>
      <span>Copyright &copy; reserved 2022</span>
    </div>
  )
}

export default Footer
