import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import style from './style.module.scss'
import {Input, DropdownMenu, Currency, Loader, DateInput} from '../../components'
import {Info, Coins,FunnelDollar, HandDollar, HandPlus, Note} from '../../icons'
import actions from '../../actions'
import constants from '../../constants'

const Details = ({peerInfo}) => {
    const [peerType, setPeerType] = useState('')
    const [currency, setCurrency] = useState('')
    const [value, setValue] = useState(0)
    const [dueDate, setDueDate] = useState(null)
    const [note, setNote] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector(state => state.login)
    const {
        loading:curr_loading, 
        error:curr_error, 
        currencies
    } = useSelector(state => state.listCurrencies)

    const {
        loading, 
        error,
        message
    }  = useSelector(state => state.createOperation)

    const requestCurrenciesHandler = _ => {
        dispatch(actions.currencies.listAllCurrencies())
    }

    
    const listCurrenciesHandler = _ => {
        if(currencies) {
            return currencies.map(currency => (
                {
                    text:<Currency currency={currency} inline/>, 
                    value:currency._id
                }
            ))
        }
        return []
    }

    
    
    const CreateOperationHandler = _ => {
        const data = {
            initiator:{
                user:user._id,
                type: peerType === 'credit' ? 'debt': 'credit',
                value:0
            },
            peer:{
                user:peerInfo._id,
                type:peerType,
                value:parseInt(value)
            },
            note,
            currency,
        }
        if(dueDate) {
            data.dueDate = dueDate.toISOString()
        }

        dispatch(actions.operations.createOperation(data))
    }
    
    useEffect(() => {
        if(message) {
            setTimeout(() => {
                navigate('/operation')
            },3000)
        }    
    },[message])

    useEffect(() => {
        requestCurrenciesHandler()
        return () => dispatch({type:constants.operations.CREATE_OPERATION_RESET})
    },[])

    return (
        <div className={style.details}>
           <div className={style.details__peer}>
                <img src={
                    `/api/files/${peerInfo.image}`
                } alt={peerInfo.name} />
                <h2>{peerInfo.name}</h2>
           </div>
           <div className={style.details__data}>
                
                <p className={style.details__data_label}>Peer Type</p>
                <DropdownMenu
                onSelectHandler={(value) => setPeerType(value)}
                data={{
                    label:'Click to Select Peer Type',
                    icon:<Info/>,
                    items:[
                        {icon:<HandDollar/>, text:'Creditor', value:'credit'}, 
                        {icon:<HandPlus/>, text:'Debtor', value:'debt'}
                    ]
                }}/>

                <Input
                icon={<FunnelDollar/>}
                placeholder='Type Operation Value'
                type='number'
                label='Operation Value'
                name='value'
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={style.details__data_value}
                />
                
                <p className={style.details__data_label}>Operation Currency</p>
                
                <DropdownMenu
                onSelectHandler={(value) => setCurrency(value)}
                loading={curr_loading}
                error={curr_error}
                data={{
                    label:'Select Operation Currency',
                    icon:<Coins/>,
                    items:listCurrenciesHandler()
                }}/>
                
                <p className={style.details__data_label}>Operation Due Date</p>
                <DateInput
                name='dueDate'
                getExpiryDate={(date) => setDueDate(date)}
                custom={{marginLeft:'0'}}
                />

               <div className={style.details__note}>
                   <span> <Note/> </span>
                   <label htmlFor="note">Operation Note</label>
                   <textarea 
                   name="note" 
                   id="note"
                   value={note}
                   onChange={(e) => setNote(e.target.value)}></textarea>
               </div>

                <div style={{
                    display:'flex', 
                    justifyContent:'flex-end',
                    alignItems:'center'
                }}>
                   {error && <p style={{marginRight:'2rem', color:'red'}}>{error}</p> } 
                   {message && <p style={{marginRight:'2rem', color:'green'}}>{message}</p> } 
                    <button 
                    className={style.details__data_action}
                    onClick={CreateOperationHandler}>
                    {loading 
                    ? <Loader center size='4' options={{animation:'border'}}/>
                    : <span> Execute </span>}
                    </button>
                </div>
           </div>
        </div>
    )
}

export default Details
