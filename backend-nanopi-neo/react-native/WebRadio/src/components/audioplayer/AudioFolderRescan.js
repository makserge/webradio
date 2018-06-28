import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import i18n from 'i18next';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
  },
});

export default () => (
  <View
    style={styles.container}
  >
    <Text
      style={styles.label}
    >
      {i18n.t('audioFolder.foldersRescanInProgress')}
    </Text>
  </View>
);
