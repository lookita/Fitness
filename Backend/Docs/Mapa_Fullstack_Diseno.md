 El proceso para añadir cualquier pantalla nueva a tu aplicación de fitness es siempre el mismo:

Crea el archivo: Creas un nuevo archivo 
.tsx
 dentro de src/pages/ (por ejemplo, Perfil.tsx).
Importa el archivo: Vas a 
App.tsx
 y lo importas arriba junto a los demás: import Perfil from './pages/Perfil'
Configura la ruta: Añades una nueva línea de <Route> en la lista: <Route path="/perfil" element={<Perfil />} />


# 🗺️ Guía Detallada de Relaciones Fullstack para el Diseño UI

Este documento proporciona una explicación profunda sobre cómo se organiza el proyecto para el diseño de la interfaz de usuario (UI), detallando las carpetas involucradas y por qué es vital entender su conexión con el backend para lograr una experiencia de usuario (UX) coherente y funcional.

## � La Arquitectura del Diseño en el Frontend

Cuando hablamos de "hacer el diseño" en nuestro proyecto, nos referimos principalmente a trabajar en la carpeta `Frontend/src/`. Sin embargo, el diseño no es solo colores; es cómo mostramos los datos que vienen del servidor.

### 📁 La Carpeta de Páginas (src/pages/)

Esta es la carpeta más importante para el diseño de alto nivel. Aquí es donde vive la estructura principal de lo que el usuario ve en pantalla.

- **Login.tsx y Register.tsx**: Estas carpetas gestionan la puerta de entrada. Su diseño debe ser limpio y motivador. Se relacionan con el backend porque cada campo (nombre, email, contraseña) debe enviarse al servicio de usuarios para que el "brain" del sistema valide o cree la cuenta.
- **Dashboard.tsx**: Es la página central. Aquí es donde el diseño debe brillar mostrando el progreso del usuario. Se relaciona con el backend a través del endpoint `/usuarios/dashboard`. El diseño aquí debe tomar los datos de "nivel" y "xp" que devuelve el servidor y transformarlos en elementos visuales como barras de carga o medidores circulares. No solo muestras un número, diseñas una representación del esfuerzo.
- **Entrenamiento.tsx**: Es la página de acción. Aquí mostras las rutinas (A, B o C) que el backend seleccionó para el usuario. El diseño debe ser funcional y permitir que el usuario ingrese sus repeticiones fácilmente desde el móvil o la PC. La relación aquí es crítica: cada número que el usuario ingresa se envía al backend para que este recalcule la XP y actualice la maestría del ejercicio.

### 📁 La Carpeta de Estilos (src/index.css)

Aquí es donde reside el "DNA" visual de tu aplicación. Es la carpeta donde definirás la paleta de colores (ej. negro azabache, amarillo volt, gris metalizado) y las tipografías.

Se relaciona con el backend de manera indirecta: el backend define estados (como "maestreado" o "no maestreado"), y tú en el CSS defines cómo se ve ese estado (ej. un borde verde neón para lo completado y uno rojo tenue para lo pendiente). El diseño visual reacciona a los datos lógicos.

### 📁 La Carpeta de Servicios (src/services/)

Aunque parece una carpeta puramente de código, es el puente que trae la "pintura" de la base de datos al lienzo del frontend.

- **api.ts**: Configura la conexión base. Si el backend cambia de puerto o dirección, aquí se ajusta.
- **sesiones.services.ts y usuarios.services.ts**: Son los "mensajeros". Cuando diseñas un botón de "Guardar Entrenamiento", este servicio es el que lleva esos datos al backend. Entender esta carpeta es entender de dónde vienen los datos que vas a decorar.

---

## 🧠 ¿Por qué se relacionan las carpetas?

La relación entre las carpetas de diseño y las de lógica existe porque nuestra aplicación es "Data-Driven" (impulsada por datos).

1. **Sincronización de Estados**: Si el backend en la carpeta `Backend/src/sesiones/` decide que el usuario ganó XP, el diseño en `Frontend/src/pages/Dashboard.tsx` debe estar preparado para animar ese aumento. Las carpetas se hablan constantemente.
2. **Validación Visual**: El backend protege los datos (por ejemplo, bloqueando una fase si no está completa). Tu diseño debe usar esa información para mostrar candados, mensajes de advertencia o botones deshabilitados.
3. **Consistencia de Nombres**: Los nombres de los campos en la base de datos (definidos en `prisma/schema.prisma`) son los mismos nombres que recibirás en el frontend. Si en el backend se llama `mejor_record`, en tu diseño de la página de Entrenamiento usarás ese nombre exacto para mostrar la marca anterior del usuario.

## 🚀 Conclusión para el Diseñador

Al trabajar en el diseño, recuerda que no estás creando imágenes estáticas. Estás creando una **interfaz viva**. Cada color, cada margen y cada animación que coloques en la carpeta de `pages` está ahí para dar sentido y belleza a los cálculos lógicos que ocurren en la carpeta `Backend/src`.

El diseño es la forma en que el usuario "siente" la potencia de la lógica de entrenamiento que hemos construido.
