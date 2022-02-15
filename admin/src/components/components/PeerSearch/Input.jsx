import React, {useEffect} from 'react'
import style from './style.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import actions from '../../actions'
import constants from '../../constants'
import {Loader} from '..'

const Input = ({ 
    filter, 
    setPeerInfo, 
    searchValue, 
    setSearchValue
}) => { 
    
    const {loading, error, users} = useSelector(state => state.searchUsers)
    const dispatch = useDispatch()

    const placeholder = {
        username:'search by username',
        mobile:'search by mobile number',
        code:'search by user code'
    }

    const searchPeersHandler = _ => {
        dispatch(actions.users.SearchForUsers({[filter]:searchValue}))
        setSearchValue('')
    }

    useEffect(() => {
        return () => {
            dispatch({type:constants.users.USERS_SEARCH_RESET})
        }
    },[])

    return (
        <div className={style.search__input}>
            
            <input 
            type="text" 
            placeholder={placeholder[filter]}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            />
            
            <button 
            onClick={searchPeersHandler}>
                SEARCH
            </button>
            
            {(loading || error) 
            ? <ul className={style.search__data} style={{overflow:'unset'}}>
                <li style={{border:0}}>
                   {loading
                   ? <Loader center size='4' options={{animation:'grow'}}/>
                   : error && <p style={{color:'red', fontSize:'1.4rem'}}>{error}</p>} 
                </li>    
            </ul>
            
            :users && users 
            && <ul className={style.search__data}>
                {
                    users.map(user => (
                    <li key={user._id}
                    onClick={() => setPeerInfo(user)}>
                        <img src={`/api/files/${user.image}`} alt="second peer" />
                        <p>{user.name}</p>
                    </li>
                    ))
               } 
            </ul>}

        </div>
    )
}

export default Input
