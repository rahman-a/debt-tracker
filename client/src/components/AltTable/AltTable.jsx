import React from 'react'
import style from './style.module.scss'

const Table = ({children}) => {
    return (
        <div className={style.records}>
            <table>
                {children}
            </table>
        </div>
    )
}

export default Table
