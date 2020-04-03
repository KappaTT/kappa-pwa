import React from 'react';
import { StyleSheet, Dimensions, TouchableWithoutFeedback, ScrollView, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { useSafeArea } from 'react-native-safe-area-context';
import moment from 'moment';

import { TRedux } from '@reducers';
import { _auth, _kappa } from '@reducers/actions';
import { log } from '@services/logService';
import { theme } from '@constants';
import { TabBarHeight, isEmpty } from '@services/utils';
import { TEvent } from '@backend/kappa';
import Block from '@components/Block';
import Ghost from '@components/Ghost';
import Text from '@components/Text';
import RoundButton from '@components/RoundButton';
import Icon from '@components/Icon';

const { width, height } = Dimensions.get('screen');

const EventDrawer: React.FC<{}> = ({}) => {
  const user = useSelector((state: TRedux) => state.auth.user);
  const selectedEventId = useSelector((state: TRedux) => state.kappa.selectedEventId);
  const selectedEvent = useSelector((state: TRedux) => state.kappa.selectedEvent);

  const dispatch = useDispatch();
  const dispatchUnselectEvent = React.useCallback(() => dispatch(_kappa.unselectEvent()), [dispatch]);

  const insets = useSafeArea();

  const sheetRef = React.useRef(undefined);
  const scrollRef = React.useRef(undefined);

  const sheetHeight = Math.max((height - insets.top) * 0.67 + insets.bottom, 600);

  const [snapPoint, setSnapPoint] = React.useState<number>(1);
  const [callbackNode, setCallbackNode] = React.useState(new Animated.Value(0));

  const backgroundOpacity = callbackNode.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0]
  });

  const snapTo = React.useCallback(
    newSnap => {
      sheetRef?.current?.snapTo(newSnap);
      sheetRef?.current?.snapTo(newSnap);
    },
    [sheetRef]
  );

  const onPressClose = React.useCallback(() => {
    snapTo(1);
  }, []);

  const onOpenStart = () => {
    setSnapPoint(0);
  };

  const onOpenEnd = () => {
    setSnapPoint(0);
  };

  const onCloseStart = () => {
    setSnapPoint(1);
  };

  const onCloseEnd = () => {
    setSnapPoint(1);

    dispatchUnselectEvent();
  };

  React.useEffect(() => {
    if (selectedEventId === -1) {
      snapTo(1);
    } else {
      snapTo(0);
    }
  }, [selectedEventId]);

  const renderHeader = () => {
    return (
      <Block style={styles.header}>
        <Block style={styles.panelHeader}>
          <Block style={styles.panelHandle} />
        </Block>
      </Block>
    );
  };

  const renderContent = () => {
    return (
      <Block
        style={[
          styles.contentWrapper,
          {
            height: sheetHeight - 48
          }
        ]}
      >
        {selectedEvent && (
          <React.Fragment>
            <ScrollView
              ref={ref => (scrollRef.current = ref)}
              refreshControl={<RefreshControl refreshing={false} onRefresh={() => {}} />}
              scrollIndicatorInsets={{ right: 1 }}
            >
              <Block style={styles.eventWrapper}>
                <Block style={styles.eventHeader}>
                  <Text style={styles.eventDate}>{moment(selectedEvent.start).format('ddd LL h:mm A')}</Text>
                  <Text style={styles.eventTitle}>{selectedEvent.title}</Text>
                </Block>
              </Block>
            </ScrollView>

            <Block
              style={[
                styles.bottomBar,
                {
                  marginBottom: insets.bottom
                }
              ]}
            >
              <Block style={styles.excuseButton}>
                <RoundButton alt={true} label="Request Excuse" />
              </Block>
              <Block style={styles.bottomDivider} />
              <Block style={styles.attendButton}>
                <RoundButton disabled={moment(selectedEvent.start).isBefore(moment(), 'day')} label="Check In" />
              </Block>
            </Block>
          </React.Fragment>
        )}
      </Block>
    );
  };

  return (
    <Ghost style={styles.container}>
      <TouchableWithoutFeedback onPress={onPressClose}>
        <Animated.View
          pointerEvents={selectedEventId === -1 ? 'none' : 'auto'}
          style={[
            styles.background,
            {
              opacity: backgroundOpacity
            }
          ]}
        />
      </TouchableWithoutFeedback>

      <BottomSheet
        ref={ref => (sheetRef.current = ref)}
        snapPoints={[sheetHeight, 0]}
        initialSnap={1}
        callbackNode={callbackNode}
        overdragResistanceFactor={1.5}
        enabledBottomClamp={true}
        renderHeader={renderHeader}
        renderContent={renderContent}
        onOpenStart={onOpenStart}
        onOpenEnd={onOpenEnd}
        onCloseStart={onCloseStart}
        onCloseEnd={onCloseEnd}
      />
    </Ghost>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
    flex: 1,
    backgroundColor: theme.COLORS.BLACK
  },
  header: {
    height: 48,
    paddingTop: 8,
    paddingBottom: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: theme.COLORS.WHITE
  },
  panelHeader: {
    alignItems: 'center'
  },
  panelHandle: {
    width: 40,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00000040'
  },
  headerControls: {
    flex: 1,
    marginHorizontal: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contentWrapper: {
    backgroundColor: theme.COLORS.WHITE
  },
  eventWrapper: {
    paddingHorizontal: 24
  },
  eventHeader: {},
  eventDate: {
    fontFamily: 'OpenSans-Bold',
    color: theme.COLORS.GRAY,
    fontSize: 14,
    textTransform: 'uppercase'
  },
  eventTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 24
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
  }
});

export default EventDrawer;
