import React from 'react'
import { auth } from '../firebase'
import { withRouter } from 'react-router'

const Reset = (props) => {

    const [email, setEmail] = React.useState("")
    const [error, setError] = React.useState(null)

	const procesarDatos = (e) => {
		e.preventDefault() // Para no procesar el método get en la url

		if (!email.trim()) {
			// Validación de carácteres para email
			console.log("Ingrese Email")
			setError("Ingrese Email")

			return
		}

		setError(null)
        recuperar()
		console.log("Correo enviado exitosamente!!!")
	}

    const recuperar = React.useCallback(
        async () => {
            try {
                await auth.sendPasswordResetEmail(email)
                props.history.push('/login')
            } catch (error) {
                console.log(error)
                if(error.code === "auth/user-not-found") {
                    setError("No hay registros de éste usuario.")
                }
            }
        }, [email, props.history])

    return (
		<div className="mt-5">
			<h3 className="text-center">
                Reiniciar contraseña
            </h3>
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
						<button className="btn btn-dark btn-lg btn-block" type="submit">
							{/* El btn-block permite que el boton abarque el 100% */}
                            Reiniciar contraseña
						</button>
					</form>
				</div>
			</div>
		</div>
    )
}

export default withRouter(Reset)
