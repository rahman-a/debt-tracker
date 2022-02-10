import React from 'react'
import style from './style.module.scss'
import {Input, DropdownMenu} from '../../components'

const Filter = ({ 
    hidden,
    filterOperationHandler,
    resetFilterOperations,
    searchFilter,
    setSearchFilter
}) => {
    
    const colorCode = {
        green:'#037A12',
        yellow:'#C7E81D',
        red:'#EC4A0D'
    }
    const searchFilterHandler = e => {
        let value = {}
        if(e.target.name === 'color') { 
            value = {[e.target.name]: colorCode[e.target.value]}
        } else {
            value = {[e.target.name]: e.target.value}
        }
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
            username:'',
            color:'',
            isProvider:'',
            isActive:'',
            email:'',
            phone:'',
            country:''
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
                placeholder='code...'
                value={searchFilter['code']}
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
                <Input
                name='color'
                type='text'
                placeholder='Color...'
                value={searchFilter['color']}
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
                name='country'
                type='text'
                placeholder='Country...'
                value={searchFilter['country']}
                className={style.filter__input_value}
                onChange={(e) => searchFilterHandler(e)}
                />
            </div>

            <div className={style.filter__input}>
                <DropdownMenu
                className={style.filter__input_dropdown}
                onSelectHandler={(value) => selectSearchFilterHandler({isProvider:value})}
                data={{
                    label: 'Provider',
                    items:[
                        {text:'YES', value:true},
                        {text:'NO', value:false}, 
                    ]
                }}
                />
            </div>

            <div className={style.filter__input}>
                <DropdownMenu
                className={style.filter__input_dropdown}
                onSelectHandler={(value) => selectSearchFilterHandler({isActive:value})}
                data={{
                    label: 'Active',
                    items:[
                        {text:'YES', value:true},
                        {text:'NO', value:false}, 
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
