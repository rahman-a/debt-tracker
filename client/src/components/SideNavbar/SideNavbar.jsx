// @ts-nocheck
import React, { useState, useRef } from 'react'
import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import classnames from 'classnames'
import actions from '@/src/actions'
import { Loader } from '@/src/components'
import {
  Cogs,
  File,
  RightLogout,
  AddressCard,
  Globe,
  CashRegister,
  HandshakeSlash,
  Employees,
} from '@/src/icons'

const SideNavbar = ({
  showSideMenu,
  loadingState,
  changeLanguageHandler,
  setSideMenu,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isReportMenu, setIsReportMenu] = useState(false)
  const reportRef = useRef(null)
  const { user } = useSelector((state) => state.isAuth)
  const { loading, error, isLogout } = useSelector((state) => state.logout)
  const language = i18next.language

  const dispatch = useDispatch()

  const logoutHandler = (e) => {
    e.stopPropagation()
    if (!loading) {
      dispatch(actions.users.logout(user._id))
    }
  }

  const toggleMenuStyle = () => {
    let style = {
      left: showSideMenu ? 0 : '-30rem',
    }
    if (language === 'ar') {
      style = { right: showSideMenu ? 0 : '-30rem' }
    }

    return style
  }

  const showReportsMenu = (e) => {
    e.stopPropagation()
    if (!isReportMenu) {
      const menuHeight = reportRef.current.getBoundingClientRect().height
      reportRef.current.parentNode.style.height = `${menuHeight}px`
      setIsReportMenu(true)
    } else {
      reportRef.current.parentNode.style.height = 0
      setIsReportMenu(false)
    }
  }
  const navbarMenuLogoutClasses = classnames(style.navbar__menu_item_logout, {
    [style.navbar__menu_item_logout_ar]: language === 'ar',
  })
  const navbarMenuItems = classnames(
    style.navbar__menu_item,
    style.navbar__menu_item_lang
  )

  return (
    <>
      {error && (
        <div
          className={style.navbar__logout_alert}
          style={{ left: error ? '1rem' : '-25rem' }}
        >
          <p>{error}</p>
        </div>
      )}

      <div className={style.navbar__menu} style={toggleMenuStyle()}>
        <ul className={style.navbar__menu_list}>
          <li className={style.navbar__menu_item}>
            <div onClick={() => navigate('/operation')}>
              <span>
                <Cogs />
              </span>
              <span>{t('operation')}</span>
            </div>
          </li>
          <li className={style.navbar__menu_item}>
            <div onClick={showReportsMenu}>
              <span>
                <File />
              </span>
              <span>{t('reports')}</span>
            </div>
            {/* ///////////////////////////////////// */}
            <ul className={style.navbar__menu_reports}>
              <div ref={reportRef}>
                <li
                  className={style.navbar__menu_reports_item}
                  onClick={() => navigate('/reports/active')}
                >
                  <span>
                    <CashRegister />
                  </span>
                  <span>{t('active-reports')}</span>
                </li>
                <li
                  className={style.navbar__menu_reports_item}
                  onClick={() => navigate('/reports/closed')}
                >
                  <span>
                    <HandshakeSlash />
                  </span>
                  <span>{t('closed-reports')}</span>
                </li>
              </div>
            </ul>
            {/* ///////////////////////////////////// */}
          </li>
          {/*/////////////////////////////////////*/}
          {user?.company?.isManager && (
            <li className={style.navbar__menu_item}>
              <div onClick={() => navigate('/employees')}>
                <span>
                  <Employees />
                </span>
                <span>{t('employees')}</span>
              </div>
            </li>
          )}
          {/*/////////////////////////////////////*/}
          <li className={style.navbar__menu_item}>
            <div onClick={() => navigate('/profile')}>
              <span>
                <AddressCard />
              </span>
              <span>{t('profile')}</span>
            </div>
          </li>
          <li className={style.navbar__menu_item}>
            <div onClick={() => navigate('/tickets')}>
              <span>
                <AddressCard />
              </span>
              <span>{t('support')}</span>
            </div>
          </li>
          <li className={style.navbar__menu_item}>
            <div onClick={logoutHandler}>
              {loading && (
                <span className={style.navbar__menu_item_loading}>
                  <Loader center size='5' options={{ animation: 'border' }} />
                </span>
              )}

              <span className={navbarMenuLogoutClasses}>
                <RightLogout />
              </span>
              <span>{t('logout')}</span>
            </div>
          </li>
          <li className={navbarMenuItems}>
            <div>
              {loadingState && (
                <span className={style.navbar__menu_item_loading}>
                  <Loader center size='5' options={{ animation: 'border' }} />
                </span>
              )}
              <span>
                <Globe />
              </span>
              <span className={style.navbar__menu_item_flag}>
                {language === 'ar' ? (
                  <img
                    onClick={(e) => changeLanguageHandler(e, 'en')}
                    src='/images/usa-flag.jpg'
                    alt='usa flag'
                  />
                ) : (
                  <img
                    onClick={(e) => changeLanguageHandler(e, 'ar')}
                    src='/images/uae-flag.png'
                    alt='uae flag'
                  />
                )}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </>
  )
}

export default SideNavbar

/**
 *
 */
