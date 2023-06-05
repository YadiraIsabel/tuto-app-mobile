import { React, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Alert, KeyboardAvoidingView, TextInput } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Moment from 'moment';
import Loader from '../Components/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import { environment } from '../../environments/environment';

Moment.defineLocale('es', {
  months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
  weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
})

const CreateTutoriaScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [tutoria, setTutoria] = useState({ nombre: '', inicio: new Date, fin: new Date() });
  const [errortext, setErrortext] = useState('');

  const [isDatePickerInicioVisible, setDatePickerInicioVisibility] = useState(false);
  const [isDatePickerFinVisible, setDatePickerFinVisibility] = useState(false);

  const showDatePickerInicio = () => {
    setDatePickerInicioVisibility(true);
  };

  const hideDatePickerInicio = () => {
    setDatePickerInicioVisibility(false);
  };

  const handleConfirmInicio = (date) => {
    let inicio = Moment(date).format('yyyy-MM-DD');
    setTutoria({ ...tutoria, inicio });
    hideDatePickerInicio();
  };

  const showDatePickerFin = () => {
    setDatePickerFinVisibility(true);
  };

  const hideDatePickerFin = () => {
    setDatePickerFinVisibility(false);
  };

  const handleConfirmFin = (date) => {
    let fin = Moment(date).format('yyyy-MM-DD');
    setTutoria({ ...tutoria, fin });
    hideDatePickerFin();
  };

  const storeTutoria = async () => {
    setErrortext('');
    setLoading(true);
    await AsyncStorage.getItem('id_token').then((val) => token = val);
    fetch(`${environment.URL}/api/tutorias`, {
      method: 'POST',
      body: JSON.stringify(tutoria),
      headers: {
        'Content-Type':
          'application/json',
        'X-Requested-With':
          'XMLHttpRequest',
        'Authorization':
          `Bearer ${token}`
      },
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        setLoading(false);
        if (responseJson.errors) {
          setErrortext(responseJson.message);
          return;
        }
        Alert.alert('Exito!!!', responseJson.message)
        navigation.navigate('TutoriasScreen', { tutoria: responseJson.tutoria })
      })
      .catch((error) => {
        alert(error)
        setLoading(false);
      });
    setLoading(false);
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loader loading={loading} />
      <View style={{ flex: 1, padding: 16 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <KeyboardAvoidingView enabled>
            <View style={[styles.labelStyle]}>
              <Text style={{ color: 'black' }}>Nombre:</Text>
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(nombre) => setTutoria({ ...tutoria, nombre })}
                underlineColorAndroid="#f000"
                placeholder="Ingresa el nombre de la tutoria"
                placeholderTextColor="#000000"
                autoCapitalize="sentences"
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>
            <View style={[styles.labelStyle]}>
              <Text style={{ color: 'black' }}>Fecha Incio:</Text>
            </View>
            <View style={styles.SectionStyle}>
              <Text onPress={showDatePickerInicio} style={{ color: 'black' }}>{Moment(tutoria.inicio).format(`dddd D MMMM YYYY`)}</Text>
            </View>
            <View>
              <DateTimePickerModal
                isVisible={isDatePickerInicioVisible}
                mode="date"
                onConfirm={handleConfirmInicio}
                onCancel={hideDatePickerInicio}
              />
            </View>
            <View style={[styles.labelStyle]}>
              <Text style={{ color: 'black' }}>Fecha Fin:</Text>
            </View>
            <View style={styles.SectionStyle}>
              <Text onPress={showDatePickerFin} style={{ color: 'black' }}>{Moment(tutoria.fin).format(`dddd D MMMM YYYY`)}</Text>
            </View>
            <View>
              <DateTimePickerModal
                isVisible={isDatePickerFinVisible}
                mode="date"
                onConfirm={handleConfirmFin}
                onCancel={hideDatePickerFin}
              />
            </View>

            {errortext != '' ? (
              <Text style={styles.errorTextStyle}>
                {errortext}
              </Text>
            ) : null}
          </KeyboardAvoidingView>
        </ScrollView>
        <TouchableOpacity
          style={[styles.buttonStyleEdit, styles.buttonStyle]}
          activeOpacity={0.5}
          onPress={() => storeTutoria(tutoria.id)}>
          <Text style={styles.buttonTextStyle}>Crear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonStyleGoback, styles.buttonStyle]}
          activeOpacity={0.5}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonTextStyle}>Cancelar</Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            color: 'grey',
          }}>
          Yadira Isabel Estrada Cervantes
        </Text>
      </View >
    </SafeAreaView >
  );
};
const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: 'blue',
    borderWidth: 0,
    color: 'red',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
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
  buttonStyleGoback: {
    backgroundColor: 'red',
  },
  buttonStyleEdit: {
    backgroundColor: 'green',
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
  labelStyle: {
    flexDirection: 'row',
    height: 15,
    marginTop: 10,
    marginLeft: 35,
    marginRight: 35,
    margin: 5,
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

export default CreateTutoriaScreen;
