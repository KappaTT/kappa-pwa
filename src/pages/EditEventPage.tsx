import React from 'react';
import { StyleSheet, Dimensions, ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';

import { TRedux } from '@reducers';
import { TEvent, TPoint } from '@backend/kappa';
import { theme } from '@constants';
import {
  Block,
  Text,
  Header,
  EndCapButton,
  RadioList,
  FormattedInput,
  Switch,
  ListButton,
  SlideModal
} from '@components';
import { HeaderHeight } from '@services/utils';

const { width, height } = Dimensions.get('screen');

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

  const onPressBackButton = React.useCallback(() => {
    if (choosingType) {
      setChoosingType(false);
    } else {
      onPressBack();
    }
  }, [choosingType]);

  const renderChoosingType = () => {
    return (
      <Block flex>
        <Header title="Event Type" showBackButton={true} onPressBackButton={onPressBackButton} />

        <Block
          style={[
            styles.wrapper,
            {
              top: insets.top + HeaderHeight
            }
          ]}
        >
          <Block style={styles.content}>
            <Block style={styles.propertyHeaderContainer}>
              <Text style={styles.propertyHeader}>Event Type</Text>
            </Block>

            <RadioList
              options={['GM', 'Philanthropy', 'Professional', 'Rush', 'Social', 'Misc']}
              selected={type}
              onChange={chosen => {
                setType(chosen);
                setChoosingType(false);
              }}
            />

            <Text style={styles.description}>
              The type of event affects GM counts. If an event is not marked as a GM, it will not count towards the GM
              attendance rate. These categories do not determine points, points are chosen separately per-event.
            </Text>
          </Block>
        </Block>
      </Block>
    );
  };

  return (
    <Block flex>
      <Header
        title={initialEvent ? 'Editing Event' : 'New Event'}
        subtitle={initialEvent ? initialEvent.title : ''}
        showBackButton={true}
        onPressBackButton={onPressBackButton}
        rightButton={<EndCapButton label="Save" onPress={onPressSaveButton} disabled={false} />}
      />

      <Block
        style={[
          styles.wrapper,
          {
            top: insets.top + HeaderHeight
          }
        ]}
      >
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={insets.top + HeaderHeight} enabled>
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
                    <FormattedInput placeholderText="ex: General Meeting" maxLength={32} />

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
                    <FormattedInput placeholderText="ex: EHall 106b1" maxLength={64} />

                    <Block style={styles.doubleColumn}>
                      <Block style={styles.column}>
                        <Block style={styles.propertyHeaderContainer}>
                          <Text style={styles.propertyHeader}>Mandatory</Text>
                        </Block>

                        <Block style={styles.switchContainer}>
                          <Switch value={false} onValueChange={(newValue: boolean) => {}} />
                          <Text style={styles.description}>
                            Choose if unexcused absence results in security deposit loss (ex: voting)
                          </Text>
                        </Block>
                      </Block>

                      <Block style={styles.separator} />

                      <Block style={styles.column}>
                        <Block style={styles.propertyHeaderContainer}>
                          <Text style={styles.propertyHeader}>Excusable</Text>
                        </Block>

                        <Block style={styles.switchContainer}>
                          <Switch value={true} onValueChange={(newValue: boolean) => {}} />
                          <Text style={styles.description}>
                            Allow a valid excuse to count as attending (for instance GM). Do not choose this if there
                            are points
                          </Text>
                        </Block>
                      </Block>
                    </Block>

                    <Block style={styles.doubleColumn}>
                      <Block style={styles.column}>
                        <Block style={styles.propertyHeaderContainer}>
                          <Text style={styles.propertyHeader}>Professional</Text>
                        </Block>

                        <FormattedInput placeholderText="points" maxLength={1} keyboardType="number-pad" />
                      </Block>

                      <Block style={styles.separator} />

                      <Block style={styles.column}>
                        <Block style={styles.propertyHeaderContainer}>
                          <Text style={styles.propertyHeader}>Philanthropy</Text>
                        </Block>

                        <FormattedInput placeholderText="points" maxLength={1} keyboardType="number-pad" />
                      </Block>
                    </Block>
                    <Block style={styles.doubleColumn}>
                      <Block style={styles.column}>
                        <Block style={styles.propertyHeaderContainer}>
                          <Text style={styles.propertyHeader}>Brother</Text>
                        </Block>

                        <FormattedInput placeholderText="points" maxLength={1} keyboardType="number-pad" />
                      </Block>

                      <Block style={styles.separator} />

                      <Block style={styles.column}>
                        <Block style={styles.propertyHeaderContainer}>
                          <Text style={styles.propertyHeader}>Rush</Text>
                        </Block>

                        <FormattedInput placeholderText="points" maxLength={1} keyboardType="number-pad" />
                      </Block>
                    </Block>
                    <Block style={styles.doubleColumn}>
                      <Block style={styles.column}>
                        <Block style={styles.propertyHeaderContainer}>
                          <Text style={styles.propertyHeader}>Any</Text>
                        </Block>

                        <FormattedInput placeholderText="points" maxLength={1} keyboardType="number-pad" />
                      </Block>

                      <Block style={styles.separator} />

                      <Block style={styles.column}>
                        <Block style={styles.propertyHeaderContainer}>
                          <Text style={styles.propertyHeader}></Text>
                        </Block>
                        <Text style={styles.description}>
                          Points in "Any" count for whatever category the brother is missing
                        </Text>
                      </Block>
                    </Block>
                  </React.Fragment>
                )}
              </Block>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </Block>

      <SlideModal visible={choosingType}>{renderChoosingType()}</SlideModal>
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
    flexGrow: 1,
    paddingHorizontal: 24
  },
  scrollContent: {
    flexGrow: 1
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
  switchContainer: {
    marginTop: 8
  },
  description: {
    marginTop: 12,
    fontFamily: 'OpenSans',
    fontSize: 12
  }
});

export default EditEventPage;
