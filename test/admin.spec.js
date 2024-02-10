const request = require('supertest');
const app = require('../src/index');
const API = 'URL.....'

/////////////////////////////////////// Registro de Tutor
 describe('Tutor POST /api/registro', () => {
  //Prueba para el registro de un tutor
  test('Registro exitoso de un tutor', async () => {
    //Datos del tutor a registrar
    const tutorData = {
        Nombre_admin: "Alex Flores",
        Email_admin: "user.adm.epn@gmail.com",
        Password_admin: "adm123EPN",
    };
    //Realiza una solicitud POST a la ruta de registro
    const response = await request.agent(API)
      .post('/api/admin/registro')
      .send(tutorData);

    //Verifica que la respuesta sea exitosa (código 200)
    expect(response.status).toBe(200);
    //Verifica que el cuerpo de la respuesta contenga el mensaje esperado
    expect(response.body.msg).toBe('Revisa tu correo electrónico para confirmar tu cuenta');
  });
});

/////////////////////////////////////// Inicio de sesión Tutor
describe('Tutor POST /api/admin/login', () => {
  // Prueba para el registro de un tutor
  test('Inicio de sesión Administrador', async () => {
    // Datos del tutor a registrar
    const adminData = {
      Email_admin: "user.adm.epn@gmail.com",
      Password_admin: "adm123EPN2"
    };
    // Realiza una solicitud POST a la ruta de registro
    const response = await request.agent(API)
      .post('/api/admin/login')
      .send(adminData);

    console.log(response.status); // Imprime el código de respuesta
    console.log(response.body)
    // Verifica que la respuesta sea exitosa (código 200)
    expect(response.status).toBe(200);
  },10000);
});

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YTk1MTBhYmEyNWViZmViZjAzOWYyMCIsImlhdCI6MTcwNTU5NTQwMSwiZXhwIjoxNzA1NjgxODAxfQ.sqgnkSum9BQrAcupgTEb-eHhZ2bJZGpWEqhbqSuO4B8';
////////////////// Registro de actividad
describe('Admin POST /api/actividad/registro', () => {
  // Prueba para el registro de un Niño
  test('Registro de actividad', async () => {
    // Datos del Niño a registrar
    const ActividadData = {
        Nombre_act: "Puzzle3",  
        Detalle_act: "Rompecabezas de números3",  
        Nivel_dificultad: "Baja",
        Recurso_video: "https://www.youtube.com/watch?v=H14uumkORzQ",
        Recurso_ejercicio: {
          Imagen_rompecabeza: "https://torange.biz/photofxnew/20/HD/de-imagen-perfil-fondo-halloween-con-la-luna-20101.jpg"
        }
    };
    // Realiza una solicitud POST a la ruta de registro de Niño
    const response = await request(API)
      .post('/api/actividad/registro')
      .set('Authorization', `Bearer ${token}`)
      .send(ActividadData);

    // Verifica que la respuesta sea exitosa (código 200)
    expect(response.status).toBe(200);
  },10000);
});

/////////////////////////////////////// Restablecer contraseña
describe('Recuperar contraseña POST /api/admin/recuperar-password', () => {
  test('Envío de email para restablecer contraseña exitoso', async () => {
      // Simular solicitud POST para restablecer contraseña
      const response = await request(API)
          .post('/api/admin/recuperar-password')
          .send({ "Email_admin": "user.adm.epn@gmail.com" });

      // Verificar que la respuesta sea exitosa (código 200)
      expect(response.status).toBe(200);
  },10000);
});


/////////////////////////////////////// Eliminación en cascada
describe('Eliminación en cascada DELETE /api/eliminacionCascada/{tutorId}', () => {
    const tutorId = "65a55e98eb7db4289b591136"; // ID de tutor de ejemplo
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YTk1MTBhYmEyNWViZmViZjAzOWYyMCIsImlhdCI6MTcwNTc5MDA0MywiZXhwIjoxNzA1ODc2NDQzfQ.zXYTTbXcrgkUOLsIrnpVmaKGg1iKje553Gm_wFYCV4M";
    test('Eliminación exitosa', async () => {
        // Simular solicitud DELETE para eliminación en cascada
        const response = await request(API)
            .delete(`/api/eliminacionCascada/${tutorId}`)
            .set('Authorization', `Bearer ${token}`);

        // Verificar que la respuesta sea exitosa (código 200)
        expect(response.status).toBe(200);
    });
});

/////////////////////////////////////// Visualización de una actividad
describe('Visualizar una actividad GET /api/actividad/{id}', () => {
    test('Visualizar una actividad', async () => {
        // Datos del usuario administrador
        const adminData = {
            Email_admin: "user.adm.epn@gmail.com",
            Password_admin: "adm123EPN"
        };
        // Realiza una solicitud POST para obtener el token de acceso
        const loginResponse = await request(API)
            .post('/api/admin/login')
            .send(adminData);

        // Extrae el token de acceso del cuerpo de la respuesta
        const token = loginResponse.body.token;
        // Id de una actividad
        const id = "65a95b0468cec25087c93494";
        // Simular solicitud GET para visualizar la actividad
        const response = await request(API)
            .get(`/api/actividad/${id}`)
            .set('Authorization', `Bearer ${token}`);

        console.log(response.status); // Imprime el código de respuesta
        console.log(response.body) // Actividad
        // Verificar que la respuesta sea exitosa (código 200)
        expect(response.status).toBe(200);
    });
});

/////////////////////////////////////// Modificar actividad
describe('Actualizar una actividad PUT /api/actividad/actualizar/{id}', () => {
    test('Actualizar una actividad', async () => {
        // Datos del usuario administrador
        const adminData = {
            Email_admin: "user.adm.epn@gmail.com",
            Password_admin: "adm123EPN"
        };
        // Realiza una solicitud POST para obtener el token de acceso
        const loginResponse = await request(API)
            .post('/api/admin/login')
            .send(adminData);

        // Extrae el token de acceso del cuerpo de la respuesta
        const token = loginResponse.body.token;
        // Id de una actividad existente
        const id = "65a952ecf02fcac36c114028";
        // Datos para actualizar la actividad
        const actividadActualizada = {
            Nombre_act: "Rompecabezas2",
            Detalle_act: "Rompecabezas tipo 2",
            Nivel_dificultad: "Alta",
            Recurso_video: "https://www.youtube.com/watch?v=NuevoVideo"
        };
        // Simular solicitud PUT para actualizar la actividad
        const response = await request(API)
            .put(`/api/actividad/actualizar/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(actividadActualizada);

        console.log(response.status); // Imprime el código de respuesta
        console.log(response.body); // Mensaje de actualización exitosa
        expect(response.status).toBe(200);
    });
});

/////////////////////////////////////// Eliminar actividad
describe('Eliminar una actividad DELETE /api/actividad/eliminar/{id}', () => {
    test('Eliminar una actividad', async () => {
        // Datos del usuario administrador
        const adminData = {
            Email_admin: "user.adm.epn@gmail.com",
            Password_admin: "adm123EPN"
        };
        // Realiza una solicitud POST para obtener el token de acceso
        const loginResponse = await request(API)
            .post('/api/admin/login')
            .send(adminData);

        // Extrae el token de acceso del cuerpo de la respuesta
        const token = loginResponse.body.token;
        // Id de una actividad existente
        const id = "65a952ecf02fcac36c114028";
        // Simular solicitud DELETE para eliminar la actividad
        const response = await request(API)
            .delete(`/api/actividad/eliminar/${id}`)
            .set('Authorization', `Bearer ${token}`);

        console.log(response.status); // Imprime el código de respuesta
        console.log(response.body); // Mensaje de eliminación exitosa
        // Verificar que la respuesta sea exitosa (código 200)
        expect(response.status).toBe(200);
    });
});
