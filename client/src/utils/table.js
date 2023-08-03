export function getUserData(record, type) {
  let user
  if (type === 'credit') {
    user =
      record.initiator?.user?.type === 'credit' ||
      record.operation?.initiator.type === 'credit'
        ? record.initiator?.user || record.operation?.initiator
        : record.peer?.user || record.operation?.peer
  } else if (type === 'debt') {
    user =
      record.initiator?.user?.type === 'debt' ||
      record.operation?.initiator.type === 'debt'
        ? record.initiator?.user || record.operation?.initiator
        : record.peer?.user || record.operation?.peer
  } else {
    return null
  }
  return user
}

export const peerType = (record, user) => {
  const type =
    record.initiator?.user?._id === user._id ||
    record.operation?.initiator?._id === user._id
      ? record.peer?.type || record.operation.peer.type
      : record.peer?.user?._id === user._id ||
        record.operation.peer._id === user._id
      ? record.initiator?.type || record.operation.initiator.type
      : 'N/A'

  return type
}

export const defineValue = (record, type, field) => {
  let value = 0
  if (type === 'credit' && field === 'credit') {
    if (record.credit) {
      value = record.credit
    } else if (record.debt) {
      value = record.debt
    } else if (record.initiator?.value) {
      value = record.initiator?.value
    } else {
      value = record.peer?.value
    }
  } else {
    value = '0.0'
  }

  if (type === 'debt' && field === 'debt') {
    if (record.debt) {
      value = record.debt
    } else if (record.credit) {
      value = record.credit
    } else if (record.initiator?.value) {
      value = record.initiator?.value
    } else {
      value = record.peer?.value
    }
  } else if (field === 'debt') {
    value = '0.0'
  }
  return value
}

export const getMemberName = (record, user, lang) => {
  if (lang === 'ar') {
    return isCurrentUserPeer(record, user)
      ? record.initiator?.user?.fullNameInArabic ||
          record.operation.initiator.fullNameInArabic
      : record.peer?.user?.fullNameInArabic ||
          record.operation.peer.fullNameInArabic
  } else {
    return isCurrentUserPeer(record, user)
      ? record.initiator?.user?.fullNameInEnglish ||
          record.operation.initiator.fullNameInEnglish
      : record.peer?.user?.fullNameInEnglish ||
          record.operation.peer.fullNameInEnglish
  }
}

export const getPeerId = (record, user) => {
  const id = isCurrentUserPeer(record, user)
    ? record.initiator?.user?._id || record.operation.initiator._id
    : record.peer?.user?._id || record.operation.peer._id

  return id
}

export const formatFineAmount = (fine) => {
  if (!fine?.amount) return null
  return `${fine.amount.toFixed(2)}`
}

export const getStateColor = (state) => {
  const states = {
    pending: '#FBFCD4',
    approved: '#C7FFCE',
    decline: '#FCD4DB',
    active: '#C7FFCE',
    closed: '#FCD4DB',
  }
  return states[state]
}

export function isCurrentUserPeer(record, user) {
  return (
    record.peer?.user?._id === user._id ||
    record.operation?.peer?._id === user._id
  )
}

export const isCurrentUserCredit = (record, op, user) => {
  if (!op) {
    const creditor =
      record.operation.initiator.type === 'credit'
        ? record.operation.initiator._id
        : record.operation.peer._id
    if (creditor === user._id) return true
  }

  return false
}

export const formatPaymentDate = (date, lang) => {
  if (!date) return null
  const locale = lang === 'ar' ? 'ar-EG' : 'en-US'
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
    timeZone: 'Asia/Dubai',
  }
  const dateObj = new Date(date)
  const formattedDate = new Intl.DateTimeFormat(locale, options).format(dateObj)
  return formattedDate
}
