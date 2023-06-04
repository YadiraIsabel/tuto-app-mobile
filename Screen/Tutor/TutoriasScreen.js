
import React, { useState, createRef } from 'react';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import Loader from '../Components/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';

const TutoriasScreen = ({ navigation }) => {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16 }}>
        <Card containerStyle={{ padding: 0 }} >
        <Text>
          Panque
        </Text>
        </Card>

      </View>
    </SafeAreaView>
  );
};
export default TutoriasScreen;

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
