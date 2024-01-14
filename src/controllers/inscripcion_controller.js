//Importar los modelos necesarios
import Actividad from "../models/Actividad.js"
import Tutor from "../models/Tutor.js"
import Nino from "../models/Nino.js"
import Inscripcion from "../models/Inscripcion.js"
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'

const InscripcionRegistro = async (req, res) => {
    try {
        // Verificar si el token corresponde a un tutor en la base de datos
        const { authorization } = req.headers;
        const { id } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);
        const tutorToken = await Tutor.findOne({ _id: id });
        if (!tutorToken) {
            return res.status(401).json({ error: 'No autorizado. Solo usuario Tutor' });
        }
        // Obtener el ID del niño y actividad utilizando desestructuración
        const { ninoId, actividadId } = req.params;
        // Validar ID en DBB Niño y Actividad
        if (!mongoose.Types.ObjectId.isValid(ninoId) || !mongoose.Types.ObjectId.isValid(actividadId)) {
            return res.status(404).json({ error: 'Los IDs proporcionados no son válidos' });
        }
        // Verificar si el niño y la actividad existen
        const ninoExistente = await Nino.findById(ninoId);
        const actividadExistente = await Actividad.findById(actividadId);
        if (!ninoExistente) {
            return res.status(404).json({ error: 'El niño con el ID proporcionado no existe' });
        }
        if (!actividadExistente) {
            return res.status(404).json({ error: 'La actividad con el ID proporcionado no existe' });
        }
        // Validar existencia de inscripción en BDD
        const verificarInscripcionBDD = await Inscripcion.findOne({
            tutor: id,
            nino: ninoId,
            actividad: actividadId
        });
        if (verificarInscripcionBDD) {
            return res.status(400).json({ error: 'La inscripción ya se encuentra registrada' });
        }
        // Crear nueva inscripción y guardar en BDD
        const nuevaInscripcion = new Inscripcion({
            tutor: id,
            nino: ninoId,
            actividad: actividadId
        });
        await nuevaInscripcion.save();
        // Enviar la respuesta
        res.status(200).json({ success: true, msg: 'Inscripción exitosa' });
    } catch (error) {
        console.error('Error durante el registro:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

const RenderAllInscripcion = async (req, res) => {
    try {
        // Verificar si hay un token de autorización en las cabeceras
        //if (req.headers.authorization) {
            const { authorization } = req.headers;
            const { id } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);
            // Verificar si el token corresponde a un tutor o a un niño en la base de datos
            const tutorToken = await Tutor.findOne({ _id: id });
            const ninoToken = await Nino.findOne({ _id: id });
            if (!tutorToken && !ninoToken) {
                // Si no se encuentra un tutor ni un niño con el ID proporcionado
                return res.status(401).json({ msg: 'No autorizado. Solo un usuario Tutor o Niño' });
            }
        //} else {
            // Si no hay un token de autorización en las cabeceras
            //return res.status(401).json({ msg: 'No autorizado' });
        //}

        try {
            // Se obtiene el ID del niño
            const { ninoid } = req.params;
            // Validar ID en DBB Niño
            if (!mongoose.Types.ObjectId.isValid(ninoid)) return res.status(404).json({ msg: `Lo sentimos, debe ser un id válido` });
            // Obtener información del niño en base al ID
            const nino = await Nino.findById(ninoid).select('-createdAt -updatedAt -__v');
            // Validar si existe el niño
            if (!nino) {
                return res.status(404).json({ msg: `EL niño no fue encontrado` });
            }
            if (tutorToken) {
                if (!nino.tutor.equals(tutorToken._id))  {
                    return res.status(401).json({ msg: 'El usuario tutor no tiene autorización a la infomación del niño' });
                }
            } else {
                if (!nino._id.equals(ninoToken._id)) {
                    return res.status(401).json({ msg: 'El usuario niño no tiene autorización a esta información' });
                }
            }

            // Obtener las inscripciones del niño
            const inscripciones = await Inscripcion.find({ nino: ninoid }).select("-createdAt -updatedAt -__v").lean();
            // Si no existen registros de actividades
            if (inscripciones.length === 0) {
                return res.status(200).json({ msg: 'No hay inscripciones registradas' });
            }
            // Obtener actividades relacionadas con las inscripciones
            const actividades = await Actividad.find({ _id: { $in: inscripciones.map(inscripcion => inscripcion.actividad) } }).select("-createdAt -updatedAt -__v").lean();

            // Respuesta con información de actividades
            res.status(200).json({ actividades });
        } catch (error) {
            console.error('Error al obtener la información del niño:', error);
            res.status(500).json({ msg: 'Error al obtener la información del niño', error });
        }
    } catch (error) {
        console.error('Error en el proceso:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

export {
    InscripcionRegistro,
    RenderAllInscripcion
}