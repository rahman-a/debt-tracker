import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import {Modal} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import {Pagination, Table, Filter, Loader, HeaderAlert} from '../../components'
import {FilterSearch, Times} from '../../icons'
import actions from '../../actions'
import constants from '../../constants'

const Reports = () => {
    const [isFilter, setIsFilter] = useState(false)
    const [isDueDate, setIsDueDate] = useState(true)
    const [searchFilter, setSearchFilter] = useState({
        code:null,
        type:null,
        name:null,
        currency:null,
        dueDate:null,
        paymentDate:null,
        state:null, 
    })

    const dispatch = useDispatch()

    const {loading, error, count, reports} = useSelector(state => state.listAllReports)


    const listReportsWithDueDate = _ => {
        dispatch(actions.reports.listAllReports())
        setIsDueDate(true)
    }

    const listReportsWithoutDueDate = _ => {
        dispatch(actions.reports.listAllReports({notDue:false}))
        setIsDueDate(false)
    }
    
    
    const filterOperationHandler = (skip) => {
        let query = {...searchFilter} 
        if(skip) query.skip = skip.skip
        dispatch(actions.reports.listAllReports(query))
    }

    const resetFilterOperations = _ => {
        dispatch(actions.reports.listAllReports())
    }

    useEffect(() => {
        dispatch(actions.reports.listAllReports())
        return () => dispatch({type:constants.reports.REPORTS_ALL_RESET})
     },[])

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
            {/* <button className={style.reports__end}>
                close report
            </button> */}
            <h1>Active Reports Records</h1>
            <div className={style.reports__wrapper}
            style={{textAlign: !isDueDate ? '-webkit-center' :'unset'}}>
                <div className={style.reports__actions}>
                    <button className={isDueDate ? style.reports__actions_active :''}
                    onClick={listReportsWithDueDate}>
                        Reports with Due Date
                    </button>
                    
                    <button className={!isDueDate ? style.reports__actions_active :''}
                    onClick={listReportsWithoutDueDate}>
                        Reports without Due Date
                    </button>
                    
                    <button className={style.reports__filter}
                    onClick={() => setIsFilter(true)}>
                        <span> <FilterSearch/> </span>
                        <span> Filter </span>
                    </button>
                </div>
                
                
                <Filter hidden 
                    isDueDate={!isDueDate}
                    searchFilter={searchFilter} 
                    setSearchFilter={setSearchFilter}
                    filterOperationHandler={filterOperationHandler}
                    resetFilterOperations={resetFilterOperations}/>
            
                {loading && <Loader size='8' options={{animation:'border'}}/>} 
                {error && <HeaderAlert size='2' text={error} type='danger'/>} 

                {
                    reports && 
                    <>

                        <Table records={reports} due={isDueDate}/>
                        <Pagination 
                        count={Math.ceil(count / 5)} 
                        moveToPageHandler={(skip) => filterOperationHandler(skip)}/>
                    </>
                }
                
            </div>
        </div>
        </>
    )
}

export default Reports
