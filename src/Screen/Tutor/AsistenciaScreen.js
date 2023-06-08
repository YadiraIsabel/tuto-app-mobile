import { React, useCallback, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Alert, KeyboardAvoidingView, TextInput, Pressable } from 'react-native';
import { RefreshControl, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Loader from '../Components/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import { environment } from '../../../environments/environment';
import Moment from 'moment';
import { Table, Row } from 'react-native-table-component';

Moment.defineLocale('es', {
  months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
  weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
})

const AsistenciaScreen = ({ navigation, route }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(route.params);
  const [inicio, setInicio] = useState('');
  const [fin, setFin] = useState('');
  const [errortext, setErrortext] = useState('');
  const [refreshing, setRefreshing] = useState(false);

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
    setInicio(inicio);
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
    setFin(fin);
    hideDatePickerFin();
  };

  const consultAsistencia = async (id) => {
    setErrortext('');
    if (!inicio) {
      return setErrortext('La fecha de inicio es requerida');
    }
    if (!fin) {
      return setErrortext('La fecha de fin es requerida');
    }
    setLoading(true);
    await AsyncStorage.getItem('id_token').then((val) => token = val);
    fetch(`${environment.URL}/api/asistencias/tutoria/${id}?startDate=${inicio}&endDate=${fin}`, {
      method: 'GET',
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
          setErrortext(responseJson.errors);
          return;
        }
        setData(responseJson);
      })
      .catch((error) => {
        alert(error)
        setLoading(false);
      });
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    consultAsistencia();
    setRefreshing(false);
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loader loading={loading} />
      <View style={{ flex: 1, padding: 16 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            justifyContent: 'center',
            alignContent: 'center',
          }} refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <KeyboardAvoidingView enabled>
            <View style={[styles.labelStyle]}>
              <Text style={{ color: 'black' }}>Fecha Incio:</Text>
            </View>
            <Pressable style={styles.SectionStyle} onPress={() => showDatePickerInicio()}>
              <TextInput
                style={styles.inputStyle}
                underlineColorAndroid="#f000"
                placeholder="Seleccione la fecha de inicio"
                placeholderTextColor="gray"
                editable={false}
                value={inicio ? Moment(inicio).format(`dddd D MMMM YYYY`) : null}
              />
            </Pressable>
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
            <Pressable style={styles.SectionStyle} onPress={() => showDatePickerFin()}>
              <TextInput
                style={styles.inputStyle}
                underlineColorAndroid="#f000"
                placeholder="Seleccione la fecha de fin"
                placeholderTextColor="gray"
                editable={false}
                value={fin ? Moment(fin).format(`dddd D MMMM YYYY`) : null}
              />
            </Pressable>
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
          {data != null ? <View style={styles.container}>
            <ScrollView horizontal={true}>
              <View>
                <Table borderStyle={{ borderWidth: 1, borderColor: '#42b983' }}>
                  <Row
                    data={data.tableHead}
                    widthArr={data.widthArr}
                    style={styles.header}
                    textStyle={styles.text}
                  />
                </Table>
                <ScrollView style={styles.scrollContainer}>
                  <Table borderStyle={{ borderWidth: 1, borderColor: '#42b983' }}>
                    {data.tableData.map((rowData, index) => (
                      <Row
                        key={index}
                        data={rowData}
                        widthArr={data.widthArr}
                        style={[
                          styles.rowSection,
                          index % 2 && { backgroundColor: '#fff' },
                        ]}
                        textStyle={styles.text}
                      />
                    ))}
                  </Table>
                </ScrollView>
              </View>
            </ScrollView>
          </View> : ''}
        </ScrollView>
        <TouchableOpacity
          style={[styles.buttonStyleEdit, styles.buttonStyle]}
          activeOpacity={0.5}
          onPress={() => consultAsistencia(id)}>
          <Text style={styles.buttonTextStyle}>Consultar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonStyleGoback, styles.buttonStyle]}
          activeOpacity={0.5}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonTextStyle}>Regresar</Text>
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
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  rowSection: { height: 40, backgroundColor: '#E7E6E1' },
  header: { height: 50, backgroundColor: '#42b983' },
  text: { textAlign: 'center', fontWeight: '100', color: 'black' },
  scrollContainer: {},
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

export default AsistenciaScreen;
