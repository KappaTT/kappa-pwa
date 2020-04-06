import React from 'react';
import { StyleSheet, KeyboardAvoidingView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';

import { TRedux } from '@reducers';
import { TEvent, TPoint } from '@backend/kappa';
import { theme } from '@constants';
import { Block, Text, Header, EndCapButton, RadioList, FormattedInput, Switch, ListButton } from '@components';
import { HeaderHeight } from '@services/utils';

const EditEventPage: React.FC<{
  initialEvent: TEvent;
  onPressBack(): void;
  onPressSave(event: TEvent): void;
}> = ({ initialEvent, onPressBack, onPressSave }) => {
  const insets = useSafeArea();

  const [choosingType, setChoosingType] = React.useState<boolean>(false);
  const [type, setType] = React.useState<string>('');

  const onPressSaveButton = React.useCallback(() => {
    const event = null;

    onPressSave(event);
  }, []);

  return (
    <Block flex>
      <Header
        title={initialEvent ? 'Editing Event' : 'New Event'}
        subtitle={initialEvent ? initialEvent.title : choosingType ? 'Choosing Type' : type}
        showBackButton={true}
        onPressBackButton={onPressBack}
        rightButton={<EndCapButton label="Save" onPress={onPressSaveButton} />}
      />

      <Block
        style={[
          styles.wrapper,
          {
            top: insets.top + HeaderHeight
          }
        ]}
      >
        <Block style={styles.content}>
          <Block style={styles.eventTypeContainer}>
            <ListButton
              keyText="Event Type"
              valueText={type === '' ? 'choose one' : type}
              onPress={() => setChoosingType(true)}
            />
          </Block>

          {type !== '' && (
            <React.Fragment>
              <Block style={styles.propertyHeaderContainer}>
                <Text style={styles.propertyHeader}>Title</Text>
                <Text style={styles.propertyHeaderRequired}>*</Text>
              </Block>
              <FormattedInput placeholderText="title" maxLength={32} />

              <Block style={styles.propertyHeaderContainer}>
                <Text style={styles.propertyHeader}>Short Description</Text>
              </Block>
              <FormattedInput
                style={{ height: 128 }}
                placeholderText="short description"
                multiline={true}
                numberOfLines={6}
                maxLength={256}
              />

              <Block style={styles.doubleColumn}>
                <Block style={styles.column}>
                  <Block style={styles.propertyHeaderContainer}>
                    <Text style={styles.propertyHeader}>Start</Text>
                    <Text style={styles.propertyHeaderRequired}>*</Text>
                  </Block>

                  <FormattedInput placeholderText="start" maxLength={5} />
                </Block>

                <Block style={styles.separator} />

                <Block style={styles.column}>
                  <Block style={styles.propertyHeaderContainer}>
                    <Text style={styles.propertyHeader}>End</Text>
                    <Text style={styles.propertyHeaderRequired}>*</Text>
                  </Block>

                  <FormattedInput placeholderText="end" maxLength={5} />
                </Block>
              </Block>

              <Block style={styles.propertyHeaderContainer}>
                <Text style={styles.propertyHeader}>Location</Text>
              </Block>
              <FormattedInput placeholderText="address or building/room" maxLength={64} />

              <Block style={styles.doubleColumn}>
                <Block style={styles.column}>
                  <Block style={styles.propertyHeaderContainer}>
                    <Text style={styles.propertyHeader}>Mandatory</Text>
                  </Block>

                  <Switch value={false} onValueChange={(newValue: boolean) => {}} />
                </Block>
                <Block style={styles.column}>
                  <Block style={styles.propertyHeaderContainer}>
                    <Text style={styles.propertyHeader}>Excusable</Text>
                  </Block>

                  <Switch value={true} onValueChange={(newValue: boolean) => {}} />
                </Block>
              </Block>
            </React.Fragment>
          )}
        </Block>
      </Block>
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
  content: {
    flex: 1,
    marginHorizontal: 24
  },
  eventTypeContainer: {
    marginVertical: 16
  },
  propertyHeaderContainer: {
    marginTop: 16,
    display: 'flex',
    flexDirection: 'row'
  },
  propertyHeader: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 13,
    textTransform: 'uppercase',
    color: theme.COLORS.GRAY
  },
  propertyHeaderRequired: {
    marginLeft: 2,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 13,
    textTransform: 'uppercase',
    color: theme.COLORS.PRIMARY
  },
  doubleColumn: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  column: {
    flex: 1
  },
  separator: {
    width: 16
  },
  checkboxContainer: {
    marginTop: 16
  }
});

export default EditEventPage;
