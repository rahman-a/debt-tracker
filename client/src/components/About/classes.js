import style from './style.module.scss'

export const classes = {
  about(mode) {
    return [style.about, mode === 'day' ? style.about_mode : ''].join(' ')
  },
  ///////////////////////////////////////////
  header(lang, mode) {
    return [
      style.about__header,
      lang === 'ar' ? style.about__header_ar : '',
      mode === 'day' ? style.about__header_mode : '',
    ].join(' ')
  },
  ///////////////////////////////////////////
  images(lang) {
    return [
      style.about__images,
      lang === 'ar' ? style.about__images_ar : '',
    ].join(' ')
  },
  ///////////////////////////////////////////
  imagesItems(lang) {
    return [
      style.about__images_item,
      lang === 'ar' ? style.about__images_item_ar : '',
    ].join(' ')
  },
  ///////////////////////////////////////////
  item(mode) {
    return [
      style.about__item,
      mode === 'day' ? style.about__item_mode : '',
    ].join(' ')
  },
}
