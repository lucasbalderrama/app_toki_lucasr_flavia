// ChatToki.js
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { auth, db } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";

const ChatToki = ({ navigation }) => {
  const [novaMensagem, setNovaMensagem] = useState('');
  const [listaMensagens, setListaMensagens] = useState([]);

  // Escuta as mensagens em tempo real
  useEffect(() => {
    const consulta = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(consulta, (snapshot) => {
      const mensagens = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setListaMensagens(mensagens);
    });
    return unsubscribe;
  }, []);

  // Enviar mensagem
  const enviarMensagem = async () => {
    if (novaMensagem.trim() === "") return;
    await addDoc(collection(db, "messages"), {
      text: novaMensagem.trim(),
      createdAt: new Date(),
      userId: auth.currentUser.uid,
      userEmail: auth.currentUser.email,
    });
    setNovaMensagem('');
  };

  // Função para sair do chat
  const sairDoChat = () => {
    signOut(auth)
      .then(() => {
        // Redireciona para a tela de login após sair
        navigation.navigate("Login");
      })
      .catch((error) => {
        console.error("Erro ao sair do chat:", error);
      });
  };

  // Renderiza as bolhas de mensagem
  const bolhaMensagem = ({ item }) => {
    const ehMinha = item.userId === auth.currentUser.uid;
    return (
      <View style={[estilos.bolha, ehMinha ? estilos.minhaBolha : estilos.bolhaAlheia]}>
        <Text style={estilos.usuario}>{item.userEmail}</Text>
        <Text style={estilos.texto}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={estilos.container} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={90}>
      <View style={estilos.cabecalho}>
        <Text style={estilos.titulo}>Chat Toki</Text>
        <Pressable onPress={sairDoChat} style={estilos.botaoSair}>
          <Text style={estilos.textoBotaoSair}>Sair</Text>
        </Pressable>
      </View>

      <FlatList
        data={listaMensagens}
        renderItem={bolhaMensagem}
        keyExtractor={item => item.id}
        contentContainerStyle={estilos.lista}
      />

      <View style={estilos.rodape}>
        <TextInput
          style={estilos.inputMensagem}
          placeholder="Digite sua mensagem..."
          value={novaMensagem}
          onChangeText={setNovaMensagem}
        />
        <Pressable style={estilos.botaoEnviar} onPress={enviarMensagem}>
          <Text style={estilos.textoBotaoEnviar}>Enviar</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  cabecalho: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ececec",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  botaoSair: {
    padding: 8,
  },
  textoBotaoSair: {
    fontSize: 14,
    color: "#d00",
  },
  lista: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bolha: {
    marginVertical: 6,
    padding: 10,
    borderRadius: 16,
    maxWidth: "75%",
  },
  minhaBolha: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  bolhaAlheia: {
    backgroundColor: "#f1f0f0",
    alignSelf: "flex-start",
  },
  usuario: {
    fontSize: 10,
    color: "#555",
    marginBottom: 4,
  },
  texto: {
    fontSize: 16,
    color: "#333",
  },
  rodape: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ececec",
    backgroundColor: "#fff",
  },
  inputMensagem: {
    flex: 1,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 12,
    backgroundColor: "#f9f9f9",
  },
  botaoEnviar: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#007AFF",
    borderRadius: 20,
  },
  textoBotaoEnviar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ChatToki ;
