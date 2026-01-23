# Servidor - Unidad de Apoyo Socioemocional

## Requisitos Previos

1. **Node.js** instalado (versión 14 o superior)
   - Descargar desde: https://nodejs.org/

2. **Cuenta de SendGrid** para envío de correos
   - Crear cuenta en: https://sendgrid.com/
   - Obtener API Key desde el dashboard

3. **Firebase/Firestore** configurado
   - Crear proyecto en: https://console.firebase.google.com/
   - Descargar credenciales de servicio

## Instalación

1. Abrir terminal en la carpeta `server`
2. Instalar dependencias:
   ```bash
   npm install
   ```

## Configuración

### 1. SendGrid API Key

Configurar la variable de entorno `SENDGRID_API_KEY`:

**Windows (PowerShell):**
```powershell
$env:SENDGRID_API_KEY="tu_api_key_aqui"
```

**Windows (CMD):**
```cmd
set SENDGRID_API_KEY=tu_api_key_aqui
```

**Linux/Mac:**
```bash
export SENDGRID_API_KEY=tu_api_key_aqui
```

### 2. Firebase Credentials

Configurar las credenciales de Firebase según la documentación oficial.

## Iniciar el Servidor

```bash
npm start
```

El servidor se iniciará en: `http://localhost:3000`

## Correos Electrónicos Configurados

Los correos se envían a los siguientes profesionales según la selección:

- **Psicólogo**: de161266@miescuela.pr
- **Enfermera**: enfermeria@unidadsalud.edu
- **Consejera Maricarmen García Rivera**: consejera1@unidadsalud.edu
- **Consejera Sonia I. Cruz Maldonado**: consejera2@unidadsalud.edu
- **Trabajo Social**: trabajosocial1@unidadsalud.edu

## Endpoints Disponibles

### POST /api/citas
Crear una nueva cita y enviar correos de notificación.

**Body:**
```json
{
  "tipoServicio": "psicologia|enfermeria|consejeria|trabajo_social",
  "profesional": "psicologo3|enfermera1|consejera1|consejera2|ts1",
  "fechaHora": "2026-01-25T10:00",
  "email": "estudiante@escuela.pr",
  "nombre": "Nombre del Estudiante",
  "telefono": "787-123-4567",
  "motivoConsulta": "Descripción del motivo"
}
```

### GET /api/citas
Obtener todas las citas registradas.

### POST /api/medicamentos/solicitar
Solicitar medicamentos.

### GET /api/medicamentos
Obtener lista de medicamentos disponibles.

## Solución de Problemas

### Error: "Cannot find module"
```bash
npm install
```

### Error: "SENDGRID_API_KEY not configured"
Configurar la variable de entorno SENDGRID_API_KEY

### Error: "Firebase credentials not found"
Configurar las credenciales de Firebase según la documentación

### Puerto 3000 ya en uso
Cambiar el puerto en `app.js`:
```javascript
const PORT = process.env.PORT || 3001;
```

