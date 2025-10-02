import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()



const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.APP_EMAIL_USER,
        pass: process.env.APP_EMAIL_PASSWORD
    }
})

export default transporter