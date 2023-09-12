import { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Container,
  Flex,
  IconButton,
  useToast,
  VStack,
  Image,
  useDisclosure,
  Button,
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LoginForm, LoginCode, PhoneConfirm, Language } from '@/src/components'
import actions from '@/src/actions'
import constants from '@/src/constants'

export default function Login(props) {
  const [userEmail, setUserEmail] = useState('')
  const [isPhoneNeedVerification, setIsPhoneNeedVerification] = useState(false)
  const [isRememberMe, setIsRememberMe] = useState(false)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { loading, error, userId } = useSelector(
    (state) => state.sendLoginCredentials
  )
  const { loading: LoginCodeLoading, error: loginCodeError } = useSelector(
    (state) => state.sendLoginCode
  )
  const {
    loading: verifyLoginCodeLoading,
    error: verifyLoginCodeError,
    isVerified,
  } = useSelector((state) => state.verifyLoginCode)
  const dispatch = useDispatch()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const submitHandler = async (info) => {
    setUserEmail(info.email)
    dispatch(actions.users.sendLoginCredentials(info))
  }

  const sendLoginCodeHandler = useCallback(() => {
    dispatch(actions.users.sendLoginCode(userId))
  }, [userId])

  const verifyLoginCodeHandler = async (code) => {
    dispatch(
      actions.users.verifyLoginCode(userId, {
        code,
        isRemembered: isRememberMe,
      })
    )
  }

  useEffect(() => {
    if (isVerified) {
      navigate('/operation')
    }
  }, [isVerified])

  useEffect(() => {
    if (error) {
      if (error === 'phone not confirmed' || error === 'الهاتف غير مفعل') {
        setIsPhoneNeedVerification(true)
        onOpen()
        dispatch({ type: constants.users.USER_SEND_CREDENTIALS_RESET })
        return
      }
      toast({
        title: 'Error',
        description: error,
        position: 'top',
        status: 'error',
        duration: 15000,
        isClosable: true,
        onCloseComplete: () => {
          dispatch({ type: constants.users.USER_SEND_CREDENTIALS_RESET })
        },
      })
    }
    if (loginCodeError) {
      toast({
        title: 'Error',
        description: loginCodeError,
        position: 'top',
        status: 'error',
        duration: 15000,
        isClosable: true,
        onCloseComplete: () => {
          dispatch({ type: constants.users.SEND_LOGIN_CODE_RESET })
        },
      })
    }

    if (verifyLoginCodeError) {
      toast({
        title: 'Error',
        description: verifyLoginCodeError,
        position: 'top',
        status: 'error',
        duration: 15000,
        isClosable: true,
        onCloseComplete: () => {
          dispatch({ type: constants.users.VERIFY_LOGIN_CODE_RESET })
        },
      })
    }
  }, [error, loginCodeError, verifyLoginCodeError])

  useEffect(() => {
    if (userId) {
      sendLoginCodeHandler()
    }
  }, [userId, sendLoginCodeHandler])
  return (
    <>
      {isPhoneNeedVerification && (
        <PhoneConfirm isOpen={isOpen} onClose={onClose} email={userEmail} />
      )}
      <Button
        leftIcon={<ArrowBackIcon />}
        color='#000'
        position='absolute'
        top='2rem'
        left='2rem'
        onClick={() =>
          (window.location.href = import.meta.env.VITE_LANDING_PAGE_URL)
        }
      >
        {t('back-home')}
      </Button>
      <Box
        position='absolute'
        top={{ base: '2rem', md: '3.5rem', xl: '5rem' }}
        right={{
          base: '2rem',
          sm: '5rem',
          md: '7rem',
          lg: '10rem',
          xl: '12rem',
        }}
      >
        <Language />
      </Box>
      <Container
        minW='95%'
        minH='100vh'
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
      >
        <Flex
          position='relative'
          width='100%'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          gap={12}
        >
          <Box>
            <Image
              src='/images/logo.svg'
              boxSize='80px'
              alt='skyline'
              width={{ base: '100%', md: '80%', lg: '100%' }}
            />
          </Box>
          {false && (
            <IconButton
              aria-label='back'
              icon={<ArrowBackIcon />}
              position='absolute'
              top='-5rem'
              left='0'
              onClick={() =>
                dispatch({ type: constants.users.USER_SEND_CREDENTIALS_RESET })
              }
            />
          )}
          <VStack
            my={{ base: 8, md: 0 }}
            justifyContent='center'
            alignItems='center'
            width='100%'
          >
            {userId ? (
              <LoginCode
                verifyLoginCodeHandler={verifyLoginCodeHandler}
                verifyLoginCodeLoading={verifyLoginCodeLoading}
                sendCodeLoading={LoginCodeLoading}
                sendLoginCodeHandler={sendLoginCodeHandler}
              />
            ) : (
              <LoginForm
                submitHandler={submitHandler}
                setIsRememberMe={setIsRememberMe}
                isRememberMe={isRememberMe}
                sendingLoginCredentialLoading={loading}
              />
            )}
          </VStack>
        </Flex>
      </Container>
    </>
  )
}
