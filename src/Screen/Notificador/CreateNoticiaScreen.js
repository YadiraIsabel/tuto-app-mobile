import { React, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Alert, KeyboardAvoidingView, TextInput } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Loader from '../Components/Loader';
import Moment from 'moment';
import SaveNewUseCase from '../../domain/usecase/news/SaveNewUseCase';

Moment.defineLocale('es', {
  months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
  weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
})

const CreateNoticiaScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [noticia, setNoticia] = useState({ name: '', description: '', creator: '' });
  const storeNoticia = async () => {
    if (!noticia.name) {
      Alert.alert(
        'Error',
        'El nombre es requerido',
      );
      return;
    }
    if (!noticia.description) {
      Alert.alert(
        'Error',
        'La descripcion es requerida',
      );
      return;
    }
    if (!noticia.creator) {
      Alert.alert(
        'Error',
        'El creador es requerido',
      );
      return;
    }
    setLoading(true)
    const date = Moment(new Date()).format('yyyy-MM-DD');;
    const request = { ...noticia, ...{ created_at: date } };
    const response = await SaveNewUseCase.dispatch(request)
    Alert.alert('Exito!!!', 'Noticia guardada con exito')
    navigation.navigate('NoticiasScreen', {
      noticia: {
        id: response,
        nombre: noticia.name,
        fechaPublicacion: date,
      }
    })
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
                onChangeText={(name) => setNoticia({ ...noticia, name })}
                underlineColorAndroid="#f000"
                placeholder="Ingresa el nombre de la noticia"
                placeholderTextColor="#000000"
                autoCapitalize="sentences"
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>
            <View style={[styles.labelStyle]}>
              <Text style={{ color: 'black' }}>Descripcion:</Text>
            </View>
            <View style={styles.textAreaStyle}>
              <TextInput
                multiline={true}
                numberOfLines={4}
                style={styles.inputStyle}
                onChangeText={(description) => setNoticia({ ...noticia, description })}
                underlineColorAndroid="#f000"
                placeholder="Ingresa la descripcion de la noticia"
                placeholderTextColor="#000000"
                autoCapitalize="sentences"
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>
            <View style={[styles.labelStyle]}>
              <Text style={{ color: 'black' }}>Creador:</Text>
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(creator) => setNoticia({ ...noticia, creator })}
                underlineColorAndroid="#f000"
                placeholder="Ingresa el creador de la noticia"
                placeholderTextColor="#000000"
                autoCapitalize="sentences"
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <TouchableOpacity
          style={[styles.buttonStyleEdit, styles.buttonStyle]}
          activeOpacity={0.5}
          onPress={() => storeNoticia(noticia.id)}>
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
  textAreaStyle: {
    flexDirection: 'row',
    height: 90,
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
export default CreateNoticiaScreen;