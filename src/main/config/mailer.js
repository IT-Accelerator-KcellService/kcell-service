import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

transporter.verify((error) => {
    if (error) {
        console.error('Ошибка подключения к Gmail:', error);
    } else {
        console.log('Gmail transporter готов к отправке писем');
    }
});