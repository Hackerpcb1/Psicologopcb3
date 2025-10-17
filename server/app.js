const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

// Inicializar Firebase Admin SDK (requiere configuración de Firebase)
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://tu-proyecto.firebaseio.com' // Reemplaza con tu URL de Firebase
});

const db = admin.firestore();

// Configurar SendGrid (requiere API key)
sgMail.setApiKey('TU_SENDGRID_API_KEY'); // Reemplaza con tu API key

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('../public'));

// Endpoint para obtener medicamentos
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

// Endpoint para solicitar medicamento
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

        // Enviar correo de confirmación
        const msg = {
            to: email,
            from: 'enfermeria@unidadsalud.edu',
            subject: 'Solicitud de Medicamento Recibida',
            text: `Su solicitud para ${cantidad} unidad(es) de ${nombre} ha sido recibida. Le contactaremos pronto.`,
            html: `<p>Su solicitud para <strong>${cantidad}</strong> unidad(es) de <strong>${nombre}</strong> ha sido recibida. Le contactaremos pronto.</p>`
        };
        await sgMail.send(msg);

        res.json({ message: 'Solicitud enviada con éxito' });
    } catch (error) {
        console.error('Error solicitando medicamento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para crear cita
app.post('/api/citas', async (req, res) => {
    const { tipoServicio, profesional, fechaHora, email } = req.body;
    if (!tipoServicio || !profesional || !fechaHora || !email) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
        await db.collection('citas').add({
            tipoServicio,
            profesional,
            fechaHora,
            email,
            fechaCreacion: admin.firestore.FieldValue.serverTimestamp()
        });

        // Enviar correo de confirmación
        const msg = {
            to: email,
            from: 'enfermeria@unidadsalud.edu',
            subject: 'Cita Confirmada',
            text: `Su cita con ${profesional} para ${tipoServicio} el ${fechaHora} ha sido confirmada.`,
            html: `<p>Su cita con <strong>${profesional}</strong> para <strong>${tipoServicio}</strong> el <strong>${fechaHora}</strong> ha sido confirmada.</p>`
        };
        await sgMail.send(msg);

        res.json({ message: 'Cita creada con éxito' });
    } catch (error) {
        console.error('Error creando cita:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para obtener citas (para el calendario)
app.get('/api/citas', async (req, res) => {
    try {
        const citasRef = db.collection('citas');
        const snapshot = await citasRef.get();
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
        console.error('Error obteniendo citas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para contacto
app.post('/api/contacto', async (req, res) => {
    const { nombre, email, asunto, mensaje, destinatario, correo_destinatario } = req.body;
    if (!nombre || !destinatario || !email || !asunto || !mensaje || !correo_destinatario) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
        await db.collection('contactos').add({
            nombre,
            email,
            destinatario,
            correo_destinatario,
            asunto,
            mensaje,
            fecha: admin.firestore.FieldValue.serverTimestamp()
        });

        // Enviar correo al destinatario
        const msgToRecipient = {
            to: correo_destinatario,
            from: 'contacto@unidadsalud.edu',
            replyTo: email,
            subject: `Nuevo mensaje de contacto: ${asunto}`,
            text: `Hola, has recibido un nuevo mensaje de ${nombre} (${email}):\n\n${mensaje}`,
            html: `<p>Hola, has recibido un nuevo mensaje de <strong>${nombre}</strong> (${email}):</p><p>${mensaje}</p>`
        };
        await sgMail.send(msgToRecipient);

        // Enviar confirmación al usuario
        const msgToUser = {
            to: email,
            from: 'contacto@unidadsalud.edu',
            subject: 'Mensaje Enviado',
            text: `Hola ${nombre}, su mensaje ha sido enviado a ${destinatario}. Le responderemos pronto.`,
            html: `<p>Hola <strong>${nombre}</strong>, su mensaje ha sido enviado a <strong>${destinatario}</strong>. Le responderemos pronto.</p>`
        };
        await sgMail.send(msgToUser);

        res.json({ message: 'Mensaje enviado con éxito' });
    } catch (error) {
        console.error('Error enviando mensaje de contacto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
