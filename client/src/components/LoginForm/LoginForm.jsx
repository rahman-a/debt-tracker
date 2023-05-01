import { useState } from 'react'
import { AtSignIcon, LockIcon } from '@chakra-ui/icons'
import {
  Button,
  Checkbox,
  Image,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  VStack,
  useDisclosure,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { useNavigate } from 'react-router-dom'
import { EyeIcon, EyeSlashIcon } from '../../icons'
import ResetPassword from '../SendResetPasswordLink/SendResetPasswordLink'

export default function LoginForm({
  submitHandler,
  setIsRememberMe,
  isRememberMe,
  sendingLoginCredentialLoading,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { t } = useTranslation()
  const lang = i18next.language
  const navigate = useNavigate()
  const formWidth = useBreakpointValue({
    base: '100%',
    sm: '80%',
    md: '50%',
    lg: '35%',
  })
  const formStyle = {
    width: formWidth,
    margin: 0,
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
    },
  })
  return (
    <>
      <ResetPassword isOpen={isOpen} onClose={onClose} />
      <form style={formStyle} onSubmit={handleSubmit(submitHandler)} noValidate>
        <FormControl
          isRequired
          id='email'
          isInvalid={!!errors.email?.message}
          mb='5'
        >
          <InputGroup>
            <InputLeftElement mt={2} pointerEvents='none'>
              <AtSignIcon boxSize='6' color='gray.800' />
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
                validate: (value) => {
                  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                  return regex.test(value) || t('enter-valid-email')
                },
              })}
            />
          </InputGroup>
          {errors.email?.message && (
            <FormErrorMessage
              flexDirection={lang === 'en' ? 'row' : 'row-reverse'}
              fontSize='xl'
            >
              {errors.email?.message}
            </FormErrorMessage>
          )}
        </FormControl>
        <FormControl
          isRequired
          id='password'
          isInvalid={!!errors.password?.message}
        >
          <InputGroup>
            <InputLeftElement mt={2} pointerEvents='none'>
              <LockIcon boxSize='6' color='gray.800' />
            </InputLeftElement>
            <Input
              type={isPasswordVisible ? 'text' : 'password'}
              size='lg'
              variant='filled'
              color='#000'
              _focus={{ color: '#fff' }}
              py={6}
              placeholder={`${t('enter-pass')} *`}
              {...register('password', {
                required: t('please-enter-pass'),
                validate: (value) => {
                  const regex = /[-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]/
                  return !regex.test(value) || t('enter-valid-pass')
                },
              })}
            />
            <InputRightElement
              cursor='pointer'
              mt={2}
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? (
                <EyeIcon color='gray.600' boxSize={6} />
              ) : (
                <EyeSlashIcon color='gray.600' boxSize={6} />
              )}
            </InputRightElement>
          </InputGroup>
          {errors.password?.message && (
            <FormErrorMessage
              flexDirection={lang === 'en' ? 'row' : 'row-reverse'}
              fontSize='xl'
            >
              {errors.password?.message}
            </FormErrorMessage>
          )}
        </FormControl>
        <HStack
          flexDirection={lang === 'en' ? 'row' : 'row-reverse'}
          mt='4'
          justifyContent='space-between'
        >
          <Checkbox
            flexDirection={lang === 'en' ? 'row' : 'row-reverse'}
            gap={lang === 'en' ? '0' : '0.5rem'}
            size='lg'
            onChange={() => setIsRememberMe(!isRememberMe)}
          >
            <Text as='span' fontSize='2xl'>
              {t('remember-me')}
            </Text>
          </Checkbox>
          <Button
            fontSize='xl'
            onClick={onOpen}
            variant='link'
            color='secondary'
          >
            {t('forget-pass')}
          </Button>
        </HStack>
        <HStack mt={8} width='100%' justifyContent='center'>
          <Button
            width='50%'
            type='submit'
            bg='primary'
            color='white'
            fontSize='xl'
            py={8}
            _hover={{ bg: 'secondary' }}
            borderRadius='5rem'
            isLoading={sendingLoginCredentialLoading}
            isDisabled={sendingLoginCredentialLoading}
            _disabled={{
              opacity: 0.4,
              cursor: 'not-allowed',
              _hover: {
                bg: 'secondary',
              },
            }}
          >
            {t('login')}
          </Button>
        </HStack>
      </form>
      <VStack spacing={6} mt='2rem !important' width='100%'>
        <Button variant='link'>
          <Image src='/images/uae-pass.png' alt='use digital pass' />
        </Button>
        <Text as='p'>{t('dont-have-account')}</Text>
        <Button
          fontSize='xl'
          px={10}
          py={6}
          variant='primary'
          borderRadius='5rem'
          onClick={() =>
            (window.location.href = `${
              import.meta.env.VITE_LANDING_PAGE_URL
            }/register`)
          }
        >
          {t('signup')}
        </Button>
      </VStack>
    </>
  )
}
