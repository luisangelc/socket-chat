var params = new URLSearchParams(window.location.search);
var nombre = params.get('nombre');
var sala = params.get('sala');

// referencias de jQuery
var divUsuarios = $('#divUsuarios');
var divChatbox = $('#divChatbox');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');

/**
 * Función para renderizar usuarios
 * @param {*} personas [{}, {}, {}...]
 */
function renderizarUsuarios(personas) {
    console.log(personas);

    var sala = params.get('sala');
    var html = '';
    var htmlSala = $('#divHtmlSala').html();
    var htmlUsuario = $('#divHtmlUsuario').html();

    html = htmlSala.toString().replace('{SALA}', sala);

    for (var i = 0, j = personas.length; i < j; ++i) {
        var meHtmlUsuario = htmlUsuario.toString()
            .replace('{PERSONANOMBRE}', personas[i].nombre)
            .replace('{ID_USER}', personas[i].id);
        html += meHtmlUsuario;
    }

    divUsuarios.html(html);
}

function renderizarMensajes(mensaje, yo) {
    var html = '';
    var img = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();
    
    var adminClass = 'info';
    if (mensaje.nombre === 'Administrador') adminClass = 'danger';

    var htmlChatbox = $('#divHtmlChatbox').html();
    var htmlChatboxReverse = $('#divHtmlChatboxReverse').html();

    if (yo) {
        if (mensaje.nombre !== 'Administrador')
            img = '<div class="chat-img img-1"><img src="assets/images/users/1.jpg" alt="user"/></div>';
        html += htmlChatboxReverse.toString()
            .replace('{NOMBRE}', mensaje.nombre)
            .replace('{MENSAJE}', mensaje.mensaje)
            .replace('{HORA}', hora)
            .replace('{IMG}', img);
    }
    else {
        if (mensaje.nombre !== 'Administrador')
            img = '<img src="assets/images/users/5.jpg" alt="user" />';
        html = htmlChatbox.toString()
            .replace('{NOMBRE}', mensaje.nombre)
            .replace('{MENSAJE}', mensaje.mensaje)
            .replace('{HORA}', hora)
            .replace('{ADMIN-CLASS}', adminClass)
            .replace('{IMG}', img);
    }
    divChatbox.append(html);
}

function scrollBottom() {
    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight)
        divChatbox.scrollTop(scrollHeight);
}

// Listener
divUsuarios.on('click', 'a', function() {
    var id = $(this).data('id');
    
    if (id) console.log(id);
});

formEnviar.on('submit', function(e) {
    e.preventDefault();
    if (txtMensaje.val().trim().length === 0) return;

    // Enviar información
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        txtMensaje.val('').focus();
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });
});
