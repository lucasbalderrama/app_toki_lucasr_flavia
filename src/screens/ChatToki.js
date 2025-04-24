//Flávia Glenda Guimarães Carvalho N°04
//Lucas Randal Abreu Balderrama N°18
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { auth, db } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { format } from "date-fns";
import Icon from "react-native-vector-icons/FontAwesome";

export default function ChatToki({ navigation }) {
  const [novaMensagem, setNovaMensagem] = useState("");
  const [listaMensagens, setListaMensagens] = useState([]);
  const [perfilUsuarios, setPerfilUsuarios] = useState({});

  useEffect(() => {
    const consulta = query(
      collection(db, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(consulta, (snapshot) => {
      const mensagens = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setListaMensagens(mensagens);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const ids = Array.from(new Set(listaMensagens.map((m) => m.userId)));
    ids.forEach(async (uid) => {
      if (!perfilUsuarios[uid]) {
        const snap = await getDoc(doc(db, "usuarios", uid));
        if (snap.exists()) {
          const data = snap.data();
          setPerfilUsuarios((prev) => ({
            ...prev,
            [uid]: {
              nome: data.nomeCompleto,
              photo: data.photoURL || "",
            },
          }));
        } else {
          setPerfilUsuarios((prev) => ({
            ...prev,
            [uid]: { nome: "Usuário", photo: "" },
          }));
        }
      }
    });
  }, [listaMensagens, perfilUsuarios]);

  const enviarMensagem = async () => {
    if (!novaMensagem.trim()) return;
    await addDoc(collection(db, "messages"), {
      text: novaMensagem.trim(),
      createdAt: new Date(),
      userId: auth.currentUser.uid,
    });
    setNovaMensagem("");
  };

  const sairDoChat = () => {
    signOut(auth)
      .then(() => navigation.navigate("Login"))
      .catch(console.error);
  };

  const bolhaMensagem = ({ item }) => {
    const ehMinha = item.userId === auth.currentUser.uid;
    const perfil = perfilUsuarios[item.userId] || { nome: "Usuário", photo: "" };

    return (
      <View
        style={[
          estilos.bolha,
          ehMinha ? estilos.minhaBolha : estilos.bolhaAlheia,
        ]}
      >
        {perfil.photo ? (
          <Image source={{ uri: perfil.photo }} style={estilos.fotoPerfil} />
        ) : (
          <View style={estilos.fotoPerfil} />
        )}

        <View style={estilos.mensagemContainer}>
          <Text style={[estilos.usuario, { color: "#d5e7ff" }]}>{perfil.nome}</Text>
          <Text style={[estilos.texto, { color: "#fff" }]}>{item.text}</Text>
          <Text style={[estilos.horario, { color: "#fff" }]}>
            {format(item.createdAt.toDate(), "HH:mm")}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={estilos.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <View style={estilos.cabecalho}>
        <Pressable onPress={sairDoChat} style={estilos.iconeVoltar}>
          <Icon name="chevron-left" size={20} color="#333" />
        </Pressable>

        <Text style={estilos.titulo}>Chat</Text>

        <Image
          source={require("../../src/assets/logo_toki.png")}
          style={estilos.logo}
          resizeMode="contain"
        />
      </View>

      <FlatList
        data={listaMensagens}
        renderItem={bolhaMensagem}
        keyExtractor={(item) => item.id}
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
}

const estilos = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F2F2F7",
    },
    cabecalho: {
      height: 60,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      backgroundColor: "#fff",
      borderBottomWidth: 1,
      borderColor: "#e0e0e0",
      position: "relative", 
    },
    iconeVoltar: {
      padding: 8,
      zIndex: 1,
    },
    titulo: {
      position: "absolute",
      left: 0,
      right: 0,
      textAlign: "center",
      fontSize: 20,
      fontWeight: "bold",
      color: "#333",
    },
    logo: {
      width: 120,
      height: 120,
      resizeMode: "contain",
    },
  lista: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bolha: {
    marginVertical: 4,
    flexDirection: "row",
    alignItems: "flex-start",
    maxWidth: "90%",
  },
  minhaBolha: {
    backgroundColor: "#2c2dd7",
    borderRadius: 20,
    padding: 8,
    alignSelf: "flex-end",
    marginLeft: "auto",
  },
  bolhaAlheia: {
    backgroundColor: "#aca9a9",
    borderRadius: 20,
    padding: 8,
    alignSelf: "flex-start",
    marginRight: "auto",
  },
  fotoPerfil: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    backgroundColor: "#ccc",
  },
  mensagemContainer: {
    flexShrink: 1,
  },
  usuario: {
    fontSize: 11,
    marginBottom: 4,
  },
  texto: {
    fontSize: 14,
  },
  horario: {
    fontSize: 11,
    textAlign: "right",
    marginTop: 4,
  },
  rodape: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  inputMensagem: {
    flex: 1,
    height: 44,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 22,
    paddingLeft: 14,
    marginRight: 8,
  },
  botaoEnviar: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 22,
  },
  textoBotaoEnviar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
