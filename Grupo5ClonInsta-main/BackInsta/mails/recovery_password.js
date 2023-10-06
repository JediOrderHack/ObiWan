const recoveryPassword = ({ recoverPassCode }) => (`
Se ha solicitado la recuperación de Meowseña.
Utiliza el siguiente código para crear una nueva contraseña: ${recoverPassCode}

Si no has sido tú ignora este email.`)

export default recoveryPassword
