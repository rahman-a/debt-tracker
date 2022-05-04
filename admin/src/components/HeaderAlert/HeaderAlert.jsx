import React from 'react'

const HeaderAlert = ({ text, type, size, custom }) => {
  const getStyle = (_) => {
    return {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: size ? `${size}rem` : '5rem',
      fontWeight: '200',
      fontStyle: 'italic',
      borderRadius: '2rem',
      padding: '0.5rem 1rem',
      boxShadow: '1px 0px 2px 0px',
      color: type === 'danger' ? '#da0000' : '#329201',
      backgroundColor: type === 'danger' ? '#fef0f0' : '#f1fef0',
      ...custom,
    }
  }

  return <h1 style={getStyle()}> {text} </h1>
}

export default HeaderAlert
