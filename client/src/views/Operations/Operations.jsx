import React, {useState} from 'react'
import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'
import {Pagination, Table, Filter} from '../../components'
import {FilterSearch, Times} from '../../icons'
import Modal from 'react-bootstrap/Modal'
import operations from './data'

const Operation = () => {
    const [isFilter, setIsFilter] = useState(false)
    const navigate = useNavigate()

    return (
        <>
        <Modal show={isFilter} onHide={() => setIsFilter(false)}>
            <span className={style.operation__close}
                onClick={() => setIsFilter(false)}>
                <Times/>
            </span>
            <Filter/>
        </Modal>
        <div className={style.operation}>
            <h1>Operations Records</h1>
            <div className={style.operation__wrapper}>
                <div className={style.operation__actions}>
                    <button 
                    onClick={() => navigate('/operation/new')}>
                        New Operation
                    </button>
                    <button className={style.operation__filter}
                    onClick={() => setIsFilter(true)}>
                        <span> <FilterSearch/> </span>
                        <span> Filter </span>
                    </button>
                </div>
                <Filter hidden/>
                <Table records={operations} due/>
                <Pagination count={10}/>
            </div>
        </div>
        </>
    )
}

export default Operation
