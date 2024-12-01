# Plataforma de Contenido de Memes (Frontend)

Va juntos con https://github.com/Ania58/projectbreak-memeweb.git

Este es el frontend de la Plataforma de Contenido de Memes, una aplicación web dinámica que permite a los usuarios crear y gestionar varios tipos de contenido, como películas, imágenes, memes y cuestionarios. El frontend está construido con **React** y **Vite**, integrando **Firebase** para la autenticación y **Axios** para solicitudes a la API.

---

## Propósito

El frontend sirve como la interfaz de usuario de la plataforma, permitiendo a los usuarios:

- Registrarse e iniciar sesión de forma segura.
- Explorar contenido por categoría o popularidad.
- Agregar y gestionar contenido personal, como memes, cuestionarios, películas e imágenes.
- Interactuar con el contenido mediante votación y paginación.
- Buscar y filtrar contenido basado en preferencias del usuario.

---

## Instalación

### Requisitos previos

- **Node.js**
- **Cuenta de Firebase** para la autenticación

### Pasos

#### Clona el repositorio:

```bash
git clone <repository-url>
```

#### Navega al directorio del frontend:

```bash
cd projectbreak-frontend-memeweb
```

#### Instala las dependencias:

```bash
npm install
```

Asegúrate de tener instalados: `react`, `react-router-dom` (si no vienen por defecto), `axios`, `firebase` y `firebase-admin`. 

#### Configura Firebase:

1. Crea un archivo `.env` y agrega las configuraciones de Firebase:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   ```

2. Actualiza el archivo `config/firebase.js` con tus credenciales de Firebase.

#### Inicia el servidor de desarrollo:

```bash
npm run dev
```

---

## Estructura de carpetas

### Directorio raíz

- **`index.html`**: Punto de entrada de la aplicación.
- **`.env`**: Variables de entorno para la configuración de Firebase. (recuerda tenerlo en .gitignore con node_modules y package-lock.json)
- **`vite.config.js`**: Configuración para Vite.js.

### Directorio `src`

#### **`components`**

##### **Agregar nuevo contenido**
- **`AddContent.jsx`**: Página con enlaces para agregar películas, imágenes, cuestionarios o memes.
- **`AddContentNavigation.jsx`**: Maneja la navegación para agregar contenido.
- **`AddFilm.jsx`**: Lógica para agregar películas.
- **`AddImage.jsx`**: Lógica para agregar imágenes.
- **`AddMeme.jsx`**: Lógica para agregar memes utilizando una plantilla de una API externa.
- **`AddQuiz.jsx`**: Lógica para crear cuestionarios.

##### **Autenticación de usuario**
- **`Login.jsx`**: Maneja el inicio de sesión de usuarios (solo los usuarios autenticados pueden agregar contenido).
- **`LogoutButton.jsx`**: Lógica para cerrar sesión.
- **`Register.jsx`**: Maneja el registro de usuarios.
- **`ProtectedRoute.jsx`**: Asegura que solo los usuarios autenticados puedan acceder a rutas protegidas.

##### **Componentes de pie de página**
- **`Footer.jsx`**: Contiene enlaces a páginas del pie de página.
- **`AdvertisementPage.jsx`**: Página para enviar consultas de anuncios (vinculada con `ContactForm.jsx`).
- **`ContactPage.jsx`**: Página general para enviar mensajes (vinculada con `ContactForm.jsx`).
- **`ContactForm.jsx`**: Página con entradas y áreas de texto para escribir mensajes. El endpoint puede ser "anuncio" o "contacto".
- **`PrivacyPolicyPage.jsx`**: Muestra las reglas de privacidad de la plataforma.
- **`RulesAndRegulationsPage.jsx`**: Enlaza a un archivo PDF con reglas para crear y usar cuentas.

##### **Gestión de contenido**
- **`FilmsPage.jsx`, `ImagesPage.jsx`, `MemesPage.jsx`, `QuizzesPage.jsx`**: Páginas para usuarios autenticados dentro de su perfil para gestionar tipos específicos de contenido (modificar o eliminar).
- **`Profile.jsx`**: Gestiona el perfil del usuario, como actualizar email, nombre y contraseña, y eliminar cuentas.
- **`UserContentList.jsx`**: Permite a los usuarios editar o eliminar su contenido.

##### **Visualización de contenido**
- **`CategoryContent.jsx`**: Agrupa contenido por categoría, crea páginas e incluye funcionalidad de votación.
- **`CategoryNavigation.jsx`**: Permite navegar por categorías.
- **`ContentHeader.jsx`**: Muestra el nombre del sitio web.
- **`ContentInfo.jsx`**: Muestra etiquetas y categorías sobre el contenido.
- **`ContentItem.jsx`**: Maneja la votación y muestra contenido como memes, imágenes, películas y cuestionarios.
- **`ContentList.jsx`**: Mapea `ContentItem.jsx` para múltiples elementos de contenido.
- **`ContentSection.jsx`**: Recupera contenido del usuario, crea paginación y filtra por tipo de contenido.

##### **Componentes especializados**
- **`Films.jsx`**: Usado en `ContentItem.jsx` para mostrar contenido de video con votación, etiquetas y categorías.
- **`Images.jsx`, `Memes.jsx`, `Quizzes.jsx`**: Similares a `Films.jsx`, pero para imágenes, memes y cuestionarios. Los cuestionarios incluyen preguntas y respuestas.
- **`PendingContent.jsx`**: Recupera contenido no aprobado para revisión, con paginación y votación.

##### **Navegación y búsqueda**
- **`Layout.jsx`**: Contiene la navegación, el encabezado, el buscador y renderiza componentes secundarios.
- **`MainPage.jsx`**: Recupera y muestra todo el contenido, con paginación y votación.
- **`Pagination.jsx`**: Habilita la paginación para listas de contenido.
- **`SearchBar.jsx`**: Campo de entrada para buscar contenido.
- **`SearchResults.jsx`**: Muestra los resultados de búsqueda.
- **`TopContent.jsx`**: Recupera el contenido más popular basado en votos recientes.
- **`TopNavigation.jsx`**: Maneja la navegación para usuarios regulares y autenticados.

---

### Directorio `config`
- **`firebase.js`**: Configuración de Firebase para el frontend.

### Directorio `contexts`
- **`UserContext.jsx`**: Gestiona el estado de autenticación del usuario y verifica los tokens de Firebase. Proporciona contexto a todas las rutas.

### Directorio `css`
- Contiene todos los archivos CSS para el estilo de componentes y páginas individuales.

---

## Otros archivos

- **`axiosConfig.js`**: Configuración de Axios para realizar solicitudes API.
- **`AppRoutes.jsx`**: Define todas las rutas de la aplicación y las pasa a `App.jsx`.
- **`App.jsx`**: Componente raíz que envuelve las rutas dentro de `UserProvider` de `UserContext`.
- **`main.jsx`**: Archivo principal de entrada para la aplicación React.
