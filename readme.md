# Formulario de Registro de Alumnos DWEC

Este proyecto implementa un formulario de registro dinámico utilizando HTML5, JavaScript (Vanilla), JSON y el patrón de diseño Builder.

## 🚀 Instalación y Ejecución

1.  **Clonar el repositorio**:
    ```bash
    git clone <url-de-tu-repo>
    ```
2.  **Ejecutar**:
    Dado que el proyecto utiliza `fetch` para cargar el archivo JSON, **es necesario ejecutarlo a través de un servidor local** para evitar errores de política CORS.
    * Opción A (VS Code): Instala la extensión "Live Server", haz clic derecho en `index.html` y selecciona "Open with Live Server".
    * Opción B (Python): `python -m http.server` en la carpeta del proyecto.

## 🛠️ Tecnologías y Patrones

* **HTML5 & Bootstrap 5**: Estructura y diseño responsive.
* **JavaScript (ES6+)**:
    * **Patrón Builder**: Utilizado en `js/app.js` para la construcción escalonada del objeto `Alumno`.
    * **Prototype**: Métodos de la clase `Alumno` definidos mediante prototipos para optimización de memoria.
    * **Fetch API**: Carga asíncrona de `data/datos.json`.
* **Validaciones**:
    * Expresiones regulares para NIF (algoritmo módulo 23) y Código Postal.
    * Validación nativa HTML5 controlada por JS.

## 📋 Estructura de Datos

El formulario carga dinámicamente opciones anidadas (País -> Ciudad -> Población) definidas en el archivo JSON externo.