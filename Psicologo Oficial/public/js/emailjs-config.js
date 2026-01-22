// EmailJS Configuration for Consejería
const emailjsConfig = {
    sonia: {
        serviceID: 'service_tl36rip',  // Mismo servicio de Maricarmen
        templateID: 'template_pck97ew',  // Usando el mismo template de Maricarmen que funciona
        publicKey: 'SCqXLNS1v8MCpsAit',
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
