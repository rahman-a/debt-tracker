import React, {useState} from 'react'
import style from './style.module.scss'
import {Input, DropdownMenu, Currency, Loader} from '../../components'
import {Info, Coins, Calendar, FunnelDollar, HandDollar, HandPlus, Note} from '../../icons'


const Details = ({peerInfo}) => {
    const [loading, setLoading] = useState(false)
    const [peerType, setPeerType] = useState('')
    const [currency, setCurrency] = useState('')
    const [value, setValue] = useState(0)
    const [dueDate, setDueDate] = useState('')

    const CreateOperationHandler = _ => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        },1500)
    }
    
    return (
        <div className={style.details}>
           <div className={style.details__peer}>
                <img src={peerInfo.image} alt={peerInfo.name} />
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
                        {icon:<HandDollar/>, text:'Creditor', value:'Creditor'}, 
                        {icon:<HandPlus/>, text:'Debtor', value:'Debtor'}
                    ]
                }}/>

                <Input
                icon={<FunnelDollar/>}
                placeholder='Type Operation Value'
                type='number'
                label='Operation Value'
                name='value'
                onChange={(e) => setValue(e.target.value)}
                className={style.details__data_value}
                />
                
                <p className={style.details__data_label}>Operation Currency</p>
                <DropdownMenu
                onSelectHandler={(value) => setCurrency(value)}
                data={{
                    label:'Select Operation Currency',
                    icon:<Coins/>,
                    items:[
                        {text:<Currency currency='USD' inline/>, value:'USD'}, 
                        {text:<Currency currency='AED' inline/>, value:'AED'},
                        {text:<Currency currency='EURO' inline/>, value:'EURO'}
                    ]
                }}/>
                
                <p className={style.details__data_label}>Operation Due Date</p>
                <Input
                icon={<Calendar/>}
                placeholder='Select Operation Due Date'
                type='text'
                name='due_date'
                onChange={(e) => setDueDate(e.target.value)}
                className={style.details__data_date}
                />

               <div className={style.details__note}>
                   <span> <Note/> </span>
                   <label htmlFor="note">Operation Note</label>
                   <textarea name="note" id="note"></textarea>
               </div>

                <button 
                className={style.details__data_action}
                onClick={CreateOperationHandler}>
                   {loading 
                   ? <Loader center size='4' options={{animation:'border'}}/> 
                   : <span> Execute </span>}
                </button>
           </div>
        </div>
    )
}

export default Details
