import constants from "../constants";

const listTickets = (state, action) => {
    const cases = {
        [constants.tickets.LIST_TICKETS_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.tickets.LIST_TICKETS_SUCCESS]: 
        {
            loading:false,
            tickets:action.tickets,
            count:action.count
        },
        [constants.tickets.LIST_TICKETS_FAILS]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.tickets.LIST_TICKETS_RESET]: 
        {
            loading:false,
            tickets:null,
            count:0,
            error:null
        }
    }
    return cases[action.type] || {...state} 
}

const updateTicketState = (state, action) => {
    const cases = {
        [constants.tickets.UPDATE_TICKET_STATE_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.tickets.UPDATE_TICKET_STATE_SUCCESS]: 
        {
            loading:false,
            error:null,
            message:action.payload
        },
        [constants.tickets.UPDATE_TICKET_STATE_FAILS]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.tickets.UPDATE_TICKET_STATE_RESET]: 
        {
            loading:false,
            error:null,
            message:null
        }
    }
    return cases[action.type] || {...state} 
}

const getTicket = (state, action) => {
    const cases = {
        [constants.tickets.GET_TICKET_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.tickets.GET_TICKET_SUCCESS]: 
        {
            loading:false,
            error:null,
            ticket:action.payload
        },
        [constants.tickets.GET_TICKET_FAILS]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.tickets.GET_TICKET_RESET]: 
        {
            loading:false,
            error:null,
            ticket:null
        }
    }
    return cases[action.type] || {...state} 
}

const addTicketReplay = (state, action) => {
    const cases = {
        [constants.tickets.ADD_TICKET_REPLAY_REQUEST]: 
        {
            loading:true,
            error:null
        },
        [constants.tickets.ADD_TICKET_REPLAY_SUCCESS]: 
        {
            loading:false,
            error:null,
            message:action.payload
        },
        [constants.tickets.ADD_TICKET_REPLAY_FAILS]: 
        {
            loading:false,
            error:action.payload
        },
        [constants.tickets.ADD_TICKET_REPLAY_RESET]: 
        {
            loading:false,
            error:null,
            message:null
        }
    }
    
    return cases[action.type] || {...state} 
}

const reducer = {
    listTickets,
    updateTicketState,
    getTicket,
    addTicketReplay
}

export default reducer