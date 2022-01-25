import React, {useState, useEffect} from 'react'
import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {Pagination, Table, Filter, Loader, HeaderAlert} from '../../components'
import {FilterSearch, Times} from '../../icons'
import Modal from 'react-bootstrap/Modal'
import actions from '../../actions'

const Operation = () => {
    const [isFilter, setIsFilter] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {loading, error, count, operations} = useSelector(state => state.listOperations)

    const filterOperationHandler = (query) => {
        dispatch(actions.operations.listAllOperations(query))
    }

    const resetFilterOperations = _ => {
        dispatch(actions.operations.listAllOperations())
    }

    useEffect(() => {
        !operations && dispatch(actions.operations.listAllOperations())
    },[])
    
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
                
                <Filter 
                hidden op 
                filterOperationHandler={filterOperationHandler}
                resetFilterOperations={resetFilterOperations}/>

                {loading && <Loader size='8' options={{animation:'border'}}/>} 
                {error && <HeaderAlert size='2' text={error} type='danger'/>} 
                {operations && <> 
                
                <Table 
                records={operations} 
                due op/>
                
                <Pagination 
                count={Math.ceil(count / 5)} 
                filterOperationHandler={filterOperationHandler}/>
                    </> }
            </div>
        </div>
        </>
    )
}

// Math.ceil(count / 5)
export default Operation
