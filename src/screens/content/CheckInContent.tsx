import React from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';
import moment from 'moment';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useIsFocused, NavigationProp } from '@react-navigation/native';

import { theme } from '@constants';
import { TRedux } from '@reducers';
import { TToast } from '@reducers/ui';
import { _kappa, _ui } from '@reducers/actions';
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
import { HeaderHeight, TabBarHeight, HORIZONTAL_PADDING } from '@services/utils';
import { getEventById, hasValidCheckIn, shouldLoad, sortEventByDate, canCheckIn } from '@services/kappaService';

const numberFormatter = (text: string) => {
  return text !== undefined ? text.replace(/\D/g, '') : '';
};

const CheckInContent: React.FC<{
  navigation: NavigationProp<any, 'Check In'>;
}> = ({ navigation }) => {
  const isFocused = useIsFocused();

  const user = useSelector((state: TRedux) => state.auth.user);
  const loadHistory = useSelector((state: TRedux) => state.kappa.loadHistory);
  const isGettingAttendance = useSelector((state: TRedux) => state.kappa.isGettingAttendance);
  const getAttendanceErrorMessage = useSelector((state: TRedux) => state.kappa.getAttendanceErrorMessage);
  const futureEventArray = useSelector((state: TRedux) => state.kappa.futureEventArray);
  const futureEvents = useSelector((state: TRedux) => state.kappa.futureEvents);
  const records = useSelector((state: TRedux) => state.kappa.records);
  const checkInEventId = useSelector((state: TRedux) => state.kappa.checkInEventId);
  const checkInExcuse = useSelector((state: TRedux) => state.kappa.checkInExcuse);
  const isCheckingIn = useSelector((state: TRedux) => state.kappa.isCheckingIn);
  const checkInRequestDate = useSelector((state: TRedux) => state.kappa.checkInRequestDate);
  const checkInSuccessDate = useSelector((state: TRedux) => state.kappa.checkInSuccessDate);
  const isCreatingExcuse = useSelector((state: TRedux) => state.kappa.isCreatingExcuse);
  const createExcuseRequestDate = useSelector((state: TRedux) => state.kappa.createExcuseRequestDate);
  const createExcuseSuccessDate = useSelector((state: TRedux) => state.kappa.createExcuseSuccessDate);

  const [choosingEvent, setChoosingEvent] = React.useState<boolean>(false);
  const [code, setCode] = React.useState<string>('');
  const [reason, setReason] = React.useState<string>('');

  const [hasPermission, setHasPermission] = React.useState<boolean>(false);
  const [scanned, setScanned] = React.useState<boolean>(false);
  const [scanning, setScanning] = React.useState<boolean>(false);
  const [openDate, setOpenDate] = React.useState<moment.Moment>(moment());

  const dispatch = useDispatch();
  const dispatchSetCheckInEvent = React.useCallback(
    (eventId: string, excuse: boolean) => dispatch(_kappa.setCheckInEvent(eventId, excuse)),
    [dispatch]
  );
  const dispatchGetMyAttendance = React.useCallback(() => dispatch(_kappa.getMyAttendance(user)), [dispatch, user]);
  const dispatchCheckIn = React.useCallback(
    (eventId: string, eventCode: string) => dispatch(_kappa.checkIn(user, eventId, eventCode)),
    [dispatch, user]
  );
  const dispatchCreateExcuse = React.useCallback(
    () => dispatch(_kappa.createExcuse(user, getEventById(futureEvents, checkInEventId), { reason, late: false })),
    [dispatch, user, futureEvents, checkInEventId, reason]
  );
  const dispatchShowToast = React.useCallback((toast: Partial<TToast>) => dispatch(_ui.showToast(toast)), [dispatch]);

  const insets = useSafeArea();

  const selectedEvent = React.useMemo(() => {
    return getEventById(futureEvents, checkInEventId);
  }, [futureEvents, checkInEventId]);

  const alreadyCheckedIn = React.useMemo(() => {
    if (!selectedEvent) return false;

    return hasValidCheckIn(records, user.email, selectedEvent._id, true);
  }, [user, records, selectedEvent]);

  const eventOptions = React.useMemo(() => {
    return futureEventArray
      .filter((event) => !hasValidCheckIn(records, user.email, event._id, true))
      .sort(sortEventByDate)
      .map((event) => ({
        id: event._id,
        title: event.title,
        subtitle: moment(event.start).format('ddd LLL')
      }));
  }, [futureEventArray, records, user.email]);

  const onPressBackButton = () => {
    setChoosingEvent(false);
  };

  const onChangeEventList = React.useCallback(
    (chosen: string) => {
      dispatchSetCheckInEvent(chosen, checkInExcuse);
      setChoosingEvent(false);
    },
    [checkInExcuse, dispatchSetCheckInEvent]
  );

  const askForPermission = React.useCallback(async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();

    if (status === 'granted') {
      setHasPermission(true);
      setScanning(true);
      setScanned(false);
    } else {
      setHasPermission(false);
      setScanning(false);

      Alert.alert('You must enable camera access from phone settings to scan');
    }
  }, []);

  const onPressScan = React.useCallback(() => {
    Keyboard.dismiss();

    if (hasPermission) {
      setScanning(true);
      setScanned(false);
    } else {
      askForPermission();
    }
  }, [askForPermission, hasPermission]);

  const onPressCheckIn = React.useCallback(() => {
    Keyboard.dismiss();

    if (checkInEventId && code) {
      dispatchCheckIn(checkInEventId, code);
    }
  }, [checkInEventId, code, dispatchCheckIn]);

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

          let eventId = '';
          const eventCode = pieces[0];

          for (const event of eventOptions) {
            if (event.id === pieces[0]) {
              eventId = pieces[0];
              break;
            }
          }

          if (eventId !== '' && numberFormatter(eventCode) === eventCode && eventCode.length === 4) {
            setScanning(false);
            setScanned(true);
            setCode(eventCode);
            dispatchSetCheckInEvent(eventId, false);
            dispatchCheckIn(eventId, eventCode);
          }
        }
      }
    },
    [checkInEventId, dispatchCheckIn, eventOptions, dispatchSetCheckInEvent]
  );

  React.useEffect(() => {
    if (
      isFocused &&
      !isGettingAttendance &&
      getAttendanceErrorMessage === '' &&
      shouldLoad(loadHistory, `user-${user.email}`)
    ) {
      dispatchGetMyAttendance();
    }
  }, [user, loadHistory, isGettingAttendance, isFocused, getAttendanceErrorMessage, dispatchGetMyAttendance]);

  React.useEffect(() => {
    if (selectedEvent === null && checkInEventId !== '') {
      dispatchSetCheckInEvent('', checkInExcuse);
    }
  }, [selectedEvent, checkInEventId, checkInExcuse, dispatchSetCheckInEvent]);

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
  }, [checkInEventId, code, dispatchSetCheckInEvent, eventOptions]);

  React.useEffect(() => {
    if (
      checkInRequestDate !== null &&
      checkInSuccessDate !== null &&
      checkInRequestDate.isAfter(openDate) &&
      checkInSuccessDate.isAfter(checkInRequestDate)
    ) {
      dispatchShowToast({
        title: 'Success',
        message: 'You have been checked in to the event!',
        timer: 2000,
        titleColor: theme.COLORS.PRIMARY_GREEN
      });

      setCode('');
    }
  }, [openDate, checkInRequestDate, checkInSuccessDate, dispatchShowToast]);

  React.useEffect(() => {
    if (
      createExcuseRequestDate !== null &&
      createExcuseSuccessDate !== null &&
      createExcuseRequestDate.isAfter(openDate) &&
      createExcuseSuccessDate.isAfter(createExcuseRequestDate)
    ) {
      dispatchShowToast({
        title: 'Success',
        message: 'Your excuse has been submitted!',
        timer: 2000,
        titleColor: theme.COLORS.PRIMARY_GREEN
      });

      setReason('');
    }
  }, [openDate, createExcuseRequestDate, createExcuseSuccessDate, dispatchShowToast]);

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
                {eventOptions.length > 0 ? (
                  <React.Fragment>
                    <Block style={styles.propertyHeaderContainer}>
                      <Text style={styles.propertyHeader}>Event</Text>
                    </Block>

                    <RadioList options={eventOptions} selected={checkInEventId} onChange={onChangeEventList} />
                  </React.Fragment>
                ) : (
                  <Text style={styles.description}>
                    No events available to check in or request excuses for. You may only check into an event on the same
                    day it happened. If you forgot to check in and it is the same day, you can still submit the code. If
                    it isn't, please send a request from your messages page. Excuses must be requested before an event.
                  </Text>
                )}
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
          <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={insets.top + HeaderHeight} enabled>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <TouchableWithoutFeedback>
                <Block style={styles.content}>
                  <Block style={styles.eventIdContainer}>
                    <ListButton
                      keyText="Event"
                      valueText={selectedEvent === null ? 'choose one' : selectedEvent.title}
                      onPress={() => setChoosingEvent(true)}
                    />
                  </Block>

                  <Block
                    style={[
                      styles.excuseContainer,
                      selectedEvent !== null &&
                        !selectedEvent.excusable && {
                          opacity: 0.5
                        }
                    ]}
                  >
                    <Block style={styles.propertyHeaderContainer}>
                      <Text style={styles.propertyHeader}>Excuse</Text>
                    </Block>

                    <FormattedInput
                      editable={selectedEvent === null || selectedEvent.excusable}
                      style={styles.multiInput}
                      multiline={true}
                      placeholderText="reason"
                      maxLength={128}
                      error={false}
                      value={reason}
                      onChangeText={(text: string) => setReason(text)}
                    />
                  </Block>

                  <Block style={styles.dividerWrapper}>
                    <Block style={styles.divider} />
                    <Text style={styles.orDividerText}>OR</Text>
                    <Block style={styles.divider} />
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
                          returnKeyType="done"
                          error={false}
                          value={code}
                          formatter={numberFormatter}
                          onChangeText={(text: string) => setCode(text)}
                        />
                      </Block>

                      <Block style={styles.scanButton}>
                        <RoundButton
                          disabled={isCheckingIn}
                          label="Scan"
                          right={true}
                          icon={
                            <Icon family="MaterialCommunityIcons" name="qrcode" size={24} color={theme.COLORS.WHITE} />
                          }
                          onPress={onPressScan}
                        />
                      </Block>
                    </Block>
                  </Block>
                  <Text style={styles.description}>
                    You may only check into an event on the same day it happened. If you forgot to check in and it is
                    the same day, you can still submit the code. If it isn't, please send a request from your messages
                    page and the exec board will consider it. Excuses must be requested before an event.
                  </Text>
                </Block>
              </TouchableWithoutFeedback>
            </ScrollView>
          </KeyboardAvoidingView>

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
                      isCheckingIn ||
                      isCreatingExcuse ||
                      selectedEvent === null ||
                      !selectedEvent.excusable ||
                      alreadyCheckedIn ||
                      reason.trim() === ''
                    }
                    loading={isCreatingExcuse}
                    onPress={dispatchCreateExcuse}
                  />
                </Block>
                <Block style={styles.bottomDivider} />

                <Block style={styles.attendButton}>
                  <RoundButton
                    disabled={
                      isCheckingIn ||
                      isCreatingExcuse ||
                      selectedEvent === null ||
                      alreadyCheckedIn ||
                      code.length !== 4 ||
                      !canCheckIn(selectedEvent)
                    }
                    loading={isCheckingIn}
                    label="Check In"
                    onPress={onPressCheckIn}
                  />
                </Block>
              </React.Fragment>
            )}
          </Block>
        </Block>

        <SlideModal visible={choosingEvent} onRequestClose={() => setChoosingEvent(false)}>
          {renderChoosingEvent()}
        </SlideModal>
        <SlideModal visible={scanning} onRequestClose={() => setScanning(false)}>
          {renderScanner()}
        </SlideModal>
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
    minHeight: '100%',
    paddingBottom: 64,
    paddingHorizontal: HORIZONTAL_PADDING
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
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 64,
    backgroundColor: theme.COLORS.WHITE,
    paddingHorizontal: HORIZONTAL_PADDING,
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
  checkInContainer: {},
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
    marginLeft: HORIZONTAL_PADDING,
    width: 128
  },
  dividerWrapper: {
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
  scannerCloseButton: {}
});

export default CheckInContent;
