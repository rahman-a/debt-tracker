import i18next from 'i18next'
import React from 'react'
import { useTranslation } from 'react-i18next'
import style from './style.module.scss'

const ProgressBar = ({step}) => {
    const {t} = useTranslation()
    const lang = i18next.language
    
    const progressWidth = _ => {
        return (step -1 ) / 5 * 100 + '%'
    }
    
    return (
        <div className={`${style.progress} ${lang === 'ar' ? style.progress_ar : ''}`}>
            <div className={style.progress__bar} style={{width:progressWidth()}}></div>
            <ul className={style.progress__list} style={{fontFamily:'Cairo'}}>
                <li className={`${style.progress__item} ${step >= 1 ? style.progress__active :''}`}>
                    <span>1</span>
                    <p>{t('credential-info')}</p>
                </li>
                <li className={`${style.progress__item} ${step >= 2 ? style.progress__active :''}`}>
                    <span>2</span>
                    <p>{t('new-personal-info')}</p>
                </li>
                <li className={`${style.progress__item} ${step >= 3 ? style.progress__active :''}`}>
                    <span>3</span>
                    <p>{t('new-addresses')}</p>
                </li>
                <li className={`${style.progress__item} ${step >= 4 ? style.progress__active :''}`}>
                    <span>4</span>
                    <p>{t('new-phones')}</p>
                </li>
                <li className={`${style.progress__item} ${step >= 5 ? style.progress__active :''}`}>
                    <span>5</span>
                    <p>{t('verification-docs')}</p>
                </li>
                <li className={`${style.progress__item} ${step >= 6 ? style.progress__active :''}`}>
                    <span>6</span>
                    <p>{t('snapshot')}</p>
                </li>
            </ul>
        </div>
    )
}

export default ProgressBar
