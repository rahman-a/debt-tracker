import React from 'react'
import style from './style.module.scss'
import {Input, DropdownMenu} from '../../components'

const Filter = ({
    hidden, 
    op, 
    closed,
    isDueDate, 
    filterOperationHandler,
    resetFilterOperations,
    searchFilter,
    setSearchFilter
}) => {
    

    const searchFilterHandler = e => {
        const value = {[e.target.name]: e.target.value}
        setSearchFilter({...searchFilter, ...value})
    }

    const selectSearchFilterHandler = filter => {
        setSearchFilter({...searchFilter, ...filter})
    }

    const resetFilterHandler = _ => {
        const resetFilterObject = {
            code:null,
            type:null,
            name:null,
            currency:null,
            dueDate:null,
            paymentDate:null,
            state:null, 
        }
        setSearchFilter(resetFilterObject)
        resetFilterOperations()
    }

    const startFilterProcessOnEnter = e => {
        if(e.keyCode === 13 || e.which === 13) {
            filterOperationHandler()
        }
    }
    
    return (
        <div className={`${style.filter} ${hidden ? style.filter__hidden :''}`}
        style={{justifyContent:isDueDate ? 'center' :'unset'}}
        onKeyDown={startFilterProcessOnEnter}>
            
            <div className={style.filter__input}>
                <Input
                name='code'
                type='text'
                placeholder='code'
                value={searchFilter.code}
                className={style.filter__input_value}
                onChange={(e) => searchFilterHandler(e)}
                />
            </div>
            
            <div className={style.filter__input}>
                <Input
                name='name'
                type='text'
                placeholder='name'
                value={searchFilter.name}
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
                        {text:'Credit', value:'credit'},
                        {text:'Debt', value:'debt'}
                    ]
                }}
                />
            </div>

            <div className={style.filter__input}>
                <DropdownMenu
                className={style.filter__input_dropdown}
                onSelectHandler={(value) => selectSearchFilterHandler({currency:value})}
                data={{
                    label:'currency',
                    items:[
                    {text:'USD', value:'USD'},
                    {text:'AED', value:'AED'}, 
                    {text:'EURO', value:'EURO'}
                ]
                }}
                />
            </div>

           { op && <div className={style.filter__input}>
                <DropdownMenu
                className={style.filter__input_dropdown}
                onSelectHandler={(value) => selectSearchFilterHandler({state:value})}
                data={{
                    label:'state',
                    items:[
                        {text:'Pending', value:'pending'},
                        {text:'Decline', value:'decline'}]
                }}
                />
            </div> }

         { !isDueDate && <div className={style.filter__input}>
                <DropdownMenu
                className={style.filter__input_dropdown}
                onSelectHandler={(value) => selectSearchFilterHandler(
                    closed ? {paymentDate:value} : {dueDate:value}
                    )}
                data={{
                    label: closed ? 'payment date' : 'due date',
                    items:[
                        {text:'Ascending', value:-1},
                        {text:'Descending', value:1}, 
                    ]
                }}
                />
            </div> }

            <div className={style.filter__input}>
                <button className={style.filter__btn}
                    onClick={filterOperationHandler}>
                        SEARCH
                </button>
                <button className={style.filter__btn}
                    onClick={resetFilterHandler}>
                        RESET
                </button>
            </div>
            
        </div>
    )
}

export default Filter
