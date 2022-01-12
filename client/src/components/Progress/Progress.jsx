import React from 'react'
import style from './style.module.scss'

const ProgressBar = ({step}) => {
    
    const progressWidth = _ => {
        return (step -1 ) / 5 * 100 + '%'
    }
    
    return (
        <div className={style.progress}>
            <div className={style.progress__bar} style={{width:progressWidth()}}></div>
            <ul className={style.progress__list}>
                <li className={`${style.progress__item} ${step >= 1 ? style.progress__active :''}`}>
                    <span>1</span>
                    <p>Credential Info</p>
                </li>
                <li className={`${style.progress__item} ${step >= 2 ? style.progress__active :''}`}>
                    <span>2</span>
                    <p>Personal Info</p>
                </li>
                <li className={`${style.progress__item} ${step >= 3 ? style.progress__active :''}`}>
                    <span>3</span>
                    <p>Address</p>
                </li>
                <li className={`${style.progress__item} ${step >= 4 ? style.progress__active :''}`}>
                    <span>4</span>
                    <p>Phones</p>
                </li>
                <li className={`${style.progress__item} ${step >= 5 ? style.progress__active :''}`}>
                    <span>5</span>
                    <p>Verification Documents</p>
                </li>
                <li className={`${style.progress__item} ${step >= 6 ? style.progress__active :''}`}>
                    <span>6</span>
                    <p>Snapshot</p>
                </li>
            </ul>
        </div>
    )
}

export default ProgressBar
