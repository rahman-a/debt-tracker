import React from 'react'
import style from './style.module.scss'
import {Input, DropdownMenu, DateInput} from '../../components'

const Filter = ({ 
    hidden,
    filterOperationHandler,
    resetFilterOperations,
    searchFilter,
    setSearchFilter,
    nonDue,
    closed
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
            arabicName:'',
            englishName:'', 
            code:'', 
            value:'',
            currency:'',
            state:'',
            dueDate:'',
        }
        setSearchFilter(resetFilterObject)
        resetFilterOperations()
    }

    const startFilterProcessOnEnter = e => {
        if(e.keyCode === 13 || e.which === 13) {
            filterOperationHandler()
        }
    }

    const filterDateHandler = date => {
        if(closed) {
            setSearchFilter({...searchFilter, paymentDate:date})
        }else {
            setSearchFilter({...searchFilter, dueDate:date})
        }
    }
    
    return (
        <div className={`${style.filter} ${hidden ? style.filter__hidden :''}`}
        onKeyDown={startFilterProcessOnEnter}>
                
                <div className={style.filter__input}>
                    <Input
                    name='code'
                    type='text'
                    placeholder='code...'
                    value={searchFilter['code']}
                    className={style.filter__input_value}
                    onChange={(e) => searchFilterHandler(e)}
                    />
                </div>
            
                <div className={style.filter__input}>
                    <Input
                    name='arabicName'
                    type='text'
                    placeholder='Name ar'
                    value={searchFilter['arabicName']}
                    className={style.filter__input_value}
                    onChange={(e) => searchFilterHandler(e)}
                    />
                </div>
            
                <div className={style.filter__input}>
                    <Input
                    name='englishName'
                    type='text'
                    placeholder='Name en'
                    value={searchFilter['englishName']}
                    className={style.filter__input_value}
                    onChange={(e) => searchFilterHandler(e)}
                    />
                </div>
                
                <div className={style.filter__input}>
                    <Input
                    name='value'
                    type='text'
                    placeholder='value range ex 100:200...'
                    value={searchFilter['value']}
                    className={style.filter__input_value}
                    onChange={(e) => searchFilterHandler(e)}
                    />
                </div>
            
                {
                    !nonDue && 
                        <div className={style.filter__input}>
                            <DateInput
                            custom={{marginLeft:'0', transform:'unset', boxShadow:'1px 2px 3px rgb(0 0 0 / 30%)'}}
                            name='Due Date'
                            getExpiryDate={(date) => filterDateHandler(date)}
                            />
                        </div>
                } 

                <div className={style.filter__input}>
                    <DropdownMenu
                    className={style.filter__input_dropdown}
                    onSelectHandler={(value) => selectSearchFilterHandler({currency:value})}
                    data={{
                        label: 'Currency',
                        items:[
                            {text:'USD', value:'USD'},
                            {text:'EURO', value:'EUR'}, 
                            {text:'AED', value:'AED'}, 
                        ]
                    }}
                    />
                </div>

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
