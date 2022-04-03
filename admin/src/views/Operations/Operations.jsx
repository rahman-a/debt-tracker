import React, {useState, useEffect} from 'react'
import style from './style.module.scss'
import {useSelector, useDispatch} from 'react-redux'
import {
    Table, 
    Pagination, 
    HeaderAlert, 
    Loader,
    OperationFilter,
    FilterModal,
    FilterButton
} from '../../components'
import actions from '../../actions'
import Row from './Row'
import { useTranslation } from 'react-i18next'

const Operations = () => {
    const [isFilterModal, setIsFilterModal] = useState(false)
    const [skipValue, setSkipValue] = useState(0)
    const [filter, setFilter] = useState({
        arabicName:'',
        englishName:'', 
        code:'', 
        value:'',
        currency:'',
        state:'',
        dueDate:'',
    })
    const dispatch = useDispatch()
    const {t} = useTranslation()
    const {loading, error, count, operations} = useSelector(state => state.listAllOperations)
  
    const initiateOperationFiltration = (skip) => {
    
        let query = {...filter}
        
        if(skip?.skip || skip?.skip === 0) {
          setSkipValue(skip.skip)
          query = {...filter, ...skip}
        }
        
        dispatch(actions.operations.listAllOperations(query))
      }
    
      const resetFilterOperation = _ => {
        setSkipValue(0)
        dispatch(actions.operations.listAllOperations())
      }

    useEffect(() => {
        dispatch(actions.operations.listAllOperations())
    },[])

    return (
    
    <>

    <div className={style.operations}>
        <h1 className='main-header'>{t('operations-records')}</h1>

        <FilterModal
            isFilter={isFilterModal}
            setIsFilter={setIsFilterModal}
            type='operation'
            options={{
            searchFilter: filter,
            setSearchFilter: setFilter,
            resetFilterOperations : resetFilterOperation,
            filterOperationHandler: initiateOperationFiltration
            }}
        />
      
        <OperationFilter
            hidden
            op
            searchFilter={filter}
            setSearchFilter={setFilter}
            resetFilterOperations={resetFilterOperation}
            filterOperationHandler={initiateOperationFiltration}
        />
        
        <FilterButton onClick={() => setIsFilterModal(true)}/>

     <Table>
         <thead>
             <th>#</th>
             <th>{t('operation-code')}</th>
             <th>{t('first-party')}</th>
             <th>{t('second-party')}</th>
             <th>{t('operation-value')}</th>
             <th>{t('note')}</th>
             <th>{t('operation-currency')}</th>
             <th>{t('status')}</th>
             <th>{t('due-date')}</th>
             <th>{t('createdAt')}</th>
         </thead>
         <tbody  style={{position:'relative'}}>
             {loading 
            ? <Loader 
            size='6' 
            center
            options={{animation:'border'}} 
            custom={{transform:'unset'}}
            />
            : error 
            ? <HeaderAlert type='danger' size='3' text={error}/>
            : operations && operations.map((operation, idx) => (
                    <Row
                    key={operation._id}
                    idx={idx + skipValue}
                    operation={operation}
                    />
                 ))
             }
         </tbody>
     </Table>
     {
        count > 0 &&
        <Pagination
        count={Math.ceil(count / 5)}
        moveToPageHandler={(skip) => initiateOperationFiltration(skip)}
        />
      }
    </div>
    
    </>
  )
}

export default Operations