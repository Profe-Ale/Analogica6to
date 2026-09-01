import {
    database,
    ref,
    set,
    get,
    onValue,
    update
} from "./firebase.js";

const pantallaInicio = document.getElementById("pantallaInicio");
const pantallaLobby = document.getElementById("pantallaLobby");
const pantallaJuego = document.getElementById("pantallaJuego");

const nombreCreador = document.getElementById("nombreCreador");
const nombreJugador = document.getElementById("nombreJugador");
const codigoSalaInput = document.getElementById("codigoSalaInput");

const btnCrearSala = document.getElementById("btnCrearSala");
const btnUnirse = document.getElementById("btnUnirse");
const codigoSala = document.getElementById("codigoSala");
const listaJugadores = document.getElementById("listaJugadores");
const contadorJugadores = document.getElementById("contadorJugadores");
const btnIniciarPartida = document.getElementById("btnIniciarPartida");
const btnCopiarCodigo = document.getElementById("btnCopiarCodigo");

const grillaNumeros = document.getElementById("grillaNumeros");

const turnoActualElemento = document.getElementById("turnoActual");
const mensajeTurno = document.getElementById("mensajeTurno");
const btnTerminarTurno = document.getElementById("btnTerminarTurno");
const btnForzarTurno = document.getElementById("btnForzarTurno");
const palabraTurno = document.getElementById("palabraTurno");
const contadorRonda = document.getElementById("contadorRonda");

const btnRevelar = document.getElementById("btnRevelar");
const btnNuevaPartida = document.getElementById("btnNuevaPartida");
const btnVolverSala = document.getElementById("btnVolverSala");
const btnPreguntaFacil = document.getElementById("btnPreguntaFacil");
const btnPreguntaIntermedia = document.getElementById("btnPreguntaIntermedia");
const btnPreguntaTecnica = document.getElementById("btnPreguntaTecnica");
const modalPreguntas = document.getElementById("modalPreguntas");
const btnCerrarPreguntas = document.getElementById("btnCerrarPreguntas");
const btnCerrarPreguntasAbajo = document.getElementById("btnCerrarPreguntasAbajo");
const btnOtrasPreguntas = document.getElementById("btnOtrasPreguntas");
const tituloModalPreguntas = document.getElementById("tituloModalPreguntas");
const descripcionModalPreguntas = document.getElementById("descripcionModalPreguntas");
const listaPreguntasAyuda = document.getElementById("listaPreguntasAyuda");

const componentesElectronicos = [
    "Resistencia",
    "Potenciómetro",
    "Capacitor cerámico",
    "Capacitor electrolítico",
    "Diodo",
    "Diodo Zener",
    "LED",
    "Transistor",
    "Transformador",
    "Relé",
    "Fusible",
    "Interruptor",
    "Pulsador",
    "LDR",
    "Temporizador 555",
    "Amplificador operacional",
    "Microcontrolador",
    "Arduino",
    "Protoboard",
    "Placa PCB",
    "Cable jumper",
    "Bornera",
    "Conector USB",
    "Conector Jack",
    "Pila",
    "Batería",
    "Portapilas",
    "Fuente de alimentación",
    "Regulador de voltaje",
    "Puente rectificador",
    "Display de 7 segmentos",
    "Display LCD",
    "Matriz LED",
    "Parlante",
    "Micrófono",
    "Motor DC",
    "Servomotor",
    "Motor paso a paso",
    "Sensor ultrasónico",
    "Sensor infrarrojo",
    "Sensor de temperatura",
    "Sensor de humedad",
    "Sensor de movimiento",
    "Sensor de luz",
    "Sensor de sonido",
    "Joystick",
    "Cooler",
    "Antena",
    "Bobina",
    "Plaqueta"
];

let jugadores = {};
let opcionesSeleccionadas = [];
let codigoActual = "";
let jugadorActualId = null;
let revelados = false;
let rondaActual = null;
let tachadosLocales = new Set();
let jugadorTurnoActualId = null;

// ==========================================
// CONFIGURACIÓN DE RONDAS
// ==========================================
// 7 rondas normales de preguntas + la 8.ª para arriesgar.
const CANTIDAD_RONDAS_PREGUNTAS = 7;
const RONDA_FINAL = CANTIDAD_RONDAS_PREGUNTAS + 1;

let nivelPreguntasActual = "facil";

const preguntasAyuda = {
    facil: [
        "¿Es un componente que se usa para conectar partes del circuito?",
        "¿Necesita alimentación para funcionar?",
        "¿Tiene polaridad?",
        "¿Tiene solamente dos terminales?",
        "¿Puede emitir luz?",
        "¿Puede producir sonido?",
        "¿Puede generar movimiento?",
        "¿Se usa para proteger un circuito?",
        "¿Se utiliza para mostrar información?",
        "¿Es un sensor?",
        "¿Tiene una parte que se puede mover o accionar?",
        "¿Se suele usar en una protoboard?",
        "¿Se puede encontrar en una fuente de alimentación?",
        "¿Se usa para alimentar un circuito?",
        "¿Se utiliza principalmente para hacer conexiones?",
        "¿Es pequeño?",
        "¿Es más grande que una moneda?",
        "¿Tiene cables?",
        "¿Tiene patas o terminales metálicos?",
        "¿Tiene más de dos terminales?",
        "¿Tiene algún botón?",
        "¿Tiene una perilla que se puede girar?",
        "¿Tiene una pantalla?",
        "¿Tiene luces?",
        "¿Puede encenderse?",
        "¿Puede calentarse cuando funciona?",
        "¿Puede girar?",
        "¿Puede hacer ruido?",
        "¿Puede detectar algo del ambiente?",
        "¿Puede detectar movimiento?",
        "¿Puede detectar luz?",
        "¿Puede detectar sonido?",
        "¿Puede detectar temperatura?",
        "¿Puede detectar humedad?",
        "¿Puede medir distancia?",
        "¿Sirve para conectar cables?",
        "¿Sirve para conectar un circuito a una computadora?",
        "¿Se puede conectar por USB?",
        "¿Sirve para encender o apagar algo?",
        "¿Se puede presionar?",
        "¿Se puede girar con la mano?",
        "¿Sirve para controlar un motor?",
        "¿Sirve para guardar energía?",
        "¿Sirve para transformar voltaje?",
        "¿Sirve para reducir o limitar la corriente?",
        "¿Sirve para evitar que se dañe un circuito?",
        "¿Puede mostrar números?",
        "¿Puede mostrar letras?",
        "¿Se usa para escuchar sonido?",
        "¿Se usa para captar sonido?",
        "¿Se usa para enfriar?",
        "¿Necesita electricidad para funcionar?",
        "¿Se conecta directamente a una placa?",
        "¿Se puede colocar en una protoboard?",
        "¿Es común encontrarlo en proyectos con Arduino?",
        "¿Se usa normalmente junto con otros componentes?",
        "¿Puede funcionar como una entrada para el circuito?",
        "¿Puede funcionar como una salida del circuito?",
        "¿Tiene una función principalmente mecánica?",
        "¿Su función principal es eléctrica?",
        "¿Es un componente que normalmente se puede ver a simple vista?",
        "¿Tiene una forma fácil de reconocer?",
        "¿Puede cambiar su comportamiento según algo que ocurra alrededor?",
        "¿Sirve para que una persona controle el circuito?",
        "¿Sirve para que el circuito muestre un resultado?"
    ],
    intermedia: [

    "¿Es un componente pasivo?",

    "¿Es un semiconductor?",

    "¿Tiene polaridad?",

    "¿Tiene más de dos terminales?",

    "¿Sirve para limitar o controlar la corriente?",

    "¿Sirve para controlar o estabilizar la tensión?",

    "¿Puede almacenar energía eléctrica?",

    "¿Puede controlar el paso de corriente?",

    "¿Puede funcionar como interruptor electrónico?",

    "¿Puede recibir una señal y controlar otra?",

    "¿Convierte energía eléctrica en movimiento?",

    "¿Convierte una magnitud física en una señal eléctrica?",

    "¿Puede transformar energía eléctrica en otra forma de energía?",

    "¿Se utiliza para trabajar con señales eléctricas?",

    "¿Puede formar parte de una etapa de potencia?",

    "¿Se utiliza para amplificar o controlar una señal?",

    "¿Se utiliza para proteger otros componentes del circuito?",

    "¿Puede formar parte de una fuente de alimentación?",

    "¿Se utiliza para convertir o modificar una tensión?",

    "¿Puede utilizarse para controlar una carga?",

    "¿Utiliza electromagnetismo para funcionar?",

    "¿Es un componente de entrada del circuito?",

    "¿Es un componente de salida del circuito?",

    "¿Puede utilizarse como parte de un circuito de control?",

    "¿Puede interactuar con una magnitud del ambiente?",

    "¿Entrega una señal eléctrica como resultado de una medición?",

    "¿Puede ser controlado mediante una señal eléctrica?",

    "¿Puede trabajar junto con un microcontrolador?",

    "¿Puede utilizarse en circuitos analógicos?",

    "¿Puede utilizarse en circuitos digitales?",

    "¿Se utiliza para conectar distintas partes de un circuito?",

    "¿Puede utilizarse para visualizar información?",

    "¿Puede utilizarse para ingresar información al circuito?",

    "¿Puede cambiar su comportamiento dependiendo de una señal de entrada?",

    "¿Su función principal es controlar otra parte del circuito?",

    "¿Puede encontrarse tanto en proyectos simples como en circuitos más complejos?"


    ],
    tecnica: [

    "¿Su funcionamiento depende de materiales semiconductores?",

    "¿Trabaja principalmente con señales analógicas?",

    "¿Trabaja principalmente con señales digitales?",

    "¿Puede trabajar tanto con señales analógicas como digitales?",

    "¿Puede conmutar una carga mediante una señal de control?",

    "¿Puede utilizarse en una etapa de amplificación?",

    "¿Puede utilizarse en una etapa de potencia?",

    "¿Puede controlar una corriente mayor a partir de una señal pequeña?",

    "¿Puede modificar el comportamiento de una señal eléctrica?",

    "¿Puede utilizarse para regular una magnitud eléctrica?",

    "¿Puede almacenar energía eléctrica temporalmente?",

    "¿Su funcionamiento depende de campos electromagnéticos?",

    "¿Puede transformar energía eléctrica en energía mecánica?",

    "¿Puede transformar energía eléctrica en otra forma de energía?",

    "¿Puede transformar una magnitud física en una señal eléctrica?",

    "¿Puede ser controlado mediante una señal PWM?",

    "¿Puede recibir una señal de control para modificar su funcionamiento?",

    "¿Puede utilizarse como elemento de entrada en un sistema de control?",

    "¿Puede utilizarse como elemento de salida en un sistema de control?",

    "¿Puede formar parte de un sistema de control automático?",

    "¿Puede trabajar junto con un microcontrolador?",

    "¿Puede enviar información a un microcontrolador?",

    "¿Puede recibir órdenes de un microcontrolador?",

    "¿Tiene entradas y salidas eléctricas diferenciadas?",

    "¿Puede procesar señales o información?",

    "¿Puede ejecutar instrucciones programadas?",

    "¿Puede utilizarse para adaptar una señal antes de enviarla a otra parte del circuito?",

    "¿Puede intervenir en la conversión entre corriente alterna y continua?",

    "¿Puede formar parte de una etapa de regulación de tensión?",

    "¿Puede utilizarse para filtrar o estabilizar una señal eléctrica?",

    "¿Puede proporcionar aislamiento entre distintas partes de un circuito?",

    "¿Puede utilizarse para proteger una etapa electrónica?",

    "¿Su comportamiento eléctrico puede cambiar según una condición externa?",

    "¿Puede utilizarse para controlar dispositivos de mayor potencia?",

    "¿Es habitual encontrarlo en sistemas electrónicos automatizados?"

]
};

function cambiarPantalla(pantalla) {
    document.querySelectorAll(".pantalla").forEach(elemento => {
        elemento.classList.remove("activa");
    });
    pantalla.classList.add("activa");
}

function generarCodigoSala() {
    const caracteres = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let codigo = "";

    for (let i = 0; i < 5; i++) {
        const posicion = Math.floor(Math.random() * caracteres.length);
        codigo += caracteres[posicion];
    }

    return codigo;
}

function mezclarArray(array) {
    const copia = [...array];

    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return copia;
}

function generarOpciones() {
    return mezclarArray(componentesElectronicos);
}


function obtenerPreguntasAleatorias(lista, cantidad = 7) {
    return mezclarArray(lista).slice(0, Math.min(cantidad, lista.length));
}

function abrirPreguntas(nivel) {
    nivelPreguntasActual = nivel;

    const configuracion = {
        facil: {
            titulo: "🟢 Preguntas fáciles",
            descripcion: "Preguntas sencillas para empezar a descartar componentes."
        },
        intermedia: {
            titulo: "🟡 Preguntas intermedias",
            descripcion: "Preguntas sobre la función y el tipo de componente."
        },
        tecnica: {
            titulo: "🔴 Preguntas técnicas",
            descripcion: "Preguntas que requieren usar conceptos de electrónica."
        }
    };

    const datos = configuracion[nivel];
    tituloModalPreguntas.textContent = datos.titulo;
    descripcionModalPreguntas.textContent = datos.descripcion;

    mostrarPreguntasDelNivel();

    modalPreguntas.classList.add("abierto");
    modalPreguntas.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-abierto");
}

function mostrarPreguntasDelNivel() {
    listaPreguntasAyuda.innerHTML = "";

    const preguntas = obtenerPreguntasAleatorias(
        preguntasAyuda[nivelPreguntasActual],
        7
    );

    preguntas.forEach(pregunta => {
        const opcion = document.createElement("button");
        opcion.classList.add("pregunta-opcion");
        opcion.type = "button";
        opcion.textContent = pregunta;

        // Al tocar una pregunta, solamente se resalta para poder leerla mejor.
        opcion.addEventListener("click", () => {
            document.querySelectorAll(".pregunta-opcion.seleccionada")
                .forEach(elemento => elemento.classList.remove("seleccionada"));
            opcion.classList.add("seleccionada");
        });

        listaPreguntasAyuda.appendChild(opcion);
    });
}

function cerrarPreguntas() {
    modalPreguntas.classList.remove("abierto");
    modalPreguntas.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-abierto");
}

btnPreguntaFacil.addEventListener("click", () => abrirPreguntas("facil"));
btnPreguntaIntermedia.addEventListener("click", () => abrirPreguntas("intermedia"));
btnPreguntaTecnica.addEventListener("click", () => abrirPreguntas("tecnica"));

btnOtrasPreguntas.addEventListener("click", mostrarPreguntasDelNivel);
btnCerrarPreguntas.addEventListener("click", cerrarPreguntas);
btnCerrarPreguntasAbajo.addEventListener("click", cerrarPreguntas);

modalPreguntas.addEventListener("click", evento => {
    if (evento.target === modalPreguntas) {
        cerrarPreguntas();
    }
});

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape" && modalPreguntas.classList.contains("abierto")) {
        cerrarPreguntas();
    }
});

btnCrearSala.addEventListener("click", async () => {
    const nombre = nombreCreador.value.trim();

    if (nombre === "") {
        alert("Ingresá tu nombre.");
        return;
    }

    try {
        let codigoDisponible = false;

        while (!codigoDisponible) {
            codigoActual = generarCodigoSala();
            const comprobarRef = ref(database, `salas/${codigoActual}`);
            const comprobacion = await get(comprobarRef);

            if (!comprobacion.exists()) {
                codigoDisponible = true;
            }
        }

        jugadorActualId = crypto.randomUUID();
        const salaRef = ref(database, `salas/${codigoActual}`);

        await set(salaRef, {
            estado: "esperando",
            anfitrionId: jugadorActualId,
            creadaEn: Date.now(),
            revelados: false,
            jugadores: {
                [jugadorActualId]: {
                    nombre,
                    anfitrion: true,
                    elemento: ""
                }
            }
        });

        codigoSala.textContent = codigoActual;
        escucharSala();
        cambiarPantalla(pantallaLobby);

    } catch (error) {
        console.error("Error creando sala:", error);
        alert("Hubo un error al crear la sala.");
    }
});

btnUnirse.addEventListener("click", async () => {
    const nombre = nombreJugador.value.trim();
    const codigo = codigoSalaInput.value.trim().toUpperCase();

    if (nombre === "") {
        alert("Ingresá tu nombre.");
        return;
    }

    if (codigo === "") {
        alert("Ingresá el código de la sala.");
        return;
    }

    try {
        const salaRef = ref(database, `salas/${codigo}`);
        const snapshot = await get(salaRef);

        if (!snapshot.exists()) {
            alert("La sala no existe.");
            return;
        }

        const sala = snapshot.val();

        if (sala.estado !== "esperando") {
            alert("La partida ya comenzó.");
            return;
        }

        jugadorActualId = crypto.randomUUID();
        codigoActual = codigo;

        const jugadorRef = ref(
            database,
            `salas/${codigoActual}/jugadores/${jugadorActualId}`
        );

        await set(jugadorRef, {
            nombre,
            anfitrion: false,
            elemento: ""
        });

        codigoSala.textContent = codigoActual;
        escucharSala();
        cambiarPantalla(pantallaLobby);

    } catch (error) {
        console.error("Error entrando:", error);
        alert("No se pudo entrar a la sala.");
    }
});

function escucharSala() {
    const salaRef = ref(database, `salas/${codigoActual}`);

    onValue(salaRef, snapshot => {
        if (!snapshot.exists()) {
            alert("La sala ya no existe.");
            return;
        }

        const sala = snapshot.val();
        jugadores = sala.jugadores || {};

        if (sala.estado === "esperando") {
            actualizarLobby(sala);
            cambiarPantalla(pantallaLobby);
        }

        if (sala.estado === "jugando") {
            cargarPartida(sala);
        }
    });
}

function actualizarLobby(sala) {
    listaJugadores.innerHTML = "";

    const lista = Object.entries(jugadores);

    lista.forEach(([id, jugador]) => {
        const fila = document.createElement("div");
        fila.classList.add("jugador");

        const nombre = document.createElement("span");
        nombre.textContent =
            id === sala.anfitrionId
                ? `${jugador.nombre} 👑`
                : jugador.nombre;

        fila.appendChild(nombre);
        listaJugadores.appendChild(fila);
    });

    contadorJugadores.textContent = `Jugadores: ${lista.length}`;

    const soyAnfitrion = sala.anfitrionId === jugadorActualId;
    btnIniciarPartida.style.display = soyAnfitrion ? "inline-block" : "none";
}

async function iniciarPartidaFirebase() {
    try {
        const salaRef = ref(database, `salas/${codigoActual}`);
        const snapshot = await get(salaRef);

        if (!snapshot.exists()) {
            alert("La sala ya no existe.");
            return;
        }

        const sala = snapshot.val();

        if (sala.anfitrionId !== jugadorActualId) {
            alert("Solo el anfitrión puede iniciar la partida.");
            return;
        }

        const listaJugadores = Object.entries(sala.jugadores || {});

        if (listaJugadores.length < 2) {
            alert("Necesitás al menos 2 jugadores.");
            return;
        }

        if (listaJugadores.length > componentesElectronicos.length) {
            alert(`Puede haber como máximo ${componentesElectronicos.length} jugadores.`);
            return;
        }

        const ordenTurnos = mezclarArray(
            listaJugadores.map(([id]) => id)
        );

        const opciones = generarOpciones();
        const opcionesJugadores = mezclarArray(opciones);

        const cambios = {
            estado: "jugando",
            opcionesSeleccionadas: opciones,
            revelados: false,
            ronda: Date.now(),

            rondaNumero: 1,
            rondasTerminadas: false,

            ordenTurnos: ordenTurnos,
            turnoActual: 0
        };

        listaJugadores.forEach(([id], indice) => {
            cambios[`jugadores/${id}/elemento`] = opcionesJugadores[indice];
        });

        await update(salaRef, cambios);

    } catch (error) {
        console.error("Error iniciando:", error);
        alert("Ocurrió un error al iniciar la partida.");
    }
}

btnIniciarPartida.addEventListener("click", iniciarPartidaFirebase);

function cargarPartida(sala) {
    jugadores = sala.jugadores || {};
    opcionesSeleccionadas = sala.opcionesSeleccionadas || [];
    revelados = sala.revelados === true;

    if (rondaActual !== sala.ronda) {
        rondaActual = sala.ronda;
        tachadosLocales.clear();
    }

    cambiarPantalla(pantallaJuego);

    mostrarTurnoActual(sala);
    mostrarGrilla();

    const soyAnfitrion = sala.anfitrionId === jugadorActualId;

    btnRevelar.style.display =
        soyAnfitrion ? "inline-block" : "none";

    btnNuevaPartida.style.display =
        soyAnfitrion ? "inline-block" : "none";

    btnRevelar.textContent =
        revelados ? "Componentes revelados" : "Revelar todos";

    btnVolverSala.style.display =
        soyAnfitrion && revelados ? "inline-block" : "none";
}

function mostrarGrilla() {
    grillaNumeros.innerHTML = "";

    const opcionesOrdenadas = [...opcionesSeleccionadas].sort((a, b) =>
        String(a).localeCompare(String(b), "es")
    );

    const elementosOtros = new Set();

    Object.entries(jugadores).forEach(([id, jugador]) => {
        if (
            id !== jugadorActualId &&
            jugador.elemento !== undefined &&
            jugador.elemento !== null &&
            jugador.elemento !== ""
        ) {
            elementosOtros.add(String(jugador.elemento));
        }
    });

    opcionesOrdenadas.forEach(opcion => {
        const clave = String(opcion);

        const casilla = document.createElement("div");
        casilla.classList.add("numero");
        casilla.textContent = opcion;

        if (elementosOtros.has(clave)) {
            casilla.classList.add("numero-otro-jugador");
        }

        if (tachadosLocales.has(clave)) {
            casilla.classList.add("tachado");
        }

        casilla.addEventListener("click", () => {
            if (elementosOtros.has(clave)) {
                return;
            }

            if (tachadosLocales.has(clave)) {
                tachadosLocales.delete(clave);
                casilla.classList.remove("tachado");
            } else {
                tachadosLocales.add(clave);
                casilla.classList.add("tachado");
            }
        });

        grillaNumeros.appendChild(casilla);
    });
}

btnRevelar.addEventListener("click", async () => {
    try {
        const salaRef = ref(database, `salas/${codigoActual}`);
        const snapshot = await get(salaRef);

        if (!snapshot.exists()) {
            alert("La sala no existe.");
            return;
        }

        const sala = snapshot.val();

        if (sala.anfitrionId !== jugadorActualId) {
            alert("Solo el anfitrión puede revelar.");
            return;
        }

        await update(salaRef, { revelados: true });

    } catch (error) {
        console.error("Error revelando:", error);
        alert("No se pudieron revelar los componentes.");
    }
});

async function nuevaPartidaFirebase() {
    try {
        const salaRef = ref(database, `salas/${codigoActual}`);
        const snapshot = await get(salaRef);

        if (!snapshot.exists()) {
            alert("La sala ya no existe.");
            return;
        }

        const sala = snapshot.val();

        if (sala.anfitrionId !== jugadorActualId) {
            alert("Solo el anfitrión puede comenzar una nueva partida.");
            return;
        }

        const listaJugadores = Object.entries(sala.jugadores || {});
        const nuevoOrdenTurnos = mezclarArray(
            listaJugadores.map(([id]) => id)
        );

        const nuevasOpciones = generarOpciones();
        const opcionesJugadores = mezclarArray(nuevasOpciones);

        const cambios = {
            estado: "jugando",
            opcionesSeleccionadas: nuevasOpciones,
            revelados: false,
            ronda: Date.now(),

            rondaNumero: 1,
            rondasTerminadas: false,

            ordenTurnos: nuevoOrdenTurnos,
            turnoActual: 0
        };

        listaJugadores.forEach(([id], indice) => {
            cambios[`jugadores/${id}/elemento`] = opcionesJugadores[indice];
        });

        await update(salaRef, cambios);

    } catch (error) {
        console.error("Error nueva partida:", error);
        alert("No se pudo comenzar una nueva partida.");
    }
}

btnNuevaPartida.addEventListener("click", nuevaPartidaFirebase);

btnCopiarCodigo.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(codigoActual);
        alert("Código copiado: " + codigoActual);
    } catch {
        alert("Código de sala: " + codigoActual);
    }
});

btnVolverSala.addEventListener("click", async () => {
    try {
        const salaRef = ref(database, `salas/${codigoActual}`);
        const snapshot = await get(salaRef);

        if (!snapshot.exists()) {
            alert("La sala ya no existe.");
            return;
        }

        const sala = snapshot.val();

        if (sala.anfitrionId !== jugadorActualId) {
            alert("Solo el anfitrión puede volver a la sala.");
            return;
        }

        if (sala.revelados !== true) {
            alert("Primero deben revelar los componentes.");
            return;
        }

        await update(salaRef, {
            estado: "esperando",
            revelados: false
        });

    } catch (error) {
        console.error("Error volviendo a la sala:", error);
        alert("No se pudo volver a la sala de espera.");
    }
})
// ==========================================
// TURNOS Y RONDAS
// ==========================================

function mostrarTurnoActual(sala) {

    const orden = sala.ordenTurnos || [];
    const indice = sala.turnoActual ?? 0;
    const rondaNumero = sala.rondaNumero || 1;
    const rondasTerminadas = sala.rondasTerminadas === true;

    // Mostrar ronda actual
    if (rondaNumero === RONDA_FINAL) {

        contadorRonda.textContent =
            "🎯 Ronda final: Arriesgar";

    } else {

        contadorRonda.textContent =
            `Ronda ${rondaNumero} de ${CANTIDAD_RONDAS_PREGUNTAS}`;
    }


    // Si todavía no existen turnos
    if (orden.length === 0) {

        turnoActualElemento.textContent =
            "Sin turno";

        palabraTurno.textContent =
            "???";

        mensajeTurno.textContent =
            "";

        jugadorTurnoActualId =
            null;

        btnTerminarTurno.style.display =
            "none";

        btnForzarTurno.style.display =
            "none";

        return;
    }


    // ======================================
    // FINAL DE TODAS LAS RONDAS
    // ======================================

    if (rondasTerminadas && !revelados) {

        contadorRonda.textContent =
            "🎯 Ronda final completada";

        turnoActualElemento.textContent =
            "🏁 ¡Final de la partida!";

        palabraTurno.textContent =
            "Tu componente era...";

        mensajeTurno.textContent =
            "El anfitrión ya puede revelar los resultados.";

        btnTerminarTurno.style.display =
            "none";

        btnForzarTurno.style.display =
            "none";

        return;
    }


    const idTurno =
        orden[indice];

    const jugador =
        jugadores[idTurno];


    // Si por algún motivo el jugador no existe
    if (!jugador) {

        turnoActualElemento.textContent =
            "Esperando...";

        palabraTurno.textContent =
            "???";

        mensajeTurno.textContent =
            "";

        btnTerminarTurno.style.display =
            "none";

        btnForzarTurno.style.display =
            "none";

        return;
    }


    jugadorTurnoActualId =
        idTurno;

    const esMiTurno =
        idTurno === jugadorActualId;

    const soyAnfitrion =
        sala.anfitrionId === jugadorActualId;


    // ======================================
    // MOSTRAR PALABRA / COMPONENTE
    // ======================================

    if (revelados) {

        const miJugador =
            jugadores[jugadorActualId];

        contadorRonda.textContent =
            "✅ Resultados";

        turnoActualElemento.textContent =
            "🎉 ¡Tu componente era!";

        palabraTurno.textContent =
            miJugador?.elemento || "???";

        mensajeTurno.textContent =
            "Todos los componentes fueron revelados.";

    } else {

        turnoActualElemento.textContent =
            `🎤 Turno de: ${jugador.nombre}`;


        if (esMiTurno) {

            palabraTurno.textContent =
                "???";

        } else {

            palabraTurno.textContent =
                jugador.elemento || "???";
        }


        // ======================================
        // MENSAJE SEGÚN LA RONDA
        // ======================================

        if (rondaNumero === RONDA_FINAL) {

            if (esMiTurno) {

                mensajeTurno.textContent =
                    "🎯 Arriesgá qué componente creés que sos y después terminá tu turno.";

            } else {

                mensajeTurno.textContent =
                    `🎯 ${jugador.nombre} está arriesgando su respuesta...`;
            }

        } else {

            if (esMiTurno) {

                mensajeTurno.textContent =
                    "Hacé tu pregunta y después terminá tu turno.";

            } else {

                mensajeTurno.textContent =
                    `Esperando a que ${jugador.nombre} termine su turno...`;
            }
        }
    }


    // ======================================
    // BOTONES
    // ======================================

    btnTerminarTurno.style.display =
        esMiTurno &&
        !revelados &&
        !rondasTerminadas
            ? "inline-block"
            : "none";


    btnForzarTurno.style.display =
        soyAnfitrion &&
        !revelados &&
        !rondasTerminadas
            ? "inline-block"
            : "none";
}


// ==========================================
// TERMINAR TURNO
// ==========================================

btnTerminarTurno.addEventListener(
    "click",
    async () => {

        try {

            const salaRef =
                ref(
                    database,
                    `salas/${codigoActual}`
                );


            const snapshot =
                await get(salaRef);


            if (!snapshot.exists()) {
                return;
            }


            const sala =
                snapshot.val();


            const orden =
                sala.ordenTurnos || [];


            const indice =
                sala.turnoActual ?? 0;


            if (
                orden.length === 0 ||
                sala.rondasTerminadas === true
            ) {
                return;
            }


            // Solo puede terminar
            // quien tiene el turno
            if (
                orden[indice] !==
                jugadorActualId
            ) {

                alert(
                    "Todavía no es tu turno."
                );

                return;
            }


            let siguiente =
                indice + 1;


            let rondaNumero =
                sala.rondaNumero || 1;


            let rondasTerminadas =
                false;


            // Si terminó el último jugador
            if (
                siguiente >=
                orden.length
            ) {

                // Si terminó la ronda final
                if (
                    rondaNumero >=
                    RONDA_FINAL
                ) {

                    rondasTerminadas =
                        true;

                    // Dejamos el turno
                    // en el último jugador
                    siguiente =
                        indice;

                } else {

                    // Volvemos al primero
                    siguiente =
                        0;

                    // Siguiente ronda
                    rondaNumero++;
                }
            }


            await update(
                salaRef,
                {
                    turnoActual:
                        siguiente,

                    rondaNumero:
                        rondaNumero,

                    rondasTerminadas:
                        rondasTerminadas
                }
            );


        } catch (error) {

            console.error(
                "Error pasando turno:",
                error
            );
        }
    }
);


// ==========================================
// FORZAR SIGUIENTE TURNO
// ==========================================

btnForzarTurno.addEventListener(
    "click",
    async () => {

        try {

            const salaRef =
                ref(
                    database,
                    `salas/${codigoActual}`
                );


            const snapshot =
                await get(salaRef);


            if (!snapshot.exists()) {
                return;
            }


            const sala =
                snapshot.val();


            // Solo el anfitrión puede forzar
            if (
                sala.anfitrionId !==
                jugadorActualId
            ) {

                alert(
                    "Solo el anfitrión puede forzar el turno."
                );

                return;
            }


            const orden =
                sala.ordenTurnos || [];


            const indice =
                sala.turnoActual ?? 0;


            if (
                orden.length === 0 ||
                sala.rondasTerminadas === true
            ) {
                return;
            }


            let siguiente =
                indice + 1;


            let rondaNumero =
                sala.rondaNumero || 1;


            let rondasTerminadas =
                false;


            if (
                siguiente >=
                orden.length
            ) {

                if (
                    rondaNumero >=
                    RONDA_FINAL
                ) {

                    rondasTerminadas =
                        true;

                    siguiente =
                        indice;

                } else {

                    siguiente =
                        0;

                    rondaNumero++;
                }
            }


            await update(
                salaRef,
                {
                    turnoActual:
                        siguiente,

                    rondaNumero:
                        rondaNumero,

                    rondasTerminadas:
                        rondasTerminadas
                }
            );


        } catch (error) {

            console.error(
                "Error forzando turno:",
                error
            );
        }
    }
);