import React, {useState, useEffect} from 'react';
import style from './style.module.scss'
import {useSelector, useDispatch} from 'react-redux'
import {v4 as uuidv4} from 'uuid'
import actions from '../../actions'
import {Cogs, CashRegister, HandshakeSlash, AddressCard, Help, Times} from '../../icons'
import {Loader} from '../../components'
import Segment from './Segment'
import {PieChart} from './Pie'
import Timeline from './Timeline';
import LoadingSegment from './loadingSegment'
import LoadingTimeLine from './LoadingTimeLine';

const Home = () => {
  const dispatch = useDispatch()
  const {loading, info} = useSelector(state => state.appInfo)
  
  const {
    loading:members_loading,
    members 
  } = useSelector(state => state.latestMembers)

  const {
    loading:tickets_loading,
    tickets 
  } = useSelector(state => state.latestTickets)
  
  const {
    loading:operations_loading,
    operations 
  } = useSelector(state => state.latestOperations)
  
  const {
    loading:reports_loading,
    reports 
  } = useSelector(state => state.latestReports)
  
  const segments = [
    {
      id:uuidv4(),
      title:'Pending Operation',
      icon:<Cogs/>,
      type:'primary',
      value:info?.pending
    },
    {
      id:uuidv4(),
      title:'Declined Operation',
      icon:<Times/>,
      type:'danger',
      value:info?.declined
    },
    {
      id:uuidv4(),
      title:'Active Reports',
      icon:<CashRegister/>,
      type:'success',
      value:info?.active
    },
    {
      id:uuidv4(),
      title:'Closed Reports',
      icon:<HandshakeSlash/>,
      type:'dark',
      value:info?.closed
    },
    {
      id:uuidv4(),
      title:'Active Members',
      icon:<AddressCard/>,
      type:'info',
      value:info?.members
    },
    {
      id:uuidv4(),
      title:'Open Tickets',
      icon:<Help/>,
      type:'warning',
      value:info?.tickets
    },
    
  ]
  
  useEffect(() => {
    dispatch(actions.admin.appInfo())
    dispatch(actions.admin.latestMembers())
    dispatch(actions.admin.latestTickets())
    dispatch(actions.admin.latestOperations())
    dispatch(actions.admin.latestReports())
  },[])

  return (
    <div className={style.dashboard}>
      
      <div className={style.dashboard__overview}>
       {
         loading 
         ? [...Array(segments.length)].map(_ => (
           <LoadingSegment key={uuidv4()}/>
         ))
         : info && segments.map(({id, type,value,title,icon}) => (
            <Segment
            key={id} 
            type={type}
            value={value} 
            title={title} 
            icon={icon} />
         ))
       }
      </div>
      
      
      <div className={style.dashboard__container}>
        <div className={style.dashboard__info}>
          <div className={style.dashboard__pie}>
            <h2>Last Week Listed Operations</h2>
            {
                operations_loading 
                ? <Loader size='8' options={{animation:'border'}}/>
                : operations && <PieChart values={operations}/>
              }
          </div>
          <div className={style.dashboard__timeline}>
                <h2>Latest Registered Members</h2>
                
                {
                  members_loading 
                  ? [...Array(5)].map(_ => (
                    <LoadingTimeLine key={uuidv4()}/>
                  ))
                  : members && members.map(member => (
                    <Timeline 
                    key={member._id} 
                    name={member.fullNameInEnglish}
                    date={member.createdAt}
                   />
                  ))
                }
            </div>
        </div>
        <div className={style.dashboard__info}>
            <div className={style.dashboard__pie}>
              <h2>Last Week Listed Reports</h2>
              {
                reports_loading 
                ? <Loader size='8' options={{animation:'border'}}/>
                : reports && <PieChart values={reports}/>
              }
              
            </div>
            <div className={style.dashboard__timeline}>
                <h2>Latest Issued Tickets</h2>
                
                {
                  tickets_loading 
                  ? [...Array(5)].map(_ => (
                    <LoadingTimeLine key={uuidv4()}/>
                  ))
                  : tickets && tickets.map(ticket => (
                    <Timeline 
                    key={ticket._id} 
                    name={ticket.title}
                    date={ticket.createdAt}
                    type='ticket'
                   />
                  ))
                }
            </div>
        </div>
      </div>
    </div>
  )
};

export default Home;
