import React from 'react';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import { Icon } from '../galio';

class IconExtra extends React.Component {
  render() {
    return <Icon {...this.props} />;
  }
}

export default IconExtra;
