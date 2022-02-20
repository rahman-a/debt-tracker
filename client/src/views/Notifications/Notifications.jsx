import React, {useState, useEffect} from 'react'
import style from './style.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import {Notification, Pagination, DropdownMenu, Loader, HeaderAlert} from '../../components'
import {Spinner, CheckDouble, Times, Redo} from '../../icons'
import actions from '../../actions'

const Notifications = () => {
    const [filter, setFilter] = useState(null)
    const [skip, setSkip] = useState(0)
    const [resetPagination, setResetPagination] = useState(false)
    const dispatch = useDispatch()
    const {loading, error, count, notifications} = useSelector(state => state.listNotifications)
    const {message} = useSelector(state => state.updateOperationState)

    
    const selectItemHandler = state => {
        !state && setResetPagination(true)
        setFilter({state})
        dispatch(actions.notifications.listNotification({state}))
    }

    const paginateHandler = skip => {
        setSkip(skip.skip)
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
    notifications && setResetPagination(false)
    },[notifications])

    useEffect(() => {
        !message && dispatch(actions.notifications.listNotification({skip}))
        message && setTimeout(() => {
            dispatch(actions.notifications.listNotification())
        },2000);
    },[message])

    return (
        <div className={style.notifications}>
            <div className="container">
                <div className={style.notifications__wrapper}>
                    <div className={style.notifications__header}>
                      <h1>Notifications</h1>
                      <div className={style.notifications__dropdown}>
                        {loading && <Loader size='4' options={{animation:'border'}}/>}
                        <div className={style.notifications__dropdown_menu}>
                            <DropdownMenu
                                data={dropdownData}
                                onSelectHandler={(value) => selectItemHandler(value)}
                                disabled={loading}
                            />
                        </div>
                      </div>
                    </div>
                        <div className={style.notifications__list}
                        style={{height:loading ? '75vh' :'unset'}}>
                            {loading && <Loader size='15' center options={{animation:'border'}}/>}
                            { (error || notifications?.length < 1)
                            &&  <HeaderAlert size='2'
                                type='danger' 
                                text={error || 'No Notifications Found'}/> 
                            }
                            {
                               notifications && notifications.length > 0 &&
                                notifications.map(notification => (
                                    <Notification key={notification._id}
                                    data={{
                                    id:notification._id,
                                    isRead:notification.isRead,
                                    image:notification.user.avatar 
                                    ? `/api/files/${notification.user.avatar}`
                                    :'/images/photos/photo-1.png',
                                    title:notification.title,
                                    message:notification.body,
                                    operation:notification.operation?._id 
                                    ? notification.operation?._id 
                                    :null,
                                    date:new Date(notification.createdAt).toLocaleDateString(),
                                    state:notification.operation?.state
                                    ? notification.operation?.state
                                    : null
                                    }}/>
                                ))
                            }
                        </div>
                   
                  { !loading && !error && <Pagination 
                    count={Math.ceil(count/5)}
                    resetPagination={resetPagination}
                    moveToPageHandler={(skip) => paginateHandler(skip)}/>
                  }
                </div>
            </div>
        </div>
    )
}

export default Notifications