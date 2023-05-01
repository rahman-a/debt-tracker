import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { AtSignIcon, CheckCircleIcon } from '@chakra-ui/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import actions from '../../actions'
import constants from '../../constants'

export default function ForgetPassword({ isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: {
      email: '',
    },
  })
  const [isLinkSent, setIsLinkSent] = useState(false)
  const { t } = useTranslation()
  const lang = i18next.language
  const { loading, error, message } = useSelector(
    (state) => state.sendResetLink
  )
  const dispatch = useDispatch()
  const toast = useToast()

  const resetHandler = () => {
    setIsLinkSent(false)
    onClose()
  }
  const resetPasswordHandler = async (info) => {
    dispatch(actions.users.sendResetLink(info.email))
  }
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error.response.data.message,
        position: 'top-left',
        status: 'error',
        duration: 15000,
        isClosable: true,
        onCloseComplete: () => {
          dispatch({ type: constants.users.SEND_RESET_LINK_RESET })
        },
      })
    }
    if (message) {
      setIsLinkSent(true)
      dispatch({ type: constants.users.SEND_RESET_LINK_RESET })
    }
  }, [error, message])
  return (
    <Modal
      size='4xl'
      blockScrollOnMount={true}
      isOpen={isOpen}
      onClose={resetHandler}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isLinkSent ? '' : t('reset-pass')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLinkSent ? (
            <Text as='p' fontSize='xl' color='#fff' textAlign='center' mx={2}>
              <CheckCircleIcon color='green.500' />{' '}
              {t('reset-link-sent-to-email')}
            </Text>
          ) : (
            <>
              <Text as='p' color='gray.400' textAlign='center' mb='1rem'>
                {t('enter-email-reset-pass')}
              </Text>
              <form
                style={{ width: '90%', margin: '0 1rem' }}
                onSubmit={(e) => e.preventDefault()}
                noValidate
              >
                <FormControl
                  isRequired
                  id='email'
                  isInvalid={!!errors.email?.message}
                >
                  <InputGroup>
                    <InputLeftElement pointerEvents='none'>
                      <AtSignIcon color='gray.300' />
                    </InputLeftElement>
                    <Input
                      type='email'
                      size='lg'
                      variant='filled'
                      color='#000'
                      _focus={{ color: '#fff' }}
                      py={6}
                      placeholder={`${t('enter-email')} *`}
                      {...register('email', {
                        required: t('please-enter-email'),
                      })}
                    />
                  </InputGroup>
                  {errors.email?.message && (
                    <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                  )}
                </FormControl>
              </form>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {!isLinkSent && (
            <>
              <Button
                color='#fff'
                colorScheme='gray.700'
                size='lg'
                mr={3}
                onClick={onClose}
                isDisabled={loading}
              >
                {t('close')}
              </Button>
              <Button
                onClick={handleSubmit(resetPasswordHandler)}
                variant='primary'
                size='lg'
                isLoading={loading}
              >
                {t('send-email')}
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
