import React, {useState} from 'react'
import style from './style.module.scss'
import {OperationDecision} from '../../components'

const Notification = ({data}) => {
    const [isStateOn, setIsStateOn] = useState(false)
    
    const stateColorStyle = _ => {
        const color = 
        data.state === 'pending'
        ? '#FBFCD4'
        : data.state === 'approved'
        ? '#C7FFCE'
        : data.state === 'declined'
        && '#FCD4DB'

        return color
    }

    const takeDecisionHandler = _ => {
        if(data.state === 'pending') {
            setIsStateOn(true)
        }
    }

    return (
        <>
            <OperationDecision 
            show={isStateOn} 
            onHide={() => setIsStateOn(false)}
            />
            <div className={style.notification}
                onClick={takeDecisionHandler}>
                <img src={data.image} alt={data.title}/>
                <div className={style.notification__content}>
                    <h3>{data.title}</h3>
                    <span>{data.date}</span>
                    <p>{data.message}</p>
                </div>
                <div className={style.notification__state}
                style={{backgroundColor:stateColorStyle()}}>
                    <p>{data.state}</p>
                </div>
            </div>
        </>
    )
}

export default Notification
