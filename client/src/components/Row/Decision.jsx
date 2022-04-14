import React from 'react'
import style from './style.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../../actions'
import constants from '../../constants'
import {Check, Times} from '../../icons'
import {Loader, SideAlert} from '../../components'

const Decision = ({id}) => {
    const {loading, error, message } = useSelector(state => state.updateOperationState)
    const dispatch = useDispatch()
    
    const declineOperationHandler = _ => {
        dispatch(actions.operations.updateOperationState(id, undefined, 'decline'))
    }

    const approveOperationHandler = _ => {
        dispatch(actions.operations.updateOperationState(id, undefined, 'active'))
    }
    
    const clearAlert = _ => {
        dispatch({type: constants.operations.UPDATE_OPERATION_STATE_RESET})
    }
    
    return (
    <>
    
    <SideAlert
    type="success"
    isOn={message ? true : false}
    text={message}
    reset={() => clearAlert()}
    />

    <SideAlert
        type="danger"
        isOn={error ? true : false}
        text={error}
        reset={() => clearAlert()}
    />

    <span className={style.row__decision}>
        {
            loading 
            ? (
            <Loader 
                size="4" 
                center 
                options={{animation:'border'}} 
                custom={{color:'#fff'}}/>
            )
            : (
                <> 
                    <span onClick={approveOperationHandler}> <Check /> </span>
                    <span onClick={declineOperationHandler}> <Times/> </span> 
                </>
            )
        }
        
        
    </span>
    </>
  )
}

export default Decision