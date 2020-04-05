import React from 'react';
import { StyleSheet, KeyboardAvoidingView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';

import { TRedux } from '@reducers';
import { TEvent, TPoint } from '@backend/kappa';
import { theme } from '@constants';
import { Block, Text, Header, EndCapButton, RadioList } from '@components';

const EditEventPage: React.FC<{
  initialEvent: TEvent;
  onPressBack(): void;
  onPressSave(event: TEvent): void;
}> = ({ initialEvent, onPressBack, onPressSave }) => {
  const onPressSaveButton = React.useCallback(() => {
    const event = null;
  }, []);

  return (
    <Block flex>
      <Header
        title={initialEvent ? 'Editing Event' : 'New Event'}
        subtitle={initialEvent ? initialEvent.title : ''}
        showBackButton={true}
        onPressBackButton={onPressBack}
        rightButton={<EndCapButton label="Save" onPress={onPressSaveButton} />}
      />
    </Block>
  );
};

const styles = StyleSheet.create({});

export default EditEventPage;
