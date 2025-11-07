import { createContext, useEffect } from "react";
import { useState } from "react";
import { account } from "../lib/appwrite";
import { ID } from "appwrite";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false); // to track if auth check is done

  async function login(email, password) {
     try {
      await account.createEmailPasswordSession( email, password);
      const response = await account.get();
      setUser(response);
      
    } catch (error) {
      // console.error("Error registering user:", error.message);
       throw Error(error.message); 
    }
  }

  async function register (email, password) {
    try {

      await account.create(ID.unique(), email, password);
      await login(email, password);

    } catch (error) {
      // console.error("Error registering user:", error.message);
      throw Error(error.message);
    }
  }

  async function logout() {
    await account.deleteSession('current')
    setUser(null);
  }

  //get current user function to user into useEffect which is called once when the component mounts
  async function getInitialUserValue() {
    try {
      const response = await account.get();
      setUser(response);
    } catch (error) {
      setUser(null);
    } finally {
      setAuthChecked(true); // to delay rendering until auth check is done
    }
  }

  useEffect(() => {
    getInitialUserValue();
  }, []);

  return (
    <UserContext.Provider value={{ user, login, register, logout, authChecked }}>
      {children}
    </UserContext.Provider>
  )
}
