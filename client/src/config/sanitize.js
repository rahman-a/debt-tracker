export const sanitizeInput = (input) => {

    if(typeof input === 'string') { 
        const sanitizedInput = input.replace(/<script>/g, '');
        const sanitizedInput2 = sanitizedInput.replace(/<\/script>/g, '');
        const replaceAngularBracket = sanitizedInput2.replace(/[\<>]/g, '');
        const replacedParentheses = replaceAngularBracket.replace(/[\()]/g, '')
        const replacedBrackets = replacedParentheses.replace(/[\[\]]/g, '')
        const replaceBraces = replacedBrackets.replace(/[\{}]/g, '')
        const output =  replaceBraces.replace(/^\s+|\s+$/gm, '');
        return output;    
    }

    return input
}
