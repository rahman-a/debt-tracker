import React, {useState, useEffect} from 'react'
import style from './style.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import {Notification, Pagination, DropdownMenu, Loader, HeaderAlert} from '../../components'
import {Spinner, CheckDouble, Times, Redo} from '../../icons'
import actions from '../../actions'

const Notifications = () => {
   const [filter, setFilter] = useState(null)
    const dispatch = useDispatch()
    const {loading, error, count, notifications} = useSelector(state => state.listNotifications)

    
    const selectItemHandler = state => {
        setFilter({state})
        dispatch(actions.notifications.listNotification({state}))
    }

    const paginateHandler = skip => {
        filter 
        ? dispatch(actions.notifications.listNotification({...skip, ...filter}))
        :dispatch(actions.notifications.listNotification(skip))
    }
    
    const dropdownData = {
        label:'operation state',
        items: [
            {text:'All', icon:<Redo/>, value:''},
            {text:'Pending', icon:<Spinner/>, value:'pending'},
            {text:'Active', icon:<CheckDouble/>, value:'active'},
            {text:'Decline', icon: <Times/>, value:'decline'},
        ]
    }

    useEffect(() => {
        dispatch(actions.notifications.listNotification())
    },[])

    return (
        <div className={style.notifications}>
            <div className="container">
                <div className={style.notifications__wrapper}>
                    <div className={style.notifications__header}>
                      <h1>Notifications</h1>
                      <div className={style.notifications__dropdown}>
                        {/* {loading && <Loader size='4' options={{animation:'border'}}/>} */}
                        <div className={style.notifications__dropdown_menu}>
                            <DropdownMenu
                                data={dropdownData}
                                onSelectHandler={(value) => selectItemHandler(value)}
                                disabled={loading || error}
                            />
                        </div>
                      </div>
                    </div>
                    <div className={style.notifications__list}>
                        {
                            loading 
                            ?   <Loader size='15' center options={{animation:'border'}}/>
                            : error
                            ?   <HeaderAlert size='2'
                                type='danger' 
                                text={error}/>
                            : notifications && notifications.length > 0 &&
                                notifications.map(notification => (
                                    <Notification key={notification._id} data={{
                                    image:notification.user.avatar 
                                    ? `/api/files/${notification.user.avatar}`
                                    :'/images/photos/photo-1.png',
                                    title:notification.title,
                                    message:notification.body,
                                    date:new Date(notification.createdAt).toLocaleDateString(),
                                    state:notification.operation.state
                                    }}/>
                                ))
                        }

                    </div>
                   {
                   notifications?.length > 0 
                   && <Pagination 
                   count={Math.ceil(count/5)}
                   moveToPageHandler={(skip) => paginateHandler(skip)}/> }
                </div>
            </div>
        </div>
    )
}

export default Notifications
/**
 * <Notification data={{
                            image:'/images/photos/photo-1.png',
                            title:'Operation Initiate',
                            message:'You been selected as second peer (creditor) in an operation',
                            date:'12/01/2022',
                            state:'pending'
                        }}/>
 */