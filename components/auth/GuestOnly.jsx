import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import ThemedLoader from "../ui/ThemedLoader";

const GuestOnly = ({ children }) => {
  const { user, authChecked } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!authChecked) return;
    if (user) {
      router.replace("/postAuth");  
    }
  }, [authChecked, user?.id]);

  if (!authChecked) return <ThemedLoader />;
  if (user) return null;

  return children;
};

export default GuestOnly;
