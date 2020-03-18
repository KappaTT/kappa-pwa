import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import { theme } from '@constants';
import { Block, Text } from '@components';
import { NavigationTypes } from '@types';
import { GoogleService } from '@services';

const LoginContent: React.FC<{
  navigation: NavigationTypes.ParamType;
}> = ({ navigation }) => {
  React.useEffect(() => {
    GoogleService.login();
  }, []);

  return (
    <Block flex>
      <Block flex middle>
        <Text>Content goes here...</Text>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({});

export default LoginContent;
