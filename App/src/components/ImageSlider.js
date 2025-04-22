import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');

const images = [
  require('../../assets/slider/image1.png'),
  require('../../assets/slider/image2.png'),
  require('../../assets/slider/image3.png'),
  require('../../assets/slider/image4.png'),
];

const ImageSlider = () => {
  return (
    <View style={styles.wrapper}>
      <Swiper
        autoplay
        autoplayTimeout={3}
        showsPagination
        dotColor="#ccc"
        activeDotColor="#4caf50"
      >
        {images.map((uri, index) => (
          <View key={index} style={styles.slide}>
            <Image source={ uri } style={styles.image} />
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 200,
    width: width,
    marginTop: 25,
    paddingHorizontal: 20,
    borderRadius: 20
  },
  slide: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    resizeMode: 'cover',
  },
});

export default ImageSlider;
