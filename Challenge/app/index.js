import React, { useState, useRef, useEffect } from "react";
import { ScrollView, Text, View, TextInput, Image, TouchableOpacity, StyleSheet, Animated } from "react-native";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import LottieView from 'lottie-react-native';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function BlogScreen() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState('');
  const slideAnim = useRef(new Animated.Value(-1000)).current;
  const navigation = useNavigation();
  const [themes, setThemes] = useState({});
  const [articles, setArticles] = useState([]);

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
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.get('http://192.168.100.16:5000/api/articles/user-articles', {
        headers: {
          Authorization: `${token}`
        }
      });
      setArticles(response.data);
      const allArticles = [
        ...response.data.otherArticles,
        ...response.data.userArticles,
      ];
      setArticles(allArticles);
    } catch (error) {
      console.error("Erreur lors de la récupération des articles", error);
    }
  };


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
  const login = () => {
    navigation.navigate('login')
  }
  const goToDetails = (article) => {
    navigation.navigate('detailsblog', { articleData: article });
  };
  const truncateText = (text, length) => {
    if (text.length > length) {
      return text.substring(0, length) + '...';
    }
    return text;
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
        <View style={styles.searchContainer}>
          <EvilIcons name="search" size={24} color="black" style={styles.searchicon} />
          <TextInput style={styles.searchInput} placeholder="Rechercher" placeholderTextColor="#ccc" />
        </View>

        <View style={styles.blogcontainer}>
          <Text style={styles.blogtitle}>Blog</Text>
          <Text style={styles.blogdescription}>
            Acquérez de nouvelles connaissances et laissez-vous inspirer par des articles sur la tech rédigés par des experts et des professionnels de la programmation, du design, du devops, et bien d'autres domaines connexes.
          </Text>
        </View>

        <View>
          {articles && articles.length > 0 ? (
            articles.map((article, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => goToDetails(article)}
                style={styles.cardContainer}
              >
                <View style={styles.textContainer}>
                  <View style={styles.inlinedata}>
                    <Text style={styles.articleTitle}> {truncateText(article.title, 100)}</Text>
                    <Text style={styles.articleDate}>
                      {new Date(article.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.articleDescription}>
                    {truncateText(article.description, 120)}
                  </Text>
                  <View style={styles.tagsContainer}>
                    {article.tags && article.tags.length > 0 ? (
                      article.tags.map((tag, tagIndex) => (
                        <Text key={tagIndex} style={styles.tag}>{tag}</Text>
                      ))
                    ) : (
                      <Text style={styles.noTags}>Pas de tags disponibles</Text>
                    )}
                  </View>
                </View>
                <Image
                  source={{ uri: article.image }}
                  style={styles.articleImage}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noArticles}>Aucun article disponible</Text>
          )}

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
  },
  articleDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  articleDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
});
