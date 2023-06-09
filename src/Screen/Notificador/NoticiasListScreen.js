import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import Moment from 'moment';
import SButton from "../Components/SButton";
import { window, getRandomColor } from "../Notificador/constants";
import { withAnchorPoint } from "./utils/anchor-point";
import Loader from '../Components/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import GetAllNewsUseCase from '../../domain/usecase/GetAllNewsUseCase';

const PAGE_WIDTH = window.width;
const PAGE_HEIGHT = window.width * 1.2;

const NoticiasListScreen = ({ navigation, route }) => {
  const [isAutoPlay, setIsAutoPlay] = React.useState(false);
  const baseOptions = {
    vertical: false,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  };
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
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
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        <Loader loading={loading} />
        <View style={{ flex: 1, padding: 16, marginTop: 50 }}>
          <View style={{ flex: 1 }}>
            <Carousel
              {...baseOptions}
              loop
              autoPlay={isAutoPlay}
              withAnimation={{
                type: "spring",
                config: {
                  damping: 13,
                },
              }}
              autoPlayInterval={1500}
              data={noticias}
              renderItem={({ index, animationValue }) => (
                <Card
                  animationValue={animationValue}
                  key={index}
                  index={index}
                  noticias={noticias}
                />
              )}
            />
            <SButton
              onPress={() => {
                setIsAutoPlay(!isAutoPlay);
              }}
            >
              {isAutoPlay ? 'Leer' : 'Continuar'}
            </SButton>
          </View>

        </View>
      </ScrollView>
      <Text
        style={{
          fontSize: 16,
          textAlign: 'center',
          color: 'grey',
          marginBottom: 10,
        }}>
        Yadira Isabel Estrada Cervantes
      </Text>
    </SafeAreaView>
  );
};

const Card = ({ index, animationValue, noticias }) => {
  const WIDTH = PAGE_WIDTH / 1.3;
  const HEIGHT = PAGE_HEIGHT / 1.2;
  const cardStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animationValue.value,
      [-0.1, 0, 1],
      [0.95, 1, 1],
      Extrapolate.CLAMP,
    );
    const translateX = interpolate(
      animationValue.value,
      [-1, -0.2, 0, 1],
      [0, WIDTH * 0.3, 0, 0],
    );
    const transform = {
      transform: [
        { scale },
        { translateX },
        { perspective: 200 },
        {
          rotateY: `${interpolate(
            animationValue.value,
            [-1, 0, 0.4, 1],
            [30, 0, -25, -25],
            Extrapolate.CLAMP,
          )}deg`,
        },
      ],
    };
    return {
      ...withAnchorPoint(
        transform,
        { x: 0.5, y: 0.50 },
        { width: WIDTH, height: HEIGHT },
      ),
    };
  }, [index]);
  const blockStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0, 60, 90],
    );
    const translateY = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0, -40, -40],
    );
    const rotateZ = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0, 0, -25],
    );
    return {
      transform: [
        { translateX },
        { translateY },
        { rotateZ: `${rotateZ}deg` },
      ],
    };
  }, [index]);
  return (
    <Animated.View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
      }}>
      <Animated.View
        style={[
          {
            backgroundColor: getRandomColor(),
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
            width: WIDTH,
            height: HEIGHT,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 8,
            },
            shadowOpacity: 0.44,
            shadowRadius: 10.32,

            elevation: 16,
          },
          cardStyle,
        ]} />
      <View style={[
        {
          marginTop: 50,
          width: WIDTH * 0.8,
          borderRadius: 16,
          justifyContent: "flex-start",
          alignItems: "flex-start",
          position: "absolute",
          zIndex: 999,
        },]}>
        <View >
          <Text style={styles.textTitle}>{noticias[index].nombre}{'\n'}</Text>
          <Text style={styles.textContent}> {noticias[index].descripcion}{'\n'}</Text>
          <Text style={styles.textAutor}>{noticias[index].autor}{'\n'}</Text>
          <Text>{Moment(noticias[index].fechaPublicacion).format('DD/MM/yyyy')}</Text>
        </View>
      </View>
      <Animated.Image
        source={require('../../../Image/aboutreact.png')}
        style={[
          {
            marginTop: 170,
            width: WIDTH * 0.4,
            borderRadius: 16,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            zIndex: 999,
          },
          blockStyle,
        ]}
        resizeMode={"contain"}
      />
    </Animated.View>
  );
};
export default NoticiasListScreen;

const styles = StyleSheet.create({
  textTitle: {
    fontSize: 22
  },
  textContent: {
    fontSize: 14
  },
  textAutor: {
    fontStyle: 'italic',
    fontSize: 18
  },
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