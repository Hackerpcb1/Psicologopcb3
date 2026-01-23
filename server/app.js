const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

// 1. Inicializar Firebase Admin SDK
// Nota: 'applicationDefault' buscará las credenciales en tu entorno local.
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://tu-proyecto.firebaseio.com' // Cambia esto por tu URL real de Firebase
});

const db = admin.firestore();

// 2. Configurar SendGrid 
// He quitado el texto plano para que GitHub no lo bloquee. 
// Para que funcione, deberás configurar la variable de entorno SENDGRID_API_KEY.
sgMail.setApiKey(process.env.SENDGRID_API_KEY || 'SIN_CLAVE_CONFIGURADA');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('../public'));

// --- ENDPOINT: OBTENER MEDICAMENTOS ---
app.get('/api/medicamentos', async (req, res) => {
    try {
        const medicamentosRef = db.collection('medicamentos');
        const snapshot = await medicamentosRef.get();
        const medicamentos = [];
        snapshot.forEach(doc => {
            medicamentos.push({ id: doc.id, ...doc.data() });
        });
        res.json(medicamentos);
    } catch (error) {
        console.error('Error obteniendo medicamentos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// --- ENDPOINT: SOLICITAR MEDICAMENTO ---
app.post('/api/medicamentos/solicitar', async (req, res) => {
    const { nombre, cantidad, email } = req.body;
    if (!nombre || !cantidad || !email) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
        await db.collection('solicitudes_medicamentos').add({
            nombre,
            cantidad,
            email,
            fecha: admin.firestore.FieldValue.serverTimestamp()
        });

        // Correo de confirmación simple
        const msg = {
            to: email,
            from: 'enfermeria@unidadsalud.edu',
            subject: 'Solicitud Recibida',
            text: `Su solicitud para ${cantidad} de ${nombre} ha sido recibida.`
        };
        
        // Solo intenta enviar si hay una clave configurada
        if (process.env.SENDGRID_API_KEY) {
            await sgMail.send(msg);
        }

        res.json({ message: 'Solicitud enviada con éxito' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});

// --- ENDPOINT: CREAR CITA ---
app.post('/api/citas', async (req, res) => {
    const { tipoServicio, profesional, fechaHora, email, nombre, telefono, motivoConsulta } = req.body;
    if (!tipoServicio || !profesional || !fechaHora || !email) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Mapeo de profesionales a correos electrónicos
    const correoProfesionales = {
        'psicologo3': 'de161266@miescuela.pr',
        'enfermera1': 'enfermeria@unidadsalud.edu',
        'consejera1': 'consejera1@unidadsalud.edu',
        'consejera2': 'consejera2@unidadsalud.edu',
        'ts1': 'trabajosocial1@unidadsalud.edu',
        'trabajadora social2': 'trabajosocial2@unidadsalud.edu'
    };

    try {
        // Guardar en base de datos
        await db.collection('citas').add({
            tipoServicio,
            profesional,
            fechaHora,
            email,
            nombre,
            telefono,
            motivoConsulta,
            fechaCreacion: admin.firestore.FieldValue.serverTimestamp()
        });

        // Enviar correo al profesional
        const correoProfesional = correoProfesionales[profesional];
        if (correoProfesional && process.env.SENDGRID_API_KEY) {
            const msg = {
                to: correoProfesional,
                from: 'noreply@unidadsalud.edu',
                subject: `Nueva Solicitud de Cita - ${tipoServicio}`,
                html: `
                    <h2>Nueva Solicitud de Cita</h2>
                    <p><strong>Servicio:</strong> ${tipoServicio}</p>
                    <p><strong>Profesional:</strong> ${profesional}</p>
                    <p><strong>Fecha y Hora:</strong> ${fechaHora}</p>
                    <p><strong>Nombre del Estudiante:</strong> ${nombre || 'No proporcionado'}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Teléfono:</strong> ${telefono || 'No proporcionado'}</p>
                    <p><strong>Motivo de Consulta:</strong> ${motivoConsulta || 'No especificado'}</p>
                `
            };

            try {
                await sgMail.send(msg);
            } catch (emailError) {
                console.error('Error enviando correo:', emailError);
                // No fallar la solicitud si el correo falla
            }
        }

        // Enviar correo de confirmación al estudiante
        if (process.env.SENDGRID_API_KEY) {
            const msgEstudiante = {
                to: email,
                from: 'noreply@unidadsalud.edu',
                subject: 'Confirmación de Solicitud de Cita',
                html: `
                    <h2>Solicitud de Cita Recibida</h2>
                    <p>Estimado/a ${nombre || 'estudiante'},</p>
                    <p>Hemos recibido su solicitud de cita con los siguientes detalles:</p>
                    <p><strong>Servicio:</strong> ${tipoServicio}</p>
                    <p><strong>Fecha y Hora Solicitada:</strong> ${fechaHora}</p>
                    <p>El profesional se pondrá en contacto con usted para confirmar la cita.</p>
                    <p>Gracias,<br>Unidad de Apoyo Socioemocional</p>
                `
            };

            try {
                await sgMail.send(msgEstudiante);
            } catch (emailError) {
                console.error('Error enviando correo de confirmación:', emailError);
            }
        }

        res.json({ message: 'Cita creada con éxito. Se han enviado las notificaciones por correo.' });
    } catch (error) {
        console.error('Error creando cita:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// --- ENDPOINT: OBTENER CITAS (PARA VISTA LOCAL) ---
app.get('/api/citas', async (req, res) => {
    try {
        const snapshot = await db.collection('citas').get();
        const citas = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            citas.push({
                title: `${data.tipoServicio} - ${data.profesional}`,
                start: data.fechaHora,
                allDay: false
            });
        });
        res.json(citas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener citas' });
    }
});

// --- SERVIDOR ---
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});