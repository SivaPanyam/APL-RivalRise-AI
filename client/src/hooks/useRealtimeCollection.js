import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';

export function useRealtimeCollection(collectionName, queryConstraints = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;

    try {
      const q = query(collection(db, collectionName), ...queryConstraints);
      
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const documents = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setData(documents);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error(`Error fetching realtime data for ${collectionName}:`, err);
          setError(err.message);
          setLoading(false);
        }
      );
    } catch (err) {
      console.error(`Setup error for ${collectionName}:`, err);
      setError(err.message);
      setLoading(false);
    }

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, JSON.stringify(queryConstraints)]);

  return { data, loading, error };
}
