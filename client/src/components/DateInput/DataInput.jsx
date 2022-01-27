import React, {useState} from 'react';
import style from './style.module.scss'
import DatePicker from 'react-date-picker'


const Input = ({name, getExpiryDate, disabled, custom}) => {
  const [date, setDate] = useState(new Date())
  const [zIndex, setZIndex] = useState(1)
  const getDateHandler = value => {
    setDate(value)
    getExpiryDate(value)
  }
  return (
      <div 
      className={style.date} 
      style={{zIndex, ...custom}}>
          <DatePicker
          value={date}
          onChange={(value) => getDateHandler(value)}
          format='dd-M-y'
          minDate={new Date()}
          name={name}
          disabled={disabled}
          onCalendarOpen={() => setZIndex(2)}
          onCalendarClose={() => setZIndex(1)}
          />
      </div>
  )
};

export default Input;
