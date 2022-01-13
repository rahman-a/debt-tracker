
const names = ['Ali', 'Ibrahim', 'Ahmed', 'Mohamed', 'Samir', 'Waleed', 'Emad', 'Mahmoud']


const peers = [...Array(10)].map((_, idx) => {
    let imageNum = idx + 1;
    if(imageNum > 5) {
        imageNum = imageNum - 5
    }
    const name = `${names[Math.round(Math.random() * 7)]} ${names[Math.round(Math.random() * 7)]}`
    return  {
        image:`/images/photos/photo-${imageNum}.jpg`,
        name
    }
})



export default peers

/**
 * const peers = [
    {
        image:'/images/photos/photo-1.png',
        name:'Jessy Ibrahim'
    },
    {
        image:'/images/photos/photo-2.jpg',
        name:'Jessy Ibrahim'
    },
    {
        image:'/images/photos/photo-3.jpg',
        name:'Jessy Ibrahim'
    },
    {
        image:'/images/photos/photo-4.jpg',
        name:'Jessy Ibrahim'
    },
    {
        image:'/images/photos/photo-5.jpg',
        name:'Jessy Ibrahim'
    },
    {
        image:'/images/photos/photo-1.png',
        name:'Jessy Ibrahim'
    },
    {
        image:'/images/photos/photo-2.jpg',
        name:'Jessy Ibrahim'
    },
    {
        image:'/images/photos/photo-3.jpg',
        name:'Jessy Ibrahim'
    },

    {
        image:'/images/photos/photo-4.jpg',
        name:'Jessy Ibrahim'
    },
    {
        image:'/images/photos/photo-5.jpg',
        name:'Jessy Ibrahim'
    },
]

 */