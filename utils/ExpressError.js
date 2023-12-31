// Definimos una clase llamada ExpressError que extiende la clase Error de JavaScript.
class ExpressError extends Error {
    // Constructor de la clase que toma un mensaje y un código de estado HTTP como argumentos.
    constructor(message, statusCode) {
        // Llamamos al constructor de la clase padre (Error) usando super().
        super();
        
        // Asignamos el mensaje y el código de estado como propiedades de la instancia.
        this.message = message;
        this.statusCode = statusCode;
    }
}

// Exportamos la clase ExpressError para que pueda ser utilizada en otros archivos.
module.exports = ExpressError;
