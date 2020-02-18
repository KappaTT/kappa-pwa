import React from 'react';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import { Icon } from '../galio';

import argonConfig from '../../assets/font/argon.json';
const IconArgonExtra = createIconSetFromIcoMoon(argonConfig, 'ArgonExtra');

class IconExtra extends React.Component {
  render() {
    const { name, family, ...rest } = this.props;

    if (name) {
      if (family === 'ArgonExtra') {
        return <IconArgonExtra name={name} family={family} {...rest} />;
      }

      return <Icon name={name} family={family} {...rest} />;
    }

    return null;
  }
}

export default IconExtra;
