const request = require('supertest')
const app = require('../src/index')
const mongoose = require('mongoose')
const tutor = require('../src/models/Tutor');
const express = require("express")

// Configuración de las pruebas
beforeAll(async()=>{
  const url = process.env.MONGODB_URI_TEST
  await mongoose.connect(url,{useNewUrlParser: true});
})

// Descripción de las pruebas
describe('Tutor POST /api/registro', () => {
  // Prueba para el registro de un tutor
  test('Registro exitoso de un tutor', async () => {
    // Datos del tutor a registrar
    const tutorData = {
      Nombre_tutor: 'Alexander Quimbia',
      Rol_tutor: 'Familiar',
      Celular_tutor: '0985436487',
      Email_tutor: 'dilan.flores@epn.edu.ec',
      Password_tutor: 'DAFQ1234',
    };
    //await tutor.insertMany(tutorData);

    // Realiza una solicitud POST a la ruta de registro
    const response = await supertest(app)
      .post('/api/registro')
      .send(tutorData);

    // Verifica que la respuesta sea exitosa (código 200)
    expect(response.status).toBe(200);

    // Verifica que el cuerpo de la respuesta contenga el mensaje esperado
    expect(response.body.msg).toBe('Revisa tu correo electrónico para confirmar tu cuenta');
  });
});

// Limpiar las colecciones de la Base de Datos después de las pruebas
afterEach(async ()=>{
  await tutor.deleteMany();
})

// Cerrar la conexión con la Base de datos después de las pruebas
afterAll(async()=>{
  await mongoose.connection.close();
})
