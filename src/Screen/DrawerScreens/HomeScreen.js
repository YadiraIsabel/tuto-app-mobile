import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import jwt_decode from "jwt-decode";

const HomeScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16 }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 37,
              textAlign: 'center',
              marginBottom: 16,
              color: '#000000'
            }}>
            Bienvenido a Tuto App
          </Text>
          <Image source={require('../../../Image/aboutreact.png')}
            style={{ width: '90%', resizeMode: 'contain', margin: 30 }}>
          </Image>
        </View>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => AsyncStorage.getItem('id_token').then(value => Alert.alert('JWT', JSON.stringify(jwt_decode(value))))}>
          <Text style={styles.buttonTextStyle}>Mostrar JWT</Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            color: 'grey',
          }}>
          Yadira Isabel Estrada Cervantes
        </Text>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: 'blue',
    borderWidth: 0,
    color: '#FFFFFF',
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
});

export default HomeScreen;