
import React, { useState, useEffect } from 'react';
import { Card } from '@rneui/themed';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
  Alert,
  TouchableOpacity
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Entypo';
import Loader from '../Components/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { environment } from '../../../environments/environment';


const TutoriasScreen = ({ navigation, route }) => {


  const [currentTutoria, setCurrentTutoria] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tutorias, setTutorias] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  if (route.params && route.params.tutoria) {
    if (route.params.tutoria.created) {
      tutorias.push(route.params.tutoria)
      setTutorias(tutorias);
    } else {
      setTutorias(tutorias.map(t => {
        let id = route.params.tutoria.id;
        if (t.id === id) {
          t.nombre = route.params.tutoria.nombre;
        }
        return t;
      }));
    }
    route.params = null;
  }

  const deleteTutoria = (id) => {
    setModalVisible(false);
    Alert.alert(
      'Eliminar',
      'Estas seguro de eliminar la tutoria?',
      [
        {
          text: 'Cancelar',
          onPress: () => {
            return null;
          },
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            setLoading(true);
            await AsyncStorage.getItem('id_token').then((val) => token = val);
            fetch(`${environment.URL}/api/tutorias/${id}`, {
              method: 'DELETE',
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
                await loadTutorias();
                setLoading(false);
                Alert.alert(
                  'Info',
                  responseJson.message);
              })
              .catch((error) => {
                alert(error)
                setLoading(false);
              });
          },
        },
      ],
      { cancelable: false },
    );
  }
  const editTutoria = async (id) => {
    setModalVisible(false);
    setLoading(true);
    await AsyncStorage.getItem('id_token').then((val) => token = val);
    fetch(`${environment.URL}/api/tutorias/${id}`, {
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
        navigation.navigate('EditTutoriaScreen', responseJson, { onGoBack: (data) => alert(data) });
      })
      .catch((error) => {
        alert(error)
        setLoading(false);
      });
  }
  const createTutoria = () => {
    navigation.navigate('CreateTutoriaScreen');
  }

  const showTutorados = (id) => {
    setModalVisible(false)
    navigation.navigate('TutoradosListScreen', id);
  }
  
  const showAsistencias = (id) => {
    setModalVisible(false)
    navigation.navigate('AsistenciaScreen', id);
  }
  const loadTutoriaOptions = (id) => {
    setCurrentTutoria(id)
    setModalVisible(true)
  }
  const loadTutorias = async () => {
    setLoading(true);
    var token;
    await AsyncStorage.getItem('id_token').then((val) => token = val);
    try {
      fetch(`${environment.URL}/api/mis-tutorias?limit=100&page=1`, {
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
        .then((responseJson) => {
          setTutorias(responseJson.data)
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          alert(error)
        });
    } catch (error) {
      Alert.alert('Error', 'Error a stablecer conexión con el servidor');
    }
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadTutorias();
    setRefreshing(false);
  }, []);


  useEffect(() => {
    loadTutorias();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loader loading={loading} />

      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        <View style={styles.floatRight}>
          <Icon
            name="plus"
            size={50}
            color={'#FFFFFF'}
            backgroundColor="#307ecc"
            style={styles.buttonStyle}
            onPress={() => createTutoria()}
          >
          </Icon>
        </View>

        {tutorias.length > 0 ?
          tutorias.map(t => (
            <View style={styles.container}>
              <Card key={t.nombre}>
                <Card.Title>{t.nombre}</Card.Title>
                <Card.Divider />
                <View style={styles.floatRight}>
                  <Icon.Button
                    name="dots-three-horizontal"
                    color={'#000000'}
                    backgroundColor="#FFFFFF"
                    onPress={() => { loadTutoriaOptions(t.id) }}>
                  </Icon.Button>
                  <Text style={styles.fonts}>
                    No.Alumnos {t.tutorados_count}
                  </Text>

                </View>
              </Card>
            </View>
          )
          ) : (<Text style={[styles.textStyle, { marginTop: 340 }]}>No hay Tutorias Disponibles</Text>)
        }
      </ScrollView>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable
                onPress={() => editTutoria(currentTutoria)}>
                <Text style={[styles.textStyle, styles.textOptions]}>Editar</Text>
              </Pressable>
              <Card.Divider />
              <Pressable
                onPress={() => deleteTutoria(currentTutoria)}>
                <Text style={[styles.textStyle, styles.textOptions]}>Eliminar</Text>
              </Pressable>
              <Card.Divider />
              <Pressable
                onPress={() => showTutorados(currentTutoria)}>
                <Text style={[styles.textStyle, styles.textOptions]}>Ver Lista</Text>
              </Pressable>
              <Card.Divider />
              <Pressable
                onPress={() => showAsistencias(currentTutoria)}>
                <Text style={[styles.textStyle, styles.textOptions]}>Asistencias</Text>
              </Pressable>
              <Card.Divider />
              <Pressable
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={[styles.textStyle, styles.textOptions]}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};
export default TutoriasScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fonts: {
    marginBottom: 8,
    color: 'black'
  },
  user: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    marginTop: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: 300,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textOptions: {
    marginBottom: 2,
    marginTop: 2,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black'
  },
  buttonStyle: {
    backgroundColor: '#307ecc',
    borderWidth: 0,
    borderColor: '#7DE24E',
    height: 50,
    width: 50,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 4,
  },
  floatRight: {
    alignItems: 'flex-end'
  }
});
