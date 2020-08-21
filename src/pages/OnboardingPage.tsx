import React from 'react';
import { StyleSheet, Dimensions, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';

import { TRedux } from '@reducers';
import { _auth, _kappa } from '@reducers/actions';
import { theme } from '@constants';
import { HeaderHeight, HORIZONTAL_PADDING } from '@services/utils';
import { prettyPhone } from '@services/kappaService';
import {
  Header,
  Block,
  Ghost,
  Text,
  ListButton,
  FAB,
  SlideModal,
  BackButton,
  FormattedInput,
  EndCapButton,
  RadioList,
  Icon
} from '@components';

const { width, height } = Dimensions.get('window');

const phoneFormatter = (text: string) => {
  return text.trim().replace(/\D/g, '');
};

const getGradYearOptions = () => {
  const options = [];

  const year = new Date().getFullYear();

  for (let i = 0; i < 5; i++) {
    const spring = `Spring ${year + i}`;
    const fall = `Fall ${year + i}`;

    options.push({
      id: fall,
      title: fall
    });
    options.push({
      id: spring,
      title: spring
    });
  }

  return options;
};

const OnboardingPage: React.FC = () => {
  const user = useSelector((state: TRedux) => state.auth.user);
  const editingUserEmail = useSelector((state: TRedux) => state.kappa.editingUserEmail);
  const isUpdatingUser = useSelector((state: TRedux) => state.kappa.isUpdatingUser);

  const [editing, setEditing] = React.useState<string>('');
  const [phone, setPhone] = React.useState<string>(user.phone || '');
  const [gradYear, setGradYear] = React.useState<string>(user.gradYear || '');

  const dispatch = useDispatch();
  const dispatchUpdateUser = React.useCallback(
    () => dispatch(_kappa.updateUser(user, user.email, { phone, gradYear })),
    [dispatch, user, phone, gradYear]
  );
  const dispatchCancelEditUser = React.useCallback(() => dispatch(_kappa.cancelEditUser()), [dispatch]);

  const insets = useSafeArea();

  const prettyPhoneValue = React.useMemo(() => {
    return prettyPhone(phone);
  }, [phone]);

  const submitDisabled = React.useMemo(() => {
    return prettyPhoneValue === '' || prettyPhoneValue === 'Invalid' || gradYear === '';
  }, [prettyPhoneValue, gradYear]);

  const onPressSubmit = React.useCallback(() => {
    dispatchUpdateUser();
  }, [dispatchUpdateUser]);

  const renderMainContent = () => {
    return (
      <Block style={styles.inputArea}>
        <Text
          style={[
            styles.heading,
            {
              marginTop: 8
            }
          ]}
        >
          CONTACT
        </Text>
        <ListButton keyText="Full Name" valueText={`${user.givenName} ${user.familyName}`} disabled={true} />
        <ListButton keyText="Email" valueText={user.email} disabled={true} />
        <ListButton keyText="Phone" valueText={prettyPhoneValue} onPress={() => setEditing('Phone')} />

        <Text style={styles.heading}>PROFILE</Text>
        <ListButton keyText="Member Status" valueText={user.type === 'B' ? 'Brother' : 'Unknown'} disabled={true} />
        {user.role !== '' && <ListButton keyText="Position" valueText={user.role} disabled={true} />}
        <ListButton keyText="Pledge Class" valueText={user.semester} disabled={true} />
        <ListButton keyText="Freshman Year" valueText={user.firstYear} disabled={true} />
        <ListButton keyText="Graduation Year" valueText={gradYear} onPress={() => setEditing('Graduation Year')} />

        <Text style={styles.description}>
          Please fill out all missing information. Information provided by the university or our official records cannot
          be edited at this time. Please contact an exec if they should be changed.
        </Text>
      </Block>
    );
  };

  const renderPhoneContent = () => {
    return (
      <Block>
        <Text
          style={[
            styles.heading,
            {
              marginTop: 8
            }
          ]}
        >
          PHONE NUMBER
        </Text>

        <FormattedInput
          style={styles.input}
          autoFocus={true}
          placeholderText="phone"
          keyboardType="phone-pad"
          returnKeyType="done"
          textContentType="telephoneNumber"
          maxLength={10}
          value={phone}
          formatter={phoneFormatter}
          onChangeText={(text) => setPhone(text)}
          onSubmit={(text) => setEditing('')}
        />

        <Text style={styles.description}>
          Your phone number will be shared with brothers and used if anyone needs to contact you.
        </Text>
      </Block>
    );
  };

  const renderGraduationYearContent = () => {
    return (
      <Block>
        <Text
          style={[
            styles.heading,
            {
              marginTop: 8
            }
          ]}
        >
          GRADUATION YEAR
        </Text>

        <RadioList options={getGradYearOptions()} selected={gradYear} onChange={(chosen) => setGradYear(chosen)} />

        <Text style={styles.description}>
          Choose the term that you will graduate in, not by credit hours, this is used to determine your points
          requirements and alumni status.
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
      <Block flex>
        <Header
          title="Edit Profile"
          subtitle={editing}
          showBackButton={true}
          onPressBackButton={() => setEditing('')}
          rightButton={<EndCapButton label="Next" onPress={() => setEditing('')} />}
        />

        <Block
          style={[
            styles.wrapper,
            {
              top: insets.top + HeaderHeight
            }
          ]}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <TouchableWithoutFeedback>
              <Block style={styles.content}>{renderSwitchContent()}</Block>
            </TouchableWithoutFeedback>
          </ScrollView>
        </Block>
      </Block>
    );
  };

  const renderContent = () => {
    return (
      <Block flex>
        <Header
          title="Edit Profile"
          showBackButton={editingUserEmail === user.email}
          onPressBackButton={dispatchCancelEditUser}
          rightButton={
            <EndCapButton label="Save" loading={isUpdatingUser} disabled={submitDisabled} onPress={onPressSubmit} />
          }
        />

        <Block
          style={[
            styles.wrapper,
            {
              top: insets.top + HeaderHeight
            }
          ]}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <TouchableWithoutFeedback>
              <Block
                style={[
                  styles.content,
                  {
                    paddingBottom: insets.bottom
                  }
                ]}
              >
                {renderMainContent()}
              </Block>
            </TouchableWithoutFeedback>
          </ScrollView>
        </Block>
      </Block>
    );
  };

  return (
    <Block flex>
      <Block flex>{renderContent()}</Block>

      <SlideModal transparent={false} visible={editing !== ''}>
        {renderEditingContent()}
      </SlideModal>
    </Block>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
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
    flexGrow: 1
  },
  heading: {
    marginTop: 32,
    marginBottom: 4,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 13,
    color: theme.COLORS.GRAY
  },
  description: {
    marginTop: 12,
    marginBottom: 64,
    fontFamily: 'OpenSans',
    fontSize: 12
  },
  content: {
    minHeight: '100%',
    paddingHorizontal: HORIZONTAL_PADDING
  },
  inputArea: {},
  input: {
    backgroundColor: theme.COLORS.SUPER_LIGHT_BLUE_GRAY
  }
});

export default OnboardingPage;
