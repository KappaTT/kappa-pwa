import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { theme } from '../constants';
import { TRedux } from '../reducers';
import { _auth, _map } from '../reducers/actions';
import Block from './Block';
import Text from './Text';
import Icon from './Icon';
import TextButton from './TextButton';
import AuthorizedComponent from './AuthorizedComponent';
import { log } from '../services/logService';
import { TPost } from '../backend/map';

const Post: React.SFC<{
  post: TPost;
}> = ({ post }) => {
  const dispatch = useDispatch();

  return (
    <Block style={styles.wrapper}>
      <Block style={styles.postHeader}>
        <Text style={styles.username}>{post.creator !== undefined ? `@${post.creator}` : ''}</Text>
        <Text style={styles.timestamp}>{moment(post.dateCreated).fromNow()}</Text>
      </Block>

      <Block style={styles.postBody}>
        <ScrollView>
          <Text style={styles.textBody}>{post.textBody}</Text>
        </ScrollView>

        <Block style={styles.speakerWrapper}>
          <Text style={styles.speaker}>— {post.speaker}</Text>
        </Block>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.COLORS.WHITE,
    borderRadius: 8,
    padding: 10
  },
  postHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  username: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12
  },
  timestamp: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12
  },
  postBody: {
    marginHorizontal: 10,
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between'
  },
  textBody: {
    fontFamily: 'OpenSans'
  },
  speakerWrapper: {
    width: '100%',
    display: 'flex'
  },
  speaker: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 12
  }
});

export default Post;
