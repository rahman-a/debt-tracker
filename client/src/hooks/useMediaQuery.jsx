import React from 'react'

const useMediaQuery = (breakpoint) => {
  const [isMobile, setIsMobile] = React.useState(false)
  if (typeof window === 'undefined') return null
  if (!breakpoint) return null
  React.useEffect(() => {
    const mediaQuery = window.matchMedia(breakpoint)
    mediaQuery.addEventListener('change', handleMediaQueryChange)
    handleMediaQueryChange(mediaQuery)
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange)
    }
  }, [])

  const handleMediaQueryChange = (mediaQuery) => {
    if (mediaQuery.matches) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }

  return isMobile
}

export default useMediaQuery
