import React, {useState} from 'react'
import style from './style.module.scss'
import {Input, DropdownMenu} from '../../components'

const Filter = ({hidden}) => {
    const [searchFilter, setSearchFilter] = useState({
        code:'',
        name:'',
        type:'',
        currency:'',
        due:'',
        state:''
    })

    const searchFilterHandler = e => {
        const value = {[e.target.name]: e.target.value}
        setSearchFilter({...setSearchFilter, ...value})
    }

    const selectSearchFilterHandler = filter => {
        if(filter.value !== 'custom') {
            setSearchFilter({...searchFilter, ...filter})
        }
    }
    
    const searchHandler = _ => {
        console.log(searchFilter);
    }

    return (
        <div className={`${style.filter} ${hidden ? style.filter__hidden :''}`}>
            <div className={style.filter__input}>
                <Input
                name='code'
                type='text'
                placeholder='code'
                className={style.filter__input_value}
                onChange={(e) => searchFilterHandler(e)}
                />
            </div>
            
            <div className={style.filter__input}>
                <Input
                name='name'
                type='text'
                placeholder='name'
                className={style.filter__input_value}
                onChange={(e) => searchFilterHandler(e)}
                />
            </div>

            <div className={style.filter__input}>
                <DropdownMenu
                onSelectHandler={(value) => selectSearchFilterHandler({type:value})}
                data={{
                    label:'type',
                    items:[
                        {text:'Creditor', value:'creditor'},
                        {text:'Debtor', value:'debtor'}
                    ]
                }}
                />
            </div>

            <div className={style.filter__input}>
                <DropdownMenu
                className={style.filter__input_dropdown}
                onSelectHandler={(value) => selectSearchFilterHandler({currency:value})}
                data={{
                    label:'Currency',
                    items:[
                        {text:'USD', value:'USD'},
                        {text:'AED', value:'AED'}, 
                        {text:'EURO', value:'EURO'}]
                }}
                />
            </div>

            <div className={style.filter__input}>
                <DropdownMenu
                className={style.filter__input_dropdown}
                onSelectHandler={(value) => selectSearchFilterHandler({state:value})}
                data={{
                    label:'state',
                    items:[
                        {text:'Pending', value:'pending'},
                        {text:'Approved', value:'approved'}, 
                        {text:'Declined', value:'declined'}]
                }}
                />
            </div>

            <div className={style.filter__input}>
                <DropdownMenu
                className={style.filter__input_dropdown}
                onSelectHandler={(value) => selectSearchFilterHandler({date:value})}
                data={{
                    label:'due date',
                    items:[
                        {text:'Ascending', value:'ascending'},
                        {text:'Descending', value:'descending'}, 
                        {text:'custom...', value:'custom'}
                    ]
                }}
                />
            </div>

            <div className={style.filter__input}>
                <button className={style.filter__btn}
                    onClick={searchHandler}>
                        SEARCH
                </button>
            </div>
        </div>
    )
}

export default Filter
