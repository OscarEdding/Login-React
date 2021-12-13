import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Admin from "./components/Admin"
import Login from "./components/Login"
import Navbar from "./components/Navbar"
import Reset from "./components/Reset"

import { auth } from "./firebase"

function App() {

	const [firebaseUser, setFirebaseUser] = React.useState(false)

	React.useEffect(() => {
		auth.onAuthStateChanged(user => { /* Si existe un usuario registrado
			nos va a pintar el usuario en la consola */
			console.log(user)
			if(user) { /* Si existe un usuario, pasamos al usuario al estado */ 
				setFirebaseUser(user)
			} else {
				/* Si no existe el usuario, el estado será nulo */
				setFirebaseUser(null)
			}
		})
	}, [])

	return firebaseUser !== false ? ( /* si firebaseUser es distinto a falso, entonces 
		devuelveme el contenido que se encuentra aqui adentro, de lo contrario, que me 
		muestre un párrafo que diga Cargando... */
		/* En el caso de que firebaseUser sea falso va a mostrar el mensaje de Cargando... 
		por unos segundos, en el caso de que firebaseUser sea nulo o contenga al usuario, 
		va a mostrar el contenido de este return. */
		<Router>
			{/* Envolvemos todo en el Router, incluso nuestro div */}
			<div className="container">
				{/* Nuestro navbar con menú de navegación debe ir arriba de los Switch */}
				<Navbar firebaseUser={firebaseUser}/>
				<Switch>
					{/* Aqui haremos nuestros componentes dinámicos */}
					<Route path="/" exact>
						{/* Cada uno de nuestros componentes dinámicos con su ruta */}
						inicio...
					</Route>
					<Route path="/login">
						<Login/>
					</Route>
					<Route path="/admin">
						<Admin/>
					</Route>
					<Route path="/reset">
						<Reset/>
					</Route>
				</Switch>
			</div>
		</Router>
	) : (
		<p>Cargando...</p>
	)
}

export default App
