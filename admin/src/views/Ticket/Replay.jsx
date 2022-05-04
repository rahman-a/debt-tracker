import React, {useState,useEffect, useRef} from 'react'
import style from './style.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import {Form, Button} from 'react-bootstrap'
import RichTextEditor from 'react-rte';
import {PaperPlane} from '../../icons'
import {Loader, SideAlert} from '../../components'
import actions from '../../actions';
import constants from '../../constants';
import { useTranslation } from 'react-i18next';

const Replay = ({setIsEditor, id}) => {
    const [title, setTitle]  = useState('')
    const [response, setResponse] = useState(RichTextEditor.createEmptyValue())
    const [file, setFile] = useState(null)
    const [errors, setErrors] = useState(null)
    const attachRef = useRef()
    const dispatch = useDispatch()
    const {loading, error, message} = useSelector(state => state.addTicketReplay)
    const {t} = useTranslation() 
    
    const toolbarConfig = {
        display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS','BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
        INLINE_STYLE_BUTTONS: [
          {label: t('bold'), style: 'BOLD', className: 'custom-css-class'},
          {label: t('italic'), style: 'ITALIC'},
          {label: t('underline'), style: 'UNDERLINE'}
        ],
        BLOCK_TYPE_DROPDOWN: [
          {label: t('normal'), style: 'unstyled'},
          {label: t('large'), style: 'header-one'},
          {label: t('medium'), style: 'header-two'},
          {label: t('small'), style: 'header-three'}
        ],
        BLOCK_TYPE_BUTTONS: [
          {label: t('ul'), style: 'unordered-list-item'},
          {label: t('ol'), style: 'ordered-list-item'}
        ]
    };

    const discardEditorHandler = _ => {
        setIsEditor(false)
        setResponse(RichTextEditor.createEmptyValue())
        attachRef.current.value = null
        setTitle('')
      }
  
      const sendResponseHandler = _ => {
          if(!title) {
            setErrors(t('title-required'))
            return 
          }
          if(response.toString('html').length < 50) {
            setErrors(t('minimum-length'))
            return
          }
          const data = new FormData()
          data.append('title', title)
          data.append('body', response.toString('html'))
          data.append('sender', 'cs')
          if(file) {
            data.append('file', file)
          }
  
          dispatch(actions.tickets.addResponseToTickets(id, data))
      }
  
      useEffect(() => {
        error && setErrors(error)
      },[error])

    return (

    <>
      <SideAlert
      isOn={errors ? true : false}
      type="danger"
      text={errors}
      reset={() => setErrors(null)}
      />

    <SideAlert
      isOn={message ? true : false}
      type="success"
      text={message}
      reset={() => dispatch({type:constants.tickets.ADD_TICKET_REPLAY_RESET})}

      />
    
        <div className={style.ticket__edit}>
                        
            <Form.Group controlId="formFile" className='m-2'>
                <Form.Control 
                type="text" 
                className='mb-3'
                size='lg'
                style={{margin:'1rem 0'}}
                placeholder={t('enter-ticket-title')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}/>
            </Form.Group>
            
            <div className={style.ticket__edit_area}>
                <RichTextEditor
                placeholder={t('enter-ticket-body')}
                toolbarConfig={toolbarConfig}
                value={response}
                onChange={(value) => setResponse(value)} 
                />
            </div>

            <div className={style.ticket__edit_footer}>
            
            <Button variant='dark' onClick={discardEditorHandler}> {t('ticket-discard')} </Button>
            
            <Form.Group controlId="formFile">
                <Form.Control 
                type="file"  
                ref={attachRef}
                onChange={(e) => setFile(e.target.files[0])}/>
            </Form.Group>
            
            <Button 
            variant='success'
            onClick={sendResponseHandler}>
                <span> <PaperPlane/> </span>
                {t('ticket-send')}
            </Button>
            {loading && <Loader size='4' options={{animation:'border'}}/> }
            </div>
        </div>
    </>
  )
}

export default Replay