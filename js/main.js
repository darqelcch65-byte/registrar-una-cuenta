//Expresiones de validaciones
//Necesarias  para verificar que los datos ingresados sean los correctos
//Para validar si el formato de correo electrónico está bien
const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//Para validar que el nombre contenga solo letras y espacios
const regexNombre = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/;
//Para validar que la contraseña tenga minusculas, mayusculas, numeros, simbolos y que sea minimo 6 caracteres
const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
//Para validar el numero de telefono y tenga de 7 a 8 digitos
const regexTelefono = /^[0-9]{7,8}$/;
//Base de datos para guardar a los usuarios
let bdUsuarios = []; 
//Mostrar y ocultar 
//Esta función oculta las vistas de registro, ingreso, recuperación y bienvenida y las muestra despues de cumplir ciertas condiciones
function ocultarTodas() {
    document.getElementById('vista-registro').classList.add('oculto');
    document.getElementById('vista-ingreso').classList.add('oculto');
    document.getElementById('vista-recuperar').classList.add('oculto');
    document.getElementById('vista-bienvenida').classList.add('oculto');
    //Limpiar los mensajes
    document.querySelectorAll('.mensaje-error').forEach(e => e.innerText = '');
    document.querySelectorAll('.mensaje-exito').forEach(e => e.innerText = '');
    }
function mostrarIngreso() { ocultarTodas(); document.getElementById('vista-ingreso').classList.remove('oculto'); }
function mostrarRegistro() { ocultarTodas(); document.getElementById('vista-registro').classList.remove('oculto'); }
function mostrarRecuperar() { ocultarTodas(); document.getElementById('vista-recuperar').classList.remove('oculto'); }        
//Función para mostrar o ocultar la contraseña
function alternarContrasena(idCampo) {
    const campo = document.getElementById(idCampo);
    if (campo.type === "password") {
        campo.type = "text";
    } else {
        campo.type = "password";
    }
}
//Registro de usuarios
//verifica la creación de nuevos usuarios y los valida
function registrarUsuario() {
    //Datos ingresados por el usuario
    const nombre = document.getElementById('registro-nombre').value;
    const email = document.getElementById('registro-correo').value;
    const telefono = document.getElementById('registro-telefono').value;
    const pass = document.getElementById('registro-contrasena').value;
    let esValido = true;
    //Limpiador de errores
    document.querySelectorAll('.mensaje-error').forEach(e => e.innerText = '');
    //Validacion de los datos ingresados
    if (!regexNombre.test(nombre)) {
        document.getElementById('error-registro-nombre').innerText = "Nombre inválido (solo letras).";
        esValido = false;
    }
    if (!regexCorreo.test(email)) {
        document.getElementById('error-registro-correo').innerText = "Correo inválido.";
        esValido = false;
    }
    if (!regexTelefono.test(telefono)) {
        document.getElementById('error-registro-telefono').innerText = "Móvil inválido (7-8 números).";
        esValido = false;
    }
    if (!regexContrasena.test(pass)) {
        document.getElementById('error-registro-contrasena').innerText = "Debe tener Mayúscula, minúscula, número, símbolo y mín 6 caracteres.";
        esValido = false;
    }
    if (esValido) {
        //Verificar si ya existe el usuario
        const existe = bdUsuarios.find(u => u.email === email);
        if (existe) {
            alert("El usuario ya está registrado.");
            return;
        }
        //Crea a un nuevo usuario y lo guarda en un objeto como base de datos
        const nuevoUsuario = {
            nombre: nombre,
            email: email,
            telefono: telefono,
            pass: pass,
            intentos: 0, //Cantidad de intentos fallidos al iniciar sesión
            bloqueado: false //Bloquea el inicio de sesion si tiene 3 intentos fallidos
        };
        bdUsuarios.push(nuevoUsuario);
        alert("Registro exitoso. Ahora puede iniciar sesión.");
        mostrarIngreso();
    }
}
//Inicio de sesion
//Verifica el usuario y contraseña y bloquea al usuario por intentos fallidos
function iniciarSesion() {
    const email = document.getElementById('ingreso-correo').value;
    const pass = document.getElementById('ingreso-contrasena').value;
    const msgDiv = document.getElementById('mensaje-ingreso');

    //Busca al usuario en la base de datos
    const usuario = bdUsuarios.find(u => u.email === email);
    if (!usuario) {
        alert("El usuario no está registrado en el sistema.");
        return;
    }
    //Verificar si el usuario ya fue bloqueado y que debe hacer
    if (usuario.bloqueado) {
        msgDiv.innerText = "Cuenta bloqueada por intentos fallidos. Use 'Recuperar contraseña'.";
        msgDiv.style.color = "red";
        return;
    }
    //Verifica la contraseña
    if (usuario.pass === pass) {
        //si el usuario y contraseña son correctos
        usuario.intentos = 0; //Reiniciar los intentos fallidos
        ocultarTodas();
        document.getElementById('vista-bienvenida').classList.remove('oculto');
        document.getElementById('usuario-bienvenida').innerText = usuario.nombre;
    } else {
        //si el usuario o contraseña son incorrectos
        usuario.intentos++;
        if (usuario.intentos >= 3) {
            usuario.bloqueado = true;
            msgDiv.innerText = "Cuenta bloqueada por intentos fallidos.";
            msgDiv.style.color = "red";
        } else {
            alert(`Contraseña incorrecta. Intentos: ${usuario.intentos}/3`);
        }
    }
}
//Cambio de contraseña
//Cambia la contraseña si el usuario sabe su correo
function cambiarContrasena() {
    const email = document.getElementById('recuperacion-correo').value;
    const nuevaPass = document.getElementById('recuperacion-contrasena').value;
    const msgDiv = document.getElementById('mensaje-recuperacion');
    const errorSpan = document.getElementById('error-recuperacion-contrasena');
    errorSpan.innerText = "";
    //Validar si la nueva contraseña es segura
    if (!regexContrasena.test(nuevaPass)) {
        errorSpan.innerText = "La contraseña no es segura (Req: Mayus, minus, num, sim).";
        return;
    }
    const usuario = bdUsuarios.find(u => u.email === email);
    if (usuario) {
        usuario.pass = nuevaPass;
        usuario.intentos = 0; //Reinicia los intentos fallidos
        usuario.bloqueado = false; //Desbloquea la cuenta para iniciar sesion de nuevo         
        alert("Contraseña actualizada. Ahora puede iniciar sesión.");
        mostrarIngreso();
    } else {
        alert("El correo no existe en el sistema.");
    }
}
function cerrarSesion() {
    mostrarIngreso();
    document.getElementById('ingreso-correo').value = "";
    document.getElementById('ingreso-contrasena').value = "";
}