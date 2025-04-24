import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function Cadastro() {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [tituloAlerta, setTituloAlerta] = useState("");
  const [mensagemAlerta, setMensagemAlerta] = useState("");
  const [sucesso, setSucesso] = useState(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "9207517684-mbo2a3nspcc4880e70f93ilken1ua43f.apps.googleusercontent.com",
    expoClientId: "9207517684-mbo2a3nspcc4880e70f93ilken1ua43f.apps.googleusercontent.com",
    useProxy: false,
  });

  const exibirAlertaPersonalizado = (titulo, mensagem, ehSucesso = true) => {
    setTituloAlerta(titulo);
    setMensagemAlerta(mensagem);
    setSucesso(ehSucesso);
    setMostrarAlerta(true);
  };

  const aoRegistrar = async () => {
    if (!nomeCompleto || !email || !senha) {
      exibirAlertaPersonalizado("Erro", "Preencha todos os campos.", false);
      return;
    }
    if (senha.length < 6) {
      exibirAlertaPersonalizado("Erro", "A senha deve ter ao menos 6 caracteres.", false);
      return;
    }

    try {
      const credencial = await createUserWithEmailAndPassword(auth, email, senha);
      const usuario = credencial.user;

      await setDoc(doc(db, "usuarios", usuario.uid), {
        uid: usuario.uid,
        nomeCompleto,
        email,
      });

      exibirAlertaPersonalizado("Sucesso", "Conta criada com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      if (error.code === "auth/email-already-in-use") {
        exibirAlertaPersonalizado("Erro", "Este e-mail já está em uso.", false);
      } else {
        exibirAlertaPersonalizado("Erro", `Erro ao criar conta: ${error.message}`, false);
      }
    }
  };

  useEffect(() => {
    const autenticarComGoogle = async () => {
      if (response?.type === "success") {
        const { id_token } = response.authentication;
        const credencial = GoogleAuthProvider.credential(id_token);
        const resultado = await signInWithCredential(auth, credencial);

        await setDoc(doc(db, "usuarios", resultado.user.uid), {
          uid: resultado.user.uid,
          nomeCompleto: resultado.user.displayName,
          email: resultado.user.email,
        });

        exibirAlertaPersonalizado("Sucesso", "Login com Google realizado!");
      }
    };

    autenticarComGoogle();
  }, [response]);

  return (
    <ImageBackground
      source={require("../assets/fundo_cadastro.png")}
      style={estilos.fundo}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={estilos.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={require("../assets/logo_toki.png")} style={estilos.logo} />

        <TextInput
          style={estilos.campo}
          placeholder="Nome completo"
          placeholderTextColor="#555"
          value={nomeCompleto}
          onChangeText={setNomeCompleto}
        />

        <TextInput
          style={estilos.campo}
          placeholder="E-mail"
          placeholderTextColor="#555"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={estilos.campo}
          placeholder="Senha"
          placeholderTextColor="#555"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <Pressable style={estilos.botaoGoogle} onPress={() => promptAsync()}>
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png",
            }}
            style={estilos.iconeGoogle}
          />
          <Text style={estilos.textoBotaoGoogle}>Continuar com Google</Text>
        </Pressable>

        <Pressable style={estilos.botao} onPress={aoRegistrar}>
          <Text style={estilos.textoBotao}>Criar conta</Text>
        </Pressable>
      </ScrollView>

      <AwesomeAlert
        show={mostrarAlerta}
        showProgress={false}
        title={tituloAlerta}
        message={mensagemAlerta}
        closeOnTouchOutside
        showConfirmButton
        confirmText="OK"
        confirmButtonColor={sucesso ? "#4BB543" : "#DD6B55"}
        onConfirmPressed={() => {
          setMostrarAlerta(false);
          if (sucesso) {
            setNomeCompleto("");
            setEmail("");
            setSenha("");
            navigation.navigate('Login');
          }
        }}
      />
    </ImageBackground>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  container: {
    width: "100%",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 60,
  },
  logo: {
    width: 320,
    height: 320,
    resizeMode: "contain",
    marginBottom: -60,
    marginTop: 70,
  },
  campo: {
    position: 'relative',
    borderColor: "gray",
    borderWidth: 1,
    backgroundColor: "white",
    marginBottom: 20,
    width: 300,
    height: 40,
    paddingLeft: 10,
    borderRadius: 8,
    shadowColor: "#c1c1c1",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.8,
  },
  botao: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginBottom: 30,
    marginTop: 10,
    shadowColor: "#2c2dd7",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.8,
    borderColor: "#2c2dd7",
    borderWidth: 2,
  },
  textoBotao: {
    color: "#2c2dd7",
    fontSize: 16,
    fontWeight: "bold",
  },
  botaoGoogle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    marginBottom: 20,
  },
  iconeGoogle: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  textoBotaoGoogle: {
    fontSize: 16,
    color: "#444",
  },
});
