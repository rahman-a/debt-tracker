import React, {useState} from 'react'
import style from './style.module.scss'
import Input from './Input'
import Filters from './Filters'

const Search = ({setPeerInfo}) => {
    const [filter, setFilter] = useState('username')
    
    return (
        <div className={style.search}>
            <Filters filter={filter} setFilter={setFilter}/>
            <Input filter={filter} setPeerInfo={setPeerInfo}/>
        </div>
    )
}

export default Search
