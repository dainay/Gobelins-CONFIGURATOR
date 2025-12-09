import { useRouter } from "expo-router";
import { useUser } from "../../hooks/useUser";
import { useEffect } from "react";
import ThemedLoader from "../ui/ThemedLoader";

const GuestOnly = ({ children }) => {
  const { user, authChecked } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (authChecked && user) {
      router.replace("/(dashboard)/openWorld");
    }
  }, [authChecked, user, router]);


  if (!authChecked) {
    return <ThemedLoader />;
  }

  if (user) {
    return null;
  }

  return children;
};

export default GuestOnly;
