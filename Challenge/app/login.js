import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image,Modal } from 'react-native'
import React, { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const Login = () => {
    const [email, setEmail] = useState('');
    const [motdepasse, setMotdepasse] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalIcon, setModalIcon] = useState('checkmark-circle');
    const navigation = useNavigation();

    const showModal = (message, icon = 'checkmark-circle') => {
        setModalMessage(message);
        setModalIcon(icon);
        setModalVisible(true);
    };

    const handleLogin = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !motdepasse) {
            showModal('Tous les champs sont obligatoires', 'warning');
            return;
        }

        if (!emailRegex.test(email)) {
            showModal("L'email est invalide", 'warning');
            return;
        }

        try {
            const response = await axios.post('http://192.168.100.16:5000/api/auth/login', {
                email: email,
                password: motdepasse,
            });

            if (response.data) {
                await AsyncStorage.setItem('userToken', response.data.token);
                await AsyncStorage.setItem('isConnected', 'true');
                await AsyncStorage.setItem('userEmail', email);
                showModal('Connexion réussie !', 'checkmark-circle');
                setTimeout(() => {
                    setModalVisible(false);
                    navigation.navigate('index'); 
                }, 2000);
            } else {
                showModal(response.data.message || "Erreur lors de la connexion", 'checkmark-circle');
                setTimeout(() => {
                    setModalVisible(false);
                    navigation.navigate('index'); 
                }, 2000);
            }
        } catch (error) {
            console.log(error.response?.data || error.message);
            showModal("Erreur serveur : " + (error.response?.data?.message || error.message), 'alert-circle');
        }
    };

    const register= ()=> {
        navigation.navigate('register')
   }
    return (
        <View style={styles.container}>
              <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Ionicons name={modalIcon} size={60} color={modalIcon === 'checkmark-circle' ? 'green' : 'orange'} />
                        <Text style={styles.modalText}>{modalMessage}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={styles.headerlogo}>
            <Image source={require('../assets/images/kimbizlogo.png')} style={styles.images} />
            <Text style={styles.logo}>Kimbiiz</Text>
            </View>
            <Text style={styles.title}>Connectez-vous</Text>
            <Text style={styles.subtitle}>Entrez vos identifiants pour accéder à votre compte</Text>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Entrez votre email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Mot de passe</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Entrez votre mot de passe"
                    secureTextEntry
                    value={motdepasse}
                    onChangeText={setMotdepasse}
                />
            </View>

            <TouchableOpacity onPress={handleLogin} style={styles.primaryButton}>
                <Text style={styles.buttonText}>Me connecter</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            onPress={register}
            style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Je n'ai pas de compte • Créer un compte</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#1e3a5a'
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 30,
        textAlign: 'center',
        color: '#666'
    },
    formGroup: {
        marginBottom: 20
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        color: '#333'
    },
    input: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd'
    },
    primaryButton: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 8,
        marginTop: 20
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '600'
    },
    secondaryButton: {
        marginTop: 25,
        padding: 10
    },
    secondaryButtonText: {
        color: '#1e3a5a',
        textAlign: 'center',
        fontWeight: '600'
    },
    images: {
        width: 40,
        height: 40,
        borderRadius: 50,
    },
    headerlogo:{
        justifyContent:'center',
        alignContent: 'center',
        alignItems:'center',
        textAlign: 'center'
    },
    logo: {
        fontSize: 24,
        fontWeight: "bold",
        position: 'relative',
        color: "black",
        textAlign: 'center'
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
        color: '#333',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: 'blue',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: '600',
        textAlign: 'center',
    },
})

export default Login