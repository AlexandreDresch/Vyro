import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEY } from "../constants";
import { DB } from "../types";
import { buildSeedData } from "./seed-data";

export async function loadDB(): Promise<DB> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as DB;
  } catch {
    /* ignore */
  }
  return buildSeedData();
}

export async function persistDB(db: DB) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    /* ignore */
  }
}
