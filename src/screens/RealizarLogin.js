// Lucas Randal N°18
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../../firebaseConfig';

const RealizarLogin = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const tentarLogar = () => {
        const auth = getAuth(app);
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigation.navigate('FeedToki')
            })
            .catch(error => {
                console.error('Login failed:', error);
            })
    }

    const redirecionarCadastro = () => {
        navigation.navigate("CadastroUsuario")
    }
    return (
        <ImageBackground source={require('../assets/fundo_cadastro.png')} style={styles.background}>
            <View style={styles.container}>
                <Image
                    style={styles.logo}
                    source={require('../assets/logo_toki.png')}
                />
                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    onChangeText={setEmail}
                    value={email}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    secureTextEntry={true}
                    onChangeText={setPassword}
                    value={password}
                />
                <TouchableOpacity style={styles.button} onPress={tentarLogar}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.textCadastro}>
                <TouchableOpacity onPress={redirecionarCadastro}>
                    <Text style={styles.linkCadastro}>
                        Não tem uma conta? <Text style={styles.linkDestacado}>Cadastre-se</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    logo: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
        marginBottom: -50,
        marginTop: 50,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        backgroundColor: 'white',
        marginBottom: 20,
        width: 300,
        paddingLeft: 10,
        borderRadius: 8,
        zIndex: 10,
        shadowColor: "#c1c1c1",
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0.8,
    },
    button: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 5,
        marginBottom: 50,
        marginTop: 20,
        shadowColor: "#2c2dd7",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.8,
        borderColor: '#2c2dd7',
        borderWidth: 2,
    },
    buttonText: {
        color: '#2c2dd7',
        fontSize: 16,
        fontWeight: 'bold',
    },
    textCadastro: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        width: '100%',
        height: 30,
    },

    linkCadastro: {
        fontSize: 16,
        color: '#000',
    },

    linkDestacado: {
        color: '#2c2dd7',
        textDecorationLine: 'underline',
    },
});

export default RealizarLogin;