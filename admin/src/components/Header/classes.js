import classnames from 'classnames'
import i18next from 'i18next'
import style from './style.module.scss'

const language = i18next.language

export const headerClasses = classnames(style.header, {
  [style.header__ar]: language === 'ar',
})

export const headerLanguageClasses = classnames(style.header__language_flag, {
  [style.header__language_flag_ar]: language === 'ar',
})

export const headerIconClasses = classnames(style.header__icon, {
  [style.header__icon_ar]: language === 'ar',
})

export const headerMenuClasses = classnames(style.header__language_menu, {
  [style.header__language_menu_ar]: language === 'ar',
})

export const headerCredentialClasses = classnames(style.header__credential, {
  [style.header__credential_ar]: language === 'ar',
})
