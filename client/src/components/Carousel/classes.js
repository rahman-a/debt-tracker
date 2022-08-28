import style from './style.module.scss'

export const classes = {
  slider(lang) {
    const classes = [style.slider, lang === 'ar' ? style.slider_ar : '']
    return classes.join(' ')
  },
  ///////////////////////////////////////////
  content(mode) {
    const classes = [
      style.slider__content,
      mode === 'day' ? style.slider__content_mode : '',
    ]
    return classes.join(' ')
  },
  ///////////////////////////////////////////
  outline(mode) {
    const classes = [
      style.slider__outline,
      mode === 'day' ? style.slider__outline_mode : '',
    ]
    return classes.join(' ')
  },
  ///////////////////////////////////////////
  segment(idx, mode, currentSlider) {
    const classes = [
      style.slider__outline_segment,
      currentSlider === idx + 1 ? style.slider__outline_active : '',
      currentSlider === idx + 1 && mode === 'day'
        ? style.slider__outline_active_mode
        : '',
      mode === 'day' ? style.slider__outline_segment_mode : '',
    ]
    return classes.join(' ')
  },
  ///////////////////////////////////////////
  tap(mode) {
    const classes = [
      style.slider__tap,
      mode === 'day' ? style.slider__tap_mode : '',
    ]
    return classes.join(' ')
  },
}
