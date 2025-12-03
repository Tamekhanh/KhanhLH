import React, { Component, useState } from 'react';
import { View, Text, FlatList, Modal, Button, StyleSheet, PanResponder, Alert } from 'react-native';
import { Card, Image, Icon, Rating, Input } from 'react-native-elements';
import { ScrollView } from 'react-native-virtualized-view';
import { baseUrl } from '../shared/baseUrl';
import { connect } from 'react-redux';
import { postFavorite, postComment } from '../redux/ActionCreators';

import * as Animatable from 'react-native-animatable';

const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
  };
};

const mapDispatchToProps = (dispatch) => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
});

const RenderDish = ({ dish, favorite, onPressFavorite, onPressComment }) => {
  const viewRef = React.useRef(null);
  // gesture
  const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
    if (dx < -200) return true; // right to left
    return false;
  };
  const recognizeComment = ({ moveX, moveY, dx, dy }) => {
    if (dx > 200) return true; // left to right
    return false;
  };
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (e, gestureState) => { return true; },
    onPanResponderEnd: (e, gestureState) => {
      if (recognizeDrag(gestureState)) {
        Alert.alert(
          'Add Favorite',
          'Are you sure you wish to add ' + dish.name + ' to favorite?',
          [
            { text: 'Cancel', onPress: () => { /* nothing */ } },
            { text: 'OK', onPress: () => { favorite ? alert('Already favorite') : onPressFavorite() } },
          ]
        );
      } else if (recognizeComment(gestureState)) {
        onPressComment();
      }
      return true;
    }
  });

  if (dish != null) {
    return (
      <Card {...panResponder.panHandlers}>
        <Image source={{ uri: baseUrl + dish.image }} style={{ width: '100%', height: 100, flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Card.FeaturedTitle>{dish.name}</Card.FeaturedTitle>
        </Image>
        <Text style={{ margin: 10 }}>{dish.description}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Icon raised reverse type='font-awesome' color='#f50'
            name={favorite ? 'heart' : 'heart-o'}
            onPress={() => favorite ? alert('Already favorite') : onPressFavorite()} />
          <Icon raised reverse type='font-awesome' color='#0000FF' name='pencil'
            onPress={() => onPressComment()} />
        </View>
      </Card>
    );
  }
  return (<View />);
};

const RenderComments = ({ comments }) => {
  const renderCommentItem = ({ item, index }) => {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        <Rating imageSize={12} readonly startingValue={item.rating} style={{ alignItems: 'flex-start' }} />
        <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + new Date(item.date).toLocaleDateString() + ' ' + new Date(item.date).toLocaleTimeString()} </Text>
      </View>
    );
  };

  return (
    <Animatable.View animation='fadeInUp' duration={2000} delay={1000}>
      <Card>
        <Card.Title>Comments</Card.Title>
        <Card.Divider />
        <FlatList data={comments}
          renderItem={renderCommentItem}
          keyExtractor={(item) => item.id.toString()} />
      </Card>
    </Animatable.View>
  );
};

const CommentForm = ({ dishId, isVisible, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');

  const resetForm = () => {
    setRating(5);
    setAuthor('');
    setComment('');
  };

  const handleCommentSubmit = () => {
    onSubmit(dishId, rating, author, comment);
    resetForm();
  };

  return (
    <Modal animationType={'slide'} transparent={false}
      visible={isVisible}
      onDismiss={onClose}
      onRequestClose={onClose}>
      <View style={styles.modal}>
        <Rating
          showRating
          fractions={0}
          startingValue={5}
          minValue={1}
          onFinishRating={(value) => setRating(value)}
        />
        <Input
          placeholder='Author'
          leftIcon={{ type: 'font-awesome', name: 'user-o' }}
          onChangeText={(value) => setAuthor(value)}
          value={author}
        />
        <Input
          placeholder='Comment'
          leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
          onChangeText={(value) => setComment(value)}
          value={comment}
        />
        <View style={{ margin: 10 }}>
          <Button title='Submit' color='#0000FF' onPress={handleCommentSubmit} />
        </View>
        <View style={{ margin: 10 }}>
          <Button title='Cancel' color='#808080' onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

class Dishdetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  handleComment(dishId, rating, author, comment) {
    this.props.postComment(dishId, rating, author, comment);
    this.toggleModal();
  }

  render() {
    const dishId = parseInt(this.props.route.params.dishId);
    const dish = this.props.dishes.dishes[dishId];
    const comments = this.props.comments.comments.filter((cmt) => cmt.dishId === dishId);
    const favorite = this.props.favorites.some((el) => el === dishId);

    return (
      <ScrollView>
        <Animatable.View animation='fadeInDown' duration={2000} delay={1000}>
          <RenderDish
            dish={dish}
            favorite={favorite}
            onPressFavorite={() => this.markFavorite(dishId)}
            onPressComment={() => this.toggleModal()}
          />
        </Animatable.View>
        <Animatable.View animation='fadeInUp' duration={2000} delay={1000}>
          <RenderComments comments={comments} />
          <CommentForm
            dishId={dishId}
            isVisible={this.state.showModal}
            onClose={() => this.toggleModal()}
            onSubmit={(dishId, rating, author, comment) => this.handleComment(dishId, rating, author, comment)}
          />
        </Animatable.View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    margin: 20
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);