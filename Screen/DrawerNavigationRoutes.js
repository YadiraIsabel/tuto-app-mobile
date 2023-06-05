// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React
import React from 'react';

// Import Navigators from React Navigation
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Import Screens
import HomeScreen from './DrawerScreens/HomeScreen';
import TutoriasScreen from './Tutor/TutoriasScreen';
import SettingsScreen from './DrawerScreens/SettingsScreen';
import CustomSidebarMenu from './Components/CustomSidebarMenu';
import NavigationDrawerHeader from './Components/NavigationDrawerHeader';
import EditTutoriaScreen from './Tutor/EditTutoriaScreen';
import CreateTutoriaScreen from './Tutor/CreateTutoriaScreen';
import TutoradosListScreen from './Tutor/TutoradosListScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeScreenStack = ({ navigation }) => {

  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: 'Home', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigation={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#307ecc', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};

const SettingScreenStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="SettingsScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigation={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#307ecc', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          title: 'Settings', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};
const TutoriasScreenStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="TutoriasScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigation={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#307ecc', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="TutoriasScreen"
        component={TutoriasScreen}
        options={{
          title: 'Tutorias', //Set Header Title
        }}
      />
      <Stack.Screen
        name="EditTutoriaScreen"
        component={EditTutoriaScreen}
        options={{
          title: 'Editar Tutoria', //Set Header Title
        }}
      />
      <Stack.Screen
        name="CreateTutoriaScreen"
        component={CreateTutoriaScreen}
        options={{
          title: 'Crear Tutoria', //Set Header Title
        }}
      />
      <Stack.Screen
        name="TutoradosListScreen"
        component={TutoradosListScreen}
        options={{
          title: 'Listado De Tutorados', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};



const DrawerNavigatorRoutes = (props) => {
  return (
    <Drawer.Navigator
      drawerContentOptions={{
        activeTintColor: '#cee1f2',
        color: '#cee1f2',
        itemStyle: { marginVertical: 5, color: 'white' },
        labelStyle: {
          color: '#d8d8d8',
        },
      }}
      screenOptions={{ headerShown: false }}
      drawerContent={CustomSidebarMenu}>
      <Drawer.Screen
        name="HomeScreenStack"
        options={{ drawerLabel: 'Home Screen' }}
        component={HomeScreenStack}
      />
      <Drawer.Screen
        name="TutoriasScreenStack"
        options={{ drawerLabel: 'Tutorias Screen' }}
        component={TutoriasScreenStack}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigatorRoutes;