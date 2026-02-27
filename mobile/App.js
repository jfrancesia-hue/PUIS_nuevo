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
const BASE_URL = process.env.EXPO_PUBLIC_PUIS_WEB_URL || 'https://puis-catamarca.vercel.app';

export default function App() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
          source={{ uri: BASE_URL }}
          style={styles.webview}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
          }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsBackForwardNavigationGestures={true}
          pullToRefreshEnabled={true}
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
      </div>
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
  }
});
