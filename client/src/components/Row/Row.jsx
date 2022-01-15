import React, {useState} from 'react'
import style from './style.module.scss'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {Currency} from '../../components'
import {Copy, Check, Reader} from '../../icons'
import Description from './Description';

const Row = ({record, idx, due, op, closed}) => {
    const [isCopied, setIsCopied] = useState(false)
    const [isDescribeOn, setIsDescribeOn] = useState(false)

    const copyIdHandler = _ => {
        setIsCopied(true)
        setTimeout(() => {
            setIsCopied(false)
        },500)
    }
    
    const getStateColor = state => { 
        const states = {
            pending:'#FBFCD4',
            approved:'#C7FFCE',
            declined:'#FCD4DB',
            active:'#C7FFCE',
            closed:'#FCD4DB'
        }
        return states[state]
    }
    
    return (
        
        <>
        <Description 
        isDescribeOn={isDescribeOn} 
        setIsDescribeOn={setIsDescribeOn}
        />
        
        <tr className={style.row}>
            <td>{idx + 1}</td>
                                    
            {/* Operation Id */}
            <td className={style.row__id}>
                <CopyToClipboard text={record._id} onCopy={copyIdHandler}>
                    <span>
                    {isCopied ? <Check/> :<Copy/>} 
                    </span>
                </CopyToClipboard>
                { record._id.substring(0,12) + '..' }
            </td>
            
            {/* Operation Second Peer Name */}
            <td style={{textTransform:'capitalize'}}>{record.name}</td>
            
            {/* Operation Second Peer Photo */}
            <td style={{padding:'1rem 0'}}>
                <img 
                src={record.image} 
                alt="second peer" 
                className={style.row__photo}/> 
            </td>
            
            {/* Operation Description */}
            <td style={{padding: record.description ? '0' :'2.5rem 0'}}>
                {record.description 
                ? <p className={style.row__desc}> 
                    <span onClick={() => setIsDescribeOn(true)}><Reader/></span> 
                    <i>{record.description.substring(0, 35) + '...' }</i> 
                  </p>  
                : 'N/A'}
            </td>

            {/* Creditor amount value*/}
            <td style={{textTransform:'capitalize'}}>{record.credit}</td>
            
            {/* Debtor amount value*/}
            <td>{record.debt}</td>
            
            {/* Operation Currency [usd, euro, aed]*/}
            <td style={{textAlign:'start', paddingLeft:'1rem'}}>
                <Currency currency={record.currency}/> 
            </td>
            
            {/* Operation State [pending, approved, declined]*/}
           { op && <td style={{
                backgroundColor:getStateColor(record.state),
                textTransform:'uppercase'
                }}>
                {record.state}
            </td> }
            
            {/* Operation Due Date */}
           {(due || closed) 
           && <td
           style={{backgroundColor: record.payment_date ? '#FCD4DB' :'#ff'}}> 
            {
            record.due_date 
            ? record.due_date
            : record.payment_date
            ? record.payment_date
            : 'N/A'} 
            </td>
           } 
        </tr>
        </>
    )
}

export default Row
