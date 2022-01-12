import React, {useState} from 'react'
import style from './style.module.scss'
import {Plus} from '../../icons'
import {Loader} from '../../components'

const DocumentSegment = ({img, document}) => {
    const [loadingState, setLoadingState] = useState(false)
    
    const uploadDocHandler = e => {
        setLoadingState(true)
        setTimeout(() => {
            setLoadingState(false)
        },1500)
    }
    
    return (
        <div className={style.segment}>
           { img 
            ? <div className={style.segment__doc}>
                <img src={img} alt={document} />
                <p>{document} document</p>
             </div>
            : <div className={style.segment__upload}>
                <label htmlFor="doc">
                   { loadingState 
                   ? <Loader size='8' options={{animation:'border', size:'lg'}} center/>
                   :<>
                    <span> <Plus/> </span>
                    <span>{`upload your ${document}`}</span>
                    </> }
                </label>
                <p>{document} document</p>
                <input type="file" name={document} id='doc' onChange={(e) => uploadDocHandler(e)}/>
            </div> }
        </div>
    )
}

export default DocumentSegment
