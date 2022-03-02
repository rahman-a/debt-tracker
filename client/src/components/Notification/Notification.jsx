import React, {useState, useEffect} from 'react'
import style from './style.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import {OperationDecision} from '../../components'
import actions from '../../actions'
import {renderStateMessage} from '../../config/stateMessage'
import DueDateChange from './DueDateChange'

const Notification = ({data}) => {
    const [isStateOn, setIsStateOn] = useState(false)
    const [isDueChange, setIsDueChange] = useState(false)
    const {message} = useSelector(state => state.approveDueDate)

    const dispatch = useDispatch()

    const stateColorStyle = _ => {
        const color = 
        data.state === 'pending'
        ? '#FBFCD4'
        : data.state === 'active'
        ? '#C7FFCE'
        : data.state === 'decline'
        ? '#FCD4DB'
        : '#406882'

        return color
    }

    const takeDecisionHandler = _ => {
        if(data.state === 'pending') {
            setIsStateOn(true)
        } else if(data.report) {
            setIsDueChange(true)
        }
        else {
            dispatch(actions.notifications.updateNotificationState(data.id))
        }
    }

    useEffect(() =>{
     message && dispatch(actions.notifications.updateNotificationState(data.id))
    },[message])

    return (
        <>
           {isStateOn 
           && <OperationDecision 
            show={isStateOn} 
            onHide={() => setIsStateOn(false)}
            id={data.operation}
            notificationId={data.id}
            /> }

            <DueDateChange
            isDueChange={isDueChange}
            setIsDueChange={setIsDueChange}
            report={data.report}
            date={data.payload?.date}
            name={data.payload?.name}
            />


            <div className={style.notification}
                onClick={takeDecisionHandler}
                style={{backgroundColor: data.isRead ? '#fff':'#e7f5ff'}}>
                <img src={data.image} alt={data.title}/>
                <div className={style.notification__content}>
                    <h3>{data.title}</h3>
                    <span>{data.date}</span>
                    <p>{renderStateMessage(data.message, style.notification__report)}</p>
                </div>
                <div className={style.notification__state}
                style={{backgroundColor:stateColorStyle()}}>
                    <p style={{color: data.state ? '#406882' : '#fff'}}>
                        {data.state || 'Notice'}
                    </p>
                </div>
            </div>
        </>
    )
}

export default Notification
