import React from 'react';
import { StyleSheet, Dimensions, TouchableWithoutFeedback, ScrollView, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import BottomSheet from 'reanimated-bottom-sheet';
import { useSafeArea } from 'react-native-safe-area-context';
import Animated, { Easing } from 'react-native-reanimated';

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

  const onOpenEnd = () => {};

  const onCloseStart = () => {
    setSnapPoint(1);
  };

  const onCloseEnd = () => {
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
        <Ghost style={styles.headerCap} />
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
            height: sheetHeight
          }
        ]}
      ></Block>
    );
  };

  return (
    <Ghost style={styles.container}>
      {selectedEventId !== -1 && (
        <TouchableWithoutFeedback onPress={onPressClose}>
          <Animated.View
            style={[
              styles.background,
              {
                opacity: backgroundOpacity
              }
            ]}
          />
        </TouchableWithoutFeedback>
      )}

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
  headerCap: {
    position: 'absolute',
    top: -68
  },
  header: {
    height: TabBarHeight,
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
  }
});

export default EventDrawer;
