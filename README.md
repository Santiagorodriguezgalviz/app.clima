# ⛅ App Clima

Una aplicación web moderna para consultar el clima, desarrollada con React, TypeScript y Tailwind CSS.

## 🌟 Características

- 🔍 Búsqueda de clima por ciudad
- 🌡️ Información detallada del clima actual
- 📅 Pronóstico del tiempo para los próximos días
- 🌍 Soporte multilenguaje (Español e Inglés)
- 🎨 Efectos visuales dinámicos según el clima
- 🔐 Autenticación de usuarios con Firebase
- 📱 Diseño responsivo para todos los dispositivos
- 🌙 Modo oscuro/claro
- 📤 Función para compartir el clima

## 🛠️ Tecnologías Utilizadas

- **Frontend:**
  - React + TypeScript
  - Tailwind CSS para estilos
  - Vite como bundler
  - Zustand para manejo de estado

- **Backend y Servicios:**
  - Firebase Authentication
  - API de OpenWeather
  - API de Unsplash para imágenes dinámicas

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/Santiagorodriguezgalviz/app.clima.git
```

2. Instala las dependencias:
```bash
cd app.clima
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 🚀 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Previsualiza la versión de producción localmente

## 📱 Capturas de Pantalla

[Aquí puedes agregar algunas capturas de pantalla de tu aplicación]

## 🤝 Contribuir

Las contribuciones son siempre bienvenidas. Por favor, lee las guías de contribución antes de enviar un pull request.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles.

## 👤 Autor

- Santiago Rodríguez Galviz
- GitHub: [@Santiagorodriguezgalviz](https://github.com/Santiagorodriguezgalviz)

## 🙏 Agradecimientos

- OpenWeather por proporcionar la API del clima
- Unsplash por las imágenes dinámicas
- Firebase por los servicios de autenticación
