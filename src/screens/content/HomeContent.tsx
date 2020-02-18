import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import { theme } from '../../constants';
import { Block, RouterModal, Text } from '../../components';
import { NavigationTypes } from '../../types';

const HomeContent: React.SFC<{
  navigation: NavigationTypes.ParamType;
}> = ({ navigation }) => {
  const origin = navigation.getParam('origin', '');
  const viewing = navigation.getParam('viewing', '');

  const [selectedRouter, setSelectedRouter] = React.useState(undefined);

  const onPressRouterBack = () => {
    setSelectedRouter(undefined);
  };

  React.useEffect(() => {
    if (viewing !== '') {
      const result = undefined; // something.find();
      if (result) {
        setSelectedRouter(result);
      }
    }
  }, []);

  return (
    <Block flex>
      <ScrollView>
        <Block flex middle>
          <Text>Content goes here...</Text>
        </Block>
      </ScrollView>

      {selectedRouter !== undefined && (
        <RouterModal routerName={selectedRouter.title} gradient={selectedRouter.gradient} onPress={onPressRouterBack}>
          <Block flex middle>
            <Text>Content goes here...</Text>
          </Block>
        </RouterModal>
      )}
    </Block>
  );
};

const styles = StyleSheet.create({});

export default HomeContent;
