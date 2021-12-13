import React from 'react'
import { auth } from '../firebase'
import { withRouter } from 'react-router'
import Firestore from './Firestore'

const Admin = (props) => {

    const [user, setUser] = React.useState(null)

    React.useEffect(() => {
        if(auth.currentUser) { /* El currentUser sirve para leer la información
            del usuario que se haya registrado en nuestro sitio web */
            // El usuario ha iniciado sesión
            console.log("Usuario existente!!!")
            setUser(auth.currentUser)
        } else {
            // El usuario no ha iniciado sesión
            console.log("Usuario no existente!!!")
            props.history.push("/login")
        }
    }, [props.history])

    return (
        <div>
            <h2>Ruta Protegida</h2>
            {
                user && (
                    <Firestore user={user}/>
                )
            }
        </div>
    )
}

export default withRouter(Admin)
