import React from 'react';
import { DrawerItems, DrawerNavigatorConfig } from 'react-navigation';
import { ScrollView, StyleSheet, Dimensions, Image } from 'react-native';

import { theme as galioTheme } from '../../libs/galio';
import Block from '../components/Block';
import Images from '../constants/Images';

const { width } = Dimensions.get('screen');

const Drawer: React.FC<{}> = (props: any) => (
  <Block style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
    <Block flex={0.05} style={styles.header}>
      {/* <Image style={styles.logo} source={Images.Logo} /> */}
    </Block>
    <Block flex>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <DrawerItems {...props} />
      </ScrollView>
    </Block>
  </Block>
);

const Menu: DrawerNavigatorConfig = {
  contentComponent: props => <Drawer {...props} />,
  drawerBackgroundColor: 'white',
  drawerWidth: width * 0.8,
  contentOptions: {
    activeTintColor: 'white',
    inactiveTintColor: '#000',
    activeBackgroundColor: 'transparent',
    labelStyle: {
      fontSize: 18,
      marginLeft: 12,
      fontWeight: 'normal'
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingHorizontal: 28,
    paddingBottom: galioTheme.SIZES.BASE,
    paddingTop: galioTheme.SIZES.BASE * 3,
    justifyContent: 'center'
  },
  logo: {
    width: 47,
    height: 20
  }
});

export default Menu;
