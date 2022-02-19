import React, {useState, useEffect} from 'react'
import style from './style.module.scss'
import {useSelector, useDispatch} from 'react-redux'
import {
  AltTable, 
  Pagination, 
  Loader, 
  HeaderAlert,
  FilterButton,
  FilterModal,
  TicketsFilter,
  Replay
} from '../../components'
import {FilterSearch} from '../../icons'
import actions from '../../actions'
import Row from './Row'

const Tickets = () => {
    
    const [isFilterModal, setIsFilterModal] = useState(false)
    const [isEditor, setIsEditor] = useState(false)
    
    const [filter, setFilter] = useState({
      ticket:'',
      title:'',
      isOpen:''
    })
    
    const [skipValue, setSkipValue] = useState(0)
    
    const {user} = useSelector(state => state.login)
    const {loading, error, count, tickets} = useSelector(state => state.listTickets)
    
    const dispatch = useDispatch()
  
    const initiateUsersFiltration = (skip) => {
    
      let query = {...filter}
      
      if(skip?.skip || skip?.skip === 0) {
        setSkipValue(skip.skip)
        query = {...filter, ...skip}
      }
      
      dispatch(actions.tickets.listAllTickets(user._id, query))
    }
  
    const resetFilterOperation = _ => {
      dispatch(actions.tickets.listAllTickets(user._id))
    }
    
    useEffect(() => {
      loading && setIsFilterModal(false)
    },[loading])
    
    useEffect(() => {
      dispatch(actions.tickets.listAllTickets(user._id))
    },[])

    return (
    <>
      <div className={style.tickets}>
          <h1>Tickets Records</h1>

          <div className={style.tickets__wrapper}>
              <div className={style.tickets__actions}>
                  <button onClick={() => setIsEditor(true)}>
                      New Tickets
                  </button>
                  <button className={style.tickets__filter}
                  onClick={() => setIsFilterModal(true)}>
                      <span> <FilterSearch/> </span>
                      <span> Filter </span>
                  </button>
              </div>
          </div>
          
          { isEditor && <Replay setIsEditor={setIsEditor} type='create'/> }
          
          <FilterModal
            isFilter={isFilterModal}
            setIsFilter={setIsFilterModal}
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
    

          <AltTable>
          <thead>
            <tr>
              <th>#</th>
              <th>Ticket Id</th>
              <th style={{width:'25rem'}}>Ticket Summery</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Last updated At</th>
              <th>close the Ticket</th>
            </tr>
          </thead>
          <tbody 
          style={{
            position:'relative',
            height: error ? '5rem' : 'auto'
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
        </AltTable>
        {
          count > 0 &&
          <Pagination
          count={Math.ceil(count / 5)}
          moveToPageHandler={(skip) => initiateUsersFiltration(skip)}
          />
        }
      </div>
    </>
  )
}

export default Tickets