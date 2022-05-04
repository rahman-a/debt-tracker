const template = {
    activate(info){
    return`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet">
            <title>E-mail Activation from SWTLE.com</title>
            <style>
                .container {
                    width:65%;
                    height:50rem;
                    margin:0 auto;
                }
                figure {
                    width:100%;
                    margin:0;
                }
                figure img {
                    width:100%
                }
                .container__message {
                    background-color: rgb(241, 241, 241); 
                    height: fit-content; 
                    width:100%;
                    padding:1rem 1.5rem;
                    box-sizing: border-box;
                }
                .container__message h4 {
                    font-weight: 400;
                }
                .container__message p {
                    line-height: 1.6;
                    margin:0;
                    padding: 0;
                }
                .container__message_link {
                    all:unset;
                    display: block;
                    width: 10rem;
                    margin:1rem 0;
                    padding:0.4rem;
                    text-decoration: none;
                    text-align: center;
                    background-color: #1A374D;
                    color:#fff;
                    border-radius: 3px;
                    cursor: pointer;
                }
                .container__message h3 {
                    margin:0; 
                    padding:0; 
                    font-weight: 500;
                    font-size: 16px;
                }
                .container__message span {
                    color:#c60249;
                    text-decoration: underline;
                    font-weight: 700;
                    margin:0 0.5rem;
                }
                @media (max-width:47.99em){
                    .container {
                        width:100%
                    }
                }
            </style>
        </head>
        <body style="font-family: 'Open Sans', sans-serif;">
            <div class="container">
                <figure>
                    <img src="https://i.ibb.co/51m9ZS1/swtlebg.jpg" alt="logo">
                </figure>
                <div class="container__message">
                    <div style='color:#2b2c33;'>
                        <h4>Hello ${info.name}</h4>
                        <p>To Verify Your Account E-mail please click on this link</p>
                        <a href=${info.link} class="container__message_link">Verify E-mail</a>
                        <h3> Please Note this link will expire within
                            <span>only 24 hours</span> 
                        </h3>
                    </div>
                </div>
            </div>
        </body>
    </html>
    `
},
reset(info){
    return`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet">
        <title>Reset Link from SWTLE.com</title>
        <style>
            .container {
                width:65%;
                height:50rem;
                margin:0 auto;
            }
            figure {
                width:100%;
                margin:0;
            }
            figure img {
                width:100%
            }
            .container__message {
                background-color: rgb(241, 241, 241); 
                height: fit-content; 
                width:100%;
                padding:1rem 1.5rem;
                box-sizing: border-box;
            }
            .container__message h4 {
                font-weight: 400;
            }
            .container__message p {
                line-height: 1.6;
                margin:0;
                padding: 0;
            }
            .container__message_link {
                all:unset;
                display: block;
                width: 10rem;
                margin:1rem 0;
                padding:0.4rem;
                text-decoration: none;
                text-align: center;
                background-color: #1A374D;
                color:#fff;
                border-radius: 3px;
                cursor: pointer;
            }
            .container__message h3 {
                margin:0; 
                padding:0; 
                font-weight: 500;
                font-size: 16px;
            }
            .container__message span {
                color:#c60249;
                text-decoration: underline;
                font-weight: 700;
                margin:0 0.5rem;
            }
            @media (max-width:47.99em){
                .container {
                    width:100%
                }
            }
        </style>
    </head>
    <body style="font-family: 'Open Sans', sans-serif;">
        <div class="container">
            <figure>
                <img src="https://i.ibb.co/51m9ZS1/swtlebg.jpg" alt="logo">
            </figure>
            <div class="container__message">
                <div style='color:#2b2c33;'>
                    <h4>Hello ${info.name}</h4>
                    <p>To Reset Your Account Password please click on this link</p>
                    <a href=${info.link} class="container__message_link">Reset Password</a>
                    <h3> Please Note this link will expire within
                        <span>only 24 hours</span> 
                    </h3>
                </div>
            </div>
        </div>
    </body>
    </html>
`
},
code(info) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet">
        <title>Login Code from SWTLE.com</title>
        <style>
            .container {
                width:65%;
                height:50rem;
                margin:0 auto;
            }
            figure {
                width:100%;
                margin:0;
            }
            figure img {
                width:100%
            }
            .container__message {
                background-color: rgb(241, 241, 241); 
                height: fit-content; 
                width:100%;
                padding:1rem 1.5rem;
                box-sizing: border-box;
            }
            .container__message h4 {
                font-weight: 400;
            }
            .container__message p {
                text-transform: uppercase; 
                line-height: 1.6;
                margin:0;
                padding: 0;
            }
            .container__message .code {
                border: 1px dashed #333;
                padding: 0.5rem;
                margin: 0.1rem 0;
                display: inline-block;
                color: #333 !important;
                margin:1rem 0;
            }
           
            @media (max-width:47.99em){
                .container {
                    width:100%
                }
            }
        </style>
    </head>
    <body style="font-family: 'Open Sans', sans-serif;">
        <div class="container">
            <figure>
                <img src="https://i.ibb.co/51m9ZS1/swtlebg.jpg" alt="logo">
            </figure>
            <div class="container__message">
                <div style='color:#2b2c33'>
                    <h4>Hello ${info.name}</h4>
                    <p>to login copy the code and enter it in login screen</p>
                    <span class="code" id="login-code">${info.code}</span>
                </div>
            </div>
        </div>
    </body>
    </html>
    `
},
notice(info) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet">
        <title>Important Notice from SWTLE.com</title>
        <style>
            .container {
                width:65%;
                height:50rem;
                margin:0 auto;
            }
            figure {
                width:100%;
                margin:0;
            }
            figure img {
                width:100%
            }
            .container__message {
                background-color: rgb(241, 241, 241); 
                height: fit-content; 
                width:100%;
                padding:1rem 1.5rem;
                box-sizing: border-box;
            }
            .container__message h1 {
                margin:0; 
                padding:0; 
                text-align: center;
                font-weight: 500;
            }
            .container__message p:last-of-type {
                text-align: center; 
                font-weight: 300; 
                text-transform: uppercase; 
                line-height: 1.6;
            }
            @media (max-width:47.99em){
                .container {
                    width:100%
                }
            }
        </style>
    </head>
    <body style="font-family: 'Open Sans', sans-serif;">
        <div class="container">
            <figure>
                <img src="https://i.ibb.co/51m9ZS1/swtlebg.jpg" alt="logo">
            </figure>
            <div class="container__message">
                <h1>${info.label}</h1>
                <div style='color:#2b2c33;'> 
                    <p>Hello ${info.name}</p>
                    <p> ${info.message} </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `
},
receiveContact(info) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet">
        <title>Contact from SWTLE.com</title>
        <style>
            .container {
                width:65%;
                height:50rem;
                margin:0 auto;
            }
            figure {
                width:100%;
                margin:0;
            }
            figure img {
                width:100%
            }
            .container__message {
                background-color: rgb(241, 241, 241); 
                height: fit-content; 
                width:100%;
                padding:1rem 1.5rem;
                box-sizing: border-box;
            }
            .container__message h2 {
                margin:0; 
                padding:0; 
                font-size: 1.3rem;
                text-align: center;
                font-weight: 500;
            }
            .container__message p {
                text-align: center; 
                font-weight: 200; 
                margin-bottom: 2rem
            }
            .container__message ul {
                list-style: none; 
                margin:0; 
                padding:0;
                font-size: 0.8rem;
            }
            .container__message li {
                border-bottom:1px solid #ccc;
                padding:0.5rem 0;
            }
            .container__message li span{
                color:rgb(5, 109, 95);
            }
            .container__message li a{
                text-decoration: none;
                color:rgb(5, 109, 95);
            }
            
            @media (max-width:47.99em){
                .container {
                    width:100%
                }
            }
        </style>
    </head>
    <body style="font-family: 'Open Sans', sans-serif;">
        <div class="container">
            <figure>
                <img src="https://i.ibb.co/51m9ZS1/swtlebg.jpg" alt="logo">
            </figure>
            <div class="container__message">
                <h2>New Contact from ${info.name}</h2>
                <p> ${info.message} </p>
                <ul>
                    <li> Name: <span>${info.name}</span></li>    
                    <li>E-mail: <a href="mailto=${info.email}"> ${info.email} </a></li>
                    ${info.phone ? `<li>Phone: <a href="tel:${info.phone}"> ${info.phone} </a></li>` : ''}
                </ul>
            </div>
        </div>
    </body>
    </html>
    `
}
}

export default template