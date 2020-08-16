import React from 'react';
import { StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';

import Block from '@components/Block';
import Text from '@components/Text';
import { theme } from '@constants';

const googleLogo = {
  uri:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/200px-Google_%22G%22_Logo.svg.png'
};

const GoogleSignInButton: React.FC<{ loading?: boolean; disabled?: boolean; onPress(): void }> = ({
  loading = false,
  disabled = false,
  onPress
}) => {
  return (
    <TouchableOpacity disabled={loading || disabled} activeOpacity={0.6} style={styles.button} onPress={onPress}>
      <Block style={styles.content}>
        {loading ? (
          <ActivityIndicator style={styles.icon} color={theme.COLORS.PRIMARY} />
        ) : (
          <Image source={googleLogo} style={styles.icon} />
        )}
        <Text style={styles.text}>Sign in with Google</Text>
      </Block>
    </TouchableOpacity>
  );
};

export default GoogleSignInButton;

const styles = StyleSheet.create({
  button: {
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    overflow: 'visible',
    backgroundColor: 'white',
    borderRadius: 4
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  icon: {
    width: 24,
    aspectRatio: 1
  },
  text: {
    color: theme.COLORS.GRAY,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600'
  }
});
