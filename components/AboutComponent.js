// File: components/AboutComponent.js
import React, { Component } from 'react';
import { FlatList, ScrollView, Text, StyleSheet } from 'react-native';
import { Card, ListItem, Avatar } from 'react-native-elements';
import { LEADERS } from '../shared/leaders';

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leaders: LEADERS
    };
  }

    renderLeadership = ({ item }) => {
      return (
        <ListItem bottomDivider>
          <Avatar source={require('./images/alberto.png')} />
          <ListItem.Content>
            <ListItem.Title style={styles.leaderName}>{item.name}</ListItem.Title>
            <ListItem.Subtitle style={styles.leaderDescription}>
              {item.description}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      );
    };

  renderHistory() {
    return (
      <Card>
        <Card.Title>Our History</Card.Title>
        <Card.Divider />
        <Text key="history-1" style={styles.text}>
          Started in 2010, Ristorante con Fusion quickly established itself as a culinary icon par excellence in Hong Kong.
          With its unique brand of world fusion cuisine that can be found nowhere else, it enjoys patronage from the A-list clientele in Hong Kong.
          Featuring four of the best three-star Michelin chefs in the world, you never know what will arrive on your plate the next time you visit us.{'\n'}
          The restaurant traces its humble beginnings to The Frying Pan, a successful chain started by our CEO, Mr. Peter Pan,
          that featured for the first time the world's best cuisines in a pan.
        </Text>
      </Card>
    );
  }
  render() {
    return (
      <ScrollView>
        {this.renderHistory()}

        <Card>
          <Card.Title>Corporate Leadership</Card.Title>
          <Card.Divider />
          <FlatList
            data={this.state.leaders}
            renderItem={this.renderLeadership}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </Card>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  leaderName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  leaderDescription: {
    fontSize: 12,
    color: '#555',
    lineHeight: 16,
    marginTop: 2,
  },
  text: {
    margin: 10,
    fontSize: 12,
    color: '#222',
    lineHeight: 18,
  },
});

export default About;
