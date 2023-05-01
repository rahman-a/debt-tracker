import style from './style.module.scss'

const classes = {
  header(lang) {
    return [style.header, lang === 'ar' ? style.header__ar : ''].join(' ')
  },
  ///////////////////////////////////////////
  icon(lang) {
    return [
      style.header__icon,
      lang === 'ar' ? style.header__icon_ar : '',
    ].join(' ')
  },
  ///////////////////////////////////////////
  flag(lang) {
    return [
      style.header__language_flag,
      lang === 'ar' ? style.header__language_flag_ar : '',
    ].join(' ')
  },
  ///////////////////////////////////////////
  menu(lang) {
    return [
      style.header__language_menu,
      lang === 'ar' ? style.header__language_menu_ar : '',
    ].join(' ')
  },
  ///////////////////////////////////////////
  credential(lang) {
    return [
      style.header__credential,
      lang === 'ar' ? style.header__credential_ar : '',
    ].join(' ')
  },
}

export default classes
