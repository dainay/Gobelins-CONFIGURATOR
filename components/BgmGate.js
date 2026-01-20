import { usePathname, useSegments } from "expo-router";
import { useEffect, useRef } from "react";
import { useMusicStore } from "../src/store/musicStore";

export default function BgmGate() {
  const segments = useSegments(); // например ["(auth)", "login"] или []
  const pathname = usePathname(); // "/" , "/login" , "/Scene" ...
  const enabled = useMusicStore((s) => s.enabled);
  const applyTrack = useMusicStore((s) => s.applyTrack);

  const lastApplied = useRef("__init__");
  const timerRef = useRef(null);

  const group = segments[0]; // "(auth)", "(dashboard)", "(intro)", "(configurator)", "(test)" или undefined

  // --- RULES ---
  const isRootIndex = pathname === "/"; // app/index.jsx
  const isMusic1 = group === "(auth)" || isRootIndex;

  const isMusic2 =
    pathname === "/Scene" ||
    (group === "(test)" && segments[1] === "AnimationChoice");

  const isMusic3 = group === "(dashboard)";

  let desiredTrack = null;

  if (isMusic1)
    desiredTrack = "confBg"; // music1
  else if (isMusic2)
    desiredTrack = "confBg2"; // music2
  else if (isMusic3)
    desiredTrack = "mainBg"; // music3
  else desiredTrack = null;

  useEffect(() => {
    if (!enabled) return;

    if (lastApplied.current === desiredTrack) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      applyTrack(desiredTrack); // null => stop
      lastApplied.current = desiredTrack;
    }, 120);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [enabled, desiredTrack]);

  return null;
}
