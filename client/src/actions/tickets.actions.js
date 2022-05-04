import constants from "../constants";
import api from '../api'


const listAllTickets = (id, query) => async dispatch => {
    dispatch({type:constants.tickets.LIST_TICKETS_REQUEST}) 

    try {
        const {data} = await api.tickets.index(id, query) 
        dispatch({
            type:constants.tickets.LIST_TICKETS_SUCCESS,
            tickets:data.tickets,
            count:data.count
        })
    } catch (error) {
        dispatch({
            type:constants.tickets.LIST_TICKETS_FAILS,
            payload:error.response && error.response.data.message
        })
    }
}

const createNewTicket = info => async (dispatch, getState) => {
    dispatch({type:constants.tickets.CREATE_TICKET_REQUEST}) 
    try {
        const {data} = await api.tickets.create(info) 
        const {tickets, count} = getState().listTickets 
        if(tickets) {
            const newTickets = [data.ticket, ...tickets] 
            dispatch({
                type:constants.tickets.LIST_TICKETS_SUCCESS,
                tickets:newTickets,
                count:count + 1
            })
        }
        dispatch({
            type:constants.tickets.CREATE_TICKET_SUCCESS,
            payload:data.message
        })
    } catch (error) {
        dispatch({
            type:constants.tickets.CREATE_TICKET_FAILS,
            payload:error.response && error.response.data.message
        })
    }
}

const getTicketInformation = id => async dispatch => {
    dispatch({type:constants.tickets.GET_TICKET_REQUEST}) 

    try {
        const {data} = await api.tickets.getTicket(id)
        dispatch({
            type:constants.tickets.GET_TICKET_SUCCESS,
            payload:data.ticket
        })
    } catch (error) {
        dispatch({
            type:constants.tickets.GET_TICKET_FAILS,
            payload:error.response && error.response.data.message
        })
    }
}

const updateTicketStatus = id => async (dispatch, getState) => {
    dispatch({type: constants.tickets.UPDATE_TICKET_STATE_REQUEST}) 

    try {
        const {data} = await api.tickets.updateStatus(id)
        
        const {tickets, count} = getState().listTickets
        
        if(tickets) {
            const ticketIndex = tickets.findIndex(ticket => ticket._id === id)
            let targetTicket = tickets.find(ticket => ticket._id === id)
            let filteredTickets = tickets.filter(ticket => ticket._id !== id) 
            targetTicket.isOpen = false
            filteredTickets.splice(ticketIndex, 0, targetTicket)
            dispatch({
                type:constants.tickets.LIST_TICKETS_SUCCESS,
                tickets:filteredTickets,
                count
            })
        }
        
        dispatch({
            type:constants.tickets.UPDATE_TICKET_STATE_SUCCESS,
            payload:data.message
        })
        
    } catch (error) {
        dispatch({
            type:constants.tickets.UPDATE_TICKET_STATE_FAILS,
            payload:error.response && error.response.data.message
        })
    }
}

const addResponseToTickets = (id, info) => async (dispatch, getState) => {
    dispatch({type:constants.tickets.ADD_TICKET_REPLAY_REQUEST}) 

    try {
        
        const {data} = await api.tickets.addReplay(id, info)
        
        const {ticket} = getState().getTicket 
        
        if(ticket) {
            const copiedTicket = {...ticket}
            copiedTicket.response = copiedTicket.response.concat(data.response)
            copiedTicket.updatedAt = data.updatedAt
            dispatch({
                type:constants.tickets.GET_TICKET_SUCCESS,
                payload:copiedTicket
            })
        }
        
        dispatch({
            type:constants.tickets.ADD_TICKET_REPLAY_SUCCESS,
            payload:data.message
        })
    
    } catch (error) {
        dispatch({
            type:constants.tickets.ADD_TICKET_REPLAY_FAILS,
            payload:error.response && error.response.data.message
        })
    }
}

const actions = {
    addResponseToTickets,
    createNewTicket,
    updateTicketStatus,
    getTicketInformation,
    listAllTickets
}

export default actions