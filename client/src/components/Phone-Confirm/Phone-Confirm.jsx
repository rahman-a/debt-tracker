import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  HStack,
  Text,
  Heading,
  PinInput,
  PinInputField,
  VStack,
  Spinner,
  Flex,
  useToast,
} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { t } from 'i18next'
import actions from '@/src/actions'
import constants from '@/src/constants'

let isMounted = true
export default function PhoneConfirmModal({ isOpen, onClose, email }) {
  const pinInputRef = useRef(null)
  const [isPhoneVerified, setIsPhoneVerified] = useState(false)
  const { loading, error } = useSelector((state) => state.sendPhoneCode)
  const {
    loading: verifyLoading,
    error: verifyError,
    message: verifyMessage,
  } = useSelector((state) => state.verifyPhoneCode)
  const dispatch = useDispatch()
  const toast = useToast()

  const sendPhoneVerificationCode = useCallback(async () => {
    dispatch(actions.users.sendCodeToPhone(email))
  }, [email, toast])
  const verifyClientPhoneHandler = async (code) => {
    dispatch(actions.users.verifyPhoneCode(code, email))
  }

  const resetHandler = () => {
    setIsPhoneVerified(false)
    onClose()
  }

  useEffect(() => {
    if (error || verifyError) {
      toast({
        title: 'Error',
        description: error || verifyError,
        position: 'top',
        status: 'error',
        duration: 10000,
        isClosable: true,
        onComplete: () => {
          error && dispatch({ type: constants.users.SEND_PHONE_CODE_RESET })
          verifyError &&
            dispatch({ type: constants.users.VERIFY_PHONE_CODE_RESET })
        },
      })
    }
  }, [error, verifyError])

  useEffect(() => {
    if (verifyMessage) {
      setIsPhoneVerified(true)
      dispatch({ type: constants.users.VERIFY_PHONE_CODE_RESET })
    }
  }, [verifyMessage])

  useEffect(() => {
    pinInputRef.current?.focus()
    isMounted && email && sendPhoneVerificationCode()
    return () => {
      isMounted = false
    }
  }, [sendPhoneVerificationCode, email])
  return (
    <Modal size='3xl' isOpen={isOpen} onClose={resetHandler}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color='red.200'>
          {isPhoneVerified ? '' : t('phone-not-verified')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Flex
              justifyContent='center'
              alignItems='center'
              position='relative'
              h={40}
            >
              <Spinner
                color='black'
                size='xl'
                display={true ? 'block' : 'none'}
              />
            </Flex>
          ) : (
            !isPhoneVerified && (
              <VStack spacing={4}>
                <Heading as='h3' fontSize={{ base: 'xl' }} textAlign='center'>
                  {t('verification-code-sent')}
                </Heading>
                <Text>{t('enter-verification-code')}</Text>
                <HStack position='relative'>
                  <PinInput
                    otp
                    variant='filled'
                    focusBorderColor='teal.500'
                    size={{ base: 'md', sm: 'lg' }}
                    onComplete={(code) => verifyClientPhoneHandler(code)}
                    isDisabled={false}
                  >
                    <PinInputField bg='gray.600' ref={pinInputRef} />
                    <PinInputField bg='gray.600' />
                    <PinInputField bg='gray.600' />
                    <PinInputField bg='gray.600' />
                    <PinInputField bg='gray.600' />
                    <PinInputField bg='gray.600' />
                  </PinInput>
                  <Spinner
                    color='gray.500'
                    position='absolute'
                    left='50%'
                    transform='translateX(-50%)'
                    display={false ? 'block' : 'none'}
                  />
                </HStack>
              </VStack>
            )
          )}
          {isPhoneVerified && (
            <VStack spacing={4}>
              <Heading
                color='secondary'
                as='h3'
                fontSize={{ base: 'xl' }}
                textAlign='center'
              >
                {t('phone-has-verified')}
              </Heading>
              <Text>{t('can-login-now')}</Text>
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          {!isPhoneVerified && (
            <Button
              isLoading={verifyLoading}
              isDisabled={loading || verifyLoading}
              variant='primary'
              side='lg'
            >
              {t('phone-verify')}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
