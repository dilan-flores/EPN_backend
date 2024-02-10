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

// TUTOR
const sendMailToUser = async(userMail,token)=>{ // Enviar correo de verificación de cuenta: Tutor
    let info = await transport.sendMail({
    from: 'dilanflores.21@gmail.com',
    to: userMail,
    subject: "Verifica tu cuenta de correo electrónico",
    html: `
    <h1>Sistema de gestión (Programación niñ@s 👦👧)</h1>
    <h3>Usuario tutor, verifica tu cuenta para iniciar sesión</h3>
    <hr>
    <br>
    <a href="https://epn-backend.onrender.com/api/confirmar/${token}">Clic para confirmar tu cuenta</a>
    <br>
    <hr>
    <footer>Bienvenido!!</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}
const sendMailToRecoveryPassword = async(userMail,token)=>{// Enviar correo para reestablecer contraseña: tutor
    let info = await transport.sendMail({
    from: 'dilanflores.21@gmail.com',
    to: userMail,
    subject: "Correo para reestablecer tu contraseña",
    html: `
    <h1>Sistema de gestión (Programación niñ@s 👦👧)</h1>
    <h3>Reestablece tu contraseña</h3>
    <hr>
    <br>
    <a href="https://epn-backend.onrender.com/api/recuperar-password/${token}">Clic para reestablecer tu contraseña</a>
    <br>
    <hr>
    <footer>Bienvenido!!</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}
// NIÑO
const sendMail_confirmNino = async(userMail,token,nino)=>{
    let info = await transport.sendMail({
    from: 'dilanflores.21@gmail.com',
    to: userMail,
    subject: "Verifica la cuenta",
    html: `
    <h1>Sistema de gestión (Programación niñ@s 👦👧)</h1>
    <h3>Verifica la cuenta de ${nino}</h3>
    <hr>
    <br>
    <a href="https://epn-backend.onrender.com/api/nin@s/confirmar/${token}">Clic para confirmar tu cuenta</a>
    <br>
    <hr>
    <footer>Bienvenido!!</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}
const sendMailToRecoveryPasswordNino = async(userMail,token,nino)=>{
    let info = await transport.sendMail({
    from: 'dilanflores.21@gmail.com',
    to: userMail,
    subject: "Correo para reestablecer tu contraseña",
    html: `
      <h1>Sistema de gestión (Programación niñ@s 👦👧)</h1>
      <h3>Reestablece la contraseña de ${nino}</h3>
      <hr>
      <br>
      <a href="https://epn-backend.onrender.com/api/nin@s/recuperar-password/${token}">Clic para restablecer tu contraseña</a>
      <br>
      <hr>
      <footer>.............</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}
// ADMINISTRADOR
const sendMailToAdmin = async(userMail,token)=>{
    let info = await transport.sendMail({
    from: 'dilanflores.21@gmail.com',
    to: userMail,
    subject: "Verifica tu cuenta de correo electrónico",
    html: `
    <h1>Sistema de gestión (Programación niñ@s 👦👧)</h1>
    <h1>Usuario administrador, verifica tu cuenta para iniciar sesión</h1>
    <hr>
    <br>
    <a href="https://epn-backend.onrender.com/api/admin/confirmar/${token}">Clic para confirmar tu cuenta</a>
    <br>
    <hr>
    <footer>Bienvenido!!</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}
const sendMailToRecoveryPasswordAdmin = async(userMail,token)=>{
    let info = await transport.sendMail({
    from: 'dilanflores.21@gmail.com',
    to: userMail,
    subject: "Correo para reestablecer tu contraseña",
    html: `
    <h1>Sistema de gestión (Programación niñ@s 👦👧)</h1>
    <h3>Reestablece tu contraseña</h3>
    <hr>
    <br>
    <a href="https://epn-backend.onrender.com/api/admin/recuperar-password/${token}">Clic para reestablecer tu contraseña</a>
    <br>
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
    sendMailToAdmin,
    sendMailToRecoveryPasswordAdmin,
    sendMailToRecoveryPasswordNino
}