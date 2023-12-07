//Importar el modelo Niño
import Nino from "../models/Nino.js"
//, sendMailToRecoveryPassword_Nino 
import { sendMail_confirmNino } from "../config/nodemailer.js"
import { uploadImage, deleteImage } from "../config/cloudinary.js"
import fs from "fs-extra"//manipulación de directorios e imágenes en cloudinary

import jwt from 'jsonwebtoken'
import Tutor from '../models/Tutor.js'

const renderAllNino = async (req, res) => {
    if (req.headers.authorization) {
        try {
            const { authorization } = req.headers;
            const { id } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);
            console.log("Autenticación exitosa:", id);

            const ninos = await Nino.find({ tutor: id }).lean();

            if (ninos.length === 0) {
                return res.status(200).json({ msg: 'No hay niños asociados a este tutor' });
            }

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
            console.log("Autenticación exitosa:", id);

            const { Usuario_nino, Password_nino, Nombre_nino, FN_nino } = req.body;

            // Validar los campos vacíos
            if (!Usuario_nino || !Password_nino || !Nombre_nino || !FN_nino) {
                return res.status(400).json({ msg: "Todos los campos son obligatorios" });
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
            if (!req.files || !req.files.image || !req.files.image.tempFilePath) {
                return res.status(400).json({ msg: "Se requiere una imagen" });
            }

            // Invocación del método
            const imageUpload = await uploadImage(req.files.image.tempFilePath);
            nuevoNino.image = {
                public_id: imageUpload.public_id,
                secure_url: imageUpload.secure_url,
            };


            // Crear el token del Niño
            nuevoNino.crearToken();
            const token = nuevoNino.crearToken();

            // Email del Tutor
            const tutorEmail = await Tutor.findById(id).select('Email_tutor').lean();

            // Invocar la función para el envío del correo
            await sendMail_confirmNino(tutorEmail, token, Nombre_nino);

            // Guardar en la base de datos
            await nuevoNino.save();

            // Enviar la respuesta
            res.status(200).json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta" });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error del servidor' });
        }
    } else {
        res.status(401).json({ msg: 'No autorizado' });
    }
}


const perfilNino = async (req, res) => {
    const { id } = req.params;
    try {
        const nino = await Nino.findById(id).select('-createdAt -updatedAt -__v -id')

        if (!nino) {
            return res.status(404).json({ msg: `Elnino con ID ${id} no fue encontrado` });
        }

        res.status(200).json(nino);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener información del niño', error });
    }
}

const actualizarNino = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ msg: `Lo sentimos, debe ser un id válido` });
    }

    const { image } = req.files || {};
    const { Nombre_nino, FN_nino, Usuario_nino } = req.body;

    if (!image && Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    try {
        const ninoBDD = await Nino.findById(id);

        if (image) {
            // Actualización de la imagen
            if (!image) return res.send("Se requiere una imagen");

            // Eliminar la imagen anterior de cloudinary
            await deleteImage(ninoBDD.image.public_id);

            // Cargar nueva imagen
            const imageUpload = await uploadImage(image.tempFilePath);

            // Actualizar en la BDD
            await Nino.findByIdAndUpdate(id, {
                Nombre_nino: Nombre_nino || ninoBDD.Nombre_nino,
                FN_nino: FN_nino || ninoBDD.FN_nino,
                Usuario_nino: Usuario_nino || ninoBDD.Usuario_nino,
                image: {
                    public_id: imageUpload.public_id,
                    secure_url: imageUpload.secure_url,
                },
            });

            // Eliminar la imagen temporal
            await fs.unlink(image.tempFilePath);
        } else {
            // Actualización de los campos sin la imagen
            await Nino.findByIdAndUpdate(id, {
                Nombre_nino: Nombre_nino || ninoBDD.Nombre_nino,
                FN_nino: FN_nino || ninoBDD.FN_nino,
                Usuario_nino: Usuario_nino || ninoBDD.Usuario_nino,
            });
        }

        res.status(200).json({ msg: "Actualización exitosa del niño" });
    } catch (error) {
        console.error("Error en la actualización del niño:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

const eliminarNino = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ msg: `Lo sentimos, no existe el Niñ@ ${id}` });
        }

        // Eliminar la imagen de cloudinary y al niño de la base de datos
        const nino = await Nino.findByIdAndDelete(id);

        if (!nino) {
            return res.status(404).json({ msg: `Lo sentimos, no existe el Niñ@ ${id}` });
        }

        await deleteImage(nino.image.public_id);

        res.status(200).json({ msg: "Eliminación exitosa del niño" });
    } catch (error) {
        console.error("Error en la eliminación del niño:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

export {
    renderAllNino,
    registrarNino,
    perfilNino,
    actualizarNino,
    eliminarNino
}