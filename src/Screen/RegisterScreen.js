import React, { useState, createRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Alert,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';

import Loader from './Components/Loader';
import { environment } from '../../environments/environment';
import RadioButton from './Components/RadioButton';

const RegisterScreen = (props) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [tutorado, setTutorado] = useState(true);
  const [errortext, setErrortext] = useState('');
  const [
    isRegistraionSuccess,
    setIsRegistraionSuccess
  ] = useState(false);

  const emailInputRef = createRef();
  const passwordInputRef = createRef();
  const passwordConfirmationInputRef = createRef();

  const handleSubmitButton = () => {
    setErrortext('');
    if (!userName) {
      Alert.alert(
        'Error',
        'Por favor ingrese su Nombre'
      );
      return;
    }
    if (!userEmail) {
      Alert.alert(
        'Error',
        'Por favor ingrese su Email'
      );
      return;
    }

    if (!userPassword) {
      Alert.alert(
        'Error',
        'Por favor ingrese su contraseña'
      );
      return;
    }

    if (!passwordConfirmation) {
      Alert.alert(
        'Error',
        'Por favor confirme su contraseña'
      );
      return;
    }
    //Show Loader
    setLoading(true);
    var dataToSend = {
      name: userName,
      email: userEmail,
      password: userPassword,
      password_confirmation: passwordConfirmation,
      type: tutorado ? environment.TUTORADO_SCOPE : environment.TUTOR_SCOPE,
    };


    fetch(`${environment.URL}/api/auth/signup`, {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers: {
        'Content-Type':
          'application/json',
        'X-Requested-With':
          'XMLHttpRequest'
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //Hide Loader
        setLoading(false);
        console.log(responseJson);
        // If server response message same as Data Matched
        if (responseJson.status === 'success') {
          setIsRegistraionSuccess(true);
        } else {
          setErrortext(responseJson.message);
        }
      })
      .catch((error) => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };
  if (isRegistraionSuccess) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../../Image/success.png')}
          style={{
            height: 250,
            resizeMode: 'contain',
            alignSelf: 'center'
          }}
        />
        <Text style={styles.successTextStyle}>
          Registro Correcto!!!
        </Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => props.navigation.navigate('LoginScreen')}>
          <Text style={styles.buttonTextStyle}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('../../Image/aboutreact.png')}
            style={{
              width: '50%',
              height: 250,
              resizeMode: 'contain',
              margin: 30,
            }}
          />
        </View>
        <KeyboardAvoidingView enabled>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserName) => setUserName(UserName)}
              underlineColorAndroid="#f000"
              placeholder="Ingresa tu nombre"
              placeholderTextColor="#000000"
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={() =>
                emailInputRef.current && emailInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserEmail) => setUserEmail(UserEmail)}
              underlineColorAndroid="#f000"
              placeholder="Ingresa tu email"
              placeholderTextColor="#000000"
              keyboardType="email-address"
              ref={emailInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current &&
                passwordInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserPassword) =>
                setUserPassword(UserPassword)
              }
              underlineColorAndroid="#f000"
              placeholder="Ingresa tu contraseña"
              placeholderTextColor="#000000"
              ref={passwordInputRef}
              returnKeyType="next"
              secureTextEntry={true}
              onSubmitEditing={() =>
                passwordConfirmationInputRef.current &&
                passwordConfirmationInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(PasswordConfirmation) =>
                setPasswordConfirmation(PasswordConfirmation)
              }
              underlineColorAndroid="#f000"
              placeholder="Confirma tu contraseña"
              placeholderTextColor="#000000"
              ref={passwordConfirmationInputRef}
              returnKeyType="next"
              secureTextEntry={true}
              onSubmitEditing={() =>
                ageInputRef.current &&
                ageInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <View style={styles.blockRadioButton}>
              <Pressable onPress={() => setTutorado(true)} style={styles.blockRadioButton}>
                <RadioButton selected={tutorado} />
                <Text style={[styles.textBlack, { marginLeft: 12 }]}>Tutorado</Text>
              </Pressable>
              <Pressable onPress={() => setTutorado(false)} style={[styles.blockRadioButton, { marginLeft: 15 }]}>
                <RadioButton selected={!tutorado} />
                <Text style={[styles.textBlack, { marginLeft: 12 }]}>Tutor</Text>
              </Pressable>
            </View>
          </View>
          {errortext != '' ? (
            <Text style={styles.errorTextStyle}>
              {errortext}
            </Text>
          ) : null}
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleSubmitButton}>
            <Text style={styles.buttonTextStyle}>Registrarse</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};
export default RegisterScreen;

const styles = StyleSheet.create({
  blockRadioButton: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
  },
  textBlack: {
    color: 'black'
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#1791e1',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'black',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  successTextStyle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,
  },
});