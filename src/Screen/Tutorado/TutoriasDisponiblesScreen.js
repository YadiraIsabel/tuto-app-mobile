
import React, { useState, useEffect } from 'react';
import { Card } from '@rneui/themed';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Entypo';
import Loader from '../Components/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshControl, ScrollView, TextInput } from 'react-native-gesture-handler';
import { environment } from '../../../environments/environment';

const TutoriasDisponiblesScreen = ({ navigation, route }) => {
  const [currentTutoria, setCurrentTutoria] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tutorias, setTutorias] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [search, setSearch] = useState('');
  const suscribeTutoria = (id) => {
    setModalVisible(false);
    Alert.alert(
      'Inscripción',
      'Estas seguro de iscribirte a la tutoria?',
      [
        {
          text: 'Cancelar',
          onPress: () => {
            return null;
          },
        },
        {
          text: 'Incribirse',
          onPress: async () => {
            setLoading(true);
            await AsyncStorage.getItem('id_token').then((val) => token = val);
            fetch(`${environment.URL}/api/tutorias/${id}/inscribirse`, {
              method: 'PUT',
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
                if (responseJson.suscrito) {
                  await loadTutorias();
                  setLoading(false);
                  Alert.alert(
                    'Info',
                    responseJson.message);
                  return;
                }
                Alert.alert(
                  'Error',
                  responseJson.message);
                setLoading(false);

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
  const showTutorados = (id) => {
    setModalVisible(false)
    navigation.navigate('TutoradosListScreen', id);
  }
  const loadTutoriaOptions = (id) => {
    setCurrentTutoria(id)
    setModalVisible(true)
  }
  const loadTutorias = async (data) => {
    setLoading(true);
    var token;
    await AsyncStorage.getItem('id_token').then((val) => token = val);
    try {
      fetch(`${environment.URL}/api/tutorados/tutorias/disponibles?limit=100&page=1&search=${data != undefined ? data : search}`, {
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
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View>
          <View>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(data) => setSearch(data)}
              underlineColorAndroid="#f000"
              placeholder="Ingresa para buscar tutoria"
              placeholderTextColor="gray"
              autoCapitalize="sentences"
              returnKeyType="next"
              blurOnSubmit={false}
              value={search}
            />
          </View>
          <View>
            <View style={styles.row}>
              <Icon
                name="magnifying-glass"
                size={50}
                color={'#FFFFFF'}
                style={[styles.buttonStyle, { backgroundColor: '#868d90' }]}
                disabled={search == ''}
                onPress={() => loadTutorias()}
              >
              </Icon>
              <Icon
                name="eraser"
                size={50}
                color={'#FFFFFF'}
                backgroundColor="#307ecc"
                disabled={search == ''}
                style={[styles.buttonStyle, { backgroundColor: '#f29100' }]}
                onPress={() => { setSearch(''); loadTutorias('') }}
              >
              </Icon>
            </View>
          </View>
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
              <Card.Divider />
              <Pressable
                onPress={() => suscribeTutoria(currentTutoria)}>
                <Text style={[styles.textStyle, styles.textOptions]}>Inscribirse</Text>
              </Pressable>
              <Card.Divider />
              <Pressable
                onPress={() => showTutorados(currentTutoria)}>
                <Text style={[styles.textStyle, styles.textOptions]}>Ver Alumnos</Text>
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
export default TutoriasDisponiblesScreen;

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
  floatRight: {
    alignItems: 'flex-end'
  },
  floatLeft: {
    alignItems: 'flex-start'
  },
  row: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
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
  inputStyle: {
    flex: 1,
    color: 'black',
    paddingLeft: 15,
    paddingRight: 10,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
    backgroundColor: 'white',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 4,
  },
});
