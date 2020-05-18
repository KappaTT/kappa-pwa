import React from 'react';
import {
  FontAwesome,
  Ionicons,
  Feather,
  AntDesign,
  Octicons,
  MaterialIcons,
  MaterialCommunityIcons
} from '@expo/vector-icons';
import PropTypes from 'prop-types';

import GalioTheme, { withGalio } from './theme';

class Icon extends React.Component {
  render() {
    const { name, family, size, color, styles, theme, ...rest } = this.props;

    if (name) {
      switch (family) {
        case 'FontAwesome':
          return (
            <FontAwesome name={name} size={size || theme.SIZES.BASE} color={color || theme.COLORS.BLACK} {...rest} />
          );
        case 'Feather':
          return <Feather name={name} size={size || theme.SIZES.BASE} color={color || theme.COLORS.BLACK} {...rest} />;
        case 'AntDesign':
          return (
            <AntDesign name={name} size={size || theme.SIZES.BASE} color={color || theme.COLORS.BLACK} {...rest} />
          );
        case 'Octicons':
          return <Octicons name={name} size={size || theme.SIZES.BASE} color={color || theme.COLORS.BLACK} {...rest} />;
        case 'MaterialIcons':
          return (
            <MaterialIcons name={name} size={size || theme.SIZES.BASE} color={color || theme.COLORS.BLACK} {...rest} />
          );
        case 'MaterialCommunityIcons':
          return (
            <MaterialCommunityIcons
              name={name}
              size={size || theme.SIZES.BASE}
              color={color || theme.COLORS.BLACK}
              {...rest}
            />
          );
      }

      return <Ionicons name={name} size={size || theme.SIZES.BASE} color={color || theme.COLORS.BLACK} {...rest} />;
    }

    return null;
  }
}

Icon.defaultProps = {
  name: null,
  family: null,
  size: null,
  color: null,
  styles: {},
  theme: GalioTheme
};

Icon.propTypes = {
  name: PropTypes.string,
  family: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
  styles: PropTypes.any,
  theme: PropTypes.any
};

export default withGalio(Icon);
