const request = require('supertest');
const app = require('../src/index');
const API = 'URL.....'

/////////////////////////////////////// Registro de Tutor 
describe('Tutor POST /api/registro', () => {
  // Prueba para el registro de un tutor
  test('Registro exitoso de un tutor', async () => {
    // Datos del tutor a registrar
    const tutorData = {
      Nombre_tutor: 'Alexander Quimbia',
      Rol_tutor: 'Familiar',
      Celular_tutor: '0985436487',
      Email_tutor: 'user.tutor.epn@gmail.com',
      Password_tutor: 'tutor123EPN',
    };
    // Realiza una solicitud POST a la ruta de registro
    const response = await request.agent(API)
      .post('/api/registro')
      .send(tutorData);

    // Verifica que la respuesta sea exitosa (código 200)
    expect(response.status).toBe(200);
    // Verifica que el cuerpo de la respuesta contenga el mensaje esperado
    expect(response.body.msg).toBe('Revisa tu correo electrónico para confirmar tu cuenta');
  });
});

/////////////////////////////////////// Inicio de sesión Niño
describe('Tutor POST /api/login', () => {
  // Prueba para el registro de un tutor
  test('Login del Tutor', async () => {
    // Datos del tutor a registrar
    const tutorData = {
      Email_tutor: "user.tutor.epn@gmail.com",
      Password_tutor: "tutor123EPN"
    };
    // Realiza una solicitud POST a la ruta de registro
    const response = await request.agent(API)
      .post('/api/login')
      .send(tutorData);
    
    console.log(response.status); // Imprime el código de respuesta
    console.log(response.body)
    // Verifica que la respuesta sea exitosa (código 200)
    expect(response.status).toBe(200);
  });
});

/////////////////////////////////////// Restablecer contraseña
describe('Recuperar contraseña POST /api/recuperar-password', () => {
  test('Envío de email para restablecer contraseña exitoso', async () => {
      // Simular solicitud POST para restablecer contraseña
      const response = await request(API)
          .post('/api/recuperar-password')
          .send({ "Email_tutor": "user.tutor.epn@gmail.com" });

      // Verificar que la respuesta sea exitosa (código 200)
      expect(response.status).toBe(200);
  });
});

/////////////////////////////////////// Nueva contraseña
describe('Nuevo password POST /api/nuevo-password/{token}', () => {
  const token = "w5y4eao6ik9";

  test('Cambio de contraseña exitoso', async () => {
      // Simular solicitud POST para cambiar la contraseña
      const response = await request(API)
          .post(`/api/nuevo-password/${token}`)
          .send({ password: "DAFQ1234", confirmpassword: "DAFQ1234" });

      // Verificar que la respuesta indique cambio exitoso (código 200)
      expect(response.status).toBe(200);
  });
});

/////////////////////////////////////// Visualizar perfil
//const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YTU1ZTk4ZWI3ZGI0Mjg5YjU5MTEzNiIsImlhdCI6MTcwNTM3MzY3MywiZXhwIjoxNzA1NDYwMDczfQ.sIH_DbTzFxzig7Uj8NCnEgpINAYh662566fivTl4Zjg';
describe('Tutor GET /api/tutor/:id', () => {
  // Prueba para obtener el perfil de un tutor
  test('Obtener perfil de un tutor', async () => {
    // ID del tutor para la prueba
    const tutorId = '65a55e98eb7db4289b591136';

    // Realiza una solicitud GET a la ruta de perfil del tutor
    const response = await request(API)
      .get(`/api/tutor/${tutorId}`)
      .set('Authorization', `Bearer ${token}`); // Establece el token en el encabezado

    // Imprime el código de respuesta
    console.log(response.status);
    console.log(response.body);

    // Verifica que la respuesta sea exitosa (código 200)
    expect(response.status).toBe(200);
  });
});

/////////////////////////////////////// Cerrar sesión
describe('Tutor POST /api/logout', () => {
  // Prueba para cerrar sesión de un tutor
  test('Cerrar sesión del tutor', async () => {
    // Realiza una solicitud POST a la ruta de cierre de sesión
    const response = await request(API)
      .post('/api/logout')
      .set('Authorization', `Bearer ${token}`);  // Establece el token en el encabezado

    console.log(response.status); // Imprime el código de respuesta
    console.log(response.body);

    // Verifica que la respuesta sea exitosa (código 200)
    expect(response.status).toBe(200);
  });
});

/////////////////////////////////////// Registro de Niño
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YThiNDJlNjU0YmZhYTRjZTlhN2Q0OCIsImlhdCI6MTcwNTU1NzU0MCwiZXhwIjoxNzA1NjQzOTQwfQ.39bmA_t6YgP6zacmlBUjf8KXBmq7FmFTU1oQpG5_TeY';
describe('Niño POST /api/nin@s/registro', () => {
  // Prueba para el registro de un Niño
  test('Registro exitoso de un Niño', async () => {
    // Datos del Niño a registrar
    const ninoData = {
      Nombre_nino: 'AlexY',
      FN_nino: '2012-12-05',
      Usuario_nino: 'AlexY',
      Password_nino: 'AAYY1234',
    };
    
    // Realiza una solicitud POST a la ruta de registro de Niño
    const response = await request(API)
      .post('/api/nin@s/registro')
      .set('Authorization', `Bearer ${token}`)
      .send(ninoData);

    // Verifica que la respuesta sea exitosa (código 200)
    expect(response.status).toBe(200);
  },10000);
});

/////////////////////////////////////// Visualizar actividades
describe('Actividades GET /api/actividades', () => {
    test('Visualización de actividades registradas', async () => {
      // Token de autorización
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YThiNDJlNjU0YmZhYTRjZTlhN2Q0OCIsImlhdCI6MTcwNTYwMjY4NSwiZXhwIjoxNzA1Njg5MDg1fQ.R-8H1y16sHuN6BixJqpEf43Thl8B420n-XHcHbfz6EE';

      // Realiza una solicitud GET a la ruta de visualización de actividades
      const response = await request(API)
        .get('/api/actividades')
        .set('Authorization', `Bearer ${token}`); // Establece el token en el encabezado
  
      // Imprime el código de respuesta y el cuerpo de la respuesta
      console.log(response.status);
      console.log(response.body);
  
      // Verifica que la respuesta sea exitosa (código 200)
      expect(response.status).toBe(200);
    });
  });

/////////////////////////////////////// Inscripciones
describe('Registro de usuario Niño POST /api/nin@s/registro', () => {
    test('Registro exitoso de usuario Niño', async () => {
        // Datos del usuario administrador para iniciar sesión y obtener el token
        const tutorData = {
            Email_tutor: "user.tutor.epn@gmail.com",
            Password_tutor: "tutor123EPN"
        };

        // Realiza una solicitud POST para obtener el token de acceso del administrador
        const loginResponse = await request(API)
            .post('/api/login')
            .send(tutorData);

        // Extrae el token de acceso del cuerpo de la respuesta
        const token = loginResponse.body.token;
        console.log(loginResponse.body.token);
        // Datos del usuario Niño a registrar
        const ninoData = {
            Nombre_nino: "AlexY",
            FN_nino: "2012-12-05",
            Usuario_nino: "AlexY",
            Password_nino: "AAYY1234"
        };

        // Realiza una solicitud POST a la ruta de registro de Niño utilizando el token de administrador
        const response = await request(API)
            .post('/api/nin@s/registro')
            .set('Authorization', `Bearer ${token}`)
            .send(ninoData);

        console.log(response.status); // Imprime el código de respuesta
        console.log(response.body); // Mensaje de registro exitoso

        // Verificar que la respuesta sea exitosa (código 200)
        expect(response.status).toBe(200);
    },10000);
});

/////////////////////////////////////// Visualizar niño
describe('Visualizar usuario Niño GET /api/nin@s/{id}', () => {
    test('Visualización exitosa de usuario Niño', async () => {
        // Datos del usuario tutor para iniciar sesión y obtener el token
        const tutorData = {
            Email_tutor: "user.tutor.epn@gmail.com",
            Password_tutor: "tutor123EPN"
        };
        // Realiza una solicitud POST para obtener el token de acceso del tutor
        const loginResponse = await request(API)
            .post('/api/login')
            .send(tutorData);

        // Extrae el token de acceso del cuerpo de la respuesta
        const token = loginResponse.body.token;
        // Id de un niño existente (debes tener un id válido en tu base de datos)
        const idNino = "65ae072d608dc3e4f51e43f3";
        // Realiza una solicitud GET a la ruta para visualizar un Niño utilizando el token de tutor
        const response = await request(API)
            .get(`/api/nin@s/${idNino}`)
            .set('Authorization', `Bearer ${token}`);

        console.log(response.status); // Imprime el código de respuesta
        console.log(response.body); // Datos del Niño
        // Verificar que la respuesta sea exitosa (código 200)
        expect(response.status).toBe(200);
    });
});

/////////////////////////////////////// Modificar usuario Niño
describe('Actualizar perfil de Niño PUT /api/nin@s/actualizar/{id}', () => {
    test('Actualización exitosa de perfil de Niño', async () => {
        // Datos del usuario tutor para iniciar sesión y obtener el token
        const tutorData = {
            Email_tutor: "user.tutor.epn@gmail.com",
            Password_tutor: "tutor123EPN"
        };
        // Realiza una solicitud POST para obtener el token de acceso del tutor
        const loginResponse = await request(API)
            .post('/api/login')
            .send(tutorData);

        // Extrae el token de acceso del cuerpo de la respuesta
        const token = loginResponse.body.token;
        // Id de un niño existente (debes tener un id válido en tu base de datos)
        const idNino = "65ae072d608dc3e4f51e43f3";
        // Datos del Niño a actualizar
        const ninoDataActualizar = {
            Nombre_nino: "Alex :)",
            FN_nino: "2013-08-02",
            Usuario_nino: "AlexY"
        };
        // Realiza una solicitud PUT a la ruta para actualizar el perfil de un Niño utilizando el token de tutor
        const response = await request(API)
            .put(`/api/nin@s/actualizar/${idNino}`)
            .set('Authorization', `Bearer ${token}`)
            .send(ninoDataActualizar);

        console.log(response.status); // Imprime el código de respuesta
        console.log(response.body); // Mensaje de actualización exitosa
        // Verificar que la respuesta sea exitosa (código 200)
        expect(response.status).toBe(200);
    });
});

/////////////////////////////////////// Eliminar usuario Niño
describe('Eliminar perfil de Niño DELETE /api/nin@s/eliminar/{id}', () => {
    test('Eliminación exitosa de perfil de Niño', async () => {
        // Datos del usuario tutor para iniciar sesión y obtener el token
        const tutorData = {
            Email_tutor: "user.tutor.epn@gmail.comc",
            Password_tutor: "tutor123EPN"
        };
        // Realiza una solicitud POST para obtener el token de acceso del tutor
        const loginResponse = await request(API)
            .post('/api/login')
            .send(tutorData);

        // Extrae el token de acceso del cuerpo de la respuesta
        const token = loginResponse.body.token;
        // Id de un niño existente (debes tener un id válido en tu base de datos)
        const idNino = "65ae072d608dc3e4f51e43f3";
        // Realiza una solicitud DELETE a la ruta para eliminar el perfil de un Niño utilizando el token de tutor
        const response = await request(API)
            .delete(`/api/nin@s/eliminar/${idNino}`)
            .set('Authorization', `Bearer ${token}`);

        console.log(response.status); // Imprime el código de respuesta
        console.log(response.body); // Mensaje de eliminación exitosa
        // Verificar que la respuesta sea exitosa (código 200)
        expect(response.status).toBe(200);
    });
});