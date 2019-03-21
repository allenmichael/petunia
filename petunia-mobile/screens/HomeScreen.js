import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, StyleSheet, TextInput, TouchableOpacity} from 'react-native'
import {Camera, Permissions} from 'expo'
import { Button, Icon } from 'react-native-elements';
import prodAPI from '../api';
import Toast, {DURATION} from 'react-native-easy-toast'
import { connectActionSheet} from '@expo/react-native-action-sheet';
var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1'; 
AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'us-east-1:1956382a-b3f6-472c-9a8d-3a246853c917'});


@connectActionSheet
class HomeScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      modalVisible: false,
      comment: '',
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      selectedIndex: null,
      displayCamera: false
    }

   }

   async componentWillMount() {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({ hasCameraPermission: status === 'granted' })
    }

   toggleModal(visible) {
      this.setState({ modalVisible: visible });
   }

   // takePicture() { 
   //    this.camera.capture() 
   //    .then((data) => console.log(data)) 
   //    .catch(err => console.error(err)); 
   // }

   async redactText(){
        // API call params
      var comprehendParams = {
      LanguageCode: "en",
      Text: ''
      };
     comprehendParams.Text = this.state.comment;
     
     // instantiate comprehend client
     var comprehend = new AWS.Comprehend({apiVersion: '2017-11-27'});
     let currentComponent = this;

     try{
     let data = await comprehend.detectSyntax(comprehendParams).promise();
     let wordsToRedact = data.SyntaxTokens.filter(value => {
        return value.PartOfSpeech.Tag === "PROPN" || value.PartOfSpeech.Tag === "NOUN";
     });
     let originalComment = this.state.comment;
      wordsToRedact.map(word => {
         let filler = "x".repeat(word.Text.length);
         originalComment = originalComment.replace(word.Text, filler);
         
      })
      this.setState({comment: originalComment});

     return data;
     }
     catch(err){
      console.log(err);
     }
   }

   async sendPost() {
  
    console.log(this.state.comment);
    await this.redactText();
    fetch(prodAPI, {
       method: 'post',
       body: JSON.stringify({'post': this.state.comment})
    })
    .then(res => res.json())
    .then(data => {
      
       this.refs.toast.show(`${data.message} and your original message redacted: ${this.state.comment}`)
       this.setState({comment: ''}); //reset comment box
      });
   }

   _onOpenActionSheet = () => {
      // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
      const options = ['Choose Photo', 'Take Photo', 'Cancel'];
      const cancelButtonIndex = 2;
    
      this.props.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        buttonIndex => {
           console.log(buttonIndex)
           switch(buttonIndex){
              case 0:
              //choose photo
              break;
              case 1:
              this.toggleModal(false)
              this.setState({displayCamera : true})
              break;
           }
          // Do something here depending on the button index selected
        },
      );
    };

   render() {
      const { hasCameraPermission } = this.state;
               let cameraDisplay;
               if (!hasCameraPermission) {
                 cameraDisplay = <Text>No access to camera</Text>;
               } else if(hasCameraPermission) {
                  cameraDisplay =  <Modal animationType = {"slide"} transparent = {false}
                  visible = {this.state.displayCamera} style={{ flex: 1 }}>
                                    <Camera style={{ flex: 1 }} type={this.state.type}>
                                    <View
                                       style={{
                                          flex: 1,
                                          backgroundColor: 'transparent',
                                          flexDirection: 'row',
                                       }}>
                                       <TouchableOpacity
                                          style={styles.cameraBtn}
                                          onPress={() => {
                                          this.setState({
                                             type: this.state.type === Camera.Constants.Type.back
                                                ? Camera.Constants.Type.front
                                                : Camera.Constants.Type.back,
                                          });
                                          }}>
                                          <Text
                                          style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                                          {' '}Flip{' '}
                                          </Text>
                                       </TouchableOpacity>
                                       <TouchableOpacity style={styles.cameraBtn} onPress = {() => {this.setState({displayCamera: false})}}>
                                          <Text style = {{ fontSize: 18, marginTop: -10, color: 'white' }}>Close Camera</Text>
                                       </TouchableOpacity>
                                    </View>
                                    </Camera>
                                 </Modal>
               }
      return (
         <View style = {styles.container}>
            {cameraDisplay}
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
                  <View style={styles.btnContainer}>
                     <Icon name="add-a-photo" iconStyle={[styles.icon, styles.buttonContainer]} onPress = {() => this._onOpenActionSheet()} />
                     <View style={styles.buttonContainer}>
                     <Button buttonStyle={styles.button} onPress = {() => this.sendPost()}  icon={{
                    name: "comment",
                    size: 15,
                    color: "white"
                  }}
                  title="Submit Post" />
                  
                     </View>
                  </View>
                  
                  
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
    alignItems: 'flex-end',
    
   },
   btnContainer: {
      flex: 1,
      flexDirection: 'row',
       alignItems: 'stretch',
       justifyContent: 'center',
    },
    buttonContainer: {
      flex: 1,
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
    
   },
   icon: { 
      color: 'white', 
      fontWeight: 'bold',
   justifyContent: 'center',
   paddingLeft:7,
   paddingVertical:7

 },
 flex: {
   flex: 1,
 },
 contentContainer: {
   padding: 16,
   paddingVertical: 20,
 },
 headerText: {
   textAlign: 'center',
   fontSize: 16,
   marginBottom: 10,
 },
 notes: {
   marginTop: 32,
 },
 sectionHeaderText: {
   color: 'orange',
   textAlign: 'center',
   fontWeight: 'bold',
   fontSize: 20,
   marginTop: 20,
   marginBottom: 10,
 },
 selectionText: {
   textAlign: 'center',
   color: 'blue',
   fontSize: 16,
   marginTop: 20,
 },
 cameraBtn: {
      flex: 1,
      alignSelf: 'baseline',
      alignItems: 'stretch',
      marginTop:40,
      marginLeft:30
      
 }

})