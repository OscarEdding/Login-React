import React from "react"
import { auth, db } from "../firebase"
import { withRouter } from "react-router-dom";

const Login = (props) => {
	const [email, setEmail] = React.useState("")
	const [pass, setPass] = React.useState("")
	const [error, setError] = React.useState(null)
	const [esRegistro, setEsRegistro] = React.useState(false)

	const procesarDatos = (e) => {
		e.preventDefault() // Para no procesar el método get en la url

		if (!email.trim()) {
			// Validación de carácteres para email
			console.log("Ingrese Email")
			setError("Ingrese Email")

			return
		}

		if (!pass.trim()) {
			// Validación de carácteres para password
			console.log("Ingrese Password")
			setError("Ingrese Password")

			return
		}

		if (pass.length < 6) {
			// Verificación de carácteres mínimos para password
			console.log("Password de 6 a más carácteres")
			setError("Password de 6 a más carácteres")

			return
		}

		setError(null)
		console.log("Pasando todas las validaciones!")

		if (esRegistro) {
			/* Si esRegistro es verdadero, ejecutar registrar() */
			registrar()
		} else {
            login()
        }
	}

	const registrar = React.useCallback(async () => {
		/* Este Hook sirve para generar un Callback */

		try {
			const res = await auth.createUserWithEmailAndPassword(email, pass)
			/* Este await crea una nueva cuenta que contiene un email y un password
            y se guarda en res. Por otro lado, firebase le asigna un id a la cuenta. */
			console.log(res.user) // res.user muestra los datos de la cuenta creada
			await db.collection("usuarios").doc(res.user.email).set({
				email: res.user.email,
				uid: res.user.uid,
			}) /* Se va a crear una colección llamada usuarios la cual tendrá un id 
            en específico que será el email del usuario + su información (email e id) */
			await db.collection(res.user.uid).add ({
				name: "Tarea de ejemplo",
				fecha: Date.now()
			})
			setEmail("") // Limpiamos o reiniciamos el Email con un string vacío
			setPass("") // Limpiamos o reiniciamos la Password con un string vacío
			setError(null) // Limpiamos o reiniciamos el error con un null
            props.history.push("/admin")
		} catch (error) {
			console.log(error.message) // Muestra el error en inglés por firebase
			setError(error.message) // Guarda el error y lo muestra
			if (error.message === "The email address is badly formatted.") {
				console.log("El correo electrónico no es válido.")
				setError("El correo electrónico no es válido.")
				// Muestra el error en español ya que fue modificado y guardado en setError
			}
			if (error.message === "The email address is already in use by another account.") {
				setError("El correo electrónico ya está siendo utilizada por otra cuenta.")
			}
		}
	}, [email, pass, props.history]) // Es muy similar al useEffect
	/* El useCallback necesita como dependencias el email y el pass, por lo que se le
    pasa dentro de los corchetes para que los pueda leer (, [email, pass]) */

    const login = React.useCallback(async () => {
        try {
            const res = await auth.signInWithEmailAndPassword(email, pass)
            /* Este await espera a que el usuario esté logeado, por lo que  busca en la 
            base de datos al usuario que contenga 
            el email y contraseña ingresado.
            Espera una respuesta que  */
            console.log(res.user)
            setEmail("") // Limpiamos o reiniciamos el Email con un string vacío
			setPass("") // Limpiamos o reiniciamos la Password con un string vacío
			setError(null) // Limpiamos o reiniciamos el error con un null
            props.history.push("/admin")
        } catch (error) {
			console.log(error) // Muestra el error
			if (error.code === "auth/user-not-found") {
				console.log("No hay registros de éste usuario.")
				setError("No hay registros de éste usuario.")
				// Muestra el error en español ya que fue modificado y guardado en setError
			}
            if(error.code === 'auth/wrong-password'){
                setError('Usuario o contraseña incorrecta.')
            }
            console.log(error.code)
            console.log(error.message)
		}
    }, [email, pass, props.history])
    /* El useCallback necesita como dependencias el email y el pass, por lo que se le
    pasa dentro de los corchetes para que los pueda leer (, [email, pass]) */

	return (
		<div className="mt-5">
			<h3 className="text-center">{esRegistro ? "Registro de Usuarios" : "Login de Acceso"}</h3>
			{/* Formulario para usuarios nuevos o usuarios ya registrados */}
			<hr />
			<div className="row justify-content-center">
				<div className="col-12 col-sm-8 col-md-6 col-xl-4">
					{/* Con este className podemos utilizar un sistema de columnas
                    para hacer nuestro formulario responsivo.
                    En dispositivos pequeños va a utilizar el total de las
                    12 columnas y a medida que se va agrandando la pantalla del 
                    dispositivo, se va a ir achicando para que esté centrado;
                    Es por esto que utilizamos el justify-content-center */}
					<form onSubmit={procesarDatos}>
						{error && <div className="alert alert-danger">{error}</div>}
						{/* el && sirve para abreviar la parte negativa (null)
                        {
                            error ? (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            ) : null
                        } */}
						<input
							type="email"
							className="form-control mb-2"
							placeholder="Ingrese su email"
							onChange={(e) => setEmail(e.target.value)}
							/* El evento onChage recibe en su interior otro evento
                            llamado “e” el cual se va a procesar a travez de una 
                            función de flecha la cual va a retornar un resultado
                            que será el setEmail; y para detectar lo que el 
                            usuario está escribiendo en el input, se debe utilizar
                            e.target.value y lo guarda en los hooks. */
							value={email}
							/* Recibe un value para limpiar los campos; y este
                            value va a recibir el email. */
						/>
						<input type="password" className="form-control mb-2" placeholder="Ingrese su password" onChange={(e) => setPass(e.target.value)} value={pass} />
						<button className="btn btn-dark btn-lg btn-block" type="submit">
							{/* El btn-block permite que el boton abarque el 100% */}
							{esRegistro ? "Registrarse" : "Acceder"}
						</button>
						<button className="btn btn-info btn-sm btn-block" onClick={() => setEsRegistro(!esRegistro)} type="button">
							{/* El btn-block permite que el boton abarque el 100% */}
							{esRegistro ? "¿Ya estás registrado?" : "No tienes cuenta"}
						</button>
						{
							!esRegistro ? (
								<button 
									className="btn btn-lg btn-danger btn-sm mt-2" 
									type="button"
									onClick={() => props.history.push('/reset')}>
									{/* El btn-block permite que el boton abarque el 100% */}
									Recuperar contraseña
								</button>
							) : null
						}
					</form>
				</div>
			</div>
		</div>
	)
}

export default withRouter(Login)
