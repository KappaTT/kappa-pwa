import React from 'react';
import { ScrollView, RefreshControl } from 'react-native';

const RefreshWrapper: React.FC<{
  refreshing: boolean;
  onRefresh(): void;
}> = ({ refreshing, onRefresh, children }) => {
  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {children}
    </ScrollView>
  );
};

export default RefreshWrapper;
