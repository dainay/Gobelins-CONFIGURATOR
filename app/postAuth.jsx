import { useRouter } from "expo-router";
import { useEffect } from "react";
import ThemedLoader from "../components/ui/ThemedLoader";
import { useUser } from "../hooks/useUser";
import { loadGobelinFromDatabase } from "../src/lib/saveGobelin";
import { useGobelinStore } from "../src/store/gobelinStore";

export default function PostAuth() {
  const router = useRouter();
  const { user, authChecked } = useUser();
  const setConfig = useGobelinStore((s) => s.setConfig);
  useEffect(() => {
    let cancelled = false;

    console.log("PostAuth: authChecked =", authChecked, "user =", user);

    async function run() {
      if (!authChecked) return;

      if (!user) {
        router.replace("/(auth)/index");
        return;
      }

      const gobelinData = await loadGobelinFromDatabase(user.id);
      if (cancelled) return;

      if (gobelinData) {
        setConfig(gobelinData);
        router.replace("/(dashboard)/openWorld");
      } else {
        router.replace("/(intro)/intro");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [authChecked, user?.id]);

  return <ThemedLoader />;
}
