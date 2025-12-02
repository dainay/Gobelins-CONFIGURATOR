import { useRouter } from "expo-router";
import { useUser } from "../../hooks/useUser";
import { useEffect } from "react";
import { Text } from "react-native";

import ThemedLoader from "../ThemedLoader";

const UserOnly = ({ children }) => {
  const { user, authChecked } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (authChecked && !user) {
      router.replace("/");
    }
  }, [authChecked, user, router]);


  if (!authChecked) {
    return  <ThemedLoader />;
  }

  if (!user) {
    return null;
  }

  return children;
};

export default UserOnly;
