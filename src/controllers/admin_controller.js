//Importar el modelo Niño
import Admin from "../models/Administrador.js"
import { sendMailToAdmin } from "../config/nodemailer.js"
import generarJWT from "../helpers/crearJWT.js"
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'

const registrarAdmin = async (req, res) => {
            try {
                // Validación de campos vacíos
                if (Object.values(req.body).some(value => value === "")) {
                    return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
                }
                // Capturar los datos del body de la petición
                const { Email_admin, Password_admin } = req.body;
                // Validación de existencia del mail
                const verificarEmailBDD = await Admin.findOne({ Email_admin });
                if (verificarEmailBDD) {
                    return res.status(400).json({ msg: "Lo sentimos, el email ya se encuentra registrado" });
                }
                // Crear la instancia del modelo
                const nuevoAdmin = new Admin(req.body);
                // Encriptar el password del Administrador
                nuevoAdmin.Password_admin = await nuevoAdmin.encrypPassword(Password_admin);
                // Crear el token del Administrador
                nuevoAdmin.crearToken();
                // Crear el token del Administrador
                const token = nuevoAdmin.crearToken();
                // Invocar la función para el envío del correo
                await sendMailToAdmin(Email_admin, token);
                // Guardar en la base de datos
                await nuevoAdmin.save();
                // Enviar la respuesta
                res.status(200).json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta" });
            } catch (error) {
                console.error('Error durante el registro:', error);
                res.status(500).json({ msg: 'Ocurrió un error durante el registro' });
            }
};

const confirmEmailAdmin = async (req, res) => {
    // Validar el token del correo
    if (!(req.params.token)) return res.status(400).json({ msg: "Lo sentimos, no se puede validar la cuenta" })
    // Verificar si en base al token existe el Administrador
    const AdminBDD = await Admin.findOne({ token: req.params.token })
    // Validar si el token ya fue seteado al null
    if (!AdminBDD?.token) return res.status(404).json({ msg: "La cuenta ya ha sido confirmada" })
    // Setear a null el token 
    AdminBDD.token = null
    // cambiar a true la configuración de la cuenta
    AdminBDD.confirmEmail = true
    // Guardar cambios en BDD
    await AdminBDD.save()
    // Presentar mensajes al Admin
    res.status(200).json({ msg: "Token confirmado, ya puedes iniciar sesión" })
}

const loginAdmin = async (req, res) => {
    // Capturar los datos del requests
    const { Email_admin, Password_admin } = req.body
    // Validación de campos vacíos
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" })
    // Obtener el Admin en base al email
    const AdminBDD = await Admin.findOne({ Email_admin }).select("-status -__v -token -updatedAt -createdAt")
    // Validar si existe el Administrador
    if (AdminBDD?.confirmEmail === false) return res.status(403).json({ msg: "Lo sentimos, debe verificar su cuenta" })
    // Verificar si existe el Administrador
    if (!AdminBDD) return res.status(404).json({ msg: "Lo sentimos, el Administrador no se encuentra registrado" })
    // Validar si el password del request es el mismo de la BDD
    const verificarPassword = await AdminBDD.matchPassword(Password_admin)
    if (!verificarPassword) return res.status(404).json({ msg: "Lo sentimos, el password no es el correcto" })
    const token = generarJWT(AdminBDD._id)
    // Desestructurar la información del Administrador; Mandar solo algunos campos 
    const { Nombre_admin, _id } = AdminBDD
    // Presentación de datos
    res.status(200).json({
        token,
        _id,
        Nombre_admin,
        Email_admin: AdminBDD.Email_admin // segunda opción
    })
}

export {
    registrarAdmin,
    confirmEmailAdmin,
    loginAdmin
}