import { useEffect } from 'react'
import styles from './style.module.scss'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ChakraProvider } from '@chakra-ui/react'
import useChakraTheme from '../../hooks/useChakraTheme'
import { Login } from '../../views'
import actions from '../../actions'

let isMounted = true
function AuthorizationRouter() {
  const { isAuth, error } = useSelector((state) => state.isAuth)
  const chakraTheme = useChakraTheme()
  const dispatch = useDispatch()

  useEffect(() => {
    isMounted && dispatch(actions.users.isUserAuth())
    return () => {
      isMounted = false
    }
  }, [])

  if (error) {
    return (
      <ChakraProvider resetCSS theme={chakraTheme}>
        <Login />
      </ChakraProvider>
    )
  }

  if (isAuth) {
    return <Outlet />
  }

  return (
    <div className={styles.authorizationRouter}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src='/images/light_blue.png' alt='logo' />
        </div>
        <div className={styles.progress}>
          <div className={styles.progress__bar}>
            <div className={styles.progress__value}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthorizationRouter
