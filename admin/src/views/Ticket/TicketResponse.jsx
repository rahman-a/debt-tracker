import React, {useState} from 'react'
import style from './style.module.scss'
import parser from 'html-react-parser'
import {Badge} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import {Certificate} from '../../icons'
import filePlaceholder from '../../config/filePlaceholder'
import i18next from 'i18next'

const TicketBody = ({data}) => {
    const [isTicketBody, setIsTicketBody] = useState(false)
    const {t} = useTranslation()
    const lang = i18next.language
    
    const displayAsset = file => {
        const anchor = document.createElement('a')
        anchor.href = `/api/files/${file}`
        anchor.target = '_blank'
        anchor.click()
    }


    return (
        <div className={style.ticket__response_block}>
            <div className={`${style.ticket__response_header} ${lang === 'ar' ? style.ticket__response_header_ar :''}`}
            onClick={() => setIsTicketBody(prev => !prev)}>
                <figure>
                    {
                        data.sender === 'member'
                        ? <img src={`/api/files/${data.avatar}`} alt="avatar" />
                        : <span> <Certificate/> </span>
                    } 
                </figure>
                <div>
                <h3>
                    { data.title }
                </h3>
                <span> 
                    <strong>{t('ticket-from')}:</strong>
                    {
                        data.sender === 'member'
                        ? <i> {data.email} </i>
                        : <i>support@swtle.com</i>
                    }
                    
                </span>
                </div>
            </div>
        {
          isTicketBody && 
          <div className={style.ticket__response_body}>
            {
                data.file 
                ? <div className={style.ticket__response_attachment}>
                    <p>{t('ticket-attachment')}</p>
                    <div className={style.ticket__response_attachment_block}
                    onClick={() => displayAsset(data.file)}>
                        <span></span>
                        <figure>
                        <img src={`images/placeholder/${filePlaceholder(data.file)}`} alt="attachment" />
                        </figure>
                    </div>
                </div>
                : <Badge bg='primary'>{t('ticket-no-attachment')}</Badge>
            }
            <div className={style.ticket__response_replay}>
               {parser(data.body)}
            </div>
        </div>
        }
    </div>
  )
}

export default TicketBody