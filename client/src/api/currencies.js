import service from './service'

const currencyAPI = {
    index() {
        return service().get('currencies')
    }
}

export default currencyAPI