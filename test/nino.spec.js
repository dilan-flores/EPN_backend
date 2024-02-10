const request = require('supertest');
const app = require('../src/index');
const API = 'URL.....'

/////////////////////////////////////// Inicio de sesión
describe('Tutor POST /api/nin@s/login', () => {
  // Prueba para el registro de un tutor
  test('Inicio de sesión Niño', async () => {
    // Datos del tutor a registrar
    const NinoData = {
        Usuario_nino: 'AlexY',
        Password_nino: 'AAYY1234'
    };
    // Realiza una solicitud POST a la ruta de registro
    const response = await request.agent(API)
      .post('/api/nin@s/login')
      .send(NinoData);

    console.log(response.status); // Imprime el código de respuesta
    console.log(response.body)
    // Verifica que la respuesta sea exitosa (código 200)
    expect(response.status).toBe(200);
  });
});

/////////////////////////////////////// Restablecer contraseña
describe('Recuperar contraseña POST /api/nin@/recuperar-password', () => {
  test('Envío de email para restablecer contraseña exitoso', async () => {
      // Simular solicitud POST para restablecer contraseña
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YThiNDJlNjU0YmZhYTRjZTlhN2Q0OCIsImlhdCI6MTcwNTc4NTgzOSwiZXhwIjoxNzA1ODcyMjM5fQ.YW1xbf4ufZkIMr1J_uQFMbIZEv71t0cTNp50LVaYSkU';
      const response = await request(API)
          .post('/api/nin@/recuperar-password')
          .set('Authorization', `Bearer ${token}`)
          .send({ "Usuario_nino": "AlexY" });

      // Verificar que la respuesta sea exitosa (código 200)
      expect(response.status).toBe(200);
  },10000);
});

/////////////////////////////////////// Visualización de perfil
describe('Niño GET /api/nin@s/:id', () => {
    // Prueba para obtener el perfil de un Niño
    test('Obtener perfil de un Niño', async () => {
      // ID del Niño para la prueba
      const ninoId = '65a8ca45218f38ea50bfd7ec';
      // Token de autorización (puedes obtenerlo de tu implementación o simularlo)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YThjYTQ1MjE4ZjM4ZWE1MGJmZDdlYyIsImlhdCI6MTcwNTU5NjEyMSwiZXhwIjoxNzA1NjgyNTIxfQ.lSBheLB59HnPo3KANq-wKAuby5rNa33pl3qBvOpSZ-c';
      // Realiza una solicitud GET a la ruta de perfil del Niño
      const response = await request(API)
        .get(`/api/nin@s/${ninoId}`)
        .set('Authorization', `Bearer ${token}`);
      // Imprime el código de respuesta y el cuerpo de la respuesta
      console.log(response.status);
      console.log(response.body);
      // Verifica que la respuesta sea exitosa (código 200)
      expect(response.status).toBe(200);
    });
  });

/////////////////////////////////////// Actualizar perfil
describe('Niño PUT /api/nin@s/actualizar/:id', () => {
    // Prueba para actualizar el perfil de un Niño
    test('Actualización de perfil Niño', async () => {
      // ID del Niño para la prueba
      const ninoId = '65a8ca45218f38ea50bfd7ec';
      // Token de autorización (puedes obtenerlo de tu implementación o simularlo)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YThjYTQ1MjE4ZjM4ZWE1MGJmZDdlYyIsImlhdCI6MTcwNTU5NjEyMSwiZXhwIjoxNzA1NjgyNTIxfQ.lSBheLB59HnPo3KANq-wKAuby5rNa33pl3qBvOpSZ-c';

      // Datos a actualizar
      const datosActualizar = {
        Nombre_nino: 'Alex :)',
        FN_nino: '2013-08-02',
        Usuario_nino: 'AlexY',
      };

      // Realiza una solicitud PUT a la ruta de actualización del perfil del Niño
      const response = await request(API)
        .put(`/api/nin@s/actualizar/${ninoId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(datosActualizar);

      // Imprime el código de respuesta y el cuerpo de la respuesta
      console.log(response.status);
      console.log(response.body);

      // Verifica que la respuesta sea exitosa (código 200)
      expect(response.status).toBe(200);
    });
  });

/////////////////////////////////////// Visualización de actividades en las que está inscrito
describe('Inscripciones GET /api/inscripciones/:ninoid', () => {
    test('Obtener todas las inscripciones de un niño', async () => {
      // ID del niño para la prueba
      const ninoid = '65a8ca45218f38ea50bfd7ec';
      // Token del niño (inicio de sesión)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YThjYTQ1MjE4ZjM4ZWE1MGJmZDdlYyIsImlhdCI6MTcwNTYwNDczNSwiZXhwIjoxNzA1NjkxMTM1fQ.tOKX9D5KwoaQL7bSrfOvP8GxbbhVNZfXtJ7AmzMH3sA';
      // Realiza una solicitud GET a la ruta de obtener inscripciones de un niño
      const response = await request(API)
        .get(`/api/inscripciones/${ninoid}`)
        .set('Authorization', `Bearer ${token}`); // Establece el token en el encabezado

      // Imprime el código de respuesta y el cuerpo de la respuesta
      console.log(response.status);
      console.log(response.body);

      // Verifica que la respuesta sea exitosa (código 200)
      expect(response.status).toBe(200);
    },10000);
  });


/////////////////////////////////////// Progreso 
describe('Registro de progreso POST /api/progreso/registro/{ActividadId}', () => {
    test('Registro de progreso exitoso', async () => {
        const ninoData = {
            Usuario_nino: "AlexY",
            Password_nino: "AAYY1234"
        };
        // Realiza una solicitud POST para obtener el token de acceso del tutor
        const loginResponse = await request(API)
            .post('/api/nin@s/login')
            .send(ninoData);

        // Extrae el token de acceso del cuerpo de la respuesta
        const token = loginResponse.body.token;
        console.log(loginResponse.body.token);
        const actividadId = "65a95b0468cec25087c93494"; // ID de actividad de ejemplo
        // Simular solicitud POST para registrar progreso
        const response = await request(API)
            .post(`/api/progreso/registro/${actividadId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ "Puntuacion": 100, "Completado": 3 });
        // Verificar que la respuesta indique registro exitoso (código 200)
        expect(response.status).toBe(200);
    });
});

/////////////////////////////////////// Visualizar progreso
describe('Obtener progreso de una actividad GET /api/progreso/{actividadID}', () => {
    test('Obtener progreso exitoso', async () => {
        const ninoData = {
            Usuario_nino: "AlexY",
            Password_nino: "AAYY1234"
        };
        // Realiza una solicitud POST para obtener el token de acceso del niño
        const loginResponse = await request(API)
            .post('/api/nin@s/login')
            .send(ninoData);

        // Extrae el token de acceso del cuerpo de la respuesta
        const token = loginResponse.body.token;
        const actividadID = "65a95b0468cec25087c93494"; // ID de la actividad de ejemplo
        // Simular solicitud GET para obtener el progreso de la actividad
        const response = await request(API)
            .get(`/api/progreso/${actividadID}`)
            .set('Authorization', `Bearer ${token}`);

        console.log(response.status); // Imprime el código de respuesta
        console.log(response.body); // Datos de progreso obtenidos
        // Verificar que la respuesta sea exitosa (código 200)
        expect(response.status).toBe(200);
    });
});

/////////////////////////////////////// Logros
describe('Visualizar logros GET /api/insignias', () => {
    test('Visualización de logros exitosa', async () => {
        const ninoData = {
            Usuario_nino: "AlexY",
            Password_nino: "AAYY1234"
        };
        // Realiza una solicitud POST para obtener el token de acceso del niño
        const loginResponse = await request(API)
            .post('/api/nin@s/login')
            .send(ninoData);

        // Extrae el token de acceso del cuerpo de la respuesta
        const token = loginResponse.body.token;

        const response = await request(API)
            .get('/api/insignias')
            .set('Authorization', `Bearer ${token}`);

        // Verificar que la respuesta sea exitosa (código 200)
        expect(response.status).toBe(200);
    });
});

/////////////////////////////////////// Registro de logros personales
describe('Registro de logro POST /api/insignia/registro', () => {
    test('Registro de logro exitoso', async () => {
        const ninoData = {
            Usuario_nino: "AlexY",
            Password_nino: "AAYY1234"
        };

        // Realiza una solicitud POST para obtener el token de acceso del niño
        const loginResponse = await request(API)
            .post('/api/nin@s/login')
            .send(ninoData);

        // Extrae el token de acceso del cuerpo de la respuesta
        const token = loginResponse.body.token;

        // Simular solicitud POST para registrar un logro para el niño autenticado
        const response = await request(API)
            .post('/api/insignia/registro')
            .set('Authorization', `Bearer ${token}`);

        console.log(response.status); // Imprime el código de respuesta
        console.log(response.body); // Mensaje de insignia registrada exitosamente

        // Verificar que la respuesta sea exitosa (código 200)
        expect(response.status).toBe(200);
    });
});

/////////////////////////////////////// Visualizar logros personales
describe('Visualizar logros GET /api/insignias', () => {
    test('Visualización de logros exitosa', async () => {
        const ninoData = {
            Usuario_nino: "AlexY",
            Password_nino: "AAYY1234"
        };

        // Realiza una solicitud POST para obtener el token de acceso del niño
        const loginResponse = await request(API)
            .post('/api/nin@s/login')
            .send(ninoData);

        // Extrae el token de acceso del cuerpo de la respuesta
        const token = loginResponse.body.token;
        // Simular solicitud GET para obtener los logros del niño
        const response = await request(API)
            .get('/api/insignias')
            .set('Authorization', `Bearer ${token}`);

        console.log(response.status); // Imprime el código de respuesta
        console.log(response.body); // Lista de logros del niño
        // Verificar que la respuesta sea exitosa (código 200)
        expect(response.status).toBe(200);
    });
});