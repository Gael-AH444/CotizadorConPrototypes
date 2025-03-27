/*** CONSTRUCTORES ***/
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

//Realiza la cotizacion con los datos
Seguro.prototype.cotizarSeguro = function () {
    /*
        1 = Americano -> 1.15
        2 = Asiatico -> 1.05
        3 = Europeo -> 1.35
    */

    let cantidad;
    const base = 2000;

    switch (this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;
        default:
            break;
    }

    //Leer el año
    const diferenciaYears = new Date().getFullYear() - this.year;

    //Cada año que la diferencia es mayor, el costo se reducira un 3% el valor del seguro
    cantidad -= ((diferenciaYears * 3) * cantidad) / 100;

    /*
        Si el seguro es basico se multiplica por 30% mas    
        Si el seguro es completo se multiplica por 50% mas    
    */

    if (this.tipo == 'basico') {
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    }

    return cantidad;
}

function UI() { }

//Llenar el select de los años
UI.prototype.llenarSelect = () => {
    const max = new Date().getFullYear();
    const min = max - 20;

    const selectYear = document.querySelector('#year');

    for (let i = max; i >= min; i--) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

//Muestra mensaje en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const div = document.createElement('div');

    if (tipo == 'error') {
        div.classList.add('error');
    }
    else {
        div.classList.add('correcto')
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    //Insertar en el HTML
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
    }, 3000);
}

UI.prototype.mostrarResultado = (total, seguro) => {

    const { marca, year, tipo } = seguro;

    let textoMarca;
    switch (marca) {
        case '1':
            textoMarca = 'Americano';
            break;
        case '2':
            textoMarca = 'Asiatico';
            break;
        case '3':
            textoMarca = 'Europeo';
            break;
        default:
            break;
    }

    //Crear el resultado
    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
        <p class="header"> Tu resumen </p>
        <p class="font-bold"> Total: <span class="font-normal">$ ${total} </span></p>
        <p class="font-bold"> Marca: <span class="font-normal"> ${textoMarca} </span></p>
        <p class="font-bold"> Año: <span class="font-normal"> ${year} </span></p>
        <p class="font-bold"> Tipo: <span class="font-normal capitalize"> ${tipo} </span></p>
    `;

    const resultadoDiv = document.querySelector('#resultado');

    //Mostrar Spinner
    const spinner = document.querySelector('#cargando');
    spinner.classList.remove('hidden'); //Se muestra el spinner

    setTimeout(() => {
        spinner.classList.add('hidden');//Se elimina el spinner
        resultadoDiv.appendChild(div); //Se muestra el resultado
    }, 3000);
}

//Instanciar Clase UI 
const ui = new UI();



/*** DOM LOADED ***/
document.addEventListener('DOMContentLoaded', () => {
    //Llena el select con los años
    ui.llenarSelect();
});


/***FUNCIONES ***/
eventListeners();
function eventListeners() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(evnt) {
    evnt.preventDefault();

    //Leer la marca seleccionada
    const marca = document.querySelector('#marca').value;

    //Leer el año seleccionado
    const year = document.querySelector('#year').value;

    //Leer el tipo de covertura
    const tipo = document.querySelector('input[name="tipo"]:checked').value; //Seleccionando radio btn seleccionado

    if (marca === '' || year === '' || tipo === '') {
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }

    ui.mostrarMensaje('Cotizazndo...', 'correcto');

    //Ocultar las cotizaciones previas
    const resultados = document.querySelector('#resultado div');
    if (resultados != null) {
        resultados.remove();
    }

    //Instanciar Clase seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    //Utilizar prototype para cotizar el seguro
    ui.mostrarResultado(total, seguro);
}


