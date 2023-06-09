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

import Icon from 'react-native-vector-icons/Entypo';
import Loader from '../Components/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import Moment from 'moment';
import DeleteNewUseCase from '../../domain/usecase/news/DeleteNewUseCase';
import GetNewUseCase from '../../domain/usecase/news/GetNewUseCase';
import GetAllNewsUseCase from '../../domain/usecase/news/GetAllNewsUseCase';

Moment.defineLocale('es', {
  months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
  weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
})

const NoticiasScreen = ({ navigation, route }) => {
  const [currentNoticia, setCurrentNoticia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [noticias, setNoticias] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  if (route.params) {
    if (route.params.noticia.updated) {
      setNoticias(noticias.map(t => {
        let id = route.params.noticia.id;
        if (t.id === id) {
          t.nombre = route.params.noticia.nombre;
        }
        return t;
      }));
    } else {
      noticias.push(route.params.noticia)
      setNoticias(noticias);
    }
    route.params = null;
  }
  const deleteNoticia = async (id) => {
    setModalVisible(false);
    Alert.alert(
      'Eliminar',
      'Estas seguro de eliminar la noticia?',
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
            await DeleteNewUseCase.dispatch(id);
            Alert.alert(
              'Info',
              'Noticia eliminada correctamente');
            loadNoticias();
            setLoading(false)
          },
        },
      ],
      { cancelable: false },
    );
  }
  const editNoticia = async (id) => {
    setModalVisible(false);
    setLoading(true);
    const response = await GetNewUseCase.dispatch(id);
    setLoading(false);
    navigation.navigate('EditNoticiaScreen', response);
  }
  const createNoticia = () => {
    navigation.navigate('CreateNoticiaScreen');
  }
  const loadNoticiaOptions = (id) => {
    setCurrentNoticia(id)
    setModalVisible(true)
  }
  const loadNoticias = async () => {
    setLoading(true);
    const response = await GetAllNewsUseCase.dispatch();
    setNoticias(response)
    setLoading(false);
  }
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadNoticias();
    setRefreshing(false);
  }, []);
  useEffect(() => {
    loadNoticias();
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
            onPress={() => createNoticia()}
          >
          </Icon>
        </View>
        {noticias && noticias.length > 0 ?
          noticias.map(n => (
            <View style={styles.container}>
              <Card key={n.id}>
                <Card.Title>{n.nombre}</Card.Title>
                <Card.Divider />
                <View style={styles.floatRight}>
                  <Icon.Button
                    name="dots-three-horizontal"
                    color={'#000000'}
                    backgroundColor="#FFFFFF"
                    onPress={() => { loadNoticiaOptions(n.id) }}>
                  </Icon.Button>
                  <Text style={styles.fonts}>
                    Creada el {Moment(n.fechaPublicacion).format(`dddd D MMMM YYYY`)}{ }
                  </Text>
                </View>
              </Card>
            </View>
          )
          ) : (<Text style={[styles.textStyle, { marginTop: 340 }]}>No hay Noticias Disponibles</Text>)
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
                onPress={() => editNoticia(currentNoticia)}>
                <Text style={[styles.textStyle, styles.textOptions]}>Editar</Text>
              </Pressable>
              <Card.Divider />
              <Pressable
                onPress={() => deleteNoticia(currentNoticia)}>
                <Text style={[styles.textStyle, styles.textOptions]}>Eliminar</Text>
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
export default NoticiasScreen;

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