import { ChevronDownIcon } from '@chakra-ui/icons'
import { Image, Spinner } from '@chakra-ui/react'
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import i18next from 'i18next'

export default function Language(props) {
  const lang = i18next.language
  const [language, setLanguage] = useState(lang)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const changeLanguageHandler = (lang) => {
    setIsLoading(true)
    setLanguage(lang)
    const changeLanguage = setTimeout(() => {
      dispatch({ type: 'CHANGE_LANGUAGE_HANDLER', payload: lang })
      i18next.changeLanguage(lang)
      setIsLoading(false)
      clearTimeout(changeLanguage)
    }, 500)
  }
  return (
    <Menu>
      <MenuButton size='lg' color='#fff' fontSize='2xl'>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {language === 'en' ? 'English' : 'العربية'} <ChevronDownIcon />
          </>
        )}
      </MenuButton>
      <MenuList color='#fff'>
        <MenuItem
          minH='48px'
          onClick={() => changeLanguageHandler('en')}
          fontSize='2xl'
        >
          <Image
            boxSize='2rem'
            borderRadius='full'
            src='./images/usa.png'
            alt='english language'
            mr='12px'
          />
          <span>English</span>
        </MenuItem>
        <MenuItem
          minH='40px'
          onClick={() => changeLanguageHandler('ar')}
          fontSize='2xl'
        >
          <Image
            boxSize='2rem'
            borderRadius='full'
            src='./images/uae.png'
            alt='arabic language'
            mr='12px'
          />
          <span>العربية</span>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
