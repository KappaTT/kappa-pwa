import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Carousel from 'react-native-snap-carousel';

import { theme } from '../constants';
import { TRedux } from '../reducers';
import { _auth, _map } from '../reducers/actions';
import Block from './Block';
import Text from './Text';
import Icon from './Icon';
import TextButton from './TextButton';
import AuthorizedComponent from './AuthorizedComponent';
import { log } from '../services/logService';
import { TPost, TPostDict } from '../backend/map';
import Post from './Post';

const { width, height } = Dimensions.get('screen');

export const carouselHeight = 200;
export const carouselMargin = 20;
export const carouselBox = carouselHeight + carouselMargin;

const PostCarousel: React.SFC<{
  posts: TPostDict;
  selected?: TPost;
}> = ({ posts, selected }) => {
  const dispatch = useDispatch();

  const dispatchShowPost = React.useCallback((post: TPost) => dispatch(_map.showPost(post)), [dispatch]);

  const carouselRef = React.useRef(undefined);

  const postArray = Object.values(posts);

  React.useEffect(() => {
    if (selected) {
      const newIndex = postArray.findIndex(post => post._id === selected._id);

      carouselRef.current.snapToItem(newIndex);
    }
  }, [selected, postArray]);

  const _renderItem = ({ item, index }) => {
    return <Post post={item} />;
  };

  if (!selected) {
    return <React.Fragment />;
  }

  return (
    <Block style={styles.wrapper}>
      <Carousel
        ref={ref => (carouselRef.current = ref)}
        layout={'default'}
        data={postArray}
        firstItem={selected ? postArray.findIndex(post => post._id === selected._id) : 0}
        renderItem={_renderItem}
        sliderWidth={width}
        itemWidth={width * 0.85}
        onSnapToItem={index => dispatchShowPost(postArray[index])}
      />
    </Block>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: carouselHeight,
    marginBottom: carouselMargin,
    shadowColor: theme.COLORS.BLACK,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2
  }
});

export default PostCarousel;
