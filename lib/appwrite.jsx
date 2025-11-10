import { Client, Account, Databases, Storage, Avatars, Locale, ID } from 'appwrite';

const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  console.warn('Appwrite: check .env (EXPO_PUBLIC_* variables).');
}

export const client = new Client().setEndpoint(endpoint).setProject(projectId);

export const account = new Account(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
export const locale = new Locale(client);

export const databases = new Databases(client);
export const AppwriteID = ID;

export async function appwritePing() {
  return locale.get();  
}
