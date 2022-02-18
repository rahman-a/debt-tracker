import React from 'react'
import style from './style.module.scss'
import {Input, DropdownMenu} from '../../components'

const TicketsFilter = ({ 
    hidden,
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
            title:'',
            isOpen:'',
            name:'',
            email:'',
            phone:'',
            code:'',
            username:''
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
        onKeyDown={startFilterProcessOnEnter}>
            <div className={style.filter__input}>
                <Input
                name='code'
                type='text'
                placeholder='ticket id...'
                value={searchFilter['code']}
                className={style.filter__input_value}
                onChange={(e) => searchFilterHandler(e)}
                />
            </div>

            <div className={style.filter__input}>
                <Input
                name='title'
                type='text'
                placeholder='title...'
                value={searchFilter['title']}
                className={style.filter__input_value}
                onChange={(e) => searchFilterHandler(e)}
                />
            </div>

            <div className={style.filter__input}>
                <Input
                name='name'
                type='text'
                placeholder='Name...'
                value={searchFilter['name']}
                className={style.filter__input_value}
                onChange={(e) => searchFilterHandler(e)}
                />
            </div>

            <div className={style.filter__input}>
                <Input
                name='username'
                type='text'
                placeholder='Username...'
                value={searchFilter['username']}
                className={style.filter__input_value}
                onChange={(e) => searchFilterHandler(e)}
                />
            </div>

            <div className={style.filter__input}>
                <Input
                name='email'
                type='text'
                placeholder='E-mail...'
                value={searchFilter['email']}
                className={style.filter__input_value}
                onChange={(e) => searchFilterHandler(e)}
                />
            </div>

            <div className={style.filter__input}>
                <Input
                name='phone'
                type='text'
                placeholder='Phone...'
                value={searchFilter['phone']}
                className={style.filter__input_value}
                onChange={(e) => searchFilterHandler(e)}
                />
            </div>


            <div className={style.filter__input}>
                <DropdownMenu
                className={style.filter__input_dropdown}
                onSelectHandler={(value) => selectSearchFilterHandler({isOpen:value})}
                data={{
                    label: 'Status',
                    items:[
                        {text:'Open', value:true},
                        {text:'Solved', value:false}, 
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

export default TicketsFilter
