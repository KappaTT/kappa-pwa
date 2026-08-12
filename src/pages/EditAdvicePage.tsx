import React from 'react';
import { StyleSheet, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';

import { TRedux } from '@reducers';
import { _courses } from '@reducers/actions';
import { theme } from '@constants';
import { TAdviceCategory } from '@backend/courses';
import { ADVICE_CATEGORIES, getAdviceTermOptions } from '@services/coursesService';
import { HeaderHeight, HORIZONTAL_PADDING } from '@services/utils';
import { Block, Header, EndCapButton, Text, Switch, RadioList, FormattedInput } from '@components';

const EditAdvicePage: React.FC<{
  onRequestClose(): void;
}> = ({ onRequestClose }) => {
  const user = useSelector((state: TRedux) => state.auth.user);
  const courseArray = useSelector((state: TRedux) => state.courses.courseArray);
  const courseIdToAdvice = useSelector((state: TRedux) => state.courses.courseIdToAdvice);
  const editingAdviceCourseId = useSelector((state: TRedux) => state.courses.editingAdviceCourseId);
  const editingAdviceId = useSelector((state: TRedux) => state.courses.editingAdviceId);
  const isSavingAdvice = useSelector((state: TRedux) => state.courses.isSavingAdvice);

  const course = React.useMemo(() => courseArray.find((candidate) => candidate._id === editingAdviceCourseId), [
    courseArray,
    editingAdviceCourseId
  ]);

  const initialAdvice = React.useMemo(
    () =>
      editingAdviceId === 'NEW'
        ? null
        : (courseIdToAdvice[editingAdviceCourseId] || []).find((candidate) => candidate._id === editingAdviceId),
    [courseIdToAdvice, editingAdviceCourseId, editingAdviceId]
  );

  const [category, setCategory] = React.useState<TAdviceCategory>(initialAdvice?.category || 'GENERAL');
  const [professor, setProfessor] = React.useState<string>(initialAdvice?.professor || '');
  const [term, setTerm] = React.useState<string>(initialAdvice?.term || '');
  const [text, setText] = React.useState<string>(initialAdvice?.text || '');
  const [anonymous, setAnonymous] = React.useState<boolean>(initialAdvice?.anonymous || false);

  const termOptions = React.useMemo(() => {
    const options = getAdviceTermOptions();
    const initialTerm = initialAdvice?.term || '';

    // keep an older term selectable when the advice predates the rolling option window
    if (initialTerm !== '' && !options.find((option) => option.id === initialTerm)) {
      options.push({ id: initialTerm, title: initialTerm });
    }

    return options;
  }, [initialAdvice]);

  const dispatch = useDispatch();
  const dispatchSaveAdvice = React.useCallback(
    () =>
      dispatch(
        _courses.saveAdvice(
          user,
          initialAdvice
            ? {
                category,
                professor,
                term,
                text,
                anonymous
              }
            : {
                courseId: editingAdviceCourseId,
                category,
                professor,
                term,
                text,
                anonymous
              },
          editingAdviceId
        )
      ),
    [dispatch, user, initialAdvice, category, professor, term, text, anonymous, editingAdviceCourseId, editingAdviceId]
  );

  const insets = useSafeArea();

  const readyToSave = React.useMemo(() => text.trim() !== '', [text]);

  const onChangeCategory = React.useCallback((chosen: TAdviceCategory) => {
    setCategory(chosen);
  }, []);

  const onChangeProfessor = React.useCallback((newText: string) => {
    setProfessor(newText);
  }, []);

  const onChangeTerm = React.useCallback((chosen: string) => {
    setTerm(chosen);
  }, []);

  const onChangeText = React.useCallback((newText: string) => {
    setText(newText);
  }, []);

  const onChangeAnonymous = React.useCallback((newValue: boolean) => {
    setAnonymous(newValue);
  }, []);

  return (
    <Block flex>
      <Header
        title={`${initialAdvice === null ? 'Add' : 'Edit'} Advice`}
        subtitle={course !== undefined ? course.code : ''}
        showBackButton={true}
        onPressBackButton={onRequestClose}
        rightButton={
          <EndCapButton label="Save" loading={isSavingAdvice} disabled={!readyToSave} onPress={dispatchSaveAdvice} />
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
                <Text style={styles.propertyHeader}>Advice</Text>
                <Text style={styles.propertyHeaderRequired}>*</Text>
              </Block>

              <FormattedInput
                style={styles.multilineInput}
                placeholderText="What should the next brother taking this class know?"
                maxLength={2000}
                multiline={true}
                value={text}
                onChangeText={onChangeText}
              />

              <Block style={styles.propertyHeaderContainer}>
                <Text style={styles.propertyHeader}>Category</Text>
                <Text style={styles.propertyHeaderRequired}>*</Text>
              </Block>

              <RadioList options={ADVICE_CATEGORIES} selected={category} onChange={onChangeCategory} />

              <Text style={styles.description}>
                Pick the topic that best fits your advice so brothers can filter for what they need.
              </Text>

              <Block style={styles.propertyHeaderContainer}>
                <Text style={styles.propertyHeader}>Professor</Text>
              </Block>

              <FormattedInput
                placeholderText="ex: Chekuri"
                maxLength={48}
                value={professor}
                onChangeText={onChangeProfessor}
              />

              <Text style={styles.description}>
                Optionally name the professor your advice applies to, since courses can differ a lot by professor.
              </Text>

              <Block style={styles.propertyHeaderContainer}>
                <Text style={styles.propertyHeader}>Semester taken</Text>
              </Block>

              <RadioList options={termOptions} selected={term} onChange={onChangeTerm} />

              <Text style={styles.description}>
                Optionally share when you took the class so brothers know how current your advice is. If you post
                anonymously, the semester is hidden from other brothers as well.
              </Text>

              <Block style={styles.propertyHeaderContainer}>
                <Text style={styles.propertyHeader}>Post anonymously</Text>
              </Block>

              <Switch value={anonymous} onValueChange={onChangeAnonymous} />

              <Text style={styles.description}>
                Your name will be hidden from other brothers. Admins can still see the author of anonymous advice and
                can remove posts that break the rules.
              </Text>
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
  description: {
    marginTop: 12,
    fontFamily: 'OpenSans',
    fontSize: 12
  },
  multilineInput: {
    backgroundColor: theme.COLORS.SUPER_LIGHT_BLUE_GRAY,
    height: 128
  }
});

export default EditAdvicePage;
