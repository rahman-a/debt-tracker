import React, { useState } from 'react'
import style from './style.module.scss'
import Modal from 'react-bootstrap/Modal'
import {Pagination, Table, Filter} from '../../components'
import {FilterSearch, Times} from '../../icons'
import reports from './data'

const Reports = () => {
    const [isFilter, setIsFilter] = useState(false)
    const [isDueDate, setIsDueDate] = useState(true)
    
    return (
        <>
        <Modal show={isFilter} onHide={() => setIsFilter(false)}>
            <span className={style.reports__close}
                onClick={() => setIsFilter(false)}>
                <Times/>
            </span>
            <Filter/>
        </Modal>
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
                    <button className={style.reports__filter}
                    onClick={() => setIsFilter(true)}>
                        <span> <FilterSearch/> </span>
                        <span> Filter </span>
                    </button>
                </div>
                <Filter hidden/>
                <Table records={reports} due={isDueDate}/>
                <Pagination count={15}/>
            </div>
        </div>
        </>
    )
}

export default Reports
