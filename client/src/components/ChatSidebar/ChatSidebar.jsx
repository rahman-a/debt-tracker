import React, {useState, useEffect} from 'react'
import style from './style.module.scss'
import Scrollbar from "simplebar-react";
import { useParams, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import i18next from 'i18next';
import {useTranslation} from 'react-i18next'
import actions from '../../actions'
import constants from '../../constants';
import {ArrowLeft, Close,Magnify, BrokenHeart} from '../../icons'
import {Loader} from '../../components'

const Sidebar = ({socket, unSeenMessage, setUnSeenMessage}) => {
    const [searchValue, setSearchValue] = useState('')
    const [isSearch, setIsSearch] = useState(false)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [peerId, setPeerId] = useState(null)
    const [selected, setSelected] = useState('')
    const [conversations, setConversations] = useState([])
    const navigate = useNavigate()
    const {id} = useParams()
    const dispatch = useDispatch()
    const {user} = useSelector(state => state.login)
    
    const {
        loading:search_loading, 
        error:search_error, 
        conversations:conversationsSearch
    } = useSelector(state => state.searchConversations)
    
    const {
        loading:list_loading, 
        error:list_error, 
        conversations:listConversation
    } = useSelector(state => state.listConversations)

    const {loading:chat_loading, conversation:chat} = useSelector(state => state.listMessages)
    // const {success} = useSelector(state => state.markPeerMessagesAsReceived)
    
    const lang = i18next.language
    const {t} = useTranslation()
    
    const searchHandler = e => {
        if(e.kayCode === 13 || e.which === 13) {
            if(searchValue === '') return 

            //  clear conversations state before search
            dispatch({type:constants.chat.LIST_CONVERSATION_RESET})
            dispatch({type:constants.chat.SEARCH_CONVERSATIONS_RESET})

            dispatch(actions.chat.searchConversations(searchValue))
            return
        }
        e.stopPropagation()   
    }

    const dateFormat = {
        day:'2-digit',
        month:'short',
        year:'numeric'
    }

    const resetSearchHandler = e => {
        setSearchValue('')
        dispatch(actions.chat.listConversation())
        dispatch({type:constants.chat.SEARCH_CONVERSATIONS_RESET})
    }

    const onBlurInputHandler = e => {
        setTimeout(() => {
            setIsSearch(false)
        },500)
    }

    const conversationsMembers = members => {
        if(members) {

            const member = members.find(member =>  member._id !== user._id)
            if(member) {

                return {
                    _id:member._id,
                    name: lang === 'ar' ? member.fullNameInArabic : member.fullNameInEnglish,
                    image: member.avatar
                }
            }
        }
    }

    const loadConversationHandler = (id) => { 
        setUnSeenMessage(null)     
        
        // if no chat loading at all
        if(!chat) {
            dispatch(actions.chat.listMessages(id))
            return
        } 
        // if chat loading and want load another chat  
        if(chat && chat.metadata.conversation !== id) {
            dispatch(actions.chat.listMessages(id))
        }

    }

    const markPeerMessageAsRead = _ => {
        dispatch(actions.chat.markPeerMessagesAsReceived({conversation:id, sender:peerId}))
    }

   /* const markMyMessageAsRead = _ => {
        
        const copiedConversation = chat ?  JSON.parse(JSON.stringify(chat)) : []
        copiedConversation.messages.forEach(message => {
            if(message.sender._id === user._id) {
                message.isReceived = true
            }
        }) 
        
        dispatch({
            type:constants.chat.LIST_CONVERSATION_MESSAGES_SUCCESS,
            payload:copiedConversation
        })
    }*/

    const cutLongText = message => {
        if(message.content?.length > 100) {
            return message.content.substring(0,70) + '....'
        }
        return message.content
    }

    
    useEffect(() => {
        if(conversationsSearch) {
            
            setConversations(conversationsSearch)
        } 
    },[conversationsSearch])

    useEffect(() => {
        if(listConversation) {
            setConversations(listConversation)
        }
    },[listConversation])

    useEffect(() => {
       if(chat) {
        setSelected(chat.metadata.conversation)
        if(conversationsSearch?.length) {
            resetSearchHandler()
        }
        // socket.on('message-has-read', markMyMessageAsRead)
       }
        if(listConversation && chat) {
            const conversation = listConversation.find(conversation => conversation._id === id)
            if(conversation && !conversation?.isRoom) {
                const peerId = conversation.members.find(member => member._id !== user._id)._id
                // set peer here to wait chat to load so i can mark all peer message as read
                setPeerId(peerId)
            }
        } 
    },[chat])

    useEffect(() => {
        id && loadConversationHandler(id)
    },[id])

    useEffect(() => {
        peerId && markPeerMessageAsRead();
    },[peerId])

    // useEffect(() => {
    //     if(success) {
    //         
    //         socket.emit('inform-message-has-read', peerId)
    //     }
    // },[success])

    useEffect(() => {
        dispatch(actions.chat.listConversation())
        socket.on('online', users => {
            setOnlineUsers(users)
        })
    },[])

    return (
    <div className={`${style.sidebar} ${chat ? style.sidebar__off :''}`}>
        
       {chat_loading &&  <div className={style.sidebar__loading}>
            <Loader size='4' center options={{animation:'border'}}/>
        </div> }
        
        
        <header>
            <img src="/images/photos/photo-1.jpg" alt="avatar"/>
        </header>
        <div className={`${style.sidebar__search} ${lang === 'ar' ? style.sidebar__search_ar :''}`}>
            <div>
                
               {isSearch &&  
               <span
                style={{
                    right:lang === 'ar' ? 'unset' :'1rem', 
                    left:lang === 'ar' ? '1rem' :'unset', 
                    cursor:'pointer'
                }}
                onClick={resetSearchHandler}> 
                    <Close/> 
                </span> }
                
                <input 
                type="text" 
                name='search' 
                placeholder={t('start-new-chat')}
                autoComplete='off'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsSearch(true)}
                onBlur={onBlurInputHandler}
                onKeyDown={searchHandler}/>
                
                {
                    isSearch 
                    ? <span 
                        style={{
                            color:'green', 
                            cursor: 'pointer',
                            transform:lang === 'ar' && 'rotate(180deg) translateY(1rem)'
                        }}> 
                        <ArrowLeft/> 
                      </span>
                    : <span style={{color:'#9e9e9e'}}> <Magnify/> </span>
                }
            </div>
        </div>
        <div className={style.sidebar__body}>
            <Scrollbar style={{maxHeight:'calc(100vh - 25.2rem)'}}>
                {
                    
                    (search_loading || list_loading) 
                    ? (
                        <div className={style.sidebar__loading}> 
                            <Loader size='4' options={{animation:'border'}}/> 
                        </div> 
                    )
                    : (list_error || search_error ) 
                    ? (
                        <div className={style.sidebar__fallback}>  
                            
                            {list_error ?
                            (
                                <>  
                                <span> <Magnify/> </span>
                                <p>{list_error}</p>
                                <p>{t('start-search-for-chat')}</p>
                                </>
                            )
                            : search_error 
                            && (
                                <>
                                <span> <BrokenHeart/> </span>
                                <p>{search_error }</p>
                                <p>{t('invalid-search')}</p>
                                </>
                            )
                            }
                        </div>
                    ) 
                : conversations.length > 0 
                && (
                    conversations.map((conversation) => (
                     <div className={`${style.sidebar__body_chat} 
                    ${lang === 'ar' ? style.sidebar__body_chat_ar :''}
                    ${unSeenMessage === conversation._id ? style.sidebar__body_chat_unseen :''}`}
                    style={{backgroundColor: selected === conversation._id ? '#1a374d1a' :'unset'}}
                    key={conversation._id}
                    onClick={() => navigate(`/chat/${conversation._id}`)}>
                    
                        <figure>
                        
                            {/* online badge */}
                            {
                            !conversation.isRoom 
                            && onlineUsers.includes(conversationsMembers(conversation.members)?._id)  
                            && <span style={{display:'inline'}}></span> 
                            }
                            
                            {/* group or member image */}
                            <img src={
                                conversation?.image
                                ?`/api/files/${conversation.image}`
                                : `/api/files/${conversationsMembers(conversation.members).image}`
                            } alt="chat" />
                        </figure>
                        <div className={style.sidebar__body_overview}>
                            <h3>
                                
                                {/* group or member name */}
                                <span> {
                                    conversation?.name 
                                    ? conversation.name 
                                    : conversationsMembers(conversation.members).name
                                } </span> 
                                
                                {/* last time conversation updated */}
                                { conversation.updatedAt && 
                                    <span> {new Date(conversation.updatedAt).toLocaleDateString('en-US', dateFormat)} </span> 
                                }
                            </h3>
                            
                            {/* last message sent to conversation or group */}
                            {conversation.lastMessage && <p>{cutLongText(conversation.lastMessage)}</p>} 
                        </div>
                    </div>) 
                    ))
                }
            </Scrollbar>
        </div>
    </div>
  )
}

export default Sidebar