import React from 'react';
import { StyleSheet, FlatList, Dimensions } from 'react-native';

import GradientBlobButton from './GradientBlobButton';
import { AttentionItemTypes } from '../types';

const { width, height } = Dimensions.get('screen');

const AttentionItem: React.SFC<{
  item: AttentionItemTypes.ItemType;
  onPressItem(item: AttentionItemTypes.ItemType): void;
}> = ({ item, onPressItem }) => {
  const { title, subtitle, alarmCount, gradient } = item;

  return (
    <GradientBlobButton
      title={title}
      subtitle={subtitle}
      alarmCount={alarmCount}
      gradient={gradient}
      onPress={() => onPressItem(item)}
    />
  );
};

const AttentionList = ({ data, onPressAttentionItem, viewingAll }) => {
  const columns = Math.floor((width - 40) / 100);

  const keyExtractor = (item: any) => {
    return item.title;
  };

  const onPressItem = (item: any) => {
    onPressAttentionItem(item);
  };

  const renderItem = ({ item }) => {
    return <AttentionItem item={item} onPressItem={() => onPressItem(item)} />;
  };

  return (
    <FlatList
      style={styles.attentionView}
      contentContainerStyle={styles.content}
      horizontal={!viewingAll}
      numColumns={viewingAll ? columns : undefined}
      showsHorizontalScrollIndicator={false}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  attentionView: {
    overflow: 'visible'
  },
  content: {
    display: 'flex',
    alignItems: 'center'
  }
});

export default AttentionList;
