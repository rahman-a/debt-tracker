import React, {useState, useEffect} from 'react'
import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {Modal} from 'react-bootstrap'
import {Pagination, Table, Filter, Loader, HeaderAlert} from '../../components'
import {FilterSearch, Times} from '../../icons'
import actions from '../../actions'
import constants from '../../constants'

const Operation = () => {
    const [isFilter, setIsFilter] = useState(false)
    const [searchFilter, setSearchFilter] = useState({
        code:null,
        type:null,
        name:null,
        currency:null,
        dueDate:null,
        paymentDate:null,
        state:null, 
    })
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {loading, error, count, operations} = useSelector(state => state.listOperations)

    const filterOperationHandler = (skip) => {
        let query = {...searchFilter} 
        if(skip) query.skip = skip.skip 
        dispatch(actions.operations.listAllOperations(query))
    }

    const resetFilterOperations = _ => {
        dispatch(actions.operations.listAllOperations())
    }

    useEffect(() => {
        loading && setIsFilter(false)
      },[loading])

    useEffect(() => {
       dispatch(actions.operations.listAllOperations())
       return () => dispatch({type:constants.operations.LIST_OPERATIONS_RESET})
    },[])
    
    return (
        <>
        <Modal show={isFilter} onHide={() => setIsFilter(false)}>
            <span className={style.operation__close}
                onClick={() => setIsFilter(false)}>
                <Times/>
            </span>
            <Filter
            op 
            filterOperationHandler={filterOperationHandler}
            resetFilterOperations={resetFilterOperations}
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
            />
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
                
                <Filter 
                hidden op 
                filterOperationHandler={filterOperationHandler}
                resetFilterOperations={resetFilterOperations}
                searchFilter={searchFilter}
                setSearchFilter={setSearchFilter}/>

                {loading && <Loader size='8' options={{animation:'border'}}/>} 
                {error && <HeaderAlert size='2' text={error} type='danger'/>} 
                {operations && <> 
                
                <Table 
                records={operations} 
                due op/>
                
                <Pagination 
                count={Math.ceil(count / 5)} 
                moveToPageHandler={(skip) => filterOperationHandler(skip)}/>
                </> }
            </div>
        </div>
        </>
    )
}

// Math.ceil(count / 5)
export default Operation
