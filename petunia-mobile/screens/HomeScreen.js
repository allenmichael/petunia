import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, StyleSheet, TextInput} from 'react-native'
import { Button } from 'react-native-elements';
import prodAPI from '../api';
import Toast, {DURATION} from 'react-native-easy-toast'

class HomeScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      modalVisible: false,
      comment: ''
    }

   }
   toggleModal(visible) {
      this.setState({ modalVisible: visible });
   }

   sendPost() {
  
      console.log(this.state.comment);
    fetch(prodAPI, {
       method: 'post',
       body: JSON.stringify({'post': this.state.comment})
    })
    .then(res => res.json())
    .then(data => {
       this.setState({comment: ''}); //reset comment box
       this.refs.toast.show(data.message)
      });
   }

   render() {
      return (
         <View style = {styles.container}>
            <Modal animationType = {"slide"} transparent = {false}
               visible = {this.state.modalVisible}
               onRequestClose = {() => { console.log("Modal has been closed.") } }>
               <View style={styles.navBar}>
                  <TouchableHighlight onPress = {() => {
                     this.toggleModal(!this.state.modalVisible)}}>
                     <Text style = {styles.modalText}>Close Modal</Text>
                  </TouchableHighlight>
                  
                </View>
               <View style = {styles.modal}>
               
                  <TextInput style={styles.input} placeholder="What's on your mind?" onChangeText={(text) => this.setState({comment: text})} value={this.state.comment} spellCheck={false} />
                  <Button buttonStyle={styles.button} onPress = {() => this.sendPost()}  icon={{
                    name: "comment",
                    size: 15,
                    color: "white"
                  }}
                  title="Submit Post" />
                 <Toast
                   ref="toast"
                   style={{backgroundColor:'green'}}
                    position='top'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={2000}
                    opacity={0.8}
                    textStyle={{color:'white'}}
                    />
               </View>
            </Modal>
            
            <Button buttonStyle={styles.button} onPress = {() => {this.toggleModal(true)}}  icon={{
              name: "comment",
              size: 15,
              color: "white"
            }}
              title="Create New Post" />
           
         </View>
      )
   }
}
export default HomeScreen

const styles = StyleSheet.create ({
   container: {
      backgroundColor: '#fff',
      color: "#fff"
   },
   navBar: {
     alignItems: 'stretch',
     color: '#0000FF',
     padding:40

   },
   button: {
    backgroundColor: "#0000FF",
    alignItems: 'stretch'
   },
   modal: {
      flex: 1,
      backgroundColor: '#D3D3D3',
      borderTopWidth: 1,
      borderColor: '#D3D3D3',
  
   },
   text: {
      color: '#fff',
      marginTop: 10
   },
   modalText: {
    color: "#0000FF",
    marginTop: 10
   },

  input: {
    height: 100,
    backgroundColor: '#ffffff',
    paddingLeft: 5,
    paddingRight: 5,
    
  }
})