import React, {useState} from 'react'
import style from './style.module.scss'
import {Button, Form, Alert} from 'react-bootstrap'
import {useLocation} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {Loader} from '../../components'
import actions from '../../actions'
import constants from '../../constants'

const ResetEmail = () => {
    const [resetPassword, setResetPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const {loading, error, message} = useSelector(state => state.VerifyAuthLink)
    const dispatch = useDispatch()
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const token = params.get('TOKEN')
    
    const clearAlert = () => {
        dispatch({type: constants.users.VERIFY_AUTH_LINK_RESET})
    }

    const submitFormData = e => {
        e.preventDefault()
        if(!token) {
            setErrorMessage('The Token is Invalid')
            return
        }
        if(resetPassword !== confirmPassword) {
            setErrorMessage('The Password doesn\'t match')
            return
        }
        dispatch(actions.users.verifyAuthLink({type:'reset', token, password:resetPassword}))
    }
   
    return (
        <div className={style.reset}>
            <div className="container">
            <div style={{maxWidth:'50rem', margin:'0 auto'}}>
                {
                    loading 
                    ? <Loader 
                    size='5' 
                    center 
                    custom={{color:'#fff', marginTop:'5rem'}}
                    options={{animation:'border'}}/>
                    : errorMessage 
                    ? <Alert 
                    variant='danger' 
                    style={{textAlign:'center'}} 
                    dismissible 
                    onClose={() => setErrorMessage(null)}>
                        {errorMessage}
                    </Alert>
                    : error 
                    ? <Alert 
                    variant='danger' 
                    style={{textAlign:'center'}} 
                    dismissible 
                    onClose={clearAlert}>
                        {error}
                    </Alert>
                    : message 
                    && <Alert 
                    variant='success' 
                    style={{textAlign:'center'}}>
                       Congratulation, Password has been Reset
                    </Alert> 
                }
            </div>
            
            <div style={{textAlign:'center'}}>
                <Form onSubmit={submitFormData} 
                style={{
                    maxWidth:'50rem', 
                    margin:'2rem auto', 
                }}>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Enter Your Password</Form.Label>
                        <Form.Control
                        onChange={(e) => setResetPassword(e.target.value)}
                        size='lg' 
                        type="password" 
                        placeholder='Enter Your Password' />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                        <Form.Label>Enter Your Password Again</Form.Label>
                        <Form.Control
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        size='lg' 
                        type="password" 
                        placeholder='Enter Your Password Again' />
                    </Form.Group>
                    <Button disabled={loading ? true : false} 
                    variant="light" 
                    type="submit" 
                    size='lg'>
                       'submit'
                    </Button>
                </Form>
            </div>       
            </div>
        </div>
    )
}

export default ResetEmail
