import classnames from 'classnames'
import style from './style.module.scss'
import i18next from 'i18next'
const lang = i18next.language

export const panelHeaderIdClasses = classnames(style.panel__header_id, {
  [style.panel__header_id_ar]: lang === 'ar',
})
export const panelHeaderStateClasses = classnames(style.panel__header_state, {
  [style.panel__header_state_ar]: lang === 'ar',
})
export const panelBodyPhotoClasses = classnames(style.panel__body_photo, {
  [style.panel__body_photo_ar]: lang === 'ar',
})
export const panelBodyNameClasses = classnames(style.panel__body_name, {
  [style.panel__body_name_ar]: lang === 'ar',
})
export const panelBodyDateClasses = classnames(style.panel__body_date, {
  [style.panel__body_date_ar]: lang === 'ar',
})
