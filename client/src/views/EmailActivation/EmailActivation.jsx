import React, {useState, useEffect} from 'react'
import style from './style.module.scss'
import {Loader} from '../../components'
import {Alert} from 'react-bootstrap'
import {useLocation, useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import actions from '../../actions'
import constants from '../../constants'


const VerifyEmail = () => {
    const [width, setWidth] = useState(0)
    const {loading, error, message} = useSelector(state => state.VerifyAuthLink)
    const dispatch = useDispatch()
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const token = params.get('TOKEN')
    const navigate = useNavigate()
    
    const clearAlert = () => {
        dispatch({type: constants.users.VERIFY_AUTH_LINK_RESET})
    }

    useEffect(() => {
        !message 
        && dispatch(actions.users.verifyAuthLink({token, type:'activate'}))
        if(message) {
            const interval = setInterval(() => {
                setWidth(prev => prev + 25)
            }, 1000) 
            setTimeout(() => {
                clearInterval(interval)
                navigate('/login')
            },5000)
        }  
    },[token, navigate, message])
    
    return (
        <div className={style.verify}>
            <div className="container">
            {
            loading 
            ? <Loader 
            size='15' 
            center 
            options={{animation:'border'}}
            custom={{color:'#fff', marginTop:'5rem'}}
            text='E-mail Verification in progress.....'/>
            : error 
            ? <Alert 
            style={{textAlign:'center'}} 
            variant='danger' 
            dismissible 
            onClose={clearAlert}>
                {error}
            </Alert>
            :
            <div 
            style={{textAlign:'center'}}>
                <h1>Congratulation Your E-mail has been verified</h1>
                <div className={style.verify__progress}>
                    <span style={{width: `${width}%`}}></span>
                </div>
                <h4>you will be redirected to home page in 5 seconds</h4>
            </div>
            }      
            </div>
        </div>
    )
}

export default VerifyEmail

