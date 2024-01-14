//Importar los modelos necesarios
import Actividad from "../models/Actividad.js"
import Nino from "../models/Nino.js"
import Progreso from "../models/Progreso.js"
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'

import { body, validationResult } from 'express-validator';

const validar = [
    body('Puntuacion')
        .isNumeric().withMessage('La puntuación debe contener solo números')
        .isLength({ min: 1, max: 3 }).withMessage('La puntuación es /100'),

    body('Completado')
        .isNumeric().withMessage('Los ejercicios de una actividad se registran por números realizados')
        .isLength({ min: 1, max: 3 }).withMessage('Exceso de ejercicios en una actividad'),
];

const ProgresoRegistro = async (req, res) => {
    try {
        // Verificar si el token corresponde a un tutor en la base de datos
        const { authorization } = req.headers;
        const { id } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);
        const ninoToken = await Nino.findOne({ _id: id });

        if (!ninoToken) {
            return res.status(401).json({ error: 'No autorizado. Solo usuario Nino' });
        }

        // Obtener el ID del niño y actividad utilizando desestructuración
        const { Puntuacion, Completado } = req.body;

        // Se obtiene el ID de la actividad
        const { ActividadId } = req.params;

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

        // Validar ID en DBB Niño y Actividad
        if (!mongoose.Types.ObjectId.isValid(ActividadId) || !mongoose.Types.ObjectId.isValid(ninoToken)) {
            return res.status(404).json({ error: 'ID de actividad o niño no es válido' });
        }

        // Verificar si la actividad existe
        const actividadExistente = await Actividad.findById(ActividadId);
        if (!actividadExistente) {
            return res.status(404).json({ error: 'La actividad con el ID proporcionado no existe' });
        }

        // Validar existencia de progreso en BDD
        const verificarprogresoBDD = await Progreso.findOne({
            ActividadId: ActividadId,
            NinoId: ninoToken
        });

        if (verificarprogresoBDD) {
            // Si en el registro también coincide los campos: "Puntuación, Completado"
            if (
                verificarprogresoBDD.Puntuacion === Puntuacion &&
                verificarprogresoBDD.Completado === Completado
            ) {
                //Mensaje de que ya está registrado y no realizar cambios
                return res.status(400).json({ error: 'El progreso del niño ya se encuentra registrada' });
            } else {
                // Los campos no coinciden y es necesario actualizar: "Puntuacion" y "Completado"
                await Progreso.updateOne(
                    { ActividadId: ActividadId, NinoId: ninoToken },
                    { Puntuacion: Puntuacion, Completado: Completado }
                );
                return res.status(200).json({ success: true, msg: 'Actualización exitosa del progreso' });
            }
        } else {
            // Ingresar un nuevo registro
            const nuevoProgreso = new Progreso({
                Puntuacion: Puntuacion,
                Completado: Completado,
                ActividadId: ActividadId,
                NinoId: ninoToken
            });
            await nuevoProgreso.save();
            return res.status(200).json({ success: true, msg: 'Registro de progreso exitoso' });
        }
    } catch (error) {
        console.error('Error durante el registro:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

const VisualizarProgreso = async (req, res) => {
    try {
        // Verificar si el token corresponde a un tutor en la base de datos
        const { authorization } = req.headers;
        const { id } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);
        // Verificar si el token corresponde a un tutor
        const ninoToken = await Nino.findOne({ _id: id });
        if (!ninoToken) {
            return res.status(401).json({ error: 'No autorizado. Solo usuario Nino' });
        }
        try {
            // Se obtiene el ID del niño
            const { actividadID } = req.params;
            // Validar ID en DBB Niño
            if (!mongoose.Types.ObjectId.isValid(actividadID)) return res.status(404).json({ msg: `Lo sentimos, debe ser un id válido` });

            // Obtener información del niño en base al ID
            const actividad = await Actividad.findById(actividadID).select('-createdAt -updatedAt -__v');
            // Validar si existe la actividad
            if (!actividad) {
                return res.status(404).json({ msg: `La actividad no fue encontrada` });
            }
            // Obtener información del niño en base al ID
            const progreso = await Progreso.findOne({ ActividadId: actividadID, NinoId: ninoToken }).select('-createdAt -updatedAt -__v');
            // Validar si existe el niño
            if (!progreso) {
                return res.status(404).json({ msg: `No existe progreso registrado en BDD` });
            } else {
                // Respuesta con información de progreso
                res.status(200).json({ progreso });
            }
        } catch (error) {
            console.error('Error al obtener la información del niño:', error);
            res.status(500).json({ msg: 'Error al obtener la información del niño', error });
        }
    } catch (error) {
        console.error('Error durante el proceso:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

export {
    ProgresoRegistro,
    VisualizarProgreso
}