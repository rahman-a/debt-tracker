const template = {
    activate(info){
        return`
        <div style='
    color:#2b2c33; 
    padding:2rem;'>
        <h1>Debt Tracker</h1>
        <p>Hello ${info.name}</p>
        <p>To Verify Your Account E-mail please click on this link</p>
        <a href=${info.link} style='
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
        '>Verify E-mail</a>
        <h3 style='font-weight: 400;'> Please Note this link will expire within<span style='
              color: #c60249;
              text-decoration: underline;
              font-weight: 600;
              margin:0 0.3rem;
             '>only 24 hours</span> </h3>
    </div>
    `
},
reset(info){
    return`
    <div style='
    color:#2b2c33; 
    padding:2rem;'>
    <h1>Debt Tracker</h1>
    <p>Hello ${info.name}</p>
    <p>To Reset Your Account Password please click on this link</p>
    <a href=${info.link} style='
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
    '>Reset Password</a>
    <h3 style='font-weight: 400;'> Please Note this link will expire within<span style='
          color: #c60249;
          text-decoration: underline;
          font-weight: 700;
          margin:0 0.5rem;
         '>only 24 hours</span> </h3>
</div>
`
},
code(info) {
    return `
    <div style='
        color:#2b2c33; 
        padding:2rem;'>
        <h1>Debt Tracker</h1>
        <p>Hello ${info.name}</p>
        <p style='text-transform: uppercase; font-style: italic;'>to login copy this code and paste it</p>
        <span style='
            border: 1px dashed #333;
            padding: 0.5rem;
            margin: 0.1rem 0;
            display: inline-block;
            color: #333;
        '>${info.code}</span>
        <h3 style='font-weight: 400;'> Please Note this link will expire within
            <span style='color: #c60249;text-decoration: underline;font-weight: 700;margin:0 0.5rem;'>
                only 24 hours
            </span> 
        </h3>
    </div>
    `
},
notice(info) {
    return `
    <div style='
        color:#2b2c33; 
        padding:2rem;'>
        <h1>Debt Tracker ${info.label}</h1>
        <p>Hello ${info.name}</p>
        <p style='text-transform: uppercase; font-style: italic;'>
            ${info.message}
        </p>
    </div>
    `
}
}

export default template