import React from 'react'

const HeaderAlert = ({ text, type, size, position }) => {
  const getStyle = (_) => {
    return {
      position: position ?? 'absolute',
      top: '70%',
      left: position === 'relative' ? '0' : '50%',
      transform: position === 'relative' ? 'unset' : 'translate(-50%, -50%)',
      fontSize: size ? `${size}rem` : '5rem',
      fontWeight: '200',
      fontStyle: 'italic',
      borderRadius: '2rem',
      padding: '0.5rem 1rem',
      boxShadow: '1px 0px 2px 0px',
      color: type === 'danger' ? '#da0000' : '#329201',
      backgroundColor: type === 'danger' ? '#fef0f0' : '#f1fef0',
    }
  }

  return <h2 style={getStyle()}> {text} </h2>
}

export default HeaderAlert
