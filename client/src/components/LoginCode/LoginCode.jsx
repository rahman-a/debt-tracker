import { useEffect, useRef, useState } from 'react'
import {
  Box,
  HStack,
  PinInput,
  PinInputField,
  Spinner,
  Text,
} from '@chakra-ui/react'
import Countdown, { zeroPad } from 'react-countdown'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

export default function LoginCode({
  verifyLoginCodeHandler,
  sendLoginCodeHandler,
  sendCodeLoading,
  verifyLoginCodeLoading,
}) {
  const pinInputRef = useRef(null)
  const [stopCounter, setStopCounter] = useState(false)
  const [counterDate, setCounterDate] = useState(119000)
  const counterRef = useRef(null)
  const { t } = useTranslation()
  const lang = i18next.language

  useEffect(() => {
    pinInputRef.current?.focus()
  }, [])

  useEffect(() => {
    let stopCounterInterval
    if (stopCounter && counterRef.current) {
      counterRef.current.pause()
      stopCounterInterval = setTimeout(() => {
        setStopCounter(false)
        clearTimeout(stopCounterInterval)
      }, 5000)
    } else {
      counterRef.current?.start()
    }
    return () => clearTimeout(stopCounterInterval)
  }, [stopCounter])

  useEffect(() => {
    !sendCodeLoading && counterRef.current?.start()
  }, [sendCodeLoading])

  return (
    <Box textAlign='center'>
      <Text as='h2' mb='5' fontSize={{ base: '2xl', md: '3xl' }}>
        {t('sent-login-code')}
      </Text>
      <HStack
        spacing={6}
        w='100%'
        justifyContent='center'
        m='0'
        position='relative'
      >
        <PinInput
          type='alphanumeric'
          variant='filled'
          focusBorderColor='teal.500'
          size={{ base: 'md', sm: 'lg' }}
          onComplete={(code) => {
            setCounterDate(119000)
            verifyLoginCodeHandler(code)
          }}
          onChange={() => setStopCounter(true)}
          isDisabled={verifyLoginCodeLoading}
        >
          <PinInputField bg='gray.600' ref={pinInputRef} />
          <PinInputField bg='gray.600' />
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
          display={verifyLoginCodeLoading || sendCodeLoading ? 'block' : 'none'}
        />
      </HStack>
      {(!verifyLoginCodeLoading || !sendCodeLoading) && (
        <Countdown
          date={Date.now() + counterDate}
          ref={counterRef}
          onPause={(date) => {
            setCounterDate(date.total)
          }}
          renderer={({ seconds, minutes }) => {
            return (
              <HStack
                my={4}
                spacing={2}
                flexWrap='wrap'
                w='100%'
                justifyContent='center'
                flexDirection={lang === 'en' ? 'row' : 'row-reverse'}
                gap='0.5rem'
              >
                <Text as='p' fontSize={{ base: 'xl', md: '2xl' }}>
                  {t('code-send-in-time')}
                </Text>
                <Text as='span' fontWeight='bold' color='red.300'>
                  {zeroPad(minutes) + ':' + zeroPad(seconds)}
                </Text>
                <Text as='p' fontSize={{ base: 'xl', md: '2xl' }}>
                  {minutes === 0 ? t('seconds') : t('minutes')}{' '}
                  {t('code-not-received')}
                </Text>
              </HStack>
            )
          }}
          onComplete={() => {
            setCounterDate(119000)
            sendLoginCodeHandler()
          }}
        />
      )}
    </Box>
  )
}
