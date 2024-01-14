import Logro from '../models/Logro.js';
import Nino from '../models/Nino.js';
import Progreso from '../models/Progreso.js';
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'

const CrearInsignia = async (req, res) => {
    try {
        // Verificar si el token corresponde a un niño en la base de datos
        const { authorization } = req.headers;
        const { id } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);
        const ninoToken = await Nino.findOne({ _id: id });
        //Verificar si el token corresponde a un niño
        if (!ninoToken) {
            return res.status(401).json({ error: 'No autorizado. Solo usuario Nino' });
        }
        // Obtener el número de actividades completadas por el niño
        const actividadesCompletadas = await Progreso.find({
            NinoId: ninoToken,
            // 3 representa haber completado exitosamente una actividad
            Completado: 3, // Ajusta según la lógica de tu aplicación
        });
        // Calcular la puntuación total en las actividades completadas
        const puntuacionActividades = actividadesCompletadas.reduce((total, actividad) => {
            return total + actividad.Puntuacion;
        }, 0);

        let logro;
        let logroDesbloqueado = false;
        let imagenURL;

        // Verificar condiciones específicas para cada Insignia
        if (actividadesCompletadas.length === 1) {
            console.log("Insignia: Primera actividad realizada")
            logroDesbloqueado = true;
            logro = 'Felicitaciones: Completaste tu primera actividad'
            imagenURL = 'https://res.cloudinary.com/dh7xuwoyg/image/upload/v1704938466/EPN/Insignia_nino/ActividadesCompletadas/InsigniaAC1_n5pkny.webp';
        } else if (actividadesCompletadas.length === 3 &&
            puntuacionActividades === 300) {
            console.log("Insignia: 100 puntos en 3 actividades")
            logroDesbloqueado = true;
            logro = 'Felicitaciones: Obtuviste 100 puntos en 3 actividades'
            imagenURL = 'https://res.cloudinary.com/dh7xuwoyg/image/upload/v1704938455/EPN/Insignia_nino/PuntosObtenido/InsigniaPO1_yf7pdk.jpg';
        }

        if (logroDesbloqueado) {
            // Verificar si el logro ya ha sido desbloqueado
            const logroExistente = await Logro.findOne({
                Nino: ninoToken,
                Descripcion_logro: logro,
                ImagenURL: imagenURL
            });

            if (!logroExistente) {
                // Crear un nuevo logro
                const nuevoLogro = new Logro({
                    Descripcion_logro: logro,
                    Nino: ninoToken,
                    ImagenURL: imagenURL
                });
                await nuevoLogro.save();
                console.log("Insignia desbloqueada");
                return res.status(200).json({ success: true, msg: 'Insignia desbloqueada y registrada' });
            } else {
                return res.status(400).json({ success: true, msg: 'Insignia ya registrada' });
            }

        } else {
            console.log("Sin insignias")
            return res.status(200).json({ success: true, msg: 'Sin insignia' });
        }
        //}
        //console.log("Sin insignias")
        //return res.status(200).json({ success: true, msg: 'Sin insignia' });
    } catch (error) {
        console.error('Error al desbloquear logros:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

const VisualizarLogro = async (req, res) => {
    try {
        // Verificar si el token corresponde a un niño en la base de datos
        const { authorization } = req.headers;
        const { id } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);
        // Verificar si el token corresponde a un nino
        const ninoToken = await Nino.findOne({ _id: id });
        if (!ninoToken) {
            return res.status(401).json({ error: 'No autorizado. Solo usuario Nino' });
        }
        try {
            // Obtener los logros de un niño
            const logro = await Logro.find({Nino:ninoToken}).select('-createdAt -updatedAt -__v -_id -Nino');
            // Validar si existe la actividad
            if (logro.length===0) {
                return res.status(200).json({ msg: `No existen logros registrados` });
            }else{
                // Respuesta con información de Logros
                res.status(200).json({ logro });
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
    CrearInsignia,
    VisualizarLogro
};
