import React from 'react';
import { StyleSheet, Dimensions, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';

import { TRedux } from '@reducers';
import { _auth } from '@reducers/actions';
import { theme } from '@constants';
import { Block, Text, ListButton, RoundButton, FAB } from '@components';

const { width, height } = Dimensions.get('screen');

const OnboardingPage: React.FC<{
  onRequestClose(): void;
}> = ({ onRequestClose }) => {
  const user = useSelector((state: TRedux) => state.auth.user);

  const dispatch = useDispatch();

  const insets = useSafeArea();

  const renderBackground = () => {
    return <Block style={styles.bg} />;
  };

  const renderContent = () => {
    return (
      <KeyboardAvoidingView behavior="position" enabled>
        <Block
          style={[
            styles.fg,
            {
              height: height - insets.top
            }
          ]}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <TouchableWithoutFeedback>
              <Block style={styles.content}>
                <Block style={styles.inputArea}>
                  <Text style={styles.subtitle}>Hi {user.givenName}</Text>
                  <Text style={styles.title}>Let's finish setting up</Text>
                  <Text style={styles.heading}>CONTACT</Text>
                  <ListButton keyText="Full Name" valueText={`${user.givenName} ${user.familyName}`} disabled={true} />
                  <ListButton keyText="Illinois Email" valueText={user.email} disabled={true} />
                  <ListButton keyText="Phone" valueText={user.phone} />

                  <Text style={styles.heading}>PROFILE</Text>
                  <ListButton
                    keyText="Member Status"
                    valueText={user.type === 'B' ? 'Brother' : 'Unknown'}
                    disabled={true}
                  />
                  {user.role !== '' && <ListButton keyText="Position" valueText={user.role} disabled={true} />}
                  <ListButton keyText="Pledge Class" valueText={user.semester} disabled={true} />
                  <ListButton keyText="Graduation Year" valueText={user.gradYear} />
                </Block>
              </Block>
            </TouchableWithoutFeedback>
          </ScrollView>

          <Block
            style={[
              styles.buttonWrapper,
              {
                bottom: insets.bottom
              }
            ]}
          >
            <FAB iconFamily="Feather" iconName="arrow-right" onPress={() => {}} />
          </Block>
        </Block>
      </KeyboardAvoidingView>
    );
  };

  return (
    <Block flex>
      {renderBackground()}
      {renderContent()}
    </Block>
  );
};

const styles = StyleSheet.create({
  bg: {
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  fg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: height - 40,
    backgroundColor: theme.COLORS.WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28
  },
  scrollContent: {
    flexGrow: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20
  },
  title: {
    fontFamily: 'OpenSans',
    fontSize: 24,
    marginBottom: 4
  },
  subtitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 12,
    textTransform: 'uppercase'
  },
  heading: {
    marginTop: 32,
    marginBottom: 8,
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: theme.COLORS.DARK_GRAY
  },
  content: {
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between'
  },
  inputArea: {},
  buttonWrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
});

export default OnboardingPage;
