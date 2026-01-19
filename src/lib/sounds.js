import { Audio } from "expo-av"; // use expo-av Audio API

export const SOUNDS = {
  //   bgm: {
  //     world: require("../../assets/audio/gobelin/bgm_world.mp3"),
  //     menu: require("../../assets/audio/gobelin/bgm_menu.mp3"),
  //   },
  sfx: {
    laugh: require("../../assets/audio/gobelin/laugh.mp3"),
    roating: require("../../assets/audio/gobelin/roating.mp3"),
    speach: require("../../assets/audio/gobelin/speach.mp3"),
    scream: require("../../assets/audio/gobelin/scream.mp3"),
    hello: require("../../assets/audio/gobelin/hello.mp3"),
    scream2: require("../../assets/audio/gobelin/scream2.mp3"),
    chatting: require("../../assets/audio/gobelin/chatting.mp3"),
  },
};

let bgm = null;
let sfxCache = new Map();

export async function initAudio() {}

export async function playBgm(key, { volume = 0.25, loop = true } = {}) {
  try {
    const asset = SOUNDS.bgm[key];
    if (!asset) {
      console.warn("Unknown BGM:", key);
      return;
    }

    await stopBgm();

    bgm = await Audio.Sound.createAsync(asset, {
      shouldPlay: true,
      isLooping: loop,
      volume,
    });

    return bgm;
  } catch (e) {
    console.log("playBgm error:", e);
  }
}

export async function stopBgm() {
  try {
    if (!bgm) return;
    await bgm.sound.stopAsync();
    await bgm.sound.unloadAsync();
    bgm = null;
  } catch (e) {
    console.log("stopBgm error:", e);
  }
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
