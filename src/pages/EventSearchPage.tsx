import React from 'react';
import { StyleSheet, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';
import moment from 'moment';
import { NotificationFeedbackType } from 'expo-haptics';

import { TRedux } from '@reducers';
import { _kappa, _ui } from '@reducers/actions';
import { theme } from '@constants';
import { Block, Header, EndCapButton, ListButton, Text, FormattedInput, RadioList } from '@components';
import { HeaderHeight, HORIZONTAL_PADDING } from '@services/utils';
import { TEvent } from '@backend/kappa';
import { sortEventByDate, getEventById } from '@services/kappaService';

const numberFormatter = (text: string) => {
  return text !== undefined ? text.replace(/\D/g, '') : '';
};

const EventSearchPage: React.FC<{
  onRequestClose(): void;
}> = ({ onRequestClose }) => {
  const user = useSelector((state: TRedux) => state.auth.user);
  const events = useSelector((state: TRedux) => state.kappa.events);
  const eventSearchResults = useSelector((state: TRedux) => state.kappa.eventSearchResults);
  const isSearchingEvents = useSelector((state: TRedux) => state.kappa.isSearchingEvents);

  const [searchText, setSearchText] = React.useState<string>('');
  const [profPoints, setProfPoints] = React.useState<string>('');
  const [philPoints, setPhilPoints] = React.useState<string>('');
  const [broPoints, setBroPoints] = React.useState<string>('');
  const [rushPoints, setRushPoints] = React.useState<string>('');
  const [anyPoints, setAnyPoints] = React.useState<string>('');

  const dispatch = useDispatch();
  const dispatchSelectEvent = React.useCallback((eventId: string) => dispatch(_kappa.selectEvent(eventId)), [dispatch]);
  const dispatchGetEventSearchResults = React.useCallback(
    () =>
      dispatch(
        _kappa.getEventSearchResults(user, {
          title: searchText,
          profPoints,
          philPoints,
          broPoints,
          rushPoints,
          anyPoints
        })
      ),
    [dispatch, user, searchText, profPoints, philPoints, broPoints, rushPoints, anyPoints]
  );

  const insets = useSafeArea();

  const eventOptions = React.useMemo(() => {
    return eventSearchResults
      .filter((event) => getEventById(events, event._id) !== null)
      .sort(sortEventByDate)
      .map((event) => ({
        id: event._id,
        title: event.title,
        subtitle: moment(event.start).format('ddd LLL')
      }));
  }, [eventSearchResults, events]);

  return (
    <Block flex>
      <Header
        title="Search Events"
        showBackButton={true}
        onPressBackButton={onRequestClose}
        rightButton={
          <EndCapButton label="Search" loading={isSearchingEvents} onPress={dispatchGetEventSearchResults} />
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
              <Block style={styles.propertyHeaderContainer}>
                <Text style={styles.propertyHeader}>Title</Text>
              </Block>

              <FormattedInput
                editable={true}
                style={styles.input}
                placeholderText="ex: General Meeting"
                maxLength={128}
                error={false}
                value={searchText}
                onChangeText={(text: string) => setSearchText(text)}
              />

              <Block style={styles.doubleColumn}>
                <Block style={styles.column}>
                  <Block style={styles.propertyHeaderContainer}>
                    <Text style={styles.propertyHeader}>Professional</Text>
                  </Block>

                  <FormattedInput
                    style={styles.input}
                    placeholderText="points"
                    maxLength={1}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    value={profPoints}
                    formatter={numberFormatter}
                    onChangeText={(text: string) => setProfPoints(text)}
                  />
                </Block>

                <Block style={styles.separator} />

                <Block style={styles.column}>
                  <Block style={styles.propertyHeaderContainer}>
                    <Text style={styles.propertyHeader}>Philanthropy</Text>
                  </Block>

                  <FormattedInput
                    style={styles.input}
                    placeholderText="points"
                    maxLength={1}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    value={philPoints}
                    formatter={numberFormatter}
                    onChangeText={(text: string) => setPhilPoints(text)}
                  />
                </Block>
              </Block>
              <Block style={styles.doubleColumn}>
                <Block style={styles.column}>
                  <Block style={styles.propertyHeaderContainer}>
                    <Text style={styles.propertyHeader}>Brotherhood</Text>
                  </Block>

                  <FormattedInput
                    style={styles.input}
                    placeholderText="points"
                    maxLength={1}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    value={broPoints}
                    formatter={numberFormatter}
                    onChangeText={(text: string) => setBroPoints(text)}
                  />
                </Block>

                <Block style={styles.separator} />

                <Block style={styles.column}>
                  <Block style={styles.propertyHeaderContainer}>
                    <Text style={styles.propertyHeader}>Rush</Text>
                  </Block>

                  <FormattedInput
                    style={styles.input}
                    placeholderText="points"
                    maxLength={1}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    value={rushPoints}
                    formatter={numberFormatter}
                    onChangeText={(text: string) => setRushPoints(text)}
                  />
                </Block>
              </Block>
              <Block style={styles.doubleColumn}>
                <Block style={styles.column}>
                  <Block style={styles.propertyHeaderContainer}>
                    <Text style={styles.propertyHeader}>Any</Text>
                  </Block>

                  <FormattedInput
                    style={styles.input}
                    placeholderText="points"
                    maxLength={1}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    value={anyPoints}
                    formatter={numberFormatter}
                    onChangeText={(text: string) => setAnyPoints(text)}
                  />
                </Block>

                <Block style={styles.separator} />

                <Block style={styles.column}>
                  <Block style={styles.propertyHeaderContainer}>
                    <Text style={styles.propertyHeader} />
                  </Block>
                </Block>
              </Block>

              <Text style={styles.description}>
                You can search for an event based on the title or by how many points they have in certain categories!
                You will see all the results that match the fields you fill in
              </Text>
              <Text style={styles.description}>
                Example: to find all events worth 1 brotherhood point, search with a "1" under brotherhood points
              </Text>

              <Block style={styles.propertyHeaderContainer}>
                <Text style={styles.propertyHeader}>Results</Text>
              </Block>

              <RadioList
                options={eventOptions}
                selected=""
                onChange={(chosen: string) => {
                  onRequestClose();
                  dispatchSelectEvent(chosen);
                }}
              />
            </Block>
          </TouchableWithoutFeedback>
        </ScrollView>
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
  input: {
    backgroundColor: theme.COLORS.SUPER_LIGHT_BLUE_GRAY
  },
  description: {
    marginTop: 12,
    fontFamily: 'OpenSans',
    fontSize: 12
  },
  doubleColumn: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  column: {
    flex: 1
  },
  wideColumn: {
    width: '60%'
  },
  separator: {
    width: HORIZONTAL_PADDING
  }
});

export default EventSearchPage;
