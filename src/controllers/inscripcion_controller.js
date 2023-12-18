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

export {InscripcionRegistro}