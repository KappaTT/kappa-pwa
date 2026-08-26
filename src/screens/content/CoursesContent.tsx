import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';
import { useIsFocused, NavigationProp } from '@react-navigation/native';
import { SearchBar } from 'react-native-elements';

import { TRedux } from '@reducers';
import { _courses, _kappa } from '@reducers/actions';
import { TCourse } from '@backend/courses';
import { theme } from '@constants';
import { HeaderHeight, HORIZONTAL_PADDING } from '@services/utils';
import { shouldLoad } from '@services/kappaService';
import {
  getCurrentTerm,
  getUserEnrollment,
  groupCoursesBySubject,
  hasPastUserEnrollment,
  hasUserEnrollment
} from '@services/coursesService';
import { Block, Header, Text, Icon, EndCapButton, CourseItem } from '@components';

// react-native-elements' SearchBar typings incorrectly require every default-provided prop
const TypedSearchBar = (SearchBar as unknown) as React.FC<any>;

const CoursesContent: React.FC<{
  navigation: NavigationProp<any, 'Courses'>;
}> = ({ navigation }) => {
  const isFocused = useIsFocused();

  const user = useSelector((state: TRedux) => state.auth.user);
  const loadHistory = useSelector((state: TRedux) => state.courses.loadHistory);
  const courseArray = useSelector((state: TRedux) => state.courses.courseArray);
  const isGettingCourses = useSelector((state: TRedux) => state.courses.isGettingCourses);
  const getCoursesError = useSelector((state: TRedux) => state.courses.getCoursesError);
  const getCoursesErrorMessage = useSelector((state: TRedux) => state.courses.getCoursesErrorMessage);
  const kappaLoadHistory = useSelector((state: TRedux) => state.kappa.loadHistory);
  const isGettingDirectory = useSelector((state: TRedux) => state.kappa.isGettingDirectory);
  const getDirectoryError = useSelector((state: TRedux) => state.kappa.getDirectoryError);

  const dispatch = useDispatch();
  const dispatchGetCourses = React.useCallback(() => dispatch(_courses.getCourses(user)), [dispatch, user]);
  const dispatchGetDirectory = React.useCallback(() => dispatch(_kappa.getDirectory(user)), [dispatch, user]);
  const dispatchShowAddCourse = React.useCallback(() => dispatch(_courses.showAddCourse()), [dispatch]);

  const insets = useSafeArea();

  const scrollRef = React.useRef(undefined);

  const refreshing = React.useMemo(() => isGettingCourses || isGettingDirectory, [
    isGettingCourses,
    isGettingDirectory
  ]);

  const loadData = React.useCallback(
    (force: boolean) => {
      if (!isGettingCourses && (force || (!getCoursesError && shouldLoad(loadHistory, 'courses'))))
        dispatchGetCourses();
      if (!isGettingDirectory && (force || (!getDirectoryError && shouldLoad(kappaLoadHistory, 'directory'))))
        dispatchGetDirectory();
    },
    [
      isGettingCourses,
      getCoursesError,
      loadHistory,
      dispatchGetCourses,
      isGettingDirectory,
      getDirectoryError,
      kappaLoadHistory,
      dispatchGetDirectory
    ]
  );

  const onRefresh = React.useCallback(() => {
    loadData(true);
  }, [loadData]);

  React.useEffect(() => {
    if (isFocused && user.sessionToken) {
      loadData(false);
    }
  }, [isFocused, loadData, user.sessionToken]);

  const [searchText, setSearchText] = React.useState<string>('');
  const [showOnlyMine, setShowOnlyMine] = React.useState<boolean>(false);
  const [expandedSubjects, setExpandedSubjects] = React.useState<{ [subject: string]: boolean }>({});

  const currentTerm = React.useMemo(() => getCurrentTerm(), []);

  const visibleCourses = React.useMemo(() => {
    let courses = courseArray;

    if (showOnlyMine) {
      courses = courses.filter((course) => hasUserEnrollment(course, user.email));
    }

    if (searchText.trim() !== '') {
      const search = searchText.trim().toLowerCase();

      courses = courses.filter(
        (course) => course.code.toLowerCase().includes(search) || course.title.toLowerCase().includes(search)
      );
    }

    return courses;
  }, [courseArray, searchText, showOnlyMine, user.email]);

  const subjectGroups = React.useMemo(() => groupCoursesBySubject(visibleCourses), [visibleCourses]);

  // searching or filtering to your own classes leaves few matches, so keep every group open for those
  const forceExpanded = React.useMemo(() => searchText.trim() !== '' || showOnlyMine, [searchText, showOnlyMine]);

  const onPressSubject = React.useCallback((subject: string) => {
    setExpandedSubjects((expanded) => ({
      ...expanded,
      [subject]: !expanded[subject]
    }));
  }, []);

  const keyExtractor = React.useCallback((item: { subject: string; courses: TCourse[] }) => item.subject, []);

  const renderItem = ({ item }: { item: { subject: string; courses: TCourse[] } }) => {
    const expanded = forceExpanded || expandedSubjects[item.subject] === true;
    const enrolledInSubject = item.courses.some(
      (course) => getUserEnrollment(course, user.email, currentTerm) !== undefined
    );
    const takenInSubject =
      !enrolledInSubject && item.courses.some((course) => hasPastUserEnrollment(course, user.email, currentTerm));

    return (
      <React.Fragment>
        <TouchableOpacity activeOpacity={0.4} disabled={forceExpanded} onPress={() => onPressSubject(item.subject)}>
          <Block style={styles.subjectContainer}>
            <Text style={styles.subjectTitle}>{item.subject}</Text>

            <Block style={styles.subjectRight}>
              {enrolledInSubject && <Text style={styles.subjectEnrolledLabel}>Enrolled</Text>}
              {takenInSubject && <Text style={styles.subjectTakenLabel}>Taken</Text>}
              <Text style={styles.subjectCountLabel}>
                {item.courses.length} {item.courses.length === 1 ? 'class' : 'classes'}
              </Text>
              <Icon
                family="MaterialIcons"
                name={expanded ? 'keyboard-arrow-down' : 'keyboard-arrow-right'}
                size={36}
                color={theme.COLORS.PRIMARY}
              />
            </Block>
          </Block>
        </TouchableOpacity>

        {expanded && (
          <Block style={styles.subjectCourses}>
            {item.courses.map((course) => (
              <CourseItem key={course._id} course={course} />
            ))}
          </Block>
        )}
      </React.Fragment>
    );
  };

  return (
    <Block flex>
      <Header
        leftButton={
          <Block style={styles.leftButton}>
            <TypedSearchBar
              round={true}
              autoCapitalize="none"
              autoCorrect={false}
              lightTheme={true}
              showCancel={false}
              cancelIcon={false}
              searchIcon={false}
              placeholder="Search..."
              containerStyle={{
                backgroundColor: 'transparent',
                borderTopColor: 'transparent',
                borderBottomColor: 'transparent',
                width: 150
              }}
              inputContainerStyle={{
                backgroundColor: 'transparent',
                width: 150
              }}
              inputStyle={{
                fontSize: 14
              }}
              onChangeText={(text: string) => setSearchText(text)}
              value={searchText}
            />
          </Block>
        }
        title="Courses"
        rightButton={<EndCapButton label="Add Class" onPress={dispatchShowAddCourse} />}
      />

      <Block
        style={[
          styles.wrapper,
          {
            top: insets.top + HeaderHeight
          }
        ]}
      >
        <Block style={styles.controlsRow}>
          <TouchableOpacity activeOpacity={0.6} onPress={() => setShowOnlyMine(!showOnlyMine)}>
            <Block style={[styles.myClassesPill, showOnlyMine && styles.myClassesPillActive]}>
              <Text style={[styles.myClassesPillText, showOnlyMine && styles.myClassesPillTextActive]}>
                My Classes
              </Text>
            </Block>
          </TouchableOpacity>

          <Block style={styles.refreshContainer}>
            {refreshing ? (
              <ActivityIndicator style={styles.refreshIcon} color={theme.COLORS.PRIMARY} />
            ) : (
              <TouchableOpacity onPress={onRefresh}>
                <Icon
                  style={styles.refreshIcon}
                  family="Feather"
                  name="refresh-cw"
                  size={17}
                  color={theme.COLORS.PRIMARY}
                />
              </TouchableOpacity>
            )}
          </Block>
        </Block>

        <Block style={styles.content}>
          <FlatList
            ref={(ref) => (scrollRef.current = ref)}
            data={subjectGroups}
            extraData={expandedSubjects}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListEmptyComponent={
              <React.Fragment>
                <Text style={styles.pullToRefresh} onPress={onRefresh}>
                  Click to Refresh
                </Text>
                <Text style={styles.errorMessage}>
                  {(courseArray.length === 0 && getCoursesErrorMessage) ||
                    (searchText.trim() !== ''
                      ? 'No matching courses'
                      : showOnlyMine
                      ? "You haven't added any of your classes yet"
                      : 'No classes yet, add the first one!')}
                </Text>
              </React.Fragment>
            }
          />
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
  leftButton: {
    position: 'absolute',
    left: 0
  },
  controlsRow: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  refreshContainer: {},
  refreshIcon: {
    margin: 8,
    width: 17
  },
  content: {
    flex: 1
  },
  pullToRefresh: {
    marginTop: '40%',
    textAlign: 'center',
    fontFamily: 'OpenSans-SemiBold',
    color: theme.COLORS.PRIMARY
  },
  errorMessage: {
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'OpenSans'
  },
  subjectContainer: {
    marginHorizontal: HORIZONTAL_PADDING,
    height: 48,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: theme.COLORS.LIGHT_BORDER,
    borderBottomWidth: 1
  },
  subjectTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 17,
    color: theme.COLORS.BLACK
  },
  subjectRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  subjectEnrolledLabel: {
    marginRight: 12,
    fontFamily: 'OpenSans-Bold',
    fontSize: 13,
    color: theme.COLORS.PRIMARY_GREEN,
    textTransform: 'uppercase'
  },
  subjectTakenLabel: {
    marginRight: 12,
    fontFamily: 'OpenSans-Bold',
    fontSize: 13,
    color: theme.COLORS.GRAY,
    textTransform: 'uppercase'
  },
  subjectCountLabel: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 13,
    color: theme.COLORS.GRAY,
    textTransform: 'uppercase'
  },
  subjectCourses: {
    paddingLeft: 16
  },
  myClassesPill: {
    paddingHorizontal: 12,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.COLORS.SUPER_LIGHT_BLUE_GRAY,
    borderColor: theme.COLORS.LIGHT_BORDER,
    borderWidth: 1
  },
  myClassesPillActive: {
    backgroundColor: theme.COLORS.PRIMARY,
    borderColor: theme.COLORS.PRIMARY
  },
  myClassesPillText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 12,
    color: theme.COLORS.DARK_GRAY
  },
  myClassesPillTextActive: {
    color: theme.COLORS.WHITE
  }
});

export default CoursesContent;
