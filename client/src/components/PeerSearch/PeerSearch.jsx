import React, {useState} from 'react'
import style from './style.module.scss'
import Input from './Input'
import Filters from './Filters'

const Search = ({setPeerInfo}) => {
    const [filter, setFilter] = useState('username')
    const [searchValue, setSearchValue] = useState('')

    return (
        <div className={style.search}>
            
            <Filters 
            filter={filter} 
            setFilter={setFilter}
            setSearchValue={setSearchValue}/>
            
            <Input 
            filter={filter} 
            setPeerInfo={setPeerInfo}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            />
        </div>
    )
}

export default Search
