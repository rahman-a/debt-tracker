import React, {useEffect, useState} from 'react'
import style from './style.module.scss'
import {useSelector, useDispatch} from 'react-redux'
import {
  Table, 
  Loader, 
  HeaderAlert, 
  Pagination, 
  FilterButton,
  FilterModal,
  TicketsFilter
} from '../../components'
import actions from '../../actions'
import Row from './Row'
import { useTranslation } from 'react-i18next'

const Support = () => {
  const [isFilterModal, setIsFilterModal] = useState(false)
  const [skipValue, setSkipValue] = useState(0)
  const [filter, setFilter] = useState({
    title:'',
    isOpen:'',
    name:'',
    email:'',
    phone:'',
    code:'',
    username:''
  })
  const {loading, error, tickets, count} = useSelector(state => state.listTickets)
  const dispatch = useDispatch()
  const {t} = useTranslation()
  
  const initiateUsersFiltration = (skip) => {
    
    let query = {...filter}
    
    if(skip?.skip || skip?.skip === 0) {
      setSkipValue(skip.skip)
      query = {...filter, ...skip}
    }
    
    dispatch(actions.tickets.listAllTickets(query))
  }

  const resetFilterOperation = _ => {
    dispatch(actions.tickets.listAllTickets())
  }

  useEffect(() => {
    loading && setIsFilterModal(false)
  },[loading])
  
  useEffect(() => {
    dispatch(actions.tickets.listAllTickets())
  },[])
  
  return (
    <div className={style.support}>
      <h1 className='main-header'> {t('member-ticket-list')} </h1>
      
      <FilterModal
      isFilter={isFilterModal}
      setIsFilter={setIsFilterModal}
      type='ticket'
      options={{
      searchFilter: filter,
      setSearchFilter: setFilter,
      resetFilterOperations : resetFilterOperation,
      filterOperationHandler: initiateUsersFiltration
      }}
      />
      
      <TicketsFilter
      hidden
      searchFilter={filter}
      setSearchFilter={setFilter}
      resetFilterOperations={resetFilterOperation}
      filterOperationHandler={initiateUsersFiltration}
    />
      
      <FilterButton onClick={() => setIsFilterModal(true)}/>
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>{t('ticket-id')}</th>
            <th style={{width:'25rem'}}>{t('member')}</th>
            <th style={{width:'25rem'}}>{t('ticket-summery')}</th>
            <th>{t('status')}</th>
            <th>{t('createdAt')}</th>
            <th>{t('last-updated')}</th>
            <th>{t('close-ticket')}</th>
          </tr>
        </thead>
        <tbody 
        style={{
          position:'relative',
          height: error ? '25rem' : 'auto'
          }}>
          {loading 
            ? <Loader 
            size='6' 
            center
            options={{animation:'border'}} 
            custom={{transform:'unset'}}
            />
            : error 
            ? <HeaderAlert type='danger' size='3' text={error}/>
            : tickets && tickets.map((ticket, idx) => (
              <Row
              key={ticket._id}
              ticket={ticket}
              idx={idx + skipValue}
              />
            ))
          }
        </tbody>
      </Table>
      {
        count > 0 &&
        <Pagination
        count={Math.ceil(count / 10)}
        moveToPageHandler={(skip) => initiateUsersFiltration(skip)}
        />
      }
    </div>
  )
}

export default Support