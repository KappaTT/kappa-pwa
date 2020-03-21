import React from 'react';
import { StyleSheet, Dimensions, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';

import { TRedux } from '@reducers';
import { _auth } from '@reducers/actions';
import { theme } from '@constants';
import {
  Block,
  Text,
  ListButton,
  FAB,
  SlideModal,
  FadeModal,
  BackButton,
  FormattedInput,
  EndCapButton
} from '@components';

const { width, height } = Dimensions.get('screen');

const phoneFormatter = (text: string) => {
  return text.trim().replace(/\D/g, '');
};

const OnboardingPage: React.FC<{
  onRequestClose(): void;
}> = ({ onRequestClose }) => {
  const user = useSelector((state: TRedux) => state.auth.user);

  const dispatch = useDispatch();

  const insets = useSafeArea();

  const [editing, setEditing] = React.useState<string>('');
  const [phone, setPhone] = React.useState<string>('');

  const renderMainContent = () => {
    return (
      <Block style={styles.inputArea}>
        <Text style={styles.heading}>CONTACT</Text>
        <ListButton keyText="Full Name" valueText={`${user.givenName} ${user.familyName}`} disabled={true} />
        <ListButton keyText="Illinois Email" valueText={user.email} disabled={true} />
        <ListButton keyText="Phone" valueText={user.phone} onPress={() => setEditing('Phone')} />

        <Text style={styles.heading}>PROFILE</Text>
        <ListButton keyText="Member Status" valueText={user.type === 'B' ? 'Brother' : 'Unknown'} disabled={true} />
        {user.role !== '' && <ListButton keyText="Position" valueText={user.role} disabled={true} />}
        <ListButton keyText="Pledge Class" valueText={user.semester} disabled={true} />
        <ListButton keyText="Graduation Year" valueText={user.gradYear} onPress={() => setEditing('Graduation Year')} />
      </Block>
    );
  };

  const renderPhoneContent = () => {
    return (
      <Block>
        <Text style={styles.heading}>PHONE NUMBER</Text>

        <FormattedInput
          placeholderText="phone"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          maxLength={10}
          defaultValue={phone}
          formatter={phoneFormatter}
          onChangeText={text => setPhone(text)}
          onSubmit={text => setEditing('')}
        />

        <Text style={styles.description}>
          Your phone number will be shared with brothers and used if anyone needs to contact you
        </Text>
      </Block>
    );
  };

  const renderGraduationYearContent = () => {
    return (
      <Block>
        <Text style={styles.heading}>GRADUATION YEAR</Text>

        <Text style={styles.description}>
          Choose the term that you will graduate in, not by credit hours, this is used to determine your points
          requirements and alumni status
        </Text>
      </Block>
    );
  };

  const renderSwitchContent = () => {
    switch (editing) {
      case 'Phone':
        return renderPhoneContent();
      case 'Graduation Year':
        return renderGraduationYearContent();
      default:
        return <React.Fragment />;
    }
  };

  const renderEditingContent = () => {
    return (
      <KeyboardAvoidingView behavior="padding" enabled>
        <Block
          style={[
            styles.fgEditing,
            {
              paddingTop: insets.top
            }
          ]}
        >
          <Block style={styles.editingHeader}>
            <BackButton onPress={() => setEditing('')} />

            <Text style={styles.editingTitle}>{editing}</Text>

            <EndCapButton label="Done" onPress={() => setEditing('')} />
          </Block>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <TouchableWithoutFeedback>
              <Block style={styles.content}>{renderSwitchContent()}</Block>
            </TouchableWithoutFeedback>
          </ScrollView>
        </Block>
      </KeyboardAvoidingView>
    );
  };

  const renderContent = () => {
    return (
      <KeyboardAvoidingView behavior="position" enabled>
        <Block
          style={[
            styles.fg,
            {
              paddingTop: insets.top
            }
          ]}
        >
          <Block style={styles.header}>
            <Text style={styles.subtitle}>Hi {user.givenName}</Text>
            <Text style={styles.title}>Let's finish setting up</Text>
          </Block>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <TouchableWithoutFeedback>
              <Block style={styles.content}>{renderMainContent()}</Block>
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
    <Block>
      <Block flex>{renderContent()}</Block>

      <SlideModal transparent={false} visible={editing !== ''}>
        {renderEditingContent()}
      </SlideModal>
    </Block>
  );
};

const styles = StyleSheet.create({
  fg: {
    width,
    height,
    backgroundColor: theme.COLORS.WHITE
  },
  fgEditing: {
    width,
    height,
    backgroundColor: theme.COLORS.WHITE
  },
  header: {
    paddingHorizontal: 20
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20
  },
  heading: {
    marginTop: 32,
    marginBottom: 8,
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: theme.COLORS.DARK_GRAY
  },
  description: {
    marginTop: 12,
    fontFamily: 'OpenSans',
    fontSize: 12
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
  },
  editingHeader: {
    height: 42,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  editingTitle: {
    fontFamily: 'OpenSans',
    fontSize: 15
  }
});

export default OnboardingPage;
