import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';

import { theme } from '@constants';
import { Block, Text, Switch, Icon, TextButton } from '@components';

const ExcusePage: React.FC<{
  renderExcuse: React.ReactElement;
  onRequestClose(): void;
}> = ({ renderExcuse, onRequestClose }) => {
  const [readyToDelete, setReadyToDelete] = React.useState<boolean>(false);

  const insets = useSafeArea();

  return (
    <Block flex>
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <Block style={styles.excuseOverlay} />
      </TouchableWithoutFeedback>

      <Block
        style={[
          styles.excusePage,
          {
            paddingBottom: insets.bottom
          }
        ]}
      >
        <Block style={styles.topBar}>
          <TextButton label="Back" textStyle={styles.backButton} onPress={onRequestClose} />
        </Block>

        <Block style={styles.excusePageContent}>
          {renderExcuse}

          <Block style={styles.dangerZone}>
            <Block style={styles.approveZone}>
              <Block style={styles.warning}>
                <Text style={styles.zoneLabel}>Approve</Text>
                <Text style={styles.description}>
                  Approving an excuse will count as if they attended the event and will give any associated points.
                </Text>
              </Block>

              <TouchableOpacity onPress={() => {}}>
                <Icon
                  style={styles.zoneIcon}
                  family="Feather"
                  name="thumbs-up"
                  size={32}
                  color={theme.COLORS.PRIMARY}
                />
              </TouchableOpacity>
            </Block>
            <Block style={styles.rejectZone}>
              <Block style={styles.warning}>
                <Text style={styles.zoneLabel}>Reject</Text>
                <Text style={styles.description}>
                  Rejecting an excuse will delete the excuse permanently and is an action that cannot be undone. Please
                  double check and be certain you want to reject this excuse.
                </Text>

                <Block style={styles.enableDeleteContainer}>
                  <Switch value={readyToDelete} onValueChange={(newValue: boolean) => setReadyToDelete(newValue)} />
                  <Text style={styles.readyToDelete}>I am ready to reject this excuse</Text>
                </Block>
              </Block>

              <TouchableOpacity
                style={
                  !readyToDelete && {
                    opacity: 0.4
                  }
                }
                disabled={!readyToDelete}
                onPress={() => {}}
              >
                <Icon
                  style={styles.zoneIcon}
                  family="Feather"
                  name="thumbs-down"
                  size={32}
                  color={theme.COLORS.PRIMARY}
                />
              </TouchableOpacity>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  excuseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  excusePage: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: theme.COLORS.WHITE,
    borderTopColor: theme.COLORS.LIGHT_BORDER,
    borderTopWidth: 1
  },
  excusePageContent: {
    paddingHorizontal: 20
  },
  topBar: {
    height: 48,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  backButton: {
    paddingHorizontal: 20,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: theme.COLORS.PRIMARY
  },
  description: {
    marginTop: 12,
    fontFamily: 'OpenSans',
    fontSize: 12
  },
  dangerZone: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: theme.COLORS.INPUT_ERROR_LIGHT
  },
  approveZone: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rejectZone: {
    marginTop: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  warning: {
    flex: 1,
    marginRight: 8
  },
  zoneLabel: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 14
  },
  zoneIcon: {},
  enableDeleteContainer: {
    marginTop: 8,
    marginLeft: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  readyToDelete: {
    marginLeft: 8,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 13
  }
});

export default ExcusePage;
