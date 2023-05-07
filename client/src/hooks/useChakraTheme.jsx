import { extendTheme } from '@chakra-ui/react'
import { ButtonStyles as Button } from '../Chakra/components/Button'
import i18next from 'i18next'
const useChakraTheme = () => {
  const lang = i18next.language
  const font = lang === 'ar' ? `'Almarai', sans-serif` : `'Lato', sans-serif`
  const colors = {
    primary: '#21597F',
    secondary: '#3FA5BA',
    variation: '#FFCA24',
    alert: '#E70000',
    surface: '#F9F9F9',
  }

  return extendTheme({
    colors,
    fonts: {
      heading: font,
      body: font,
    },
    direction: lang === 'ar' ? 'rtl' : 'ltr',
    components: {
      Button,
    },
  })
}
export default useChakraTheme
