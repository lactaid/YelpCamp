// Exportamos una función que toma otra función 'func' como argumento.
module.exports = func => {
    // Retornamos una nueva función que toma los argumentos 'req', 'res', y 'next'.
    return (req, res, next) => {
        // Ejecutamos la función 'func' pasando 'req', 'res', y 'next', y manejamos cualquier error que ocurra usando 'catch(next)'.
        func(req, res, next).catch(next);
    };
};
