// File: components/ContactComponent.js
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';

const Contact = () => {
  return (
    <View>
      <Card>
        <Card.Title>Contact Information</Card.Title>
        <Card.Divider />
        <Text style={styles.text}>
          121, Clear Water Bay Road{'\n'}
          Clear Water Bay, Kowloon{'\n'}
          HONG KONG{'\n'}
          Tel: +852 1234 5678{'\n'}
          Fax: +852 8765 4321{'\n'}
          Email:confusion@food.net
        </Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    margin: 10,
    fontSize: 16,
    lineHeight: 40,
  },
});

export default Contact;
