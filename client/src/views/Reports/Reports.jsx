import React, { useState } from 'react'
import style from './style.module.scss'
import {Pagination, Table} from '../../components'
import reports from './data'

const Reports = () => {
    const [isDueDate, setIsDueDate] = useState(true)
    
    return (
        <div className={style.reports}>
            <h1>Reports Records</h1>
            <div className={style.reports__wrapper}>
                <div className={style.reports__actions}>
                    <button className={isDueDate ? style.reports__actions_active :''}
                    onClick={() => setIsDueDate(true)}>
                        Reports with Due Date
                    </button>
                    <button className={!isDueDate ? style.reports__actions_active :''}
                    onClick={() => setIsDueDate(false)}>
                        Reports without Due Date
                    </button>
                </div>
                <Table records={reports} due={isDueDate}/>
                <Pagination count={15}/>
            </div>
        </div>
    )
}

export default Reports
