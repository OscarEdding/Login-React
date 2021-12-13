import React from "react"
import { db } from "../firebase"

import moment from 'moment'
import 'moment/locale/es' // Cada vez que se llame a moment, se va a transformar a español

const Firestore = (props) => {
	const [tareas, setTareas] = React.useState([])
	const [tarea, setTarea] = React.useState("") // Estado para agregar Tarea
	const [modoEdicion, setModoEdicion] = React.useState(false) /* Estado para 
  	transformar formulario de agregar a editar. */
	const [id, setId] = React.useState("")
	const [ultimo, setUltimo] = React.useState(null)
	const [desactivar, setDesactivar] = React.useState(false)

	React.useEffect(() => {
		const obtenerDatos = async () => {
			try {
				setDesactivar(true)

				const data = await db.collection(props.user.uid)
					.limit(2)
					.orderBy("fecha", "asc")
					.get()
				/* El id del usuario es el nombre de colección en nuestra base de datos */
				console.log("data.docs: " + data.docs)
				/* Muestra los documentos */
				const arrayData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

				setUltimo(data.docs[data.docs.length - 1])

				console.log(arrayData)
				setTareas(arrayData)

				const query = await db.collection(props.user.uid)
					.limit(2)
					.orderBy("fecha", "asc")
					.startAfter(data.docs[data.docs.length - 1])
					.get()
				/* A este startAfter le pasamos directamente data.docs[data.docs.length - 1]
				y no ultimo, ya que es recomendable utilizarlo de esa manera cuando estamos
				trabajando dentro de una función y se demora menos para procesarlo. */
				if(query.empty) {
					console.log("No hay más documentos.")
					setDesactivar(true)
					/* La función de hacer una nueva llamada a la base de datos con el 
					nombre de query es saber si es que el documento viene vacio o no 
					por si tuvieramos mas documentos. Si es que ya no hay mas documentos, 
					desactivamos el botón */
				} else {
					setDesactivar(false)
					/* En el caso de haber mas documento, que el botón esté activado */
				}
			} catch (error) {
				console.log(error)
			}
		}

		obtenerDatos()
	}, [props.user.uid])

	const agregar = async (e) => {
		e.preventDefault()

		if (!tarea.trim()) {
			console.log("Está vacío")
			return
		}

		try {
			const nuevaTarea = {
				name: tarea,
				fecha: Date.now() /* Genera un número que se puede transformar 
                en la fecha cuando se creó la nueva tarea */,
			}

			const data = await db.collection(props.user.uid).add(nuevaTarea)
			/* El add recibe el objeto, en este caso recibe nuevaTarea.
            Con el add el id va a ser aleatorio de la misma manera en que lo 
            colocabamos de forma manual. */

			setTareas([
				...tareas, // Hacemos una copia del array Tareas mediante los 3 puntitos
				{ ...nuevaTarea, id: data.id } /* Agregamos un objeto que contenga la 
                nuevaTarea y mediante el data.id le agregamos un id automaticamente 
                mediante firestore. */,
				/* Descuartisamos tareas y nuevaTarea para crear un solo objeto que 
                contenga las tareas anteriores + la nueva tarea y su id. */
			])
			setTarea("") /* Limpiamos Tarea para que podamos agregar otra tarea */
		} catch (error) {
			console.log(error)
		}

		console.log(tarea)
	}

	const eliminar = async (id) => {
		try {
			await db.collection(props.user.uid).doc(id).delete()

			const arrayFiltrado = tareas.filter((item) => item.id !== id)
			setTareas(arrayFiltrado)
		} catch (error) {
			console.log(error)
		}
	}

	const activarEdicion = (item) => {
		/* Es importante que reciba como parametro el item */
		setModoEdicion(true) /* Activamos el formulario de edición  */
		setTarea(item.name) /* Le pasamos en nombre de la tarea a editar en el input */
		setId(item.id) /* Queda registrado el id de la tarea a editar */
	}

	const editar = async (e) => {
		e.preventDefault()

		if (!tarea.trim()) {
			console.log("Está vacío")
			return
		}

		try {
			await db.collection(props.user.uid).doc(id).update({
				name: tarea,
			}) /* update va a recibir un objeto con el campo que nosotros queremos 
            actualizar, por lo que no necesitamos mandar todo el objeto. */
			const arrayEditado = tarea.map((item) =>
				item.id === id ? { id: item.id, fecha: item.fecha, name: tarea } : item
			) /* Cuando el item.id sea igual al id que estamos editando: Cuando eso sea
            verdadero, vamos a devolver un objeto que contenga el id, la fecha y la tarea, y 
            se va a guardar en arrayEditado, caso contrario en que el item.id no coincide
            con el id que estamos editando, devolvemos el item sin modificación. */
			setTareas(arrayEditado)
			setModoEdicion(false) /* Desactivamos el formulario de edición  */
			setTarea("") /* Limpiamos el input */
			setId("") /* Limpiamos el registro del id de la tarea editada */
		} catch (error) {
			console.log(error)
		}
	}

	const siguiente = async() => {
		console.log("Presionaste siguiente")
		try {
			const data = await db.collection(props.user.uid)
				.limit(2)
				.orderBy("fecha", "asc")
				.startAfter(ultimo)
				.get()
			const arrayData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
			setTareas([
				...tareas,
				...arrayData
			]) /* Recordar que los 3 puntos sirven para destruir los arreeglos y luego 
			construir un objeto que contenga todo.
			Si nosotros no le colocamos los 3 puntos en arrayData, podemos visualizar
			en los components del navegador que en el estado tenemos un objeto 
			proveniente de tareas y un arreglo proveniente de arrayData, para evitar
			esto descuatizamos todo con los 3 puntitos y construimos un objeto que  
			contenga todos los datos. */
			setUltimo(data.docs[data.docs.length - 1]) /* Actualizamos nuestro último 
			documento de manera dinámica */

			const query = await db.collection(props.user.uid)
			.limit(2)
			.orderBy("fecha", "asc")
			.startAfter(data.docs[data.docs.length - 1])
			.get()
			/* A este startAfter le pasamos directamente data.docs[data.docs.length - 1]
			y no ultimo, ya que es recomendable utilizarlo de esa manera cuando estamos
			trabajando dentro de una función y se demora menos para procesarlo. */
			if(query.empty) {
				console.log("No hay más documentos.")
				setDesactivar(true)
				/* La función de hacer una nueva llamada a la base de datos con el 
				nombre de query es saber si es que el documento viene vacio o no 
				por si tuvieramos mas documentos. Si es que ya no hay mas documentos, 
				desactivamos el botón */
			}else{
				setDesactivar(false)
			}
	
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className="container mt-3">
			<div className="row">
				<div className="col-md-6">
					<ul className="list-group">
						{tareas.map((item) => (
							<li className="list-group-item" key={item.id}>
								{item.name} - {moment(item.fecha).format('LLL')}
								<button 
                                    className="btn btn-danger btn-sm float-right" 
                                    type="submit" onClick={() => eliminar(item.id)}
                                >
									Eliminar
								</button>
								<button 
                                    className="btn btn-warning btn-sm float-right mr-2" 
                                    type="submit" onClick={() => activarEdicion(item)}
                                >
									{/* Debemos pasarle todo el item para modificarlo */}
									Editar
								</button>
							</li>
						))}
					</ul>
					<button 
						className="btn btn-info btn-block mt-2 btn-sm"
						onClick={() => siguiente()}
						disabled={desactivar}
					>
						Ver más
					</button>
				</div>
				<div className="col-md-6">
					<h3>
						{modoEdicion ? "Editar Tarea" : "Agregar Tarea"}
						{/* Cuando modoEdicion sea verdadero, mostrará "Editar Tarea" 
                        y cuando sea falso mostrará "Agregar Tarea" */}
					</h3>
					<form onSubmit={modoEdicion ? editar : agregar}>
						{/* Cuando modoEdicion sea verdadero, el botón dirá "Editar" 
                        y cuando sea falso el botón dirá "Agregar" */}
						<input 
                            type="text" 
                            placeholder="Ingrese Tarea" 
                            className="form-control mb-2" 
                            onChange={(e) => setTarea(e.target.value)} 
                            value={tarea} 
                        />
						<button 
                            className={
                                modoEdicion ? 
                                    "btn btn-warning btn-block" : "btn btn-dark btn-block"
                            } 
                            type="submit">
							{/* Se puede jugar con el className del botón 
                            y hacerlo dinámico de la misma manera que el título y el
                            botón, utilizando el modoEdicion y el operador ternario. */}
							{modoEdicion ? "Editar" : "Agregar"}
							{/* Cuando modoEdicion sea verdadero, el botón dirá "Editar" 
                            y cuando sea falso el botón dirá "Agregar" */}
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}

export default Firestore
