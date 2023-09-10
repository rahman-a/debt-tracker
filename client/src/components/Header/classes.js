import style from './style.module.scss'
import classnames from 'classnames'
import i18next from 'i18next'

const lang = i18next.language

export const headerClasses = classnames(style.header, {
  [style.header__ar]: lang === 'ar',
})

export const headerIconClasses = classnames(style.header__icon, {
  [style.header__icon_ar]: lang === 'ar',
})

export const headerFlagClasses = classnames(style.header__language_flag, {
  [style.header__language_flag_ar]: lang === 'ar',
})

export const headerMenuClasses = classnames(style.header__language_menu, {
  [style.header__language_menu]: lang === 'ar',
})

export const headerCredentialClasses = classnames(style.header__credential, {
  [style.header__credential_ar]: lang === 'ar',
})
