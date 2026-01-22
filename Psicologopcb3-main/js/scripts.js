// scripts.js - Manejo básico de formularios y mensajes

document.addEventListener('DOMContentLoaded', () => {
    // Formulario Enfermería
    const formEnfermeria = document.getElementById('form-enfermeria');
    if (formEnfermeria) {
        // Mostrar/ocultar campo "otro" cuando se selecciona "Otro"
        const tipoConsultaSelect = formEnfermeria.tipoConsulta;
        const otroTipoDiv = document.getElementById('otroTipoEnfermeriaDiv');
        const otroTipoInput = document.getElementById('otroTipoEnfermeria');

        tipoConsultaSelect.addEventListener('change', () => {
            if (tipoConsultaSelect.value === 'otro') {
                otroTipoDiv.style.display = 'block';
                otroTipoInput.required = true;
            } else {
                otroTipoDiv.style.display = 'none';
                otroTipoInput.required = false;
                otroTipoInput.value = '';
            }
        });

        formEnfermeria.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formEnfermeria);
            const data = Object.fromEntries(formData);
            const mensajeDiv = document.getElementById('mensaje-enfermeria');

            // Validación básica
            if (!data.nombre || !data.edad || !data.estatura || !data.peso || !data.email || !data.telefono || !data.direccion || !data.tipoConsulta || !data.sintomas || !data.horaConsulta) {
                mensajeDiv.textContent = 'Por favor, complete todos los campos.';
                mensajeDiv.className = 'text-danger';
                return;
            }

            if (data.tipoConsulta === 'otro' && !data.otroTipoEnfermeria) {
                mensajeDiv.textContent = 'Por favor, especifique el tipo de consulta.';
                mensajeDiv.className = 'text-danger';
                return;
            }

            // Aquí se puede agregar la lógica para enviar la cita al backend
            // Por ahora, simulamos éxito
            mensajeDiv.textContent = 'Cita solicitada con éxito. Recibirá un correo de confirmación.';
            mensajeDiv.className = 'text-success';

            formEnfermeria.reset();
            otroTipoDiv.style.display = 'none';
        });
    }

    // Formulario Psicología
    const formPsicologia = document.getElementById('form-psicologia');
    if (formPsicologia) {
        // Mostrar/ocultar campo "otro" cuando se selecciona "Otro"
        const tipoConsultaSelect = formPsicologia.tipoConsultaPsico;
        const otroTipoDiv = document.getElementById('otroTipoDiv');
        const otroTipoInput = document.getElementById('otroTipo');

        tipoConsultaSelect.addEventListener('change', () => {
            if (tipoConsultaSelect.value === 'otro') {
                otroTipoDiv.style.display = 'block';
                otroTipoInput.required = true;
            } else {
                otroTipoDiv.style.display = 'none';
                otroTipoInput.required = false;
                otroTipoInput.value = '';
            }
        });

        formPsicologia.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formPsicologia);
            const data = Object.fromEntries(formData);
            const mensajeDiv = document.getElementById('mensaje-psicologia');

            // Validación básica
            if (!data.nombrePsico || !data.edadPsico || !data.emailPsico || !data.telefonoPsico || !data.direccionPsico || !data.tipoConsultaPsico || !data.horaConsultaPsico) {
                mensajeDiv.textContent = 'Por favor, complete todos los campos.';
                mensajeDiv.className = 'text-danger';
                return;
            }

            if (data.tipoConsultaPsico === 'otro' && !data.otroTipo) {
                mensajeDiv.textContent = 'Por favor, especifique el tipo de consulta.';
                mensajeDiv.className = 'text-danger';
                return;
            }

            // Validación de horario para psicología: no permitir martes, miércoles, jueves
            const selectedDateTime = new Date(data.horaConsultaPsico);
            const dayOfWeek = selectedDateTime.getDay(); // 0=Dom, 1=Lun, 2=Mar, 3=Mie, 4=Jue, 5=Vie, 6=Sab
            if (dayOfWeek === 2 || dayOfWeek === 3 || dayOfWeek === 4) {
                mensajeDiv.textContent = 'Su cita no pudo ser asignada, ya que el psicólogo está en reunión.';
                mensajeDiv.className = 'text-danger';
                return;
            }

            try {
                // Enviar email usando EmailJS
                const toEmail = 'de161266@miescuela.pr'; // Email del psicólogo

                const templateParams = {
                    to_email: toEmail,
                    from_name: data.nombrePsico,
                    from_email: data.emailPsico,

                    nombre_completo: data.nombrePsico,
                    edad: data.edadPsico,
                    correo: data.emailPsico,
                    telefono: data.telefonoPsico,
                    telefono_alterno: data.telefonoAlternoPsico || 'No especificado',
                    direccion: data.direccionPsico,

                    tipo_consulta: data.tipoConsultaPsico === 'otro'
                        ? data.otroTipo
                        : data.tipoConsultaPsico,

                    hora_cita: data.horaConsultaPsico
                };

                await emailjs.send('service_psicologia', 'template_psicologia', templateParams);

                mensajeDiv.textContent = 'Cita solicitada con éxito. Recibirá un correo de confirmación.';
                mensajeDiv.className = 'text-success';

                formPsicologia.reset();
                otroTipoDiv.style.display = 'none';
            } catch (error) {
                console.error('Error al enviar el email:', error);
                mensajeDiv.textContent = 'Error al enviar la solicitud. Por favor, inténtelo nuevamente.';
                mensajeDiv.className = 'text-danger';
            }
        });
    }

    // Formulario Consejería
    const formConsejeria = document.getElementById('form-consejeria');
    if (formConsejeria) {
        // Mostrar/ocultar campo "otro" cuando se selecciona "Otro"
        const tipoConsultaSelect = formConsejeria.tipoConsultaConse;
        const otroTipoDiv = document.getElementById('otroTipoConseDiv');
        const otroTipoInput = document.getElementById('otroTipoConse');

        tipoConsultaSelect.addEventListener('change', () => {
            if (tipoConsultaSelect.value === 'otro') {
                otroTipoDiv.style.display = 'block';
                otroTipoInput.required = true;
            } else {
                otroTipoDiv.style.display = 'none';
                otroTipoInput.required = false;
                otroTipoInput.value = '';
            }
        });

        formConsejeria.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formConsejeria);
            const data = Object.fromEntries(formData);
            const mensajeDiv = document.getElementById('mensaje-consejeria');

            // Validación básica
            if (!data.nombreConse || !data.edadConse || !data.emailConse || !data.telefonoConse || !data.direccionConse || !data.tipoConsultaConse || !data.consejeroConse || !data.horaConsultaConse) {
                mensajeDiv.textContent = 'Por favor, complete todos los campos.';
                mensajeDiv.className = 'text-danger';
                return;
            }

            if (data.tipoConsultaConse === 'otro' && !data.otroTipoConse) {
                mensajeDiv.textContent = 'Por favor, especifique el tipo de consulta.';
                mensajeDiv.className = 'text-danger';
                return;
            }

            try {
                let service, template, publicKey, toEmail;

                if (data.consejeroConse === 'Maricarmen García Rivera') {
                    service = 'service_tl36rip';
                    template = 'template_pck97ew';
                    publicKey = 'SCqXLNS1v8MCpsAit';
                    toEmail = 'maricarmenpcb@gmail.com';
                } else if (data.consejeroConse === 'Sonia I. Cruz Maldonado') {
                    service = 'service_jwkxgrm';
                    template = 'template_gaqvy95';
                    publicKey = 'sUT_mezeXvnOxkvVI';
                    toEmail = 'soniaconsejeravoc@gmail.com';
                }

                // Initialize EmailJS with the appropriate public key
                emailjs.init(publicKey);

                // Enviar email usando EmailJS
              const templateParams = {
    to_email: toEmail,
    from_name: data.nombreConse,
    from_email: data.emailConse,

    nombre_completo: data.nombreConse,
    edad: data.edadConse,
    correo: data.emailConse,
    telefono: data.telefonoConse,
    direccion: data.direccionConse,

    tipo_consulta: data.tipoConsultaConse,
    especificar_consulta: data.tipoConsultaConse === 'otro'
        ? data.otroTipoConse
        : 'No aplica',

    consejero: data.consejeroConse,
    hora_cita: data.horaConsultaConse
};



                await emailjs.send(service, template, templateParams);



                mensajeDiv.textContent = 'Cita solicitada con éxito. Recibirá un correo de confirmación.';
                mensajeDiv.className = 'text-success';

                formConsejeria.reset();
                otroTipoDiv.style.display = 'none';
            } catch (error) {
                console.error('Error al enviar el email:', error);
                mensajeDiv.textContent = 'Error al enviar la solicitud. Por favor, inténtelo nuevamente.';
                mensajeDiv.className = 'text-danger';
            }
        });
    }

    // Formulario Trabajo Social
    const formTrabajoSocial = document.getElementById('form-trabajo-social');
    if (formTrabajoSocial) {
        // Mostrar/ocultar campo "otro" cuando se selecciona "Otro"
        const motivoConsultaSelect = formTrabajoSocial.motivoConsulta;
        const otroMotivoDiv = document.getElementById('otroMotivoTSDiv');
        const otroMotivoInput = document.getElementById('otroMotivoTS');

        motivoConsultaSelect.addEventListener('change', () => {
            if (motivoConsultaSelect.value === 'otro') {
                otroMotivoDiv.style.display = 'block';
                otroMotivoInput.required = true;
            } else {
                otroMotivoDiv.style.display = 'none';
                otroMotivoInput.required = false;
                otroMotivoInput.value = '';
            }
        });

        formTrabajoSocial.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formTrabajoSocial);
            const data = Object.fromEntries(formData);
            const mensajeDiv = document.getElementById('mensaje-trabajo-social');

            if (!data.nombreTS || !data.edadTS || !data.emailTS || !data.telefonoTS || !data.direccionTS || !data.motivoConsulta || !data.trabajadoraSocialTS || !data.horaConsultaTS) {
                mensajeDiv.textContent = 'Por favor, complete todos los campos.';
                mensajeDiv.className = 'text-danger';
                return;
            }

            if (data.motivoConsulta === 'otro' && !data.otroMotivoTS) {
                mensajeDiv.textContent = 'Por favor, especifique el motivo de la consulta.';
                mensajeDiv.className = 'text-danger';
                return;
            }

            try {
                let service, template, publicKey, toEmail;

                if (data.trabajadoraSocialTS === 'Kárem Rivera Moreno') {
                    service = 'service_3xbuvck';
                    template = 'template_prewukp';
                    publicKey = 'JEnP4Ol_npOF0u1zF';
                    toEmail = 'de156358@miescuela.pr'; // Email de Kárem según la información en el HTML
                } else {
                    service = 'service_trabajo_social';
                    template = 'template_trabajo_social';
                    publicKey = 'YOUR_PUBLIC_KEY'; // Replace with actual public key for other workers
                    toEmail = 'hackerpcb4@gmail.com';
                }

                // Initialize EmailJS with the appropriate public key
                emailjs.init(publicKey);

                // Enviar email usando EmailJS
                const templateParams = {
                    to_email: toEmail,
                    from_name: data.nombreTS,
                    from_email: data.emailTS,
                    nombre_completo: data.nombreTS,
                    edad: data.edadTS,
                    telefono: data.telefonoTS,
                    telefono_alterno: data.telefonoAlternoTS || 'No especificado',
                    direccion: data.direccionTS,
                    motivo_consulta: data.motivoConsulta === 'otro' ? data.otroMotivoTS : data.motivoConsulta,
                    trabajadora_social: data.trabajadoraSocialTS,
                    hora_consulta: data.horaConsultaTS
                };

                await emailjs.send(service, template, templateParams);

                mensajeDiv.textContent = 'Cita solicitada con éxito. Recibirá un correo de confirmación.';
                mensajeDiv.className = 'text-success';

                formTrabajoSocial.reset();
                otroMotivoDiv.style.display = 'none';
            } catch (error) {
                console.error('Error al enviar el email:', error);
                mensajeDiv.textContent = 'Error al enviar la solicitud. Por favor, inténtelo nuevamente.';
                mensajeDiv.className = 'text-danger';
            }
        });
    }

    // Language switching
    const currentLang = localStorage.getItem('lang') || 'es';
    setLanguage(currentLang);

    document.querySelectorAll('[data-lang]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = e.target.getAttribute('data-lang');
            setLanguage(lang);
            localStorage.setItem('lang', lang);
        });
    });

    function setLanguage(lang) {
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-' + lang + ']').forEach(element => {
            element.textContent = element.getAttribute('data-' + lang);
        });
    }

    // Formulario Contacto
    const formContacto = document.getElementById('form-contacto');
    if (formContacto) {
        const destinatarioSelect = document.getElementById('destinatario');
        const correoDisplay = document.getElementById('correo-destinatario');
        const correoHidden = document.getElementById('correo-destinatario-hidden');
        const destinatarios = {
            psicologo: 'de161266@miescuela.pr',
            enfermera: 'enfermeria@unidadsalud.edu',
            trabajo_social: 'trabajo_social@unidadsalud.edu'
        };

        destinatarioSelect.addEventListener('change', (e) => {
            const selected = e.target.value;
            if (selected && destinatarios[selected]) {
                correoDisplay.textContent = 'Correo electrónico: ' + destinatarios[selected];
                correoHidden.value = destinatarios[selected];
            } else {
                correoDisplay.textContent = '';
                correoHidden.value = '';
            }
        });

        formContacto.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formContacto);
            const data = Object.fromEntries(formData);
            const mensajeDiv = document.getElementById('mensaje-contacto');

            // Validación básica
            if (!data.nombre || !data.destinatario || !data.email || !data.asunto || !data.mensaje) {
                mensajeDiv.textContent = 'Por favor, complete todos los campos requeridos.';
                mensajeDiv.className = 'text-danger';
                return;
            }

            // Validación de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                mensajeDiv.textContent = 'Por favor, ingrese un correo electrónico válido.';
                mensajeDiv.className = 'text-danger';
                return;
            }

            try {
                const response = await fetch('/api/contacto', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (response.ok) {
                    mensajeDiv.textContent = 'Mensaje enviado con éxito. Recibirá una respuesta pronto.';
                    mensajeDiv.className = 'text-success';
                    formContacto.reset();
                } else {
                    mensajeDiv.textContent = result.error || 'Error al enviar el mensaje. Intente nuevamente.';
                    mensajeDiv.className = 'text-danger';
                }
            } catch (error) {
                console.error('Error:', error);
                mensajeDiv.textContent = 'Error de conexión. Intente nuevamente.';
                mensajeDiv.className = 'text-danger';
            }
        });
    }

    // Formulario Búsqueda Mapa
    const formBusquedaMapa = document.getElementById('form-busqueda-mapa');
    if (formBusquedaMapa) {
        formBusquedaMapa.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = document.getElementById('busqueda-mapa').value.trim();
            if (query) {
                window.open('https://www.google.com/maps/search/' + encodeURIComponent(query), '_blank');
            }
        });
    }

    // Función para alternar descripción en tarjetas de psicología
    window.toggleDescription = function(card) {
        card.classList.toggle('expanded');
    };

    // Slideshow functionality
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Initialize slideshow
    if (slides.length > 0) {
        showSlide(currentSlide);
        setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }
});