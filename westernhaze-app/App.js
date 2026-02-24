import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { supabase } from "./src/services/supabase";
import { colors } from "./src/theme/colors";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ScanScreen from "./src/screens/ScanScreen";
import ProcessingScreen from "./src/screens/ProcessingScreen";
import ReportScreen from "./src/screens/ReportScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.gold} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      {session ? (
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.bg },
            headerTintColor: colors.cream,
            headerTitleStyle: { fontWeight: "600" },
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeNavigator}
            options={{ title: "WesternHaze®" }}
          />
          <Stack.Screen
            name="Scan"
            component={ScanScreen}
            options={{ title: "Escanear" }}
          />
          <Stack.Screen
            name="Processing"
            component={ProcessingScreen}
            options={{ title: "Analizando", headerBackVisible: false }}
          />
          <Stack.Screen
            name="Report"
            component={ReportScreen}
            options={{ title: "Reporte del día" }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen
                {...props}
                onLogin={() => {}}
                onGoRegister={() => props.navigation.navigate("Register")}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Register">
            {(props) => (
              <RegisterScreen
                {...props}
                onRegistered={() => props.navigation.goBack()}
                onGoLogin={() => props.navigation.goBack()}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

function HomeNavigator({ navigation }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  const handleStartScan = () => {
    navigation.navigate("Scan");
  };
  return (
    <HomeScreen
      onLogout={handleLogout}
      onStartScan={handleStartScan}
      navigation={navigation}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: "center",
    alignItems: "center",
  },
});
