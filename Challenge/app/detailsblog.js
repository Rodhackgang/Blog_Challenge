import React, { useState, useRef, useEffect } from "react";
import { ScrollView, Text, View, Modal, Image, TouchableOpacity, StyleSheet, Animated, Button } from "react-native";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import LottieView from 'lottie-react-native';
import { BlurView } from 'expo-blur';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';


export default function Detailsblog() {
  const route = useRoute();
  const { articleData } = route.params;
  const { title, image, views, likes, description, authorName, authorDescription, tags, createdAt } = articleData;
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-1000)).current;
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [themes, setThemes] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState('');

  const tagsArray = typeof tags === 'string' ? tags.split(',') : tags || [];

  useEffect(() => {
    const checkConnection = async () => {
      const connectionStatus = await AsyncStorage.getItem('isConnected');
      const email = await AsyncStorage.getItem('userEmail');
      if (connectionStatus === 'true') {
        setIsConnected(true);
        setUserName(email);
      }
    };
    checkConnection();
    fetchThemes();
  }, []);
  const fetchThemes = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.get('http://192.168.100.16:5000/api/articles/tags-info', {
        headers: {
          Authorization: `${token}`
        }
      });
      setThemes(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des tags", error);
    }
  };
  const login = () => {
    navigation.navigate('login')
  }


  const handleDeletePress = () => {
    setIsModalVisible(true);
  };
  const handleConfirmDelete = () => {
    setIsModalVisible(false);
    setIsDeleted(true);
  };
  const handleCancelDelete = () => {
    setIsModalVisible(false);
  };
  const modifblog = () => {
    navigation.navigate('modifblog')
  }

  const handleLogout = async () => {
    await AsyncStorage.removeItem('isConnected');
    await AsyncStorage.removeItem('userName');
    await AsyncStorage.removeItem('userToken');
    setIsConnected(false);
    setUserName('');
  };


  const toggleMenu = () => {
    if (isMenuVisible) {
      Animated.timing(slideAnim, {
        toValue: -1000,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    setIsMenuVisible(!isMenuVisible);
  };
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.menuContainer,
          {
            transform: [{ translateX: slideAnim }],
            zIndex: 1000,
          }
        ]}
      >
        <BlurView
          intensity={90}
          tint="light"
          style={styles.blurContainer}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={toggleMenu}
          >
            <EvilIcons name="close" size={30} color="black" />
          </TouchableOpacity>

          <Text style={styles.menuTitle}>Recherchez par thème</Text>

          {themes && themes.tags && Object.keys(themes.tags).length > 0 ? (
            Object.keys(themes.tags).map((tag, index) => (
              <View key={index} style={styles.themeItem}>
                <Text style={styles.themeName}>{tag}</Text>
                <Text style={styles.themeCount}>
                  {themes.tags[tag].count} {themes.tags[tag].count > 1 ? "articles" : "article"}
                </Text>
                <EvilIcons name="search" size={24} color="black" />
              </View>
            ))
          ) : (
            <View style={styles.authMessageContainer}>
              <EvilIcons name="lock" size={40} color="#4a90e2" />
              <Text style={styles.authMessageText}>
                Vous devez être connecté pour accéder aux thèmes
              </Text>
              <TouchableOpacity
                onPress={login}
                style={styles.authButton}
              >
                <Text style={styles.authButtonText}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          )}

        </BlurView>
        <View style={styles.bottomBlur}>
          <BlurView
            intensity={100}
            tint="light"
            style={styles.fullBlur}
          />
        </View>
      </Animated.View>
      <View style={styles.header}>
        {isConnected ? (
          <>
            <Text style={styles.userInitial}>{userName ? userName.charAt(0).toUpperCase() : ''}</Text>
            <Text style={styles.logo}>Kimbiiz</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Se déconnecter</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Image source={require('../assets/images/kimbizlogo.png')} style={styles.images} />
            <Text style={styles.logo}>Kimbiiz</Text>
            <TouchableOpacity onPress={login} style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Me connecter</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
        <View style={styles.tagsContainer}>
          {tagsArray.length > 0 ? (
            tagsArray.map((tag, index) => (
              <TouchableOpacity key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag.trim()}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noTagsText}>Aucun tag</Text>
          )}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.articleTitle}>
            {title}
          </Text>

          <Text style={{ marginLeft: -7, fontStyle: 'italic' }}>  {new Date(createdAt).toLocaleDateString()}</Text>
        </View>

        <Image
          source={image ? { uri: image } : require('../assets/images/1.jpeg')}
          style={styles.mainImage}
        />
        <View style={styles.likecontainer}>
          <AntDesign name="eyeo" size={24} color="black" />
          <Text style={styles.text}>
            {views}
          </Text>
          <AntDesign name="like2" size={24} color="black" style={styles.icon} />
          <Text style={styles.text}>
            {likes}
          </Text>
        </View>
        <Text style={styles.articleTitles}>
          {title}
        </Text>
        <Text style={styles.articleContent}>
          {description}
        </Text>
        <View style={styles.authorContainer}>
          <Text style={styles.userInitial}>{authorName ? authorName.charAt(0).toUpperCase() : ''}</Text>
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}> {authorName}</Text>
            <Text style={styles.authorTitle}>{authorDescription}</Text>
          </View>
        </View>
        <View style={styles.hrline}></View>
        <Text style={styles.texts}>Partager l'article</Text>
        <View style={styles.iconsContainer}>
          <FontAwesome name="linkedin" size={30} color="blue" style={styles.icon} />
          <FontAwesome name="twitter" size={30} color="skyblue" style={styles.icon} />
          <FontAwesome name="facebook" size={30} color="blue" style={styles.icon} />
        </View>
        <View style={styles.hrline}></View>
        <View style={styles.buttons}>
          {userName === authorName ? (
            <>
              <TouchableOpacity onPress={modifblog} style={styles.editButton}>
                <Text style={styles.editButtonText}>Modifier l'article</Text>
                <AntDesign name="edit" size={18} color="black" style={styles.icon} />
              </TouchableOpacity>

              {!isDeleted ? (
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePress}>
                  <Text style={styles.deleteButtonText}>Supprimer l'article</Text>
                  <FontAwesome name="trash" size={18} color="red" style={styles.icon} />
                </TouchableOpacity>
              ) : (
                <View style={styles.confirmationMessage}>
                  <Text style={styles.confirmationText}>L'article a été supprimé avec succès !</Text>
                </View>
              )}
            </>
          ) : (
            <TouchableOpacity style={styles.reportButton}>
              <Text style={styles.reportButtonText}>Signaler ce post</Text>
              <EvilIcons name="exclamation" size={24} color="red" style={styles.icon} />
            </TouchableOpacity>
          )}

          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleCancelDelete}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Voulez-vous vraiment supprimer cet article ?</Text>
                <View style={styles.modalButtons}>
                  <Button title="Annuler" onPress={handleCancelDelete} />
                  <Button title="OK" onPress={handleConfirmDelete} color="red" />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>

      <TouchableOpacity onPress={toggleMenu} style={styles.lottieContainer}>
        <LottieView
          source={require('../assets/Animation/search.json')}
          style={styles.lottie}
          autoPlay
          loop
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    position: 'relative',
    right: 25,
    color: "black",
  },
  loginButton: {
    backgroundColor: "#4a90e2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  searchContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    flex: 0.95,
    paddingLeft: 35
  },
  searchicon: {
    position: 'relative',
    left: 27
  },
  mainImage: {
    width: '90%',
    height: 250,
    borderRadius: 15,
    marginBottom: 25,
    margin: 10
  },
  images: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  blogcontainer: {
    margin: 15
  },
  blogtitle: {
    fontStyle: 'normal',
    fontSize: 24,
    fontWeight: 'bold',
  },
  blogdescription: {
    fontStyle: 'normal',
    fontSize: 15,
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '80%',
    height: '90%',
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    backgroundColor: 'rgba(236, 236, 236, 0.9)',
    overflow: 'hidden'
  },
  blurContainer: {
    flex: 1,
    padding: 20,
    height: '100%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  themeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  themeName: {
    fontSize: 16,
  },
  themeCount: {
    fontSize: 14,
    color: '#666',
  },
  bottomBlur: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    overflow: 'hidden',
  },
  fullBlur: {
    flex: 1,
  },
  lottieContainer: {
    position: 'absolute',
    bottom: 320,
    left: '90%',
    transform: [{ translateX: 25 }],
    zIndex: 999,
    backgroundColor: 'blue',
    borderBottomLeftRadius: 100,
    borderTopLeftRadius: 100,
  },
  lottie: {
    width: 200,
    height: 200,
    transform: [{ translateX: -120 }],
    overflow: 'hidden'
  },
  inlinedata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '45'
  },
  cardContainer: {
    flexDirection: 'row',
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderColor: '#e0e0e0',
    alignItems: 'center',
    margin: 7,
    marginRight: 10
  },
  textContainer: {
    flex: 1,
    marginRight: 15,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    margin: 5,
    width: '250'
  },
  articleTitles: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    margin: 5,
    width: '100%'
  },
  articleDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  articleContent: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    margin: 10
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    width: '100%',
    marginTop: '5'
  },
  tag: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
    fontSize: 12,
  },
  articleImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  likecontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginLeft: 15,
    position: 'relative',
    bottom: 10
  },
  text: {
    marginLeft: 5,
  },
  texts: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginLeft: 15
  },
  icon: {
    marginLeft: 20,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    margin: 15
  },
  authorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  authorTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  hrline: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginLeft: 20,
    marginRight: 20,
    marginVertical: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {
    marginHorizontal: 15,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    margin: 10,
    textAlign: 'center',
    justifyContent: 'center'
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#f44336',
    margin: 10,
    textAlign: 'center',
    justifyContent: 'center'
  },
  editButtonText: {
    color: 'black',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#f44336',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  confirmationMessage: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  confirmationText: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    margin: 10
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
    borderRadius: 10,
  },
  authMessageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  authMessageText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 15,
    color: '#555',
  },
  authButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  authButtonText: {
    color: 'white',
    fontWeight: '600',
  },

  userInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#4a90e2',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    alignContent: 'center',
    marginRight: 12,
    marginLeft: -5,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#f44336',
    margin: 10,
    justifyContent: 'center',
    textAlign: 'center',
  },

  reportButtonText: {
    color: '#f44336',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  }
});
