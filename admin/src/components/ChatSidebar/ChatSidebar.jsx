import React, {useState, useEffect} from 'react'
import style from './ChatSidebar.module.scss'
import Scrollbar from "simplebar-react";
import {useDispatch, useSelector} from 'react-redux'
import actions from '../../actions'
import {ArrowLeft, Close, PlusLight, Magnify} from '../../icons'

import RoomCreationProcess from './RoomCreationProcess'

const Sidebar = () => {
    const [isRoomCreation, setIsRoomCreation] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [isSearch, setIsSearch] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const dispatch = useDispatch()
    const {loading, error, output} = useSelector(state => state.searchConversations)
    
    const searchHandler = e => {
        if(e.kayCode === 13 || e.which === 13) {
            if(searchValue === '') return setIsSearching(false)
            setIsSearching(true)
            
            dispatch(actions.chat.searchConversations(searchValue))
            return
        }

        e.stopPropagation()
        
    }

    const resetSearchHandler = e => {
        setIsSearching(false)
        setSearchValue('')
    }

    const onBlurInputHandler = e => {
        setTimeout(() => {
            setIsSearch(false)
    },500)
}

    useEffect(() => {
      output && console.log({output});
    },[output])

    return (
    <div className={style.sidebar}>
        
        <RoomCreationProcess
        isRoomCreation={isRoomCreation}
        setIsRoomCreation={setIsRoomCreation}
        />
        
        <header>
            <img src="/images/photos/photo-1.jpg" alt="avatar"/>
            <button onClick={() => setIsRoomCreation(true)}>
                <span> <PlusLight/> </span>
            </button>
        </header>
        <div className={style.sidebar__search}>
            <div>
                
               {isSearch &&  <span
                style={{right:'1rem', left:'unset', cursor:'pointer'}}
                onClick={resetSearchHandler}> 
                    <Close/> 
                </span> }
                
                <input 
                type="text" 
                name='search' 
                placeholder='start a new chat...'
                autoComplete='off'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsSearch(true)}
                onBlur={onBlurInputHandler}
                onKeyDown={searchHandler}/>
                
                {
                    isSearch 
                    ? <span 
                        style={{color:'green', cursor: 'pointer'}}> 
                        <ArrowLeft/> 
                      </span>
                    : <span style={{color:'#9e9e9e'}}> <Magnify/> </span>
                }
            </div>
        </div>
            <div className={style.sidebar__body}>
                <Scrollbar style={{maxHeight:'calc(100vh - 25.2rem)'}}>
                    {
                        [...Array(10)].map((_, idx) => (
                        <div className={style.sidebar__body_chat} key={idx}>
                            <figure>
                                <img src={`/images/photos/photo-${idx+1}.jpg`} alt="chat" />
                            </figure>
                            <div className={style.sidebar__body_overview}>
                                <h3>
                                    <span style={{
                                        display:idx === 2 ? 'inline' : 'none'
                                    }}></span>
                                    <span> Ahmed Abdelrahman </span> 
                                    <span> 23/2/2022 </span> 
                                </h3>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates, natus.</p>
                            </div>
                        </div>
                        ))
                    }
                </Scrollbar>
            </div>
    </div>
  )
}

export default Sidebar