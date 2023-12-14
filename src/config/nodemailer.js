import nodemailer from "nodemailer"
import dotenv from 'dotenv'
dotenv.config()

// Creación del transporter
const transport = nodemailer.createTransport({
    host: process.env.HOST_GMAIL,
    port: process.env.PORT_GMAIL,
    auth: {
        user: process.env.USER_GMAIL,
        pass: process.env.PASS_GMAIL
    }
})

// Enviar correo con objeto de transporte definido
const sendMailToUser = async(userMail,token)=>{
    let info = await transport.sendMail({
    from: 'dilanflores.21@gmail.com',
    to: userMail,
    subject: "Verifica tu cuenta de correo electrónico",
    html: `
    <h1>Sistema de gestión (Programación niños 👦👧)</h1>
    <hr>
    <a href="http://localhost:3000/api/confirmar/${token}">Clic para confirmar tu cuenta</a>
    <hr>
    <footer>Bienvenido!!</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

const sendMailToRecoveryPassword = async(userMail,token)=>{
    let info = await transport.sendMail({
    from: 'dilanflores.21@gmail.com',
    to: userMail,
    subject: "Correo para reestablecer tu contraseña",
    html: `
    <h1>Sistema de gestión (Programación niños 👦👧)</h1>
    <hr>
    <a href="http://localhost:3000/api/recuperar-password/${token}">Clic para reestablecer tu contraseña</a>
    <hr>
    <footer>Bienvenido!!</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

// Enviar correo para confirmar la cuenta de Niño
const sendMail_confirmNino = async(userMail,token,nino)=>{
    let info = await transport.sendMail({
    from: 'dilanflores.21@gmail.com',
    to: userMail,
    subject: "Verifica la cuenta",
    html: `
    <h1>Verificación de cuenta de nin@ (${nino})</h1>
    <hr>
    <a href="http://localhost:3000/api/nin@s/confirmar/${token}">Clic para confirmar tu cuenta</a>
    <hr>
    <footer>Bienvenido!!</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

const sendMailToAdmin = async(userMail,token)=>{
    let info = await transport.sendMail({
    from: 'dilanflores.21@gmail.com',
    to: userMail,
    subject: "Verifica tu cuenta de correo electrónico",
    html: `
    <h1>ADMIN</h1>
    <hr>
    <a href="http://localhost:3000/api/admin/confirmar/${token}">Clic para confirmar tu cuenta</a>
    <hr>
    <footer>..........</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

export {
    sendMailToUser,
    sendMailToRecoveryPassword,
    sendMail_confirmNino,
    sendMailToAdmin
}