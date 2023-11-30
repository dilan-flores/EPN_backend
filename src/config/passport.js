// src/config/passport.js
import passport from 'passport';
import LocalStrategy from 'passport-local';
import Tutor from '../models/Tutor.js';

passport.use(new LocalStrategy(
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

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const tutorBDD = await Tutor.findById(id);
    done(null, tutorBDD);
  } catch (error) {
    done(error);
  }
});

// npm install passport passport-local express-session
