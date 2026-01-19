import { Audio } from "expo-audio"; // API expo-audio

let bgm = null;
let sfxCache = new Map();

export async function initAudio() {
  // важно: на iOS режимы/микс и т.п. настраиваются тут
  // expo-audio docs: background требует отдельной конфигурации в standalone apps
  // но для обычного “внутри приложения” этого хватает
}

export async function playBgm(assetModule, { volume = 0.25, loop = true } = {}) {
  try {
    await stopBgm();

    bgm = await Audio.Sound.createAsync(assetModule, {
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

export async function playSfx(key, assetModule, { volume = 0.8 } = {}) {
  try {
 
    if (!sfxCache.has(key)) {
      const s = await Audio.Sound.createAsync(assetModule, {
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
