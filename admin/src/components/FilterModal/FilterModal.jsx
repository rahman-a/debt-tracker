import React from 'react';
import style from './style.module.scss'
import {Modal} from 'react-bootstrap'
import {Times} from '../../icons'
import {UserFilter} from '../../components'

const FilterModal = ({isFilter, setIsFilter, type, options}) => {
  return <>
  
  <Modal show={isFilter} onHide={() => setIsFilter(false)}>
    <span className={style.filter}
        onClick={() => setIsFilter(false)}>
        <Times/>
    </span>
    {
        <UserFilter {...options}/>
    }
  </Modal>
  
  </>;
};

export default FilterModal;
