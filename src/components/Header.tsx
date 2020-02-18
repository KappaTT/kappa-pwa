import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle, Dimensions } from 'react-native';

import { Button, Block, Text, theme as galioTheme } from '../../libs/galio';
import { Icon, Input, Tabs, Header as ArgonHeader } from '../../libs/argon';
import theme from '../constants/Theme';
import { NavigationTypes } from '../types';

const { width } = Dimensions.get('window');

const BellButton: React.SFC<{
  isWhite: boolean;
  style: ViewStyle;
  navigation: NavigationTypes.ParamType;
}> = ({ isWhite, style, navigation }) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={() => navigation.navigate('Alarms', { origin: 'Dashboard', viewing: '' })}
  >
    <Icon family="Ionicons" size={20} name="md-notifications" color={theme.COLORS[isWhite ? 'WHITE' : 'ICON']} />
    <Block middle style={styles.notify} />
  </TouchableOpacity>
);

const CalendarButton: React.SFC<{
  isWhite: boolean;
  style: ViewStyle;
  navigation: NavigationTypes.ParamType;
}> = ({ isWhite, style, navigation }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={() => {}}>
    <Icon
      family="MaterialCommunityIcons"
      size={20}
      name="calendar-clock"
      color={theme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
  </TouchableOpacity>
);

const SearchButton: React.SFC<{
  isWhite: boolean;
  style: ViewStyle;
  navigation: NavigationTypes.ParamType;
}> = ({ isWhite, style, navigation }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={() => {}}>
    <Icon size={16} family="Galio" name="search-zoom-in" color={theme.COLORS[isWhite ? 'WHITE' : 'ICON']} />
  </TouchableOpacity>
);

const Header: React.SFC<{
  back?: boolean;
  title: string;
  white?: boolean;
  transparent?: boolean;
  bgColor?: string;
  iconColor?: string;
  titleColor?: string;
  navigation?: NavigationTypes.ParamType;
  optionLeft?: string;
  optionRight?: string;
  tabs?: Array<any>;
  tabIndex?: number;
  search?: boolean;
  searchText?: string;
  options?: boolean;
}> = ({ back, title, white, transparent, bgColor, iconColor, titleColor, navigation, children, ...props }) => {
  const renderRight = () => {
    const { routeName } = navigation.state;

    switch (routeName) {
      case 'Dashboard':
      case 'Alarms':
        return [
          <BellButton style={{}} key="chat-home" navigation={navigation} isWhite={white} />,
          <CalendarButton style={{}} key="basket-home" navigation={navigation} isWhite={white} />
        ];
      default:
        break;
    }
  };

  const renderSearch = () => {
    const { searchText } = props;
    return (
      <Input
        right
        color="black"
        style={styles.search}
        placeholder={searchText || 'What are you looking for?'}
        placeholderTextColor={'#8898AA'}
        onFocus={() => {}}
        onChangeText={(text: string) => navigation.setParams({ searchValue: text })}
        iconContent={<Icon size={16} color={theme.COLORS.MUTED} name="search-zoom-in" family="ArgonExtra" />}
      />
    );
  };

  const renderOptions = () => {
    const { optionLeft, optionRight } = props;

    return (
      <Block row style={styles.options}>
        <Button shadowless style={[styles.tab, styles.divider]} onPress={() => {}}>
          <Block row middle>
            <Icon name="diamond" family="ArgonExtra" style={{ paddingRight: 8 }} color={theme.COLORS.ICON} />
            <Text size={16} style={styles.tabTitle}>
              {optionLeft || 'Beauty'}
            </Text>
          </Block>
        </Button>
        <Button shadowless style={styles.tab} onPress={() => {}}>
          <Block row middle>
            <Icon size={16} name="bag-17" family="ArgonExtra" style={{ paddingRight: 8 }} color={theme.COLORS.ICON} />
            <Text size={16} style={styles.tabTitle}>
              {optionRight || 'Fashion'}
            </Text>
          </Block>
        </Button>
      </Block>
    );
  };

  const renderTabs = () => {
    const { tabs, tabIndex } = props;
    const defaultTab = tabs && tabs[0] && tabs[0].id;

    if (!tabs) return null;

    return (
      <Tabs
        data={tabs || []}
        initialIndex={tabIndex || defaultTab}
        onChange={id => navigation.setParams({ tabId: id })}
      />
    );
  };

  const renderHeader = () => {
    const { search, options, tabs } = props;
    if (search || tabs || options) {
      return (
        <Block center>
          {search ? renderSearch() : null}
          {options ? renderOptions() : null}
          {tabs ? renderTabs() : null}
        </Block>
      );
    }
  };

  return (
    <ArgonHeader
      back={back}
      title={title}
      white={white}
      transparent={transparent}
      bgColor={bgColor}
      iconColor={iconColor}
      titleColor={titleColor}
      renderRight={renderRight}
      renderHeader={renderHeader}
      props={props}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    position: 'relative'
  },
  notify: {
    backgroundColor: theme.COLORS.LABEL,
    borderRadius: 4,
    height: galioTheme.SIZES.BASE / 2,
    width: galioTheme.SIZES.BASE / 2,
    position: 'absolute',
    top: 11,
    right: 11
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: galioTheme.COLORS.ICON
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: theme.COLORS.BORDER
  },
  options: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4
  },
  tab: {
    backgroundColor: galioTheme.COLORS.TRANSPARENT,
    width: width * 0.35,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '400',
    color: theme.COLORS.HEADER
  }
});

export default Header;
