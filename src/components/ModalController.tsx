import React from 'react';
import { StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { TRedux } from '@reducers';
import { _kappa, _voting } from '@reducers/actions';
import { incompleteUser } from '@backend/auth';
import { LoginPage, OnboardingPage, VotingPage } from '@pages';
import Ghost from '@components/Ghost';
import FullPageModal from '@components/FullPageModal';

const ModalController: React.FC = () => {
  const loadedUser = useSelector((state: TRedux) => state.auth.loadedUser);
  const authorized = useSelector((state: TRedux) => state.auth.authorized);
  const user = useSelector((state: TRedux) => state.auth.user);
  const loginVisible = useSelector((state: TRedux) => state.auth.visible);
  const editingUserEmail = useSelector((state: TRedux) => state.kappa.editingUserEmail);
  const isShowingVoting = useSelector((state: TRedux) => state.voting.isShowingVoting);

  const dispatch = useDispatch();
  const dispatchCancelEditUser = React.useCallback(() => dispatch(_kappa.cancelEditUser()), [dispatch]);
  const dispatchHideVoting = React.useCallback(() => dispatch(_voting.hideVoting()), [dispatch]);

  const userIsIncomplete = React.useMemo(() => {
    if (!authorized || !user) return false;

    let incomplete = false;

    for (const key of Object.keys(incompleteUser)) {
      if (user[key] === undefined || user[key] === incompleteUser[key]) {
        incomplete = true;
        break;
      }
    }

    return incomplete;
  }, [authorized, user]);

  return (
    <Ghost style={styles.container}>
      <FullPageModal visible={isShowingVoting} onDoneClosing={dispatchHideVoting}>
        <VotingPage onRequestClose={dispatchHideVoting} />
      </FullPageModal>

      <FullPageModal
        visible={userIsIncomplete || (authorized && editingUserEmail === user.email)}
        onDoneClosing={dispatchCancelEditUser}
      >
        <OnboardingPage />
      </FullPageModal>

      <FullPageModal visible={loginVisible || (loadedUser && !authorized)}>
        <LoginPage />
      </FullPageModal>
    </Ghost>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
});

export default ModalController;
