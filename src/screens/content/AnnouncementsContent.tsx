import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import { theme } from '@constants';
import { Block, Text } from '@components';
import { NavigationTypes } from '@types';

const AnnouncementsContent: React.FC<{
  navigation: NavigationTypes.ParamType;
}> = ({ navigation }) => {
  return (
    <Block flex>
      <ScrollView>
        <Block flex middle>
          <Text>Content goes here...</Text>
        </Block>
      </ScrollView>
    </Block>
  );
};

const styles = StyleSheet.create({});

export default AnnouncementsContent;
