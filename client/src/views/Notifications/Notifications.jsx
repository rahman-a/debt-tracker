import React, {useState} from 'react'
import style from './style.module.scss'
import {Notification, Pagination, DropdownMenu, Loader} from '../../components'
import {Spinner, CheckDouble, Times} from '../../icons'

const Notifications = () => {
   
    const [loadingState, setLoadingState] = useState(false)
    
    const selectItemHandler = value => {
        setLoadingState(true)
        setTimeout(() => {
            setLoadingState(false)
        },2000)
    }
    
    const dropdownData = {
        label:'operation state',
        items: [
            {text:'Pending', icon:<Spinner/>, value:'pending'},
            {text:'Approved', icon:<CheckDouble/>, value:'approved'},
            {text:'Declined', icon: <Times/>, value:'declined'},
        ]
    }

    return (
        <div className={style.notifications}>
            <div className="container">
                <div className={style.notifications__wrapper}>
                    <div className={style.notifications__header}>
                      <h1>Notifications</h1>
                      <div className={style.notifications__dropdown}>
                        {loadingState && <Loader size='4' options={{animation:'border'}}/>}
                        <div className={style.notifications__dropdown_menu}>
                            <DropdownMenu
                                data={dropdownData}
                                onSelectHandler={(value) => selectItemHandler(value)}
                                disabled={loadingState}
                            />
                        </div>
                      </div>
                    </div>
                    <div className={style.notifications__list}>
                        <Notification data={{
                            image:'/images/photos/photo-1.png',
                            title:'Operation Initiate',
                            message:'You been selected as second peer (creditor) in an operation',
                            date:'12/01/2022',
                            state:'pending'
                        }}/>

                        <Notification data={{
                            image:'/images/photos/photo-1.png',
                            title:'Operation Initiate',
                            message:'You been selected as second peer (creditor) in an operation',
                            date:'12/01/2022',
                            state:'approved'
                        }}/>

                        <Notification data={{
                            image:'/images/photos/photo-1.png',
                            title:'Operation Initiate',
                            message:'You been selected as second peer (creditor) in an operation',
                            date:'12/01/2022',
                            state:'declined'
                        }}/>
                    </div>
                    <Pagination count={5}/>
                </div>
            </div>
        </div>
    )
}

export default Notifications
