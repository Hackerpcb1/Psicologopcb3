// EmailJS Configuration for Consejería
const emailjsConfig = {
    sonia: {
        serviceID: 'service_jwkxgrm',  // Mismo servicio de Maricarmen
        templateID: 'template_gaqvy95',  // Usando el mismo template de Maricarmen que funciona
        publicKey: 'sUT_mezeXvnOxkvVI',
        toEmail: 'soniaconsejeravoc@gmail.com'
    },
    maricarmen: {
        serviceID: 'service_tl36rip',
        templateID: 'template_pck97ew',
        publicKey: 'SCqXLNS1v8MCpsAit',
        toEmail: 'maricarmenpcb@gmail.com'
    }
};

// Initialize EmailJS - Se inicializará con la public key específica en cada envío
(function() {
    // EmailJS se inicializa automáticamente cuando se usa emailjs.send() con la publicKey
    console.log('EmailJS configurado para Consejería');
})();
