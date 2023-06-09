import React, { useState, useEffect } from 'react';
import { Card } from '@rneui/themed';
import {
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../Components/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshControl, ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { environment } from '../../../environments/environment';

const TutoradosListScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [tutorados, setTutorados] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [search, setSearch] = useState('');
  const loadTutorias = async (data) => {
    setLoading(true);
    var token;
    await AsyncStorage.getItem('id_token').then((val) => token = val);
    try {
      fetch(`${environment.URL}/api/tutorias/${route.params}/tutorados?limit=100&page=1&search=${data != undefined ? data : search}`, {
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
          setTutorados(responseJson.data)
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          alert(error)
        });
    } catch (error) {
      Alert.alert('Error', 'Error al establecer conexión con el servidor');
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
        <View>
          <View>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(data) => setSearch(data)}
              underlineColorAndroid="#f000"
              placeholder="Ingresa para buscar el tutorado"
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
        {tutorados.length > 0 ?
          tutorados.map(t => (
            <View style={styles.container}>
              <Card key={t.id}>
                <Card.Title>{t.name}</Card.Title>
                <Card.Divider />
                <View style={styles.floatRight}>
                  <Text style={styles.fonts}>
                    Id: {t.id + '\n'}
                    Email: {t.email}
                  </Text>

                </View>
              </Card>
            </View>
          )
          ) : (<Text style={[styles.textStyle, { marginTop: 340 }]}>No hay Alumnos Disponibles</Text>)
        }
      </ScrollView>
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
          style={[styles.buttonStyle, styles.button, { backgroundColor: 'red', height: 60 }]}
          activeOpacity={0.5}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonTextStyle}>Regresar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView >
  );
};
export default TutoradosListScreen;

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
  name: {
    fontSize: 16,
    marginTop: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 100,
    marginBottom: 15,
    marginTop: 15,
    textAlign: 'center'
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
  floatRight: {
    alignItems: 'flex-end'
  },

  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
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
  inputStyle: {
    flex: 1,
    color: 'black',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
    backgroundColor: 'white',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 4,
    marginRight: 20,
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
});
