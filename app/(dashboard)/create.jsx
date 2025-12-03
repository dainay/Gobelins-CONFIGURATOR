import { StyleSheet, TouchableWithoutFeedback, Keyboard, Text } from "react-native";

import Spacer from "../../components/ui/Spacer";
import ThemedText from "../../components/ui/ThemedText";
import ThemedView from "../../components/ui/ThemedView";
import ThemedTextInput from "../../components/ui/ThemedTextInput";
import ThemedButton from "../../components/ui/ThemedButton";

import { useState } from "react";
import { useGobelins } from "../../hooks/useGobelins";
import { useRouter } from "expo-router";

const Create = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [formation, setFormation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Guild, setGuild] = useState("");

  const [loading, setLoading] = useState(false);

  const { createGobelin } = useGobelins();
  const router = useRouter();

  const handleSubmit = async () => {
    if (
      !name.trim() ||
      !surname.trim() ||
      !formation.trim() ||
      !email.trim() ||
      !password.trim() ||
      !Guild.trim()
    ) {
      return;
    }

    setLoading(true);

    await createGobelin({
      name,
      surname,
      formation,
      email,
      password,
      Guild
    });

   
    setName("");
    setSurname("");
    setFormation("");
    setEmail("");
    setPassword("");
    setGuild("");
    setLoading(false);

    router.replace("/books");

  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ThemedText title={true} style={styles.heading}>
          Add a New Book
        </ThemedText>
        <Spacer />

        <ThemedTextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <Spacer height={10} />

        <ThemedTextInput
          placeholder="Surname"
          value={surname}
          onChangeText={setSurname}
        />
        <Spacer height={10} />
 

        <ThemedTextInput
          placeholder="Formation"
          value={formation}
          onChangeText={setFormation}
        />
        <Spacer height={10} />

        <ThemedTextInput
          placeholder="Email"
          value={email}
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <Spacer height={10} />

        <ThemedTextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        />
        <Spacer height={10} />

        <ThemedTextInput
          placeholder="Guild"
          value={Guild}
          onChangeText={setGuild}
        />
        <Spacer />

        
        <ThemedButton
          title="Create Gobelin"
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text>
            {loading ? "Saving..." : "Create Gobelin"}
          </Text>
        </ThemedButton>

      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default Create;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});
