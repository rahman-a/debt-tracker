export const renderStateMessage = (text, className) => {
    const regex = /#{.*}+/g
    const match = text.match(regex)
    if(match) {
        const matchText = match[0].split('')
        matchText.splice(0,3)
        const value = matchText.slice(0, matchText.length - 2).join('')
        const replacedString = text.match(regex)[0]
        const finalText = text.replace(replacedString, `${value}`)
        const textArray = finalText.split(value)
        return [textArray[0], <span className={className}>{value}</span>, textArray[1]]
    } else return text
}