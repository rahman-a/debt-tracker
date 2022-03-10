import React, {useState, useEffect} from 'react'
import style from './style.module.scss'
import {useSelector, useDispatch} from 'react-redux'
import {
    Table, 
    Pagination, 
    HeaderAlert, 
    Loader,
    ReportFilter,
    FilterModal,
    FilterButton
} from '../../components'
import actions from '../../actions'
import Row from './Row'
import { useTranslation } from 'react-i18next'


const NonDueReports = () => {
    const [isFilterModal, setIsFilterModal] = useState(false)
    const [skipValue, setSkipValue] = useState(0)
    const [filter, setFilter] = useState({
        arabicName:'',
        englishName:'', 
        code:'', 
        value:'',
        currency:'',
        dueDate:'',
        isDue:false,
        isActive:true
    })
    
    const defaultFilter = {isActive:true, isDue:false}

    const dispatch = useDispatch()
    
    const {loading, error, count, reports} = useSelector(state => state.listAllReports)
    
    const {t} = useTranslation()

    const initiateReportsFiltration = (skip) => {
    
        let query = {...filter}
        
        if(skip?.skip || skip?.skip === 0) {
          setSkipValue(skip.skip)
          query = {...filter, ...skip}
        }
        dispatch(actions.reports.listAllReports(query))
      }
    
      const resetFilterReports = _ => {
        setSkipValue(0)
        dispatch(actions.reports.listAllReports(defaultFilter))
      }

    useEffect(() => {
        dispatch(actions.reports.listAllReports(defaultFilter))
    },[])

    return (
    
    <>

    <div className={style.reports__nonDue}>

        <FilterModal
            isFilter={isFilterModal}
            setIsFilter={setIsFilterModal}
            type='report'
            options={{
            nonDue:true,
            searchFilter: filter,
            setSearchFilter: setFilter,
            resetFilterOperations : resetFilterReports,
            filterOperationHandler: initiateReportsFiltration
            }}
        />
      
        <ReportFilter
            hidden
            nonDue
            searchFilter={filter}
            setSearchFilter={setFilter}
            resetFilterOperations={resetFilterReports}
            filterOperationHandler={initiateReportsFiltration}
        />
        
        <FilterButton onClick={() => setIsFilterModal(true)}/>

     <Table>
         <thead>
         <th>#</th>
             <th>{t('report-code')}</th>
             <th>{t('first-party')}</th>
             <th>{t('second-party')}</th>
             <th>{t('operation-value')}</th>
             <th>{t('note')}</th>
             <th>{t('currency')}</th>
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
            : reports && reports.map((report, idx) => (
                    <Row
                    key={report._id}
                    idx={idx + skipValue}
                    report={report}
                    />
                 ))
             }
         </tbody>
     </Table>
     {
        count > 0 &&
        <Pagination
        count={Math.ceil(count / 5)}
        moveToPageHandler={(skip) => initiateReportsFiltration(skip)}
        />
      }
    </div>
    
    </>
  )
}

export default NonDueReports