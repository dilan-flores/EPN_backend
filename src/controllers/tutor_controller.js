//Importar el modelo Tutor
import Tutor from "../models/Tutor.js"
import { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js"
import generarJWT from "../helpers/crearJWT.js"
import mongoose from "mongoose";
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken'

const nuevoPasswordValidations = [
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 8, max: 15 }).withMessage('La contraseña debe tener entre 8 y 15 caracteres')
        .matches(/\d/).withMessage('La contraseña debe contener al menos un número'),
];
const tutorRoles = ["Padre", "Madre", "Familiar", "Otros"];
const validar = [
    body('Nombre_tutor')
        .isLength({ min: 2, max: 30 }).withMessage('El nombre debe tener entre 2 y 30 caracteres'),
    body('Rol_tutor')
        .custom((value) => {
            if (!tutorRoles.includes(value)) {
                throw new Error('El rol debe ser "Padre", "Madre", "Familiar" u "Otros"');
            }
            return true;
        }),
    body('Celular_tutor')
        .isNumeric().withMessage('El celular debe contener solo números')
        .isLength({ min: 10, max: 10 }).withMessage('El celular debe tener 10 dígitos'),
    body('Email_tutor').isEmail().withMessage('El email debe ser válido'),
    body('Password_tutor')
        .isLength({ min: 8, max: 15 }).withMessage('La contraseña debe tener entre 8 y 15 caracteres')
        .matches(/\d/).withMessage('La contraseña debe contener al menos un número'),
];

const login = async (req, res) => {
    // Capturar los datos del requests
    const { Email_tutor, Password_tutor } = req.body
    // Vallidación de campos vacíos
    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })
    // Obtener el tutor en base al email
    const TutorBDD = await Tutor.findOne({ Email_tutor }).select("-status -__v -token -updatedAt -createdAt")
    // Validar si existe el tutor
    if (TutorBDD?.confirmEmail === false) return res.status(403).json({ msg: "Lo sentimos, debe verificar su cuenta" })
    // Verificar si existe el tutor
    if (!TutorBDD) return res.status(404).json({ msg: "Lo sentimos, el tutor no se encuentra registrado" })
    // Validar si el password del request es el mismo de la BDD
    const verificarPassword = await TutorBDD.matchPassword(Password_tutor)
    if (!verificarPassword) return res.status(401).json({ msg: "Lo sentimos, el password no es el correcto" })
    const token = generarJWT(TutorBDD._id)
    // Desestructurar la información del tutor; Mandar solo algunos campos 
    const { Nombre_tutor, Rol_tutor, Celular_tutor, _id } = TutorBDD
    // Presentación de datos
    res.status(200).json({
        token,
        _id,
        Nombre_tutor,
        Rol_tutor,
        Celular_tutor,
        Email_tutor: TutorBDD.Email_tutor // segunda opción
    })
}

const registrar = async (req, res) => {
    try {
        // Validación de campos vacíos
        if (Object.values(req.body).some(value => value === "")) {
            return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
        }
        // Ejecutar las validaciones
        await Promise.all(validar.map(validation => validation.run(req)));
        // Obtener los resultados de la validación
        const errors = validationResult(req);
        // Verificar si hay errores
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        // Capturar los datos del body de la petición
        const { Email_tutor, Password_tutor } = req.body;
        // Validación de existencia del mail
        const verificarEmailBDD = await Tutor.findOne({ Email_tutor });
        if (verificarEmailBDD) {
            return res.status(409).json({ msg: "Lo sentimos, el email ya se encuentra registrado" });
        }
        // Crear la instancia del modelo
        const nuevoTutor = new Tutor(req.body);
        // Encriptar el password del tutor
        nuevoTutor.Password_tutor = await nuevoTutor.encrypPassword(Password_tutor);
        // Crear el token del tutor
        nuevoTutor.crearToken();
        // Crear el token del tutor
        const token = nuevoTutor.crearToken();
        // Invocar la función para el envío del correo
        await sendMailToUser(Email_tutor, token);
        // Guardar en la base de datos
        await nuevoTutor.save();
        // Enviar la respuesta
        res.status(200).json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta" });
    } catch (error) {
        console.error('Error durante el registro:', error);
        res.status(500).json({ msg: 'Ocurrió un error durante el registro' });
    }
};


const confirmEmail = async (req, res) => {
    // Validar el token del correo
    if (!(req.params.token)) return res.status(400).json({ msg: "Lo sentimos, no se puede validar la cuenta" })
    // Verificar si en base al token existe ese tutor
    const TutorBDD = await Tutor.findOne({ token: req.params.token })
    // Validar si el token ya fue seteado al null
    if (!TutorBDD?.token) return res.status(404).json({ msg: "La cuenta ya ha sido confirmada" })
    // Setear a null el token 
    TutorBDD.token = null
    // cambiar a true la configuración de la cuenta
    TutorBDD.confirmEmail = true
    // Guardar cambios en BDD
    await TutorBDD.save()
    // Presentar mensajes al tutor
    res.status(200).json({ msg: "Token confirmado, ya puedes iniciar sesión" })
}

const perfilTutor = async (req, res) => {
    try {
        // Verificar si el token corresponde a un Tutor en la base de datos
        const { authorization } = req.headers;
        const { id: tutorId } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);
        // Verificar si el token corresponde a un tutor en la base de datos
        const tutorToken = await Tutor.findOne({ _id: tutorId });
        if (!tutorToken) {
            // Si no se encuentra un tutor con el ID proporcionados
            return res.status(401).json({ msg: 'No autorizado. Solo un usuario Tutor' });
        }
        // Se obtiene el ID del tutor que ingresó al sistema
        const { id } = req.params
        // Verificar si el id del tutor que ingresó al sistema es igual al id optenido en el endpoint
        if (id === tutorId) {
            // Validar ID en DBB tutor
            if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: `Lo sentimos, debe ser un id válido` });
            // Obtener información tutor en base al ID
            const tutorBDD = await Tutor.findById(id).select("-Password_tutor -confirmEmail -token -status -updatedAt -__v -_id")
            // Validar si existe el tutor
            if (!tutorBDD) return res.status(404).json({ msg: `Lo sentimos, no existe el tutor con id: ${id}` })
            // Mostrar los datos del tutor
            res.status(200).json({ msg: tutorBDD })
        } else {
            res.status(401).json({ msg: 'Tutor no autorizado' });
        }
    } catch (error) {
        console.error('Error durante el registro:', error);
        res.status(500).json({ msg: 'Error del servidor' });
    }
}

// const perfil =(req,res)=>{
//     delete req.tutorBDD.token
//     delete req.tutorBDD.confirmEmail
//     delete req.tutorBDD.createdAt
//     delete req.tutorBDD.updatedAt
//     delete req.tutorBDD.__v
//     res.status(200).json(req.tutorBDD)
// }

// const actualizarPassword = async (req,res)=>{
//     const tutorBDD = await Tutor.findById(req.tutorBDD._id)
//     if(!tutorBDD) return res.status(404).json({msg:`Lo sentimos, no existe el tutor ${id}`})
//     const verificarPassword = await tutorBDD.matchPassword(req.body.passwordactual)
//     if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password actual no es el correcto"})
//     tutorBDD.password = await tutorBDD.encrypPassword(req.body.passwordnuevo)
//     await tutorBDD.save()
//     res.status(200).json({msg:"Password actualizado correctamente"})
// }

const recuperarPassword = async (req, res) => {
    // Se obtiene el email del tutor
    const { Email_tutor } = req.body
    // Validación de campos vacíos
    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })
    // Obtener el tutor en base al email
    const tutorBDD = await Tutor.findOne({ Email_tutor })
    // Validación de existencia de tutor
    if (!tutorBDD) return res.status(404).json({ msg: "Lo sentimos, el tutor no se encuentra registrado" })
    // creación del token
    const token = tutorBDD.crearToken()
    // Establecer el token en el tutor obtenido previamente
    tutorBDD.token = token
    // Enviar el email de recuperación
    await sendMailToRecoveryPassword(Email_tutor, token)
    // Guardar los cambio en BDD
    await tutorBDD.save()
    // Presentar mensajes al tutor
    res.status(200).json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" })
}

const comprobarTokenPasword = async (req, res) => {
    // Validar el token
    if (!(req.params.token)) return res.status(400).json({ msg: "Lo sentimos, no se puede validar la cuenta" })
    // Obtener el tutor en base al token
    const tutorBDD = await Tutor.findOne({ token: req.params.token })
    // Validación si existe el tutor
    if (tutorBDD?.token !== req.params.token) return res.status(401).json({ msg: "Lo sentimos, no se puede validar la cuenta" })
    // Guardar en BDD
    await tutorBDD.save()
    // Presentar mensaje al tutor
    res.status(200).json({ msg: "Token confirmado, ya puedes crear tu nuevo password" })
}

const nuevoPassword = async (req, res) => {
    try {
        // Validación de campos vacíos
        if (Object.values(req.body).some(value => value === "")) {
            return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
        }
        // Validar coincidencia de los passwords
        const { password, confirmpassword } = req.body;
        if (password !== confirmpassword) {
            return res.status(404).json({ msg: "Lo sentimos, los passwords no coinciden" });
        }
        // Aplicar validaciones de nuevoPassword
        await Promise.all(nuevoPasswordValidations.map(validation => validation.run(req)));
        // Obtener los resultados de la validación
        const errors = validationResult(req);
        // Verificar si hay errores
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        // Obtener los datos del tutor en base al token
        const tutorBDD = await Tutor.findOne({ token: req.params.token });
        // Validar la existencia de tutor y que el token no sea null o undefined
        if (!tutorBDD || tutorBDD.token === null) {
            return res.status(400).json({ msg: "Lo sentimos, no se puede validar la cuenta" });
        }
        // Setear el token nuevamente a null
        tutorBDD.token = null;
        // Encriptar el nuevo password
        tutorBDD.Password_tutor = await tutorBDD.encrypPassword(password);
        // Guardar en BDD
        await tutorBDD.save();
        // Mostrar mensaje al tutor
        res.status(200).json({ msg: "Felicitaciones, ya puedes iniciar sesión con tu nuevo password" });
    } catch (error) {
        console.error("Error al cambiar la contraseña:", error);
        res.status(500).json({ msg: "Ocurrió un error al cambiar la contraseña" });
    }
};

const logoutTutor = async (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ msg: "Ocurrió un error al cerrar sesión" });
        return res.status(200).json({ msg: "Sesión cerrada exitosamente" });
    });
}

export {
    login,
    registrar,
    confirmEmail,
    perfilTutor,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword,
    logoutTutor
}