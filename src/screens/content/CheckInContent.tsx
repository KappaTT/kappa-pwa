import React from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';
import moment from 'moment';
import { BarCodeScanner } from 'expo-barcode-scanner';

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
  KeyboardDismissView,
  FadeModal
} from '@components';
import { HeaderHeight, TabBarHeight } from '@services/utils';
import { getEventById, hasValidCheckIn, shouldLoad, sortEventByDate } from '@services/kappaService';

const CheckInContent: React.FC<{
  navigation: NavigationTypes.ParamType;
}> = ({ navigation }) => {
  const user = useSelector((state: TRedux) => state.auth.user);
  const loadHistory = useSelector((state: TRedux) => state.kappa.loadHistory);
  const gettingAttendance = useSelector((state: TRedux) => state.kappa.gettingAttendance);
  const futureEventArray = useSelector((state: TRedux) => state.kappa.futureEventArray);
  const futureEvents = useSelector((state: TRedux) => state.kappa.futureEvents);
  const records = useSelector((state: TRedux) => state.kappa.records);
  const checkInEventId = useSelector((state: TRedux) => state.kappa.checkInEventId);
  const checkInExcuse = useSelector((state: TRedux) => state.kappa.checkInExcuse);
  const checkingIn = useSelector((state: TRedux) => state.kappa.checkingIn);
  const checkinErrorMessage = useSelector((state: TRedux) => state.kappa.checkInErrorMessage);

  const [choosingEvent, setChoosingEvent] = React.useState<boolean>(false);
  const [code, setCode] = React.useState<string>('');
  const [excuse, setExcuse] = React.useState<string>('');

  const [hasPermission, setHasPermission] = React.useState<boolean>(false);
  const [scanned, setScanned] = React.useState<boolean>(false);
  const [scanning, setScanning] = React.useState<boolean>(false);
  const [waitingForCheckIn, setWaitingForCheckIn] = React.useState<boolean>(false);
  const [showCheckedInStatus, setShowCheckedInStatus] = React.useState<boolean>(false);

  const dispatch = useDispatch();
  const dispatchSetCheckInEvent = React.useCallback(
    (event_id: string, excuse: boolean) => dispatch(_kappa.setCheckInEvent(event_id, excuse)),
    [dispatch]
  );
  const dispatchGetMyAttendance = React.useCallback(() => dispatch(_kappa.getMyAttendance(user)), [dispatch, user]);
  const dispatchCheckIn = React.useCallback(
    (event_id: string, event_code: string) => dispatch(_kappa.checkIn(user, event_id, event_code)),
    [dispatch, user]
  );

  const insets = useSafeArea();

  const selectedEvent = React.useMemo(() => {
    return getEventById(futureEvents, checkInEventId);
  }, [futureEvents, checkInEventId]);

  const alreadyCheckedIn = React.useMemo(() => {
    if (!selectedEvent) return false;

    return hasValidCheckIn(records, user.email, selectedEvent.id, true);
  }, [user, records, selectedEvent]);

  const eventOptions = React.useMemo(() => {
    return futureEventArray
      .filter(event => !hasValidCheckIn(records, user.email, event.id, true))
      .sort(sortEventByDate)
      .map(event => ({
        id: event.id,
        title: event.title,
        subtitle: moment(event.start).format('ddd LLL')
      }));
  }, [user, records.attended, records.excused, futureEventArray]);

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

  const askForPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();

    if (status === 'granted') {
      setHasPermission(true);
      setScanning(true);
      setScanned(false);
    } else {
      setHasPermission(false);
      setScanning(false);
    }
  };

  const onPressScan = React.useCallback(() => {
    Keyboard.dismiss();

    if (hasPermission) {
      setScanning(true);
      setScanned(false);
    } else {
      askForPermission();
    }
  }, [hasPermission]);

  const onPressCheckIn = React.useCallback(() => {
    Keyboard.dismiss();

    if (checkInEventId && code) {
      dispatchCheckIn(checkInEventId, code);
    }
  }, [checkInEventId, code]);

  const handleCodeScanned = React.useCallback(
    ({ type, data }) => {
      if (type === BarCodeScanner.Constants.BarCodeType.qr && data) {
        if (numberFormatter(data) === data && data.length === 4) {
          setScanning(false);
          setScanned(true);
          setCode(data);

          if (checkInEventId !== '') {
            dispatchCheckIn(checkInEventId, data);
          }
        } else if (data.indexOf(':') > 0) {
          const pieces = data.split(':');

          let event_id = '';
          let event_code = pieces[0];

          for (const event of eventOptions) {
            if (event.id === pieces[0]) {
              event_id = pieces[0];
              break;
            }
          }

          if (event_id !== '' && numberFormatter(event_code) === event_code && event_code.length === 4) {
            setScanning(false);
            setScanned(true);
            setCode(event_code);
            dispatchSetCheckInEvent(event_id, false);
            dispatchCheckIn(event_id, event_code);
          }
        }
      }
    },
    [eventOptions, checkInEventId]
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

  React.useEffect(() => {
    if (checkInEventId !== '') {
      for (const event of eventOptions) {
        if (event.id === checkInEventId) {
          return;
        }
      }

      dispatchSetCheckInEvent('', false);
      setCode('');
    }
  }, [checkInEventId, code, eventOptions]);

  React.useEffect(() => {
    if (checkingIn) {
      setWaitingForCheckIn(true);
    } else if (waitingForCheckIn) {
      setWaitingForCheckIn(false);
      setShowCheckedInStatus(true);

      setTimeout(() => setShowCheckedInStatus(false), 1000);
    }
  }, [checkingIn, waitingForCheckIn]);

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

  const renderScanner = () => {
    return (
      <Block flex>
        {hasPermission && <BarCodeScanner style={styles.scanner} onBarCodeScanned={handleCodeScanned} />}

        <Block
          style={[
            styles.scannerOverlay,
            {
              top: insets.top
            }
          ]}
        >
          <TouchableOpacity onPress={() => setScanning(false)}>
            <Block style={styles.scannerCloseButtonContainer}>
              <Icon
                style={styles.scannerCloseButton}
                family="Feather"
                name="x"
                color={theme.COLORS.PRIMARY}
                size={32}
              />
            </Block>
          </TouchableOpacity>
        </Block>
      </Block>
    );
  };

  const renderCheckingIn = () => {
    return (
      <Block style={styles.checkingInOverlay}>
        <Block
          style={[
            styles.checkingInContainer,
            {
              height: 64 + TabBarHeight + insets.bottom
            }
          ]}
        >
          {showCheckedInStatus ? (
            checkinErrorMessage !== '' ? (
              <React.Fragment>
                <Icon family="Feather" name="x" size={24} color={theme.COLORS.PRIMARY} />
                <Text style={styles.failedCheckIn}>{checkinErrorMessage}</Text>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Icon family="Feather" name="check" size={24} color={theme.COLORS.PRIMARY_GREEN} />
                <Text style={styles.alreadyCheckedIn}>Checked In</Text>
              </React.Fragment>
            )
          ) : (
            <ActivityIndicator size="large" />
          )}
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

              <Block style={styles.codeContainer}>
                <Block style={styles.column}>
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

                <Block style={styles.scanButton}>
                  <RoundButton
                    label="Scan"
                    right={true}
                    icon={<Icon family="MaterialCommunityIcons" name="qrcode" size={24} color={theme.COLORS.WHITE} />}
                    onPress={onPressScan}
                  />
                </Block>
              </Block>
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
                style={styles.multiInput}
                multiline={true}
                placeholderText="reason"
                maxLength={128}
                error={false}
                defaultValue={excuse}
                onChangeText={(text: string) => setExcuse(text)}
              />
            </Block>

            <Text style={styles.description}>
              You may only check into an event on the same day it happened. If you forgot to check in and it is the same
              day, you can still submit the code. If it isn't, please send a request from your profile page. Excuses
              must be requested before an event.
            </Text>
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
                    disabled={
                      selectedEvent === null ||
                      // needsLoading ||
                      !selectedEvent.excusable ||
                      alreadyCheckedIn
                    }
                    onPress={() => {}}
                  />
                </Block>
                <Block style={styles.bottomDivider} />

                <Block style={styles.attendButton}>
                  <RoundButton
                    disabled={
                      selectedEvent === null ||
                      // needsLoading ||
                      alreadyCheckedIn ||
                      code.length !== 4 ||
                      !moment(selectedEvent.start).isSame(moment(), 'day')
                    }
                    loading={checkingIn}
                    label="Check In"
                    onPress={onPressCheckIn}
                  />
                </Block>
              </React.Fragment>
            )}
          </Block>
        </Block>

        <SlideModal visible={choosingEvent}>{renderChoosingEvent()}</SlideModal>
        <SlideModal visible={scanning}>{renderScanner()}</SlideModal>
        <FadeModal visible={waitingForCheckIn || showCheckedInStatus} transparent={true}>
          {renderCheckingIn()}
        </FadeModal>
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
  failedCheckIn: {
    marginLeft: 4,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    color: theme.COLORS.PRIMARY
  },
  checkInContainer: {
    marginTop: 32
  },
  input: {
    backgroundColor: theme.COLORS.SUPER_LIGHT_BLUE_GRAY
  },
  multiInput: {
    backgroundColor: theme.COLORS.SUPER_LIGHT_BLUE_GRAY,
    height: 128
  },
  codeContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  column: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  scanButton: {
    marginLeft: 24,
    width: 128
  },
  dividerWrapper: {
    marginHorizontal: 8,
    marginTop: 20,
    marginBottom: 4,
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
  excuseContainer: {},
  scanner: {
    flex: 1
  },
  scannerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  scannerCloseButtonContainer: {
    margin: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)'
  },
  scannerCloseButton: {},
  checkingInOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.25)'
  },
  checkingInContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.COLORS.WHITE,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default CheckInContent;
