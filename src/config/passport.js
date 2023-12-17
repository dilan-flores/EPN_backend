// passport.js

import passport from 'passport';
import LocalStrategy from 'passport-local';
import Tutor from '../models/Tutor.js';
import Nino from '../models/Nino.js';

// Estrategia de autenticación para el Tutor
passport.use('tutor', new LocalStrategy(
  { usernameField: 'Email_tutor', passwordField: 'Password_tutor' },
  async (email, password, done) => {
    try {
      const tutorBDD = await Tutor.findOne({ Email_tutor: email });
      if (!tutorBDD) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }

      const passwordMatch = await tutorBDD.matchPassword(password);
      if (!passwordMatch) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }

      return done(null, tutorBDD);
    } catch (error) {
      return done(error);
    }
  }
));

// Estrategia de autenticación para el Niño
passport.use('nino', new LocalStrategy(
  { usernameField: 'Usuario_nino', passwordField: 'Password_nino' },
  async (username, password, done) => {
    try {
      const ninoBDD = await Nino.findOne({ Usuario_nino: username });
      if (!ninoBDD) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }

      const passwordMatch = await ninoBDD.matchPassword(password);
      if (!passwordMatch) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }

      return done(null, ninoBDD);
    } catch (error) {
      return done(error);
    }
  }
));

// ADMINISTRADOR:
// Estrategia de autenticación para el Administrador
passport.use('admin', new LocalStrategy(
  { usernameField: 'Email_admin', passwordField: 'Password_admin' },
  async (email, password, done) => {
    try {
      const adminBDD = await Admin.findOne({ Email_admin: email });
      if (!adminBDD) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }

      const passwordMatch = await adminBDD.matchPassword(password);
      if (!passwordMatch) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }

      return done(null, adminBDD);
    } catch (error) {
      return done(error);
    }
  }
));

// Serialización y deserialización para el Administrador, tutor y Niño
passport.serializeUser((user, done) => {
  if (user instanceof Tutor) {
    done(null, { id: user._id, role: 'tutor' });
  } else if (user instanceof Nino) {
    done(null, { id: user._id, role: 'nino' });
  } else if (user instanceof Admin) {
    done(null, { id: user._id, role: 'admin' });
  } else {
    done(new Error('Tipo de usuario no reconocido'));
  }
});

passport.deserializeUser(async (sessionInfo, done) => {
  try {
    const { id, role } = sessionInfo;
    if (role === 'tutor') {
      const tutorBDD = await Tutor.findById(id);
      done(null, tutorBDD);
    } else if (role === 'nino') {
      const ninoBDD = await Nino.findById(id);
      done(null, ninoBDD);
    } else if (role === 'admin') {
      const adminBDD = await Admin.findById(id);
      done(null, adminBDD);
    } else {
      done(new Error('Rol de usuario no reconocido'));
    }
  } catch (error) {
    done(error);
  }
});
