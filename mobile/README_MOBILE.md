# PUIS Catamarca - Aplicación Móvil (WebView)

Esta es una aplicación móvil desarrollada con **Expo** que empaqueta la versión web del PUIS Catamarca en un componente WebView de alto rendimiento.

## Características
- **WebView Optimizada**: Integración directa con el sitio desplegado.
- **Manejo Offline**: Detección automática de conexión con pantalla de reintento.
- **Navegación Nativa**: Soporte para el botón físico de "Atrás" en Android dentro del historial web.
- **Branding Institucional**: Colores y splash screen alineados con el PUIS.
- **Preparada para Producción**: Configuración EAS para generación de APK.

## Requisitos Previos
1. Tener [Node.js](https://nodejs.org/) instalado.
2. Tener instalado el CLI de Expo: `npm install -g expo-cli`.
3. Tener instalado el CLI de EAS: `npm install -g eas-cli`.

## Configuración
1. Navegue a la carpeta de la app:
   ```bash
   cd mobile
   ```
2. Instale las dependencias:
   ```bash
   npm install
   ```

## Configuración de URL de Producción
Cree un archivo `.env.local` en la carpeta `mobile/` o configure la variable de entorno:
```bash
EXPO_PUBLIC_PUIS_WEB_URL=https://tu-url-vercel.app
```
*Si no se configura, la app intentará conectar por defecto a `https://puis-catamarca.vercel.app`.*

## Ejecución en Desarrollo
Para probar en un emulador o dispositivo físico (vía Expo Go):
```bash
npx expo start
```

## Generación de APK (Android)
Para generar un archivo APK instalable listo para distribución:

1. **Inicie sesión en Expo** (si no lo ha hecho):
   ```bash
   npx eas login
   ```

2. **Configure el proyecto EAS** (solo la primera vez):
   ```bash
   npx eas build:configure
   ```

3. **Genere el APK**:
   ```bash
   npx eas build -p android --profile preview
   ```
   *Este comando le proporcionará un link de descarga una vez finalizado el proceso en la nube de Expo.*

## Estructura del Proyecto
- `App.js`: Lógica principal del WebView, manejo de estados de carga y red.
- `app.json`: Configuración de branding, iconos y paquete Android (`com.catamarca.puis`).
- `eas.json`: Perfiles de construcción para APK.
