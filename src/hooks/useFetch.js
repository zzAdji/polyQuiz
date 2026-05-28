import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        if (isMounted) {
          setData(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setData(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      // Nettoyage pour éviter les fuites de mémoire si le composant est démonté
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
}
