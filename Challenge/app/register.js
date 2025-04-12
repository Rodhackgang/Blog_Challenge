import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Modal } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Register = () => {
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [motdepasse, setMotdepasse] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalIcon, setModalIcon] = useState('checkmark-circle');
    const navigation = useNavigation();

    const showModal = (message, icon = 'checkmark-circle') => {
        setModalMessage(message);
        setModalIcon(icon);
        setModalVisible(true);
    };

    const handleRegister = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!nom || !email || !motdepasse || !confirmation) {
            showModal('Tous les champs sont obligatoires', 'warning');
            return;
        }

        if (!emailRegex.test(email)) {
            showModal("L'email est invalide", 'warning');
            return;
        }

        if (motdepasse.length < 6) {
            showModal("Le mot de passe doit contenir au moins 6 caractères", 'warning');
            return;
        }

        if (motdepasse !== confirmation) {
            showModal("Les mots de passe ne correspondent pas", 'warning');
            return;
        }

        try {
            const response = await axios.post('http://192.168.100.16:5000/api/auth/register', {
                name: nom,
                email: email,
                password: motdepasse,
                password_confirmation: confirmation,
            });

            if (response.data) {
                await AsyncStorage.setItem('user', JSON.stringify({ nom, email }));
                showModal('Inscription réussie !', 'checkmark-circle');  
                setTimeout(() => {
                    setModalVisible(false);
                    navigation.navigate('login');
                }, 2000);
            } else {
                showModal(response.data.message || "Erreur lors de l'inscription", 'checkmark-circle');
                setTimeout(() => {
                    setModalVisible(false);
                    navigation.navigate('login');
                }, 2000);
            }
        } catch (error) {
            console.log(error.response?.data || error.message);
            showModal("Erreur serveur : " + (error.response?.data?.message || error.message), 'alert-circle');
        }
    };
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
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Entrez vos informations pour vous inscrire</Text>
            <ScrollView>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nom</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Entrez votre nom"
                        value={nom}
                        onChangeText={setNom}
                    />
                </View>

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

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Confirmer le mot de passe</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmez votre mot de passe"
                        secureTextEntry
                        value={confirmation}
                        onChangeText={setConfirmation}
                    />

                </View>

                <TouchableOpacity
                    onPress={handleRegister}
                    style={styles.primaryButton}>
                    <Text style={styles.buttonText}>S'inscrire</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Vous avez déjà un compte ? Se connecter</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#1e3a5a',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 30,
        textAlign: 'center',
        color: '#666',
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        color: '#333',
    },
    input: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    primaryButton: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '600',
    },
    secondaryButton: {
        marginTop: 25,
        padding: 10,
    },
    secondaryButtonText: {
        color: '#1e3a5a',
        textAlign: 'center',
        fontWeight: '600',
    },
    images: {
        width: 40,
        height: 40,
        borderRadius: 50,
    },
    headerlogo: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    logo: {
        fontSize: 24,
        fontWeight: 'bold',
        position: 'relative',
        color: 'black',
        textAlign: 'center',
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
});

export default Register;
