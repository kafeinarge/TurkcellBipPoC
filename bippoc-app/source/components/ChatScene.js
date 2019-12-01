import React from 'react';
import { View, StyleSheet } from 'react-native';

import ChatsList from './ChatsList';

export default props => (
  <View style={styles.container}>
    <ChatsList />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});
