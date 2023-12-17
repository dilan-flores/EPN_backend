//Importar el modelo Niño
import Nino from "../models/Nino.js"
//, sendMailToRecoveryPassword_Nino 
import { sendMail_confirmNino } from "../config/nodemailer.js"
import generarJWT from "../helpers/crearJWT.js"
import mongoose from "mongoose";
//import { uploadImage, deleteImage } from "../config/cloudinary.js"
//import fs from "fs-extra"//manipulación de directorios e imágenes en cloudinary

import jwt from 'jsonwebtoken'
import Tutor from '../models/Tutor.js'

import { body, validationResult } from 'express-validator';
import moment from 'moment';

const validar = [
    body('Nombre_nino')
        .isLength({ min: 2, max: 30 }).withMessage('El nombre debe tener entre 2 y 30 caracteres'),

    body('FN_nino')
        .custom(value => {
            if (!moment(value, 'YYYY-MM-DD', true).isValid()) {
                throw new Error('La fecha de nacimiento debe tener un formato de fecha válido (ejemplo: "2012-11-30")');
            }
            return true;
        }),

    body('Usuario_nino')
        .isLength({ min: 2, max: 30 }).withMessage('El nombre de usuario debe tener entre 2 y 30 caracteres')
        .trim(),

    body('Password_nino')
        .notEmpty().withMessage('La contraseña del niño es obligatoria')
        .isLength({ min: 8, max: 15 }).withMessage('La contraseña debe tener entre 8 y 15 caracteres')
        .matches(/\d/).withMessage('La contraseña debe contener al menos un número'),
];

const validarActualizacion = [
    body('Nombre_nino')
        .isLength({ min: 2, max: 30 }).optional().withMessage('El nombre debe tener entre 2 y 30 caracteres'),

    body('FN_nino')
        .optional()
        .custom(value => {
            if (!moment(value, 'YYYY-MM-DD', true).isValid()) {
                throw new Error('La fecha de nacimiento debe tener un formato de fecha válido (ejemplo: "2012-11-30")');
            }
            return true;
        }),

    body('Usuario_nino')
        .isLength({ min: 2, max: 30 }).optional().withMessage('El nombre de usuario debe tener entre 2 y 30 caracteres')
        .trim(),
];



const renderAllNino = async (req, res) => {
    if (req.headers.authorization) {
        try {
            const { authorization } = req.headers;
            const { id } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);

            // Verificar si el token corresponde a un tutor en la base de datos
            const tutorToken = await Tutor.findOne({ _id: id });
            if (!tutorToken) {
                // Si no se encuentra un tutor con el ID proporcionados
                return res.status(401).json({ msg: 'No autorizado. Solo un usuario Tutor' });
            }

            const ninos = await Nino.find({ tutor: id }).select("-Password_nino -token -updatedAt -status -confirm_tutor -__v").lean();

            if (ninos.length === 0) {
                return res.status(200).json({ msg: 'No hay niños asociados a este tutor' });
            }

            // Formatear la fecha en cada niño
            ninos.forEach(nino => {
                nino.FN_nino = new Date(nino.FN_nino).toLocaleDateString();
                nino.createdAt = new Date(nino.createdAt).toLocaleDateString();
            });

            // Envía la respuesta con los niños encontrados
            res.status(200).json({ ninos });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error del servidor' });
        }
    } else {
        res.status(401).json({ msg: 'No autorizado' });
    }
};

const registrarNino = async (req, res) => {
    if (req.headers.authorization) {
        try {
            const { authorization } = req.headers;
            const { id } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);

            // Verificar si el token corresponde a un tutor en la base de datos
            const tutorToken = await Tutor.findOne({ _id: id });
            if (!tutorToken) {
                // Si no se encuentra un tutor con el ID proporcionados
                return res.status(401).json({ msg: 'No autorizado. Solo un usuario Tutor' });
            }

            const { Usuario_nino, Password_nino, Nombre_nino, FN_nino } = req.body;

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

            // Validación de existencia del Usuario niño
            const verificarUsuarioBDD = await Nino.findOne({ Usuario_nino });

            if (verificarUsuarioBDD) {
                return res.status(400).json({ msg: "El usuario ya se encuentra registrado" });
            }

            // Crear la instancia del modelo
            const nuevoNino = new Nino({
                Nombre_nino,
                FN_nino,
                Usuario_nino,
                Password_nino,
                tutor: id,
            });

            // Encriptar el password del Niño
            nuevoNino.Password_nino = await nuevoNino.encrypPassword(Password_nino);

            // Validar imagen
            // if (!req.files || !req.files.image || !req.files.image.tempFilePath) {
            //     return res.status(400).json({ msg: "Se requiere una imagen" });
            // }

            // Invocación del método
            // const imageUpload = await uploadImage(req.files.image.tempFilePath);
            // nuevoNino.image = {
            //     public_id: imageUpload.public_id,
            //     secure_url: imageUpload.secure_url,
            // };


            // Crear el token del Niño
            nuevoNino.crearToken();
            const token = nuevoNino.crearToken();

            // Email del Tutor
            const tutor = await Tutor.findById(id).select('Email_tutor').lean();
            //console.log("tutor:", tutor);
            const tutorEmail = tutor ? tutor.Email_tutor : null;

            //console.log("EMAIL:", tutorEmail);

            if (!tutorEmail) {
                return res.status(400).json({ msg: "No se pudo obtener el correo electrónico del tutor" });
            }
            // Invocar la función para el envío del correo
            await sendMail_confirmNino(tutorEmail, token, Nombre_nino);

            // Guardar en la base de datos
            await nuevoNino.save();

            // Enviar la respuesta
            res.status(200).json({ msg: "Revisa tu correo electrónico para confirmar la cuenta" });

        } catch (error) {
            console.error('Error durante el registro:', error);
            res.status(500).json({ msg: 'Error del servidor' });
        }
    } else {
        res.status(401).json({ msg: 'No autorizado' });
    }
}

const confirmCuenta = async (req, res) => {
    // Validar el token del correo
    if (!(req.params.token)) return res.status(400).json({ msg: "Lo sentimos, no se puede validar la cuenta" })
    // Verificar si en base al token existe el nino
    const NinoBDD = await Nino.findOne({ token: req.params.token })
    // Validar si el token ya fue seteado al null
    if (!NinoBDD?.token) return res.status(404).json({ msg: "La cuenta ya ha sido confirmada" })
    // Setear a null el token 
    NinoBDD.token = null
    // cambiar a true la configuración de la cuenta
    NinoBDD.confirm_tutor = true
    // Guardar cambios en BDD
    await NinoBDD.save()
    // Presentar mensaje de confirmación
    res.status(200).json({ msg: "Token confirmado, ya puedes iniciar sesión" })
}

const loginNino = async (req, res) => {
    // Capturar los datos del requests
    const { Usuario_nino, Password_nino } = req.body
    // Vallidación de campos vacíos
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" })
    // Obtener el niño en base al usuario
    const NinoBDD = await Nino.findOne({ Usuario_nino }).select("-token -updatedAt -status -__v")
    // Validar si existe el niño
    if (NinoBDD?.confirm_tutor === false) return res.status(403).json({ msg: "Lo sentimos, el tutor debe verificar su correo para confirmar la cuenta" })
    // Verificar si existe el niño
    if (!NinoBDD) return res.status(404).json({ msg: "Lo sentimos, el niño no se encuentra registrado" })
    // Validar si el password del request es el mismo de la BDD
    const verificarPassword = await NinoBDD.matchPassword(Password_nino)
    if (!verificarPassword) return res.status(404).json({ msg: "Lo sentimos, el password no es el correcto" })
    const token = generarJWT(NinoBDD._id)
    // Desestructurar la información del Nino; Mandar solo algunos campos 
    const { Nombre_nino, FN_nino, _id } = NinoBDD
    // Formatear la fecha en el niño
    const formattedFN_nino = new Date(NinoBDD.FN_nino).toLocaleDateString();
    // Presentación de datos
    res.status(200).json({
        token,
        _id,
        Nombre_nino,
        FN_nino: formattedFN_nino,
        Usuario_nino
    })
}

const perfilNino = async (req, res) => {
    if (req.headers.authorization) {
        try {
            const { authorization } = req.headers;
            const { id: tutorId } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);

            // Se obtiene el ID del niño o tutor que ingresó al sistema
            const { id } = req.params;
            try {
                // Validar ID en DBB Niño
                if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: `Lo sentimos, debe ser un id válido` });
                // Obtener información del niño en base al ID
                const nino = await Nino.findById(id).select("-Password_nino -token -updatedAt -status -confirm_tutor -createdAt -__v");
                // Validar si existe el niño
                if (!nino) {
                    return res.status(404).json({ msg: `El niño con ID ${id} no fue encontrado` });
                }

                if (id === tutorId || tutorId === nino.tutor.toString()) {

                    // Crear un nuevo objeto con la fecha formateada
                    const ninoFormateado = {
                        ...nino.toObject(),
                        FN_nino: new Date(nino.FN_nino).toLocaleDateString(),
                    };
                    // Mostrar los datos del niño
                    res.status(200).json(ninoFormateado);
                } else {
                    return res.status(401).json({ msg: 'No autorizado. Solo usuario Tutor y Niñ@' });
                }

            } catch (error) {
                res.status(500).json({ msg: 'Error al obtener información del niño', error });
            }
        } catch (error) {
            console.error('Error durante el registro:', error);
            res.status(500).json({ msg: 'Error del servidor' });
        }
    } else {
        res.status(401).json({ msg: 'No autorizado' });
    }
}

const actualizarNino = async (req, res) => {
    if (req.headers.authorization) {
        try {
            const { authorization } = req.headers;
            const { id: tutorId } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);

            // Se obtiene el ID del niño que ingresó al sistema
            const { id } = req.params;
            // Verificar campos vacíos
            if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })
            // Validar ID en DBB Niño
            if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: `Lo sentimos, debe ser un id válido` });

            // const { image } = req.files || {};
            const { Nombre_nino, FN_nino, Usuario_nino } = req.body;
            // if (!image && Object.values(req.body).includes("")) {
            //     return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
            // }

            try {
                // Ejecutar las validaciones
                await Promise.all(validarActualizacion.map(validation => validation.run(req)));
                // Obtener los resultados de la validación
                const errors = validationResult(req);
                // Verificar si hay errores
                if (!errors.isEmpty()) {
                    return res.status(422).json({ errors: errors.array() });
                }
                const ninoBDD = await Nino.findById(id);
                // Verificar si existe el niño
                if (!ninoBDD) return res.status(404).json({ msg: "Lo sentimos, el niño no se encuentra registrado" })
                // if (!image && Object.values(req.body).includes("")) {
                //     return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
                // }

                if (id === tutorId || tutorId === ninoBDD.tutor.toString()) {

                    // if (image) {
                    //     // Actualización de la imagen
                    //     if (!image) return res.send("Se requiere una imagen");

                    //     // Eliminar la imagen anterior de cloudinary
                    //     await deleteImage(ninoBDD.image.public_id);

                    //     // Cargar nueva imagen
                    //     const imageUpload = await uploadImage(image.tempFilePath);

                    //     // Actualizar en la BDD
                    //     await Nino.findByIdAndUpdate(id, {
                    //         Nombre_nino: Nombre_nino || ninoBDD.Nombre_nino,
                    //         FN_nino: FN_nino || ninoBDD.FN_nino,
                    //         Usuario_nino: Usuario_nino || ninoBDD.Usuario_nino,
                    //         image: {
                    //             public_id: imageUpload.public_id,
                    //             secure_url: imageUpload.secure_url,
                    //         },
                    //     });

                    //     // Eliminar la imagen temporal
                    //     await fs.unlink(image.tempFilePath);
                    // } else {
                    // Actualización de los campos sin la imagen
                    await Nino.findByIdAndUpdate(id, {
                        Nombre_nino: Nombre_nino || ninoBDD.Nombre_nino,
                        FN_nino: FN_nino || ninoBDD.FN_nino,
                        Usuario_nino: Usuario_nino || ninoBDD.Usuario_nino,
                    });
                    //}
                    res.status(200).json({ msg: "Actualización exitosa del niño" });
                } else {
                    return res.status(401).json({ msg: 'No autorizado. Solo usuario Tutor y Niñ@' });
                }

            } catch (error) {
                res.status(500).json({ msg: 'Error al obtener información del niño', error });
            }
        } catch (error) {
            console.error('Error durante el registro:', error);
            res.status(500).json({ msg: 'Error del servidor' });
        }
    } else {
        res.status(401).json({ msg: 'No autorizado' });
    }
};

const eliminarNino = async (req, res) => {
    if (req.headers.authorization) {
        try {
            const { authorization } = req.headers;
            const { id: tutorId } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);

            // Verificar si el token corresponde a un tutor en la base de datos
            const tutorToken = await Tutor.findOne({ _id: tutorId });
            if (!tutorToken) {
                // Si no se encuentra un tutor con el ID proporcionados
                return res.status(401).json({ msg: 'No autorizado. Solo un usuario Tutor' });
            }

            const { id } = req.params;
            try {
                if (!mongoose.Types.ObjectId.isValid(id)) {
                    return res.status(404).json({ msg: `Lo sentimos, debe ser un id válido` });
                }

                // Eliminar la imagen de cloudinary y al niño de la base de datos
                const nino = await Nino.findByIdAndDelete(id);

                if (!nino) {
                    return res.status(404).json({ msg: `Lo sentimos, no existe el Niñ@ registrado en BDD` });
                }

                //await deleteImage(nino.image.public_id);

                res.status(200).json({ msg: "Eliminación exitosa del niño" });
            } catch (error) {
                console.error("Error en la eliminación del niño:", error);
                res.status(500).json({ msg: "Error interno del servidor" });
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error del servidor' });
        }
    } else {
        res.status(401).json({ msg: 'No autorizado' });
    }
};

// nino_controller.js
const logoutNino = async (req, res) => {
    req.logout();  // Passport.js proporciona el método 'logout()' para cerrar sesión
    res.status(200).json({ msg: "Sesión cerrada exitosamente" });
}

export {
    renderAllNino,
    registrarNino,
    confirmCuenta,
    loginNino,
    perfilNino,
    actualizarNino,
    eliminarNino,
    logoutNino
}