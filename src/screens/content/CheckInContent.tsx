import React from 'react';
import { StyleSheet, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';
import moment from 'moment';

import { theme } from '@constants';
import { TRedux } from '@reducers';
import { _kappa } from '@reducers/actions';
import { NavigationTypes } from '@types';
import {
  Block,
  Text,
  Header,
  Icon,
  ListButton,
  RoundButton,
  SlideModal,
  RadioList,
  FormattedInput,
  KeyboardDismissView
} from '@components';
import { HeaderHeight } from '@services/utils';
import { getEventById, hasValidCheckIn, shouldLoad, sortEventByDate } from '@services/kappaService';

const CheckInContent: React.FC<{
  navigation: NavigationTypes.ParamType;
}> = ({ navigation }) => {
  const user = useSelector((state: TRedux) => state.auth.user);
  const loadHistory = useSelector((state: TRedux) => state.kappa.loadHistory);
  const gettingAttendance = useSelector((state: TRedux) => state.kappa.gettingAttendance);
  const events = useSelector((state: TRedux) => state.kappa.events);
  const records = useSelector((state: TRedux) => state.kappa.records);
  const checkInEventId = useSelector((state: TRedux) => state.kappa.checkInEventId);
  const checkInExcuse = useSelector((state: TRedux) => state.kappa.checkInExcuse);

  const [choosingEvent, setChoosingEvent] = React.useState<boolean>(false);
  const [code, setCode] = React.useState<string>('');
  const [excuse, setExcuse] = React.useState<string>('');

  const dispatch = useDispatch();
  const dispatchSetCheckInEvent = React.useCallback(
    (event_id: string, excuse: boolean) => dispatch(_kappa.setCheckInEvent(event_id, excuse)),
    [dispatch]
  );
  const dispatchGetMyAttendance = React.useCallback(() => dispatch(_kappa.getMyAttendance(user)), [dispatch, user]);

  const insets = useSafeArea();

  const selectedEvent = React.useMemo(() => {
    return getEventById(events, checkInEventId);
  }, [events, checkInEventId]);

  const alreadyCheckedIn = React.useMemo(() => {
    if (!selectedEvent) return false;

    return hasValidCheckIn(records, user.email, selectedEvent.id, true);
  }, [user, records, selectedEvent]);

  const needsLoading = React.useMemo(() => {
    return shouldLoad(loadHistory, user.email);
  }, [user, loadHistory]);

  const eventOptions = React.useMemo(() => {
    return Object.values(events)
      .filter(event => !hasValidCheckIn(records, user.email, event.id, true))
      .sort(sortEventByDate)
      .map(event => ({
        id: event.id,
        title: event.title,
        subtitle: moment(event.start).format('ddd LLL')
      }));
  }, [user, records, events]);

  const onPressBackButton = () => {
    setChoosingEvent(false);
  };

  const onChangeEventList = React.useCallback(
    (chosen: string) => {
      dispatchSetCheckInEvent(chosen, checkInExcuse);
      setChoosingEvent(false);
    },
    [checkInExcuse]
  );

  const numberFormatter = (text: string) => {
    return text !== undefined ? text.replace(/\D/g, '') : '';
  };

  React.useEffect(() => {
    if (shouldLoad(loadHistory, user.email) && !gettingAttendance) {
      dispatchGetMyAttendance();
    }
  }, [user, loadHistory, gettingAttendance]);

  React.useEffect(() => {
    if (selectedEvent === null && checkInEventId !== '') {
      dispatchSetCheckInEvent('', checkInExcuse);
    }
  }, [selectedEvent, checkInEventId, checkInExcuse]);

  const renderChoosingEvent = () => {
    return (
      <Block flex>
        <Header title="Choose an Event" showBackButton={true} onPressBackButton={onPressBackButton} />

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
                <Block style={styles.propertyHeaderContainer}>
                  <Text style={styles.propertyHeader}>Event</Text>
                </Block>

                <RadioList options={eventOptions} selected={checkInEventId} onChange={onChangeEventList} />
              </Block>
            </TouchableWithoutFeedback>
          </ScrollView>
        </Block>
      </Block>
    );
  };

  return (
    <KeyboardDismissView style={styles.flex}>
      <Block flex>
        <Header title="Check In" />

        <Block
          style={[
            styles.wrapper,
            {
              top: insets.top + HeaderHeight
            }
          ]}
        >
          <Block style={styles.content}>
            <Block style={styles.eventIdContainer}>
              <ListButton
                keyText="Event"
                valueText={selectedEvent === null ? 'choose one' : selectedEvent.title}
                onPress={() => setChoosingEvent(true)}
              />
            </Block>

            <Block style={styles.checkInContainer}>
              <Block style={styles.propertyHeaderContainer}>
                <Text style={styles.propertyHeader}>Check in</Text>
              </Block>

              <FormattedInput
                style={styles.input}
                placeholderText="code"
                maxLength={4}
                keyboardType="number-pad"
                error={false}
                defaultValue={code}
                formatter={numberFormatter}
                onChangeText={(text: string) => setCode(text)}
              />
            </Block>

            <Block style={styles.dividerWrapper}>
              <Block style={styles.divider} />
              <Text style={styles.orDividerText}>OR</Text>
              <Block style={styles.divider} />
            </Block>

            <Block style={styles.excuseContainer}>
              <Block style={styles.propertyHeaderContainer}>
                <Text style={styles.propertyHeader}>Excuse</Text>
              </Block>

              <FormattedInput
                style={styles.input}
                placeholderText="reason"
                maxLength={128}
                error={false}
                defaultValue={excuse}
                onChangeText={(text: string) => setExcuse(text)}
              />
            </Block>
          </Block>

          <Block style={styles.bottomBar}>
            {alreadyCheckedIn ? (
              <React.Fragment>
                <Icon family="Feather" name="check" size={24} color={theme.COLORS.PRIMARY_GREEN} />
                <Text style={styles.alreadyCheckedIn}>Checked In</Text>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Block style={styles.excuseButton}>
                  <RoundButton
                    alt={true}
                    label="Request Excuse"
                    disabled={selectedEvent === null || needsLoading || !selectedEvent.excusable || alreadyCheckedIn}
                    onPress={() => {}}
                  />
                </Block>
                <Block style={styles.bottomDivider} />

                <Block style={styles.attendButton}>
                  <RoundButton
                    disabled={
                      selectedEvent === null ||
                      needsLoading ||
                      alreadyCheckedIn ||
                      moment(selectedEvent.start).isSame(moment(), 'day')
                    }
                    label="Check In"
                    onPress={() => {}}
                  />
                </Block>
              </React.Fragment>
            )}
          </Block>
        </Block>

        <SlideModal visible={choosingEvent}>{renderChoosingEvent()}</SlideModal>
      </Block>
    </KeyboardDismissView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  scrollContent: {
    flexGrow: 1
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24
  },
  eventIdContainer: {
    marginTop: 16
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
  description: {
    marginTop: 12,
    fontFamily: 'OpenSans',
    fontSize: 12
  },
  bottomBar: {
    width: '100%',
    height: 64,
    backgroundColor: theme.COLORS.WHITE,
    paddingHorizontal: 24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  excuseButton: {
    flex: 1
  },
  bottomDivider: {
    width: 8
  },
  attendButton: {
    flex: 1
  },
  alreadyCheckedIn: {
    marginLeft: 4,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    color: theme.COLORS.PRIMARY_GREEN
  },
  checkInContainer: {
    marginTop: 48
  },
  input: {
    backgroundColor: theme.COLORS.SUPER_LIGHT_BLUE_GRAY
  },
  multiInput: {
    backgroundColor: theme.COLORS.SUPER_LIGHT_BLUE_GRAY,
    height: 128
  },
  dividerWrapper: {
    marginHorizontal: 8,
    marginVertical: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  divider: {
    flexGrow: 1,
    borderBottomColor: theme.COLORS.BORDER,
    borderBottomWidth: 1
  },
  orDividerText: {
    marginHorizontal: 8,
    fontFamily: 'OpenSans',
    color: theme.COLORS.BORDER
  },
  excuseContainer: {}
});

export default CheckInContent;
