/**
 * Implementación con Patrón Builder
 */


// 1. CLASES Y PATRONES (MODELO) [cite: 92, 94]

/**
 * Clase Principal Alumno
 */
function Alumno() {
    this.datosPersonales = {};
    this.familiares = [];
    this.direccion = {};
    this.datosAcademicos = {};
    this.infoMedica = {};
}

// Método definido en el prototipo
Alumno.prototype.generarResumenHTML = function() {
    // Generar lista de familiares
    let familiaresHTML = this.familiares.map(fam => `
        <p><strong>Nombre:</strong> ${fam.nombre} ${fam.apellidos}</p>
        <p><strong>NIF:</strong> ${fam.nif}</p>
        <p><strong>Profesión:</strong> ${fam.profesion}</p>
        <p><strong>Ciudad Nacimiento:</strong> ${fam.ciudadNac}</p>
        <p><strong>Lengua Materna:</strong> ${fam.lenguaMaterna}</p>
        <p><strong>Idiomas:</strong> ${fam.idiomas.join(', ')}</p>
    `).join('<hr>');

    return `
        <h4>Datos Personales</h4>
        <p><strong>Nombre:</strong> ${this.datosPersonales.nombre} ${this.datosPersonales.apellidos}</p>
        <p><strong>NIF:</strong> ${this.datosPersonales.nif}</p>
        <p><strong>Lengua Materna:</strong> ${this.datosPersonales.lengua}</p>
        <p><strong>Idiomas Conocidos:</strong> ${this.datosPersonales.idiomas.join(', ')}</p>
        <hr>
        <h4>Familiar Asociado</h4>
        ${familiaresHTML}
        <hr>
        <h4>Dirección</h4>
        <p><strong>País:</strong> ${this.direccion.pais}</p>
        <p><strong>Ciudad:</strong> ${this.direccion.ciudad}</p>
        <p><strong>Población:</strong> ${this.direccion.poblacion}</p>
        <p><strong>Dirección:</strong> ${this.direccion.direccion}</p>
        <p><strong>CP:</strong> ${this.direccion.cp}</p>
        <hr>
        <h4>Datos Académicos</h4>
        <p><strong>Colegio:</strong> ${this.datosAcademicos.colegio}</p>
        <p><strong>Nivel Alcanzado:</strong> ${this.datosAcademicos.nivelAlcanzado}</p>
        <p><strong>Idiomas Estudiados:</strong> ${this.datosAcademicos.idiomas.join(', ')}</p>
        <p><strong>Nivel Solicitado:</strong> ${this.datosAcademicos.nivelSolicitado}</p>
        <hr>
        <h4>Información Médica</h4>
        <p><strong>Alergias:</strong> ${this.infoMedica.alergias.length > 0 ? this.infoMedica.alergias.join(', ') : 'Ninguna'}</p>
        <p><strong>Medicación:</strong> ${this.infoMedica.medicacion || 'Ninguna'}</p>
    `;
};

/**
 * Patrón Builder para construir el objeto Alumno 
 */
function AlumnoBuilder() {
    this.alumno = new Alumno();
}

AlumnoBuilder.prototype.setDatosPersonales = function(nombre, apellidos, nif, lengua, idiomas) {
    this.alumno.datosPersonales = { nombre, apellidos, nif, lengua, idiomas };
    return this; // Retornamos this para encadenar métodos
};

AlumnoBuilder.prototype.addFamiliar = function(nombre, apellidos, nif, profesion, ciudadNac, lenguaMaterna, idiomas) {
    this.alumno.familiares.push({ nombre, apellidos, nif, profesion, ciudadNac, lenguaMaterna, idiomas });
    return this;
};

AlumnoBuilder.prototype.setDireccion = function(pais, ciudad, poblacion, direccion, cp) {
    this.alumno.direccion = { pais, ciudad, poblacion, direccion, cp };
    return this;
};

AlumnoBuilder.prototype.setDatosAcademicos = function(colegio, nivelAlcanzado, idiomas, nivelSolicitado) {
    this.alumno.datosAcademicos = { colegio, nivelAlcanzado, idiomas, nivelSolicitado };
    return this;
};

AlumnoBuilder.prototype.setInfoMedica = function(alergias, medicacion) {
    this.alumno.infoMedica = { alergias, medicacion };
    return this;
};

AlumnoBuilder.prototype.build = function() {
    return this.alumno;
};


// 2. GESTIÓN DE DATOS Y EVENTOS 

document.addEventListener('DOMContentLoaded', () => {
    cargarDatosJSON();
    configurarEventos();
});

let datosGlobales = null; // Para guardar el JSON cargado

/**
 * Carga los datos del JSON y rellena los desplegables iniciales
 */
async function cargarDatosJSON() {
    try {
        const response = await fetch('data/datos.json');
        datosGlobales = await response.json();

        // Cargar desplegables del ALUMNO
        rellenarSelect('lenguaMaterna', datosGlobales.lenguas);
        rellenarSelect('idiomas', datosGlobales.idiomas);
        
        // Cargar desplegables del FAMILIAR
        rellenarSelect('fam_lenguaMaterna', datosGlobales.lenguas);
        rellenarSelect('fam_idiomas', datosGlobales.idiomas);
        rellenarSelect('fam_profesion', datosGlobales.profesiones);
        
        // Usamos ciudades planas de los países para el ejemplo de nacimiento
        const todasCiudades = datosGlobales.paises.flatMap(p => p.ciudades.map(c => c.nombre));
        rellenarSelect('fam_ciudadNac', todasCiudades);
        
        // Cargar desplegables ACADÉMICOS
        rellenarSelect('nivelEstudios', datosGlobales.niveles_estudios);
        rellenarSelect('nivelSolicitado', datosGlobales.niveles_estudios);
        rellenarSelect('idiomasEstudiados', datosGlobales.idiomas);
        
        // Cargar desplegables MÉDICOS
        rellenarSelect('alergias', datosGlobales.alergias);

        // Cargar País (inicio de la cascada)
        const paises = datosGlobales.paises.map(p => p.nombre);
        rellenarSelect('pais', paises);

    } catch (error) {
        console.error("Error cargando JSON:", error);
        alert("Error cargando los datos del formulario.");
    }
}

/**
 * Helper para rellenar un select
 */
function rellenarSelect(id, arrayDatos) {
    const select = document.getElementById(id);
    arrayDatos.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        select.appendChild(option);
    });
}

/**
 * Configura Listeners para eventos y validaciones
 */
function configurarEventos() {
    // Evento Cascada: País -> Ciudad 
    document.getElementById('pais').addEventListener('change', (e) => {
        const paisSelect = e.target.value;
        const ciudadSelect = document.getElementById('ciudad');
        const poblacionSelect = document.getElementById('poblacion');
        
        ciudadSelect.innerHTML = '<option value="">Seleccione...</option>';
        poblacionSelect.innerHTML = '<option value="">Seleccione ciudad primero...</option>';
        ciudadSelect.disabled = true;
        poblacionSelect.disabled = true;

        if (paisSelect) {
            const datosPais = datosGlobales.paises.find(p => p.nombre === paisSelect);
            if (datosPais) {
                datosPais.ciudades.forEach(c => {
                    const opt = document.createElement('option');
                    opt.value = c.nombre;
                    opt.textContent = c.nombre;
                    ciudadSelect.appendChild(opt);
                });
                ciudadSelect.disabled = false;
            }
        }
    });

    // Evento Cascada: Ciudad -> Población
    document.getElementById('ciudad').addEventListener('change', (e) => {
        const ciudadNombre = e.target.value;
        const paisNombre = document.getElementById('pais').value;
        const poblacionSelect = document.getElementById('poblacion');
        
        poblacionSelect.innerHTML = '<option value="">Seleccione...</option>';
        poblacionSelect.disabled = true;

        if (ciudadNombre) {
            const datosPais = datosGlobales.paises.find(p => p.nombre === paisNombre);
            const datosCiudad = datosPais.ciudades.find(c => c.nombre === ciudadNombre);
            
            if (datosCiudad) {
                datosCiudad.poblaciones.forEach(p => {
                    const opt = document.createElement('option');
                    opt.value = p;
                    opt.textContent = p;
                    poblacionSelect.appendChild(opt);
                });
                poblacionSelect.disabled = false;
            }
        }
    });

    // Validación y Envío
    document.getElementById('registroForm').addEventListener('submit', procesarFormulario);
}

// 3. VALIDACIÓN

function validarNIF(nif) {
    // Regex estándar para NIF español (8 números + Letra)
    const regex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
    if (!regex.test(nif)) return false;
    
    // Validación de letra correcta
    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    const numero = nif.substr(0, 8);
    const letra = nif.substr(8, 1).toUpperCase();
    return letras.charAt(numero % 23) === letra;
}

function getSelectValues(select) {
    return Array.from(select.selectedOptions).map(option => option.value);
}

function validarSelectMultiple(selectElement) {
    const valores = getSelectValues(selectElement);
    if (valores.length === 0) {
        selectElement.classList.add('is-invalid');
        return false;
    } else {
        selectElement.classList.remove('is-invalid');
        selectElement.classList.add('is-valid');
        return true;
    }
}

function procesarFormulario(e) {
    e.preventDefault();
    const form = e.target;
    let esValido = true;

    // Validación NIF Alumno
    const nifAlumno = document.getElementById('nif');
    if (!validarNIF(nifAlumno.value)) {
        nifAlumno.classList.add('is-invalid');
        esValido = false;
    } else {
        nifAlumno.classList.remove('is-invalid');
        nifAlumno.classList.add('is-valid');
    }

    // Validación NIF Familiar
    const nifFamiliar = document.getElementById('fam_nif');
    if (!validarNIF(nifFamiliar.value)) {
        nifFamiliar.classList.add('is-invalid');
        esValido = false;
    } else {
        nifFamiliar.classList.remove('is-invalid');
        nifFamiliar.classList.add('is-valid');
    }

    // Validación Código Postal (Regex simple 5 dígitos)
    const cpInput = document.getElementById('cp');
    if (!/^\d{5}$/.test(cpInput.value)) {
        cpInput.classList.add('is-invalid');
        esValido = false;
    } else {
        cpInput.classList.remove('is-invalid');
        cpInput.classList.add('is-valid');
    }

    // Validación de selects múltiples obligatorios
    if (!validarSelectMultiple(document.getElementById('idiomas'))) {
        esValido = false;
    }
    if (!validarSelectMultiple(document.getElementById('fam_idiomas'))) {
        esValido = false;
    }
    if (!validarSelectMultiple(document.getElementById('idiomasEstudiados'))) {
        esValido = false;
    }

    // Validación campos HTML5 nativos
    if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        esValido = false;
    }

    if (esValido) {
        construirYMostrarAlumno();
    } else {
        alert('Por favor, corrija los errores en el formulario.');
    }
}

// 4. CONSTRUCCIÓN Y MODAL [cite: 92, 98]

function construirYMostrarAlumno() {
    // Instanciamos el Builder
    const builder = new AlumnoBuilder();

    // 1. Datos Personales
    builder.setDatosPersonales(
        document.getElementById('nombre').value,
        document.getElementById('apellidos').value,
        document.getElementById('nif').value,
        document.getElementById('lenguaMaterna').value,
        getSelectValues(document.getElementById('idiomas'))
    );

    // 2. Familiar 
    builder.addFamiliar(
        document.getElementById('fam_nombre').value,
        document.getElementById('fam_apellidos').value,
        document.getElementById('fam_nif').value,
        document.getElementById('fam_profesion').value,
        document.getElementById('fam_ciudadNac').value,
        document.getElementById('fam_lenguaMaterna').value,
        getSelectValues(document.getElementById('fam_idiomas'))
    );

    // 3. Dirección
    builder.setDireccion(
        document.getElementById('pais').value,
        document.getElementById('ciudad').value,
        document.getElementById('poblacion').value,
        document.getElementById('direccion').value,
        document.getElementById('cp').value
    );

    // 4. Datos Académicos
    builder.setDatosAcademicos(
        document.getElementById('colegio').value,
        document.getElementById('nivelEstudios').value,
        getSelectValues(document.getElementById('idiomasEstudiados')),
        document.getElementById('nivelSolicitado').value
    );

    // 5. Médicos
    builder.setInfoMedica(
        getSelectValues(document.getElementById('alergias')),
        document.getElementById('medicacion').value
    );

    // Construimos el objeto final
    const alumnoNuevo = builder.build();

    // Mostrar en Modal
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = alumnoNuevo.generarResumenHTML(); // Usando método Prototype
    
    // Objeto JS nativo del modal de Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('resumenModal'));
    modal.show();
    
    console.log("Objeto Alumno Creado:", alumnoNuevo);
}