import { Audio } from "expo-av"; // use expo-av Audio API

export const SOUNDS = {
  bgm: {
    confBg: require("../../assets/audio/gobelin/conf-bg.mp3"),
    confBg2: require("../../assets/audio/gobelin/conf-bg2.mp3"),
    mainBg: require("../../assets/audio/gobelin/main-bg.mp3"),
  },
  sfx: {
    laugh: require("../../assets/audio/gobelin/laugh.mp3"),
    roating: require("../../assets/audio/gobelin/roating.mp3"),
    speach: require("../../assets/audio/gobelin/speach.mp3"),
    scream: require("../../assets/audio/gobelin/scream.mp3"),
    hello: require("../../assets/audio/gobelin/hello.mp3"),
    scream2: require("../../assets/audio/gobelin/scream2.mp3"),
    chatting: require("../../assets/audio/gobelin/chatting.mp3"),
    suffering: require("../../assets/audio/gobelin/suffering.mp3"),
    stomach: require("../../assets/audio/gobelin/stomach.mp3"),
    suffering1: require("../../assets/audio/gobelin/suffering1.mp3"),
    // suffering2: require("../../assets/audio/gobelin/suffering2.mp3"),
    suffering3: require("../../assets/audio/gobelin/suffering3.mp3"),
    yay: require("../../assets/audio/gobelin/yay.mp3"),
    button: require("../../assets/audio/gobelin/button.mp3"),
  },
};

let bgmSound = null; // <- Audio.Sound
let bgmKey = null;
let sfxCache = new Map();

export async function initAudio() {
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
    shouldDuckAndroid: true,
  });
}

export async function playBgm(key, { volume = 0.25, loop = true } = {}) {
  const asset = SOUNDS.bgm[key];
  if (!asset) {
    console.warn("Unknown BGM:", key);
    return;
  }
  if (bgmSound && bgmKey === key) {
    await bgmSound.setIsLoopingAsync(loop);
    await bgmSound.setVolumeAsync(volume);
    const st = await bgmSound.getStatusAsync();
    if (!st.isPlaying) await bgmSound.playAsync();
    return;
  }

  await stopBgm();

  const { sound } = await Audio.Sound.createAsync(asset, {
    shouldPlay: true,
    isLooping: loop,
    volume,
  });

  bgmSound = sound;
  bgmKey = key;
}

export async function stopBgm() {
  if (!bgmSound) return;
  try {
    await bgmSound.stopAsync();
    await bgmSound.unloadAsync();
  } finally {
    bgmSound = null;
    bgmKey = null;
  }
}

export async function setBgmVolume(volume) {
  if (!bgmSound) return;
  await bgmSound.setVolumeAsync(volume);
}

export async function playSfx(key, { volume = 0.8 } = {}) {
  try {
    console.log("playSfx TRY PLAY SOUND:", key);
    const asset = SOUNDS.sfx[key];
    if (!asset) {
      console.warn("Unknown SFX:", key);
      return;
    }

    if (!sfxCache.has(key)) {
      const s = await Audio.Sound.createAsync(asset, {
        shouldPlay: false,
        volume,
      });
      sfxCache.set(key, s);
    }

    const sfx = sfxCache.get(key);
    await sfx.sound.setPositionAsync(0);
    await sfx.sound.playAsync();
  } catch (e) {
    console.log("playSfx error:", e);
  }
}

export async function stopSfx(key) {
  try {
    const sfx = sfxCache.get(key);
    if (!sfx) return;
    await sfx.sound.stopAsync();
    await sfx.sound.setPositionAsync(0);
  } catch (e) {
    console.log("stopSfx error:", e);
  }
}

export async function stopAllSfx() {
  try {
    const values = Array.from(sfxCache.values());
    await Promise.all(
      values.map(async (s) => {
        try {
          await s.sound.stopAsync();
          await s.sound.setPositionAsync(0);
        } catch {}
      }),
    );
  } catch (e) {
    console.log("stopAllSfx error:", e);
  }
}
