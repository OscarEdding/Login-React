import React from "react"
import { Link, NavLink } from "react-router-dom"
import { auth } from "../firebase"
import { withRouter } from "react-router"

const Navbar = (props) => {

	const cerrarSesion = () => {
		auth.signOut()
			.then(() => {
				props.history.push("/login")
			})
	} /* SignOut nos permite cerrar la sesión activa y en el caso de que se 
	cierre sesión, con el .then que es la respuesta de éxito, vamos a 
	empujar al usuario al login.
	Al cerrar la sesión, va a devolver un null mediante el
	onAuthStateChanged del App.jsx y con ese null vamos a mostrar el botón
	del login */

	return (
		<div className="navbar navbar-dark bg-dark">
			<Link className="navbar-brand" to="/">
				React Admin
			</Link>
			<div>
				<div className="d-flex">
					{
						props.firebaseUser !== null ? (
							<NavLink className="btn btn-dark mr-2" to="/" exact>
								{/* Permite colocar la clase active cuando estamos 
								en la ruta. Active activa una clase de Bootstrap
								que se ve mas oscura. */}
								Inicio
							</NavLink>
						) : null
					}
					{
						props.firebaseUser !== null ? (
							<NavLink className="btn btn-dark mr-2" to="/admin">
								Admin
							</NavLink>
						) : null
					}
					{
						props.firebaseUser !== null ? (
							/* Si existe un usuario (firebaseUser !== null) que 
							muestre Cerrar Sesión, sino Login */
							<button className="btn btn-dark" onClick={() => cerrarSesion()}>
								Cerrar Sesión
							</button>
						) : (
							<NavLink className="btn btn-dark" to="/login">
								Login
							</NavLink>
						)
					}
				</div>
			</div>
		</div>
	)
}

export default withRouter(Navbar)
