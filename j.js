'use strict' 
const Numero_maximo_de_empleados_por_proyecto = 2; 

class Proyecto{
  constructor(nombre, departamento){
    this.nombre = nombre;
    this.empleados = [];
  }



  asignarEmpleado(empleado){
    //usamos 
    if(empleado.includes(empleado))
  }
}

class Empleado{
  constructor(nombre, apellido, dni){
    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni; 
    this.jefe = null; 
  }

  asignarJefe(jefe){
    this.jefe = jefe; 
  }
}

class Jefe extends Empleado{
  constructor(nombre, apellido, dni){
    super(Empleado);
    this.empleadosAcargo = [];
  }

  agregarEmpleado(empleado){
    if(!this.empleadosAcargo.includes(empleado)){
      this.empleadosAcargo.push(empleado); 
      empleado.asignarJefe(this); 
    }
  }
}

class Departamento{
  constructor(nombre){
    this.nombre = nombre; 
  }
}


class EmpresaTecnologica{
  constructor(nombre){
    this.nombre = nombre; 
    this.proyectos = proyectos; 
    this.empleados = empleados; 
  }
}



//objetos 
