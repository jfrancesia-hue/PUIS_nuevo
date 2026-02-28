import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  BackHandler,
  Alert,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  RefreshControl,
  ScrollView
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Network from 'expo-network';
import NetInfo from '@react-native-community/netinfo';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

// URL de producción por defecto (puede ser sobreescrita por env)
const BASE_URL = process.env.EXPO_PUBLIC_PUIS_WEB_URL || 'https://puis-nuevo.vercel.app';

// Script para bloquear el zoom y la selección de texto en la webview
const INJECTED_JAVASCRIPT = `
  const meta = document.createElement('meta');
  meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover');
  meta.setAttribute('name', 'viewport');
  document.getElementsByTagName('head')[0].appendChild(meta);
  
  // Ocultar menú hamburguesa original y forzar el ancho de la página para evitar que se desborde (línea blanca lateral)
  const style = document.createElement('style');
  style.innerHTML = \`
    body, html { overflow-x: hidden !important; width: 100% !important; max-width: 100vw !important; }
    header button svg { display: none !important; }
  \`;
  document.head.appendChild(style);

  // Prevenir que se pueda hacer 'long press' o seleccionar el texto de forma accidental
  document.body.style.userSelect = 'none';
  document.body.style.WebkitUserSelect = 'none';
  true;
`;

export default function App() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(BASE_URL);

  // Monitorear conexión
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  // Manejar botón atrás físico de Android
  useEffect(() => {
    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      } else {
        Alert.alert("Salir", "¿Desea cerrar la aplicación?", [
          { text: "Cancelar", onPress: () => null, style: "cancel" },
          { text: "Salir", onPress: () => BackHandler.exitApp() }
        ]);
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [canGoBack]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  if (!isConnected) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <ExpoStatusBar style="light" />
        <Text style={styles.errorIcon}>📡</Text>
        <Text style={styles.errorTitle}>Sin conexión a Internet</Text>
        <Text style={styles.errorSubtitle}>Por favor, verifique su red para continuar utilizando el PUIS.</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={async () => {
            const networkState = await Network.getNetworkStateAsync();
            setIsConnected(networkState.isConnected);
          }}
        >
          <Text style={styles.retryText}>REINTENTAR</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="light" />
      <View style={{ flex: 1 }}>
        <WebView
          ref={webViewRef}
          source={{ uri: currentUrl }}
          style={styles.webview}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
          }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}

          // Compatibilidad base
          javaScriptEnabled={true}
          domStorageEnabled={true}

          // Deshabilitar gestos que compiten con el menú lateral de la web
          allowsBackForwardNavigationGestures={false}
          pullToRefreshEnabled={false}

          // Optimización de UI (quitar líneas blancas y rebotes)
          bounces={false}
          overScrollMode="never"
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}

          // Bloqueo estricto de zoom en Android/iOS
          scalesPageToFit={false}
          setBuiltInZoomControls={false}
          textZoom={100}
          injectedJavaScript={INJECTED_JAVASCRIPT}

          // Otras optimizaciones de seguridad y multimedia
          mixedContentMode="compatibility"
          geolocationEnabled={true}

          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#0067b1" />
            </View>
          )}
        />
        {loading && (
          <View style={styles.progressBar}>
            <ActivityIndicator size="small" color="#0067b1" />
          </View>
        )}
      </View>

      {/* Barra de Navegación Inferior (Bottom Bar) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            setCurrentUrl(BASE_URL);
          }}
        >
          <Text style={styles.navButtonIcon}>🏠</Text>
          <Text style={styles.navButtonText}>INICIO</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            const urlFicha = BASE_URL.endsWith('/') ? BASE_URL + 'ficha-unificada' : BASE_URL + '/ficha-unificada';
            setCurrentUrl(urlFicha);
          }}
        >
          <Text style={styles.navButtonIcon}>📋</Text>
          <Text style={styles.navButtonText}>FICHA UNIFICADA</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            const urlTurnos = BASE_URL.endsWith('/') ? BASE_URL + 'turnos' : BASE_URL + '/turnos';
            setCurrentUrl(urlTurnos);
          }}
        >
          <Text style={styles.navButtonIcon}>📅</Text>
          <Text style={styles.navButtonText}>TURNOS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#002b49',
    paddingTop: StatusBar.currentHeight,
  },
  webview: {
    flex: 1,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#002b49',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  errorTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  errorSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#0067b1',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 20,
    elevation: 5,
  },
  retryText: {
    color: '#ffffff',
    fontWeight: '900',
    letterSpacing: 2,
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: 100,
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#002b49',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#00406d',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 5,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navButtonIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  navButtonText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  }
});
