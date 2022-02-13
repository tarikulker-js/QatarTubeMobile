import * as React from 'react';
import { useState, useEffect } from 'react';
import { Alert, View, Image, ScrollView, Dimensions, RefreshControl, Share, Linking, StyleSheet, Modal, Pressable } from 'react-native';
import { Card, Button, Title, Paragraph, TouchableRipple, TextInput } from 'react-native-paper';
import axios from 'axios';
import LocalStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config.json';
import { AntDesign } from 'react-native-vector-icons';
import { BottomNavigation, Text, List, Switch } from 'react-native-paper';
import Loading from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Clipboard from 'expo-clipboard';
import { Video, AVPlaybackStatus } from 'expo-av';


const window = Dimensions.get("window");

function VideoScreen({ navigation }) {
  var [editedvideoId, setEditedvideoId] = useState(null);

  var [jwt, setJwt] = useState();
  var [userId, setUserId] = useState();


  const [videoInfos, setVideo] = useState(null);
  const [undefinedMeeting, setUndefinedVideo] = useState(true)
  const [message, setMessage] = useState(null);
  const [comments, setComments] = useState(null);
  const [showReplysCommentId, setReplyCommentId] = useState(null);
  const [replyComment, setReplyComment] = useState(null);
  const [modalComment, setModalComment] = useState(null);
  const [replyComments, setReplyComments] = useState(null)
  const [isLoading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [replyModalVisible, setReplyModalVisible] = useState(false);

  const [showDesc, setShowDesc] = useState(false);
  const [commentText, setCommentText] = useState("");

  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});


  const videoId = useSelector(state => {
    return state.videogIdReducer;
    //console.log(state.videogIdReducer);

  })

  useEffect(() => {
    LocalStorage.getItem("jwt")
      .then((getedJwt) => {
        setJwt(getedJwt);
        //console.log("geted", getedJwt);

      });

    LocalStorage.getItem("userid")
      .then((getedUserId) => {
        setUserId(getedUserId);
        //console.log("geted user id", getedUserId);

      });

    if (videoInfos) {
      if (videoId !== videoInfos._id) {
        updateInfos(videoId);
        //console.log("call")
        setLoading(true);

      } else {
        //console.log("not call");
      }
    } else if (!videoInfos) {
      updateInfos(videoId);
      //console.log("call")
      setLoading(true);

    }


  });

  function updateInfos(getedLoginedVideo) {

    setLoading(true);
    setModalLoading(true);


    //console.log("IS CALLED", getedLoginedVideo);

    fetch(`${API_URL}/video/${getedLoginedVideo}`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + jwt
      },
      body: {
        video: videoId
      }
    }).then((req) => req.json())
      .then((video) => {
        //console.log(video);
        setVideo(video.video);

        console.log("video bulundu.")


        if (video.successful == false) {
          setMessage("Video Bulunamadı! Videonun var olduğundan emin olunuz.");
        }

        fetch(`${API_URL}/getcomments/${getedLoginedVideo}`, {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + jwt
          },
          body: {
            video: videoId
          }
        }).then((req) => req.json())
          .then((getedComments) => {
            //console.log("geted comments", getedComments);
            setComments(getedComments);

            console.log("yorumlar bulundu.")

            fetch(`${API_URL}/getreplycomments/${getedLoginedVideo}`, {
              method: "POST",
              headers: {
                "Authorization": "Bearer " + jwt
              },
              body: {
                video: videoId
              }
            }).then((req) => req.json())
              .then((getedReplyComments) => {
                setReplyComments(getedReplyComments);

                console.log("yanıt yorumları bulundu.")
                setLoading(false)
                setModalLoading(false);
                setUndefinedVideo(false);
                console.log("finish loading")





              });





          });


      });

  }

  const onShare = async (inviteLink) => {
    Share.share(
      {
        message: `
          Hey! Ben QatarTube'da bu videoyu çok beğendim! Seninle eğlencemi paylaşmak isterim!

          Video: ${inviteLink}
        `,
        title: 'QatarTube',
      },
      {
        excludedActivityTypes: [
          'com.apple.UIKit.activity.PostToWeibo',
          'com.apple.UIKit.activity.Print',
          'com.apple.UIKit.activity.CopyToPasteboard',
          'com.apple.UIKit.activity.AssignToContact',
          'com.apple.UIKit.activity.SaveToCameraRoll',
          'com.apple.UIKit.activity.AddToReadingList',
          'com.apple.UIKit.activity.PostToFlickr',
          'com.apple.UIKit.activity.PostToVimeo',
          'com.apple.UIKit.activity.PostToTencentWeibo',
          'com.apple.UIKit.activity.AirDrop',
          'com.apple.UIKit.activity.OpenInIBooks',
          'com.apple.UIKit.activity.MarkupAsPDF',
          'com.apple.reminders.RemindersEditorExtension',
          'com.apple.mobilenotes.SharingExtension',
          'com.apple.mobileslideshow.StreamShareService',
          'com.linkedin.LinkedIn.ShareExtension',
          'pinterest.ShareExtension',
          'com.google.GooglePlus.ShareExtension',
          'com.tumblr.tumblr.Share-With-Tumblr',
          'net.whatsapp.WhatsApp.ShareExtension', //WhatsApp
        ],
      }
    );
  };

  const likeVideo = () => {
    setLoading(true);

    //Alert.alert("like")

    //console.log(videoId)

    axios.put(`${API_URL}/like`, { videoId: videoId, userId: userId }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwt
      }
    }).then((res) => {
      updateInfos(videoId);

      //console.log(res.data);

      if (!res.data.message) {

      } else {
        //alert("Video zaten beğenildi. ");
      }

    })

  }

  const unlikeVideo = () => {
    setLoading(true);

    //Alert.alert("unlike")

    axios.put(`${API_URL}/unlike`, { videoId: videoId, userId: userId }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwt
      }
    }).then((res) => {
      updateInfos(videoId);

      //console.log(res.data);

      if (!res.data.message) {

      } else {
        //alert("Video zaten beğenildi. ");
      }

    })

  }

  const dislikeVideo = () => {
    setLoading(true);

    //Alert.alert("dislike")

    axios.put(`${API_URL}/dislike`, { videoId: videoId, userId: userId }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwt
      }
    }).then((res) => {
      updateInfos(videoId);

      //console.log(res.data);

      if (!res.data.message) {

      } else {
        //alert("Video zaten beğenildi. ");
      }

    })

  }

  const undislikeVideo = () => {
    setLoading(true);

    //Alert.alert("undislike")

    axios.put(`${API_URL}/undislike`, { videoId: videoId, userId: userId }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwt
      }
    }).then((res) => {
      updateInfos(videoId);

      //console.log(res.data);

      if (!res.data.message) {

      } else {
        //alert("Video zaten beğenildi. ");
      }

    })

  }



  const addComment = () => {
    axios.post(`${API_URL}/addcomment`, { videoId: videoId, text: commentText }, {
      headers: {
        "Authorization": "Bearer " + jwt
      }
    })
      .then((result) => {
        //console.log(result.data);

        updateInfos(videoId);
      })
  }

  const likeComment = (commentId) => {
    axios.put(`${API_URL}/likecomment`, { commentId: commentId, userId: userId }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwt
      }
    }).then((res) => {

      //console.log(res.data)

      if (res.data.message) {
        updateInfos(videoId);

      } else {

      }

    })

  }

  const unlikeComment = (commentId) => {
    axios.put(`${API_URL}/unlikecomment`, { commentId: commentId, userId: userId }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwt
      }
    }).then((res) => {
      updateInfos(videoId);

      if (!res.data.message) {

      } else {
        //alert("Video zaten beğenildi. ");
      }

    })

  }

  const dislikeComment = (commentId) => {
    axios.put(`${API_URL}/dislikecomment`, { commentId: commentId, userId: userId }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwt
      }
    }).then((res) => {
      updateInfos(videoId);

      if (!res.data.message) {

      } else {
        //alert("Video zaten beğenildi. ");
      }

    })
  }

  const undislikeComment = (commentId) => {
    axios.put(`${API_URL}/undislikecomment`, { commentId: commentId, userId: userId }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwt
      }
    }).then((res) => {
      updateInfos(videoId);

      if (!res.data.message) {

      } else {
        //alert("Video zaten beğenildi. ");
      }

    })
  }

  function likeReplyComment(replyCommentId) {
    setLoading(true);
    setModalLoading(true);

    console.log("clicked like. ");

    axios.put(`${API_URL}/likereplycomment`, { replyCommentId: replyCommentId, userId: userId }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwt
      }
    })
      .then((res) => {
        setLoading(true);
        setModalLoading(true);


        console.log("sended.");
        console.log(res.data)
        updateInfos(videoId);

      }).catch((err) => alert(err))
  }

  function dislikeReplyComment(replyCommentId) {
    setLoading(true);
    setModalLoading(true);

    console.log("clicked dis. ");

    axios.put(`${API_URL}/dislikereplycomment`, { replyCommentId: replyCommentId, userId: userId }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwt
      }
    })
      .then((res) => {
        setLoading(true);
        setModalLoading(true);


        console.log("sended.");
        console.log(res.data)
        updateInfos(videoId);

      }).catch((err) => alert(err))
  }

  function undislikeReplyComment(replyCommentId) {
    setLoading(true);
    setModalLoading(true);

    console.log("clicked. undis ");

    axios.put(`${API_URL}/undislikereplycomment`, { replyCommentId: replyCommentId, userId: userId }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwt
      }
    })
      .then((res) => {
        setLoading(true);
        setModalLoading(true);


        console.log("sended.");
        console.log(res.data)
        updateInfos(videoId);

      }).catch((err) => alert(err))
  }





  function unlikeReplyComment(replyCommentId) {
    setLoading(true);
    setModalLoading(true);

    console.log("clicked. unlike");

    axios.put(`${API_URL}/unlikereplycomment`, { replyCommentId: replyCommentId, userId: userId }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwt
      }
    })
      .then((res) => {
        setLoading(true);
        setModalLoading(true);


        console.log("sended.");
        console.log(res.data)
        updateInfos(videoId);

      }).catch((err) => alert(err))
  }



  return (
    <View>
      <Loading textContent="Yükleniyor, lütfen bekleyiniz..." altTextContent="Bu işlem biraz uzun sürebilir!"  visible={isLoading} />
      <ScrollView nestedScrollEnabled = {true}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              setLoading(true);
              updateInfos(videoId)
            }}
          />
        }>



        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Yorumları Kapat</Text>
                </Pressable>

                <Text onPress={() => {
                  setModalVisible(true)

                }} style={{ fontSize: 24, fontWeight: 'bold' }}>Yorumlar</Text>

                <View style={{ flexDirection: 'row' }}>
                  <TextInput onChangeText={(text) => setCommentText(text)} returnKeyType="send" onSubmitEditing={() => addComment()} style={{ width: (window.width / 100) * 70 }} placeholder="Yorum yapın!" />
                  <Button type="submit" style={{ width: (window.width / 100) * 30 }} onPress={() => {
                    addComment()
                  }}>Ekle</Button>
                </View>

                <ScrollView nestedScrollEnabled = {true} style={{ width: window.width }}>
                  <Text>{"\n"}</Text>


                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>

        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={replyModalVisible}
            onRequestClose={() => {
              setReplyModalVisible(!replyModalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <Loading textContent="Yükleniyor, lütfen bekleyiniz..." altTextContent="Bu işlem biraz uzun sürebilir!"  visible={modalLoading} />

              <View style={styles.modalView}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setReplyModalVisible(!replyModalVisible)}
                >
                  <Text style={styles.textStyle}>Yanıtları Kapat</Text>
                </Pressable>

                <Text>{"\n"}</Text>

                {
                  replyComment ? <View>

                    <View style={{ width: window.width }} key={replyComment._id}>

                      <View style={{ flexDirection: 'row', textAlign: 'center' }}>
                        <Image source={{ uri: replyComment.postedBy.pic }} style={{ width: 50, height: 50 }} />
                        <Text>{replyComment.postedBy.name}</Text>

                        <Text style={{ marginTop: 20, marginLeft: -50 }}>{replyComment.text}</Text>
                      </View>

                    </View>

                  </View> : <></>
                }

                <Text onPress={() => {
                  setReplyModalVisible(true)

                }} style={{ fontSize: 24, fontWeight: 'bold' }}>Yanıtlar</Text>


                <ScrollView nestedScrollEnabled = {true} style={{ width: window.width }}>
                  <Text>{"\n"}</Text>


                  {
                    showReplysCommentId && replyComments ? <View>
                      {
                        replyComments.map(reply => {
                          return (
                            <View key={reply._id}>

                              {
                                reply.comment == showReplysCommentId ?
                                  <View>
                                    <View style={{ flexDirection: 'row', textAlign: 'center' }}>
                                      <Image source={{ uri: reply.postedBy.pic }} style={{ width: 50, height: 50 }} />
                                      <Text>{reply.postedBy.name}</Text>

                                      <Text style={{ marginTop: 20, marginLeft: -50 }}>{reply.text}</Text>
                                    </View>

                                    {
                                      reply ? <View style={{ flexDirection: 'row', marginLeft: 45 }}>

                                        {
                                          reply.likes.includes(userId) == true ? <AntDesign onPress={() => {
                                            console.log("clicked unlike. ");
                                          
                                            unlikeReplyComment(reply._id);

                                            setLoading(true);
                                            setModalLoading(true);
                                            
                                        
                                          }} style={{ marginRight: 15, marginLeft: 5 }} color="white" size={16} name="like1" /> : <AntDesign onPress={() => {
                                            console.log("clicked like. ");
                                            
                                            likeReplyComment(reply._id)

                                            setLoading(true);
                                            setModalLoading(true);
                                            
                                        
                                          }} style={{ marginRight: 15, marginLeft: 5 }} color="white" size={16} name="like2" />
                                        }


                                        {
                                          reply.dislikes.includes(userId) == true ? <AntDesign onPress={() => {
                                            console.log("clicked undislike. ");
                                       
                                            undislikeReplyComment(reply._id)

                                            setLoading(true);
                                            setModalLoading(true);
                                            
                                        
                                          }} style={{ marginLeft: 15 }} color="white" size={16} name="dislike1" /> : <AntDesign onPress={() => {
                                            console.log("clicked dislike. ");

                                            dislikeReplyComment(reply._id)
                                            
                                            setLoading(true);
                                            setModalLoading(true);
                                            
                                        
                                          }} style={{ marginLeft: 15 }} color="white" size={16} name="dislike2" />
                                        }

                                      </View> : <></>
                                    }

                                    <View style={{ flexDirection: 'row', marginLeft: 45, fontSize: 5 }}>
                                      <Text>{"\n"}</Text>
                                      <Text style={{ marginRight: -10, marginLeft: 5, fontSize: 12.5 }} color="white" >{reply.likes.length} Like</Text>
                                      <Text style={{ marginLeft: 15, marginRight: 15, fontSize: 12.5 }} color="white" >{reply.dislikes.length} Dislike</Text>

                                    </View>


                                    <Text>{"\n"}</Text>
                                    <View style={{ flex: 1, height: 1, backgroundColor: 'white' }} />
                                    <Text>{"\n"}</Text>


                                  </View>
                                  : <></>
                              }


                            </View>
                          )
                        })
                      }
                    </View> : <></>
                  }




                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>


        <View style={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center', flex: 1, width: window.width }}>
          <View style={{ height: window.height }}>
            <View style={{ width: window.width, backgroundColor: 'blue', height: (window.height / 100) * 35 }}>

              {
                videoInfos ? <View style={styles.container}>
                  <Video
                    ref={video}
                    style={styles.video}
                    source={{
                      uri: videoInfos.URL,
                    }}
                    useNativeControls
                    resizeMode="contain"
                    isLooping
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                  />
                </View>

                  :

                  <></>
              }


            </View>
            {
              isLoading === true ? <Text>Yükleniyor... </Text> :
                <View>
                  {
                    videoInfos ?

                      <View style={{ width: window.width }}>
                        <Text style={{ fontSize: (window.width / 100) * 5, fontWeight: 'bold' }}>{videoInfos.title}</Text>
                        {showDesc ? <Text onPress={() => setShowDesc(false)}>{videoInfos.desc}</Text> : <Text onPress={() => setShowDesc(true)}>Açıklama</Text>}
                      </View>

                      :

                      <View><Text>{isLoading == true ? "true" : "false"}</Text></View>
                  }

                  {
                    videoInfos ? <View style={{ flexDirection: 'row' }}>

                      {
                        videoInfos.likes.includes(userId) == true ? <AntDesign onPress={unlikeVideo} style={{ marginRight: 15, marginLeft: 5 }} color="white" size={36} name="like1" /> : <AntDesign onPress={likeVideo} style={{ marginRight: 15, marginLeft: 5 }} color="white" size={36} name="like2" />
                      }


                      {
                        videoInfos.dislikes.includes(userId) == true ? <AntDesign onPress={undislikeVideo} style={{ marginLeft: 15 }} color="white" size={36} name="dislike1" /> : <AntDesign onPress={dislikeVideo} style={{ marginLeft: 15 }} color="white" size={36} name="dislike2" />
                      }

                    </View> : <></>
                  }

                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ marginRight: 15, marginLeft: 5 }} color="white" >{videoInfos.likes.length} Like</Text>
                    <Text style={{ marginLeft: 15 }} color="white" >{videoInfos.dislikes.length} Like</Text>

                  </View>

                  {/* comments ? replyComments ? <Comments comments={comments} replyComments={replyComments} /> : <></> : <></> */}

                  {
                    comments ?

                      <View style={{ width: window.width, height: (window.height / 100) * 45 }}>
                        <Text onPress={() => {
                          setModalVisible(true)

                        }} style={{ fontSize: 24, fontWeight: 'bold' }}>Yorumlar</Text>

                        <View style={{ flexDirection: 'row' }}>
                          <TextInput onChangeText={(text) => setCommentText(text)} returnKeyType="send" onSubmitEditing={() => addComment()} style={{ width: (window.width / 100) * 70 }} placeholder="Yorum yapın!" />
                          <Button type="submit" style={{ width: (window.width / 100) * 30 }} onPress={() => {
                            addComment()
                          }}>Ekle</Button>
                        </View>

                        <View>
                          <ScrollView nestedScrollEnabled = {true}>
                            <Text>{"\n"}</Text>

                            {
                              comments.map((comment) => {
                                //console.log("comment", comment)

                                return (
                                  <View style={{}} key={comment._id}>

                                    <View style={{ flexDirection: 'row', textAlign: 'center' }}>
                                      <Image source={{ uri: comment.postedBy.pic }} style={{ width: 50, height: 50 }} />
                                      <Text>{comment.postedBy.name}</Text>

                                      <Text style={{ marginTop: 20, marginLeft: -50 }}>{comment.text}</Text>
                                    </View>

                                    {
                                      comment ? <View style={{ flexDirection: 'row', marginLeft: 45 }}>

                                        {
                                          comment.likes.includes(userId) == true ? <AntDesign onPress={() => unlikeComment(comment._id)} style={{ marginRight: 15, marginLeft: 5 }} color="white" size={16} name="like1" /> : <AntDesign onPress={() => likeComment(comment._id)} style={{ marginRight: 15, marginLeft: 5 }} color="white" size={16} name="like2" />
                                        }


                                        {
                                          comment.dislikes.includes(userId) == true ? <AntDesign onPress={() => undislikeComment(comment._id)} style={{ marginLeft: 15 }} color="white" size={16} name="dislike1" /> : <AntDesign onPress={() => dislikeComment(comment._id)} style={{ marginLeft: 15 }} color="white" size={16} name="dislike2" />
                                        }

                                      </View> : <></>
                                    }

                                    <View style={{ flexDirection: 'row', marginLeft: 45, fontSize: 5 }}>
                                      <Text>{"\n"}</Text>
                                      <Text style={{ marginRight: -10, marginLeft: 5, fontSize: 12.5 }} color="white" >{comment.likes.length} Like</Text>
                                      <Text style={{ marginLeft: 15, marginRight: 15, fontSize: 12.5 }} color="white" >{comment.dislikes.length} Dislike</Text>
                                      <Button onPress={() => { console.log("show reply modal"); setReplyComment(comment); setReplyCommentId(comment._id); setReplyModalVisible(true) }} >{comment.replys.length} Yanıt</Button>

                                    </View>


                                    <Text>{"\n"}</Text>
                                    <View style={{ flex: 1, height: 1, backgroundColor: 'white' }} />
                                    <Text>{"\n"}</Text>

                                  </View>

                                )
                              })}
                          </ScrollView>

                        </View>
                      </View>

                      :

                      <View>
                        <Text>No Comment</Text>

                      </View>
                  }
                </View>
            }
          </View>

        </View>


      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    position: 'absolute',
    top: 0
  },
  video: {
    alignSelf: 'center',
    width: window.width,
    height: (window.height / 100) * 35
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    width: window.width,
    height: (window.height / 100) * 80,
    backgroundColor: "black",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default function MainVideoScreen() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'video', title: 'Video', icon: () => <AntDesign size={16} name="infocirlceo" /> },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    video: VideoScreen,
  });

  return (
    <VideoScreen
    />
  );
};

/*
const [routes] = React.useState([
    { key: 'music', title: 'Ayrıntılar', icon: () => <AntDesign size={16} name="infocirlceo" /> },
    { key: 'albums', title: 'Katılımcılar', icon: () => <AntDesign size={20} name="adduser" /> },
    { key: 'recents', title: 'Ben', icon: () => <AntDesign size={20} name="user" /> },
  ]);
*/