import { validationResult } from 'express-validator' // Extrae los resultados de la validación HTTP de la petición

const handleValidation = async (req, res, next) => { // req: objeto de solicitud, res: objeto de respuesta
  const err = validationResult(req) // Extraemos los resultados de la validación de req
  if (err.errors.length > 0) { // Comprobamos si hay errores
    res.status(422).send(err) // Si hay errores se responde con "Entidad Inprocesable (422)"
  } else {
    next() // Llama a la siguiente función especificada donde se usa handleValidation
  }
}

export { handleValidation }
