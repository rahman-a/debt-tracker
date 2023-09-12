import { useEffect } from 'react'
import styles from './style.module.scss'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ChakraProvider } from '@chakra-ui/react'
import useChakraTheme from '@/src/hooks/useChakraTheme'
import { Login } from '@/src/views'
import actions from '@/src/actions'

let isMounted = true
function AuthorizationRouter() {
  const { isAuth, error, loading } = useSelector((state) => state.isAuth)
  const location = useLocation()
  const navigate = useNavigate()
  const chakraTheme = useChakraTheme()
  const dispatch = useDispatch()
  const token = location.hash.split('=')[1]

  useEffect(() => {
    isMounted && dispatch(actions.users.isUserAuth(token))
    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
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

  if (isAuth) {
    token && navigate(location.pathname)
    return <Outlet />
  } else if (error) {
    return window.location.replace('http://localhost:3000/login')
  }

  // return (
  //   <ChakraProvider resetCSS theme={chakraTheme}>
  //     <Login />
  //   </ChakraProvider>
  // )
}

export default AuthorizationRouter
