//Importar el modelo Actividad
import Actividad from "../models/Actividad.js"
import Admin from "../models/Administrador.js"
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator';

const dificultad = ['Alta', 'Media', 'Baja'];
const validar = [
    body('Nombre_act')
        .isLength({ min: 5, max: 30 }).withMessage('El nombre de la actividad debe tener entre 5 y 30 caracteres'),

    body('Detalle_act')
        .isLength({ min: 5, max: 50 }).withMessage('El detalle de la actividad debe tener entre 5 y 50 caracteres'),

    body('Nivel_dificultad')
        .custom((value) => {
            if (!dificultad.includes(value)) {
                throw new Error('El nivel requerido es: "Alta", "Media" o "Baja"');
            }
            return true;
        })
];

const registrarActividad = async (req, res) => {
    if (req.headers.authorization) {
        try {
            const { authorization } = req.headers;
            const { id } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);

            // Verificar si el token corresponde a un administrador en la base de datos
            const adminToken = await Admin.findOne({ _id: id });

            if (!adminToken) {
                // Si no se encuentra un administrador con el ID proporcionados
                return res.status(401).json({ msg: 'No autorizado. Solo usuario administrador' });
            }

            const { Nombre_act, Detalle_act, Nivel_dificultad, Recurso_video, Recurso_ejercicio } = req.body;

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
            const verificarActividadBDD = await Actividad.findOne({ Nombre_act });
            if (verificarActividadBDD) {
                return res.status(400).json({ msg: "La actividad ya se encuentra registrada" });
            }

            // Crear la instancia del modelo
            const nuevaActividad = new Actividad({
                Nombre_act,
                Detalle_act,
                Nivel_dificultad,
                Recurso_video,
                Recurso_ejercicio
            });

            // Guardar en la base de datos
            await nuevaActividad.save();

            // Enviar la respuesta
            res.status(200).json({ msg: "Registro exitoso" });
        } catch (error) {
            console.error('Error durante el registro:', error);
            res.status(500).json({ msg: 'Error del servidor' });
        }
    } else {
        res.status(401).json({ msg: 'No autorizado' });
    }
}

const visualizarActividad = async (req, res) => {
    // Se obtiene el ID de la actividad que se ingresó al sistema
    const { id } = req.params;
    try {
        // Validar ID en DBB Actividad
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: `Lo sentimos, debe ser un id válido` });
        // Obtener información de la actividad en base al ID
        const actividad = await Actividad.findById(id).select('-createdAt -updatedAt -__v -id');
        // Validar si existe la actividad
        if (!actividad) {
            return res.status(404).json({ msg: `La actividad no fué encontrada` });
        }
        // Mostrar los datos de la actividad
        res.status(200).json(actividad);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener la información de la actividad', error });
    }
}

const actualizarActividad = async (req, res) => {
    if (req.headers.authorization) {
        try {
            const { authorization } = req.headers;
            const { id: adminId } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);

            // Verificar si el token corresponde a un administrador en la base de datos
            const adminToken = await Admin.findOne({ _id: adminId });

            if (!adminToken) {
                // Si no se encuentra un administrador con el ID proporcionados
                return res.status(401).json({ msg: 'No autorizado. Solo usuario administrador' });
            }

            // Se obtiene el ID de la actividad que se ingresó al sistema
            const { id } = req.params;
            // Validar ID en DBB Actividad
            if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: `Lo sentimos, debe ser un id válido` });

            const { Nombre_act, Detalle_act, Nivel_dificultad, Recurso_video, Recurso_ejercicio } = req.body;

            // Validación de campos vacíos
            if (Object.values(req.body).some(value => value === "")) {
                return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
            }

            try {
                // Ejecutar las validaciones
                await Promise.all(validar.map(validation => validation.run(req)));
                // Obtener los resultados de la validación
                const errors = validationResult(req);
                // Verificar si hay errores
                if (!errors.isEmpty()) {
                    return res.status(422).json({ errors: errors.array() });
                }
                const actividadBDD = await Actividad.findById(id);
                await Actividad.findByIdAndUpdate(id, {
                    Nombre_act: Nombre_act || actividadBDD.Nombre_act,
                    Detalle_act: Detalle_act || actividadBDD.Detalle_act,
                    Nivel_dificultad: Nivel_dificultad || actividadBDD.Nivel_dificultad,
                    Recurso_video: Recurso_video || actividadBDD.Recurso_video,
                    Recurso_ejercicio: Recurso_ejercicio || actividadBDD.Recurso_ejercicio,
                });
                res.status(200).json({ msg: "Actualización exitosa de la actividad" });
            } catch (error) {
                console.error("Error en la actualización de la actividad:", error);
                res.status(500).json({ msg: "Error interno del servidor" });
            }

        } catch (error) {
            console.error('Error durante el registro:', error);
            res.status(500).json({ msg: 'Error del servidor' });
        }
    } else {
        res.status(401).json({ msg: 'No autorizado' });
    }
};

const eliminarActividad = async (req, res) => {
    if (req.headers.authorization) {
        try {
            const { authorization } = req.headers;
            const { id: adminId } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);

            // Verificar si el token corresponde a un administrador en la base de datos
            const adminToken = await Admin.findOne({ _id: adminId });

            if (!adminToken) {
                // Si no se encuentra un administrador con el ID proporcionados
                return res.status(401).json({ msg: 'No autorizado. Solo usuario administrador' });
            }

            // Se obtiene el ID de la actividad que se ingresó al sistema
            const { id } = req.params;
            try {
                // Validar ID en DBB Actividad
                if (!mongoose.Types.ObjectId.isValid(id)) {
                    return res.status(404).json({ msg: `Lo sentimos, debe ser un id válido` });
                }

                // Eliminar actividad de la base de datos
                const actividad = await Actividad.findByIdAndDelete(id);

                if (!actividad) {
                    return res.status(404).json({ msg: `Lo sentimos, no existe la actividad con id: ${id}` });
                }

                res.status(200).json({ msg: "Eliminación exitosa de actividad" });
            } catch (error) {
                console.error("Error en la eliminación de la actividad:", error);
                res.status(500).json({ msg: "Error interno del servidor" });
            }
        } catch (error) {
            console.error('Error durante el registro:', error);
            res.status(500).json({ msg: 'Error del servidor' });
        }
    } else {
        res.status(401).json({ msg: 'No autorizado' });
    }

};


export {
    registrarActividad,
    visualizarActividad,
    actualizarActividad,
    eliminarActividad
}
