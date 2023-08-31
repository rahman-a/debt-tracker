import classnames from 'classnames'
import style from './style.module.scss'
import i18next from 'i18next'

const lang = i18next.language

export const panelBodyNameClasses = classnames(style.panel__body_name, {
  [style.panel__body_name_ar]: lang === 'ar',
})
export const panelLabelClasses = classnames(style.panel__label, {
  [style.panel__label_ar]: lang === 'ar',
})
export const panelCodeClasses = classnames(style.panel__code, {
  [style.panel__code_ar]: lang === 'ar',
})

export const panelBodyValueClasses = classnames(style.panel__body_value, {
  [style.panel__body_value_ar]: lang === 'ar',
})

export const panelBodyDateClasses = classnames(style.panel__body_date, {
  [style.panel__body_date_ar]: lang === 'ar',
})

export const panelNoteClasses = (isShow) => {
  return classnames(style.panel__note, {
    [style.panel__note_show]: isShow,
  })
}
