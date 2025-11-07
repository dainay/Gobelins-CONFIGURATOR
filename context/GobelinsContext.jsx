import { createContext, useEffect, useState } from "react";
import { databases, client } from "../lib/appwrite";
import { ID, Permission, Query, Role } from "appwrite";
import { useUser } from "../hooks/useUser";

const DATABASE_ID = "690dbc2700060281a085";
const COLLECTION_ID = "gobelins";

export const GobelinsContext = createContext();

export function GobelinsProvider({ children }) {
  const [gobelins, setGobelins] = useState([]);
  const { user } = useUser();

  async function fetchGobelins() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID
      );
      setGobelins(response.documents);
      // console.log("Fetched gobelins:", response.documents);
    } catch (error) {
      console.error("Error fetching gobelins:", error);
    }
  }

  async function fetchGobelinById(id) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      );
      return response;
    } catch (error) {
      console.error("Error fetching gobelin by ID:", error);
    } finally {
    }
  }

  async function createGobelin(data) {
    try {
      const newGobelin = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        { ...data }
        // [
        // Permission.read(Role.user(user.$id)),
        // Permission.update(Role.user(user.$id)),
        // Permission.delete(Role.user(user.$id)),
        // ]
      );
    } catch (error) {
      console.error("Error creating gobelin:", error);
    }
  }

  async function deleteGobelin(id) {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
    } catch (error) {
      console.error("Error deleting gobelin:", error);
    }
  }

  //fetch gobelins directly when we have user loggined
  useEffect(() => {
    let unsubscribe;
    // subscription for updates in gobelins collection
    const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`;

    if (user) {
      fetchGobelins();
      unsubscribe = client.subscribe(channel, (response) => {
        //     console.log("Gobelins collection updated:", response);
        const { payload, events } = response;
        if (events[0].includes("create")) {
          setGobelins((prevGobelins) => [...prevGobelins, payload]);
        }
        if (events[0].includes("delete")) {
          setGobelins((prevGobelins) =>
            prevGobelins.filter((gobelin) => gobelin.$id !== payload.$id)
          );
        }
      });
    } else {
      setGobelins([]);
    }

    // return works as cleanup function, so it is called only on rerender/unmount
    return () => {
        if (unsubscribe) {
            unsubscribe();
        }
    };
  }, [user]);

  return (
    <GobelinsContext.Provider
      value={{
        gobelins,
        fetchGobelins,
        fetchGobelinById,
        createGobelin,
        deleteGobelin,
      }}
    >
      {children}
    </GobelinsContext.Provider>
  );
}
