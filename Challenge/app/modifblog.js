import React, { useState, useRef } from "react";
import { ScrollView, Text, View, TextInput, Image, TouchableOpacity, StyleSheet, Animated, KeyboardAvoidingView, Platform, Modal } from "react-native";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import LottieView from 'lottie-react-native';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Markdown from 'react-native-markdown-display';

export default function Modifblog() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("5 bonnes pratiques sur ReactJS");
  const [titles, setTitles] = useState("React Js, Best Pratice, JWT");
  const [image, setImage] = useState(null);
  const [selectedThemes, setSelectedThemes] = useState(["ReactJS", "Best practices", "JWT"]);
  const [isPreview, setIsPreview] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-1000)).current;
  const [showModal, setShowModal] = useState(false);
  const [alignment, setAlignment] = useState('left');
  const [text, setText] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [notificationVisible, setNotificationVisible] = useState(false);

  const handleStyle = (style) => {
    let newText = text;
    switch (style) {
      case '**':
        newText = `**${text}**`;
        break;
      case '*':
        newText = `*${text}*`;
        break;
      case '![alt](url)':
        newText = `![Image](${text})`;
        break;
      case '<code>':
        newText = `<code>${text}</code>`;
        break;
      default:
        newText = text;
    }
    setContent(content + newText);
  };
  const handleInsertLink = () => {
    const formattedLink = `[${linkUrl}](${linkUrl})`;
    setContent(content + formattedLink);
    setShowLinkModal(false);
    setLinkUrl('');
  };

  const handleInsertImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageMarkdown = `![Image](${result.assets[0].uri})`;
      setContent(content + imageMarkdown);
    }
  };

  const handleCancel = () => {
    setShowModal(true);  
  };
  const handleConfirmCancel = () => {
    setShowModal(false); 
  };

  const handleSave = () => {
    setNotificationVisible(true); 
    setTimeout(() => {
      setNotificationVisible(false); 
    }, 3000);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
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
          <Image source={require('../assets/images/kimbizlogo.png')} style={styles.images} />
          <Text style={styles.logo}>Kimbiiz</Text>
          <View style={styles.blockcontainer}>
            <TouchableOpacity style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Déconnexion</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Nouvel Article +</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
          <View style={styles.inline}>
            <Text style={styles.modifarticle}>Modifier l'article: </Text>
            <Text style={styles.articletomodif}>Adipisicing quis mollit ipsum minim dolore reprehenderit labore et consectetur proident duis veniam esse. </Text>
          </View>
          <Text style={styles.modifarticle}>Titre de l'article:</Text>

          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Titre de l'article"
          />
          <View style={styles.hr} />
          <Text style={styles.modifarticle}>Thème de l'article:</Text>

          <TextInput
            style={styles.titleInput}
            value={titles}
            onChangeText={setTitles}
            placeholder="Theme de l'article"
          />
          <Text style={styles.separecomon}>Séparer les thèmes par une virgules </Text>
          <View style={styles.hr} />

          <Text style={styles.modifarticle}>Image d'illustration:</Text>

          <TouchableOpacity
            style={styles.dropZone}
            onPress={pickImage}
            activeOpacity={0.7}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            ) : (
              <View style={styles.dropContent}>
                <FontAwesome name="cloud-upload" size={40} color="#4a90e2" />
                <Text style={styles.dropText}>Cliquez pour choisir ou glissez et déposez</Text>
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.hr} />
          <Text style={styles.modifarticle}>Bio:</Text>
          <View style={styles.toolbar}>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.iconText}>📝</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => handleStyle('**')}>
              <Text style={styles.iconText}>𝐁</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => handleStyle('*')}>
              <Text style={styles.iconText}>𝐼</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => setShowLinkModal(true)}>
              <Text style={styles.iconText}>🔗</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleInsertImage}>
              <Text style={styles.iconText}>🖼️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => setAlignment('left')}>
              <Text style={styles.iconText}>⬅️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => setAlignment('right')}>
              <Text style={styles.iconText}>➡️</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.iconButton} onPress={() => handleStyle('<code>')}>
              <Text style={styles.iconText}>📄</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.hr} />
          {isPreview ? (
            <>
              <Markdown style={markdownStyles}>
                {content}
              </Markdown>

              <TouchableOpacity
                onPress={togglePreview}
                style={styles.previewButton}>
                <Text style={styles.previewButtonText}>
                  Retour à l'édition
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                style={[styles.inputs, { textAlign: alignment }]}
                multiline
                value={text}
                onChangeText={setText}
                placeholder="Commencez à écrire..."
                placeholderTextColor="#888"
                textAlignVertical="top"
              />
              <TouchableOpacity onPress={togglePreview} style={styles.previewButton}>
                <Text style={styles.previewButtonText}>{isPreview ? 'Retour à l\'édition' : 'Aperçu'}</Text>
              </TouchableOpacity>
            </>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.buttonTexts}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
          <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Voulez-vous vraiment annuler la publication de cet article ?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleConfirmCancel}>
                <Text style={styles.modalButtonText}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowModal(false)}>
                <Text style={styles.modalButtonText}>Non</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {notificationVisible && (
        <View style={styles.notification}>
          <Text style={styles.notificationText}>Article publié avec succès !</Text>
        </View>
      )}
          {showLinkModal && (
            <Modal
              visible={showLinkModal}
              animationType="slide"
              onRequestClose={() => setShowLinkModal(false)}
            >
              <View style={styles.modalContainer}>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Entrez l'URL du lien"
                  value={linkUrl}
                  onChangeText={setLinkUrl}
                />
                <TouchableOpacity onPress={handleInsertLink} style={styles.insertButton}>
                  <Text>Insérer le lien</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          )}

        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    padding: 15,
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 10,
  },
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
  link: {
    color: '#4a90e2',
    textDecorationLine: 'underline',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
  },
});

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
    right: 15,
    color: "black",
  },
  blockcontainer: {
    gap: 10,
  },
  modifarticle: {
    marginLeft: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
  articletomodif: {
    margin: 10,
    fontSize: 18,
    width: '100%',
  },
  loginButton: {
    backgroundColor: "#4a90e2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  logoutButton: {
    backgroundColor: "transparent",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    borderWidth: 1
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  logoutButtonText: {
    color: "black",
    fontWeight: "bold",
  },
  images: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  titleInput: {
    fontSize: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginVertical: 8,
    margin: 10
  },
  themeInput: {
    width: '100%',
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 8,
  },
  hr: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    marginVertical: 16,
    width: '100%',
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  themeInstruction: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginBottom: 8,
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
  inline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  separecomon: {
    fontSize: 16,
    marginLeft: 15
  },
  dropZone: {
    height: 150,
    margin: 15,
    borderWidth: 2,
    borderColor: '#4a90e2',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  dropContent: {
    alignItems: 'center',
    gap: 10,
  },
  dropText: {
    color: '#6c757d',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
  toolbar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    marginLeft: 15
  },
  iconButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    padding: 8,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#404040',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalInput: {
    width: '80%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
  },
  insertButton: {
    backgroundColor: '#4a90e2',
    padding: 10,
    borderRadius: 5,
  },
  inputs: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginVertical: 10,
    marginLeft: 15,
    marginRight: 15,
    height: 150,
    margin: 5
  },
  previewButton: {
    backgroundColor: '#4a90e2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
    margin: 15
  },
  previewButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  previewText: {
    fontSize: 16,
    lineHeight: 24,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    margin: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%'
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
  },
  saveButton: {
    backgroundColor: 'blue',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonTexts: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  notification: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  notificationText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

