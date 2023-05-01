import { extendTheme } from '@chakra-ui/react'
import { ButtonStyles as Button } from './components/Button'

const colors = {
  primary: '#21597F',
  secondary: '#3FA5BA',
  variation: '#FFCA24',
  alert: '#E70000',
  surface: '#F9F9F9',
}

const fonts = {
  body: `'Lato', sans-serif`,
  Heading: `'Lato', sans-serif`,
}

export default extendTheme({
  colors,
  fonts,
  components: {
    Button,
  },
})
