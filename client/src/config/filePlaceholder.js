const filePlaceholder = file => {
    const images = ['png','jpg','jpeg','PNG','JPG','JPEG']
    const word = ['doc','docx']
    const excel = 'xlsx'
    const powerpoint = 'pptx'
    const pdf = 'pdf'
    const extension = file.split('.')[1]
    if(images.includes(extension)) return `img.png`
    else if (word.includes(extension)) return 'word.png'
    else if(extension === pdf) return 'pdf.png'
    else if(extension === powerpoint) return 'powerpoint.png'
    else if(extension === excel) return 'excel.png'
}

export default filePlaceholder