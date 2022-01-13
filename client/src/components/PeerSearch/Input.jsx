import React, {useState} from 'react'
import style from './style.module.scss'
import {Loader} from '..'
import peers from './peers'
import {v4 as uuidv4} from 'uuid'

const Input = ({filter, setPeerInfo}) => {
    const [loading, setLoading] = useState(false) 
    const [isPeers, setIsPeers] = useState(false) // for test
    const [error, setError] = useState(null) // for test
    
    const placeholder = {
        username:'search by username',
        mobile:'search by mobile number',
        id:'search by peer id'
    }

    const searchPeersHandler = _ => {
        setIsPeers(false)
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            // setError('This is Error From Server related to peers search')
            setIsPeers(true)
        },2000)
    }

    return (
        <div className={style.search__input}>
            
            <input type="text" placeholder={placeholder[filter]}/>
            <button onClick={searchPeersHandler}>SEARCH</button>
            
            {(loading || error) 
            ? <ul className={style.search__data} style={{overflow:'unset'}}>
                <li style={{border:0}}>
                   {loading
                   ? <Loader center size='4' options={{animation:'grow'}}/>
                   : error && <p style={{color:'red', fontSize:'1.4rem'}}>{error}</p>} 
                </li>    
            </ul>
            
            :peers && isPeers 
            && <ul className={style.search__data} style={{height:'35rem'}}>
                {
                    peers.map(peer => (
                    <li key={uuidv4()}
                    onClick={() => setPeerInfo(peer)}>
                        <img src={peer.image} alt="second peer" />
                        <p>{peer.name}</p>
                    </li>
                    ))
               } 
            </ul>}

        </div>
    )
}

export default Input
