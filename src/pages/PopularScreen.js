import React from 'react'
import {Animated ,Dimensions, Image, Platform, StyleSheet, Text, View } from 'react-native'

import axiosInstance from '../helpers/AxiosInstance'
import { Backdrop, Loading } from '../components';

const { width } = Dimensions.get('window');
const ITEM_SIZE = Platform.OS === 'ios' ? width * 0.72 : width * 0.74;
const SPACING = 10;
const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2;


const PopularScreen = () => {
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const [movies, setMovies] = React.useState([]);

  React.useEffect(() => {
    axiosInstance.get('/movie/popular')
    .then((res) => {
      //[spacer, movies, spacer]
      setMovies([{key: 'left-spacer'}, ...(res.data.results), {key: 'right-spacer'}]);
    })
    .catch(err => console.log(err))
  }, [])

  if (movies.length === 0) {
    return <Loading />;
  }
  return (
    <View style={styles.container}>
      <Backdrop movies={movies} scrollX={scrollX}/>
      <Animated.FlatList 
        showsHorizontalScrollIndicator={false}
        data={movies}
        keyExtractor={item => item.key}
        horizontal
        snapToInterval={ITEM_SIZE}
        snapToAlignment='start'
        decelerationRate={0}
        bounces={0}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}  
        contentContainerStyle={{
          alignItems: 'center'
        }}
        renderItem={({item, index}) => {
          if(!item.poster_path) {
            return <View style={{ width: SPACER_ITEM_SIZE }} />;
          }

          const inputRange = [
            // previous slide
            (index - 2) * ITEM_SIZE,
            // active slide
            (index - 1 ) * ITEM_SIZE,
            // next slide
            index * ITEM_SIZE,
          ];
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [100, 50, 100],
            extrapolate: 'clamp',
          });

          return (
            // hold thing
            <View style={{ width: ITEM_SIZE}}>
              {/* spacing item */}
              <Animated.View
                style={{
                  marginHorizontal: SPACING,
                  padding: SPACING * 2,
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  borderRadius: 34,
                  transform: [{ translateY }],
                }}
              >
                <Image 
                  source={{
                    uri: 'https://image.tmdb.org/t/p/w500/' + item.poster_path
                  }}
                  style={styles.posterImage}
                />
                <Text>{item.original_title}</Text>
              </Animated.View>
            </View>
          )
        }}
      />
    </View>
  )
}

export default PopularScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  posterImage: {
    width: '100%',
    height: ITEM_SIZE * 1.2,
    resizeMode: 'cover',
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  }
})