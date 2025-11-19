import React, { Component, useState } from 'react';
import { View, Text, FlatList, Modal, Button, StyleSheet } from 'react-native';
import { Card, Image, Icon, Rating, Input } from 'react-native-elements';
import { ScrollView } from 'react-native-virtualized-view';
import { baseUrl } from '../shared/baseUrl';
import { connect } from 'react-redux';
import { postFavorite, postComment } from '../redux/ActionCreators';

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

const RenderDish = React.memo(({ dish, favorite, onPressFavorite, onPressComment }) => {
  if (dish != null) {
    return (
      <Card>
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
});

const RenderComments = React.memo(({ comments }) => {
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
    <Card>
      <Card.Title>Comments</Card.Title>
      <Card.Divider />
      <FlatList data={comments}
        renderItem={renderCommentItem}
        keyExtractor={(item) => item.id.toString()} />
    </Card>
  );
});

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
        <RenderDish
          dish={dish}
          favorite={favorite}
          onPressFavorite={() => this.markFavorite(dishId)}
          onPressComment={() => this.toggleModal()}
        />
        <RenderComments comments={comments} />
        <CommentForm
          dishId={dishId}
          isVisible={this.state.showModal}
          onClose={() => this.toggleModal()}
          onSubmit={(dishId, rating, author, comment) => this.handleComment(dishId, rating, author, comment)}
        />
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