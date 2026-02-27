import { api } from './api'

export const UsuariosService = {
  crear(data: {
    nombre: string
    email: string
    contrasena: string
  }) {
    return api.post('/usuarios', data)
  },

  obtenerTodos() {
    return api.get('/usuarios')
  },



  //define como el frontend se comunica con el back para iniciar sesion y recibir el token 
  //login es una funcion que recibe un objeto con email y contraseña 
  //aca entra los datos y se los envia al backend
  login(data: { email: string; contrasena: string }) {
    //api.post es una funcion que envia una peticion post al backend
    //'/usuarios/login' es la ruta del backend que recibe la peticion 
    //aca la data es el objeto con email y contraseña
    // return para q front reciba la respuesta del backend
    return api.post('/usuarios/login', data)

    //quien se encarga de este metodo es el backend del archivo usuarios.controller.ts
    //lo que hace usuarios.controller.ts de este metodo es: 
    //1. recibe la peticion post al backend
    //2. busca el usuario en la base de datos
    //3. compara la contraseña
    //4. si la contraseña es correcta, devuelve el usuario
    //5. si la contra es incorrecta, devuelve un error
    //6. si el usuario no existe, devuelve un error
  },


  //agregado logout de 
  logout() {
    return api.post('/usuarios/logout');
  },
}
