export const renderStateMessage = (text, className) => {
  const regex = /#\S+#/g
  const splittedText = text.split(' ')
  const fullText = []
  splittedText.forEach((tx) => {
    const match = tx.match(regex)
    if (match) {
      const matchText = match[0].split('') /// [#, p, t,t,e,r,n,#]
      const value = matchText.splice(1, matchText.length - 2).join('')
      fullText.push(<span className={className}>{value}</span>)
    } else fullText.push(` ${tx} `)
  })

  return fullText
}
