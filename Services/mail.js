const nodeMailer = require('nodemailer')

let transport

const createTransport = () => {
    transport = nodeMailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: 'b74ff08db8d03f',
            pass: 'b96eb82681cf08'
        },
    })
}


module.exports = {
    createTransport,
    getTransport: () => transport
}
