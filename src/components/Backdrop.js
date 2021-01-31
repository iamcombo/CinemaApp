import React from 'react'
import { FlatList, Image, StyleSheet, Platform, View, Dimensions, Animated } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

const { width, height } = Dimensions.get('window');
const ITEM_SIZE = Platform.OS === 'ios' ? width * 0.72 : width * 0.74;
const BACKDROP_HEIGHT = height * 0.65;

const Backdrop = ({movies, scrollX}) => {
  return (
    <View style={{
      position: 'absolute',
      width,
      height: BACKDROP_HEIGHT
    }}>
      <FlatList
        data={movies}
        keyExtractor={item => item.key}
        removeClippedSubviews={false}
        contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
        renderItem={({item, index}) => {
          if (!item.poster_path) {
            return null;
          }
          const translateX = scrollX.interpolate({
            inputRange: [(index - 2) * ITEM_SIZE, (index - 1) * ITEM_SIZE],
            outputRange: [0, width],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              removeClippedSubviews={false}
              style={{
                position: 'absolute',
                width: translateX,
                height,
                overflow: 'hidden',
              }}
            >
              <Image
                source={{
                  uri: 'https://image.tmdb.org/t/p/w500/' + item.poster_path
                }}
                style={{
                  width,
                  height: BACKDROP_HEIGHT,
                  position: 'absolute',
                  resizeMode: 'cover'
                }}
              />
            </Animated.View>
          )
        }}
      />
      <LinearGradient
        colors={['transparent', 'white']}
        style={{
          height: BACKDROP_HEIGHT,
          width,
          position: 'absolute',
          bottom: 0,
        }}
      />
    </View>
  )
}

export default Backdrop

const styles = StyleSheet.create({})
