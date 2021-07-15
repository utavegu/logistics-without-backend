import {useState, useEffect} from 'react';

// Боюсь расфигарить всё перед сдачей проекта, потому пусть он просто тут лежит, а логику взаимодействия с сервером оставлю в App.

export default function useServerCRUD (link, type, body = null) {
  const [responseState, setResponseState] = useState({
    data: null,
    success: false,
    loading: false,
    error: null,
  })

  useEffect(
		() => {
      const options = {
        method: type,
        headers: { "Content-Type": "application/json" },
      };
      
      if (body) options.body = JSON.stringify(body);

      const createRequest = async () => {
        setResponseState(prev => ({...prev, loading: true}));
        try {
          const response = await fetch(link, options);
          if (response.ok) {
            if (type === "GET") {
              let data = await response.json();
              setResponseState(prev => ({...prev, data: data.data}));
            }
            setResponseState(prev => ({...prev, success: true}));
            setTimeout(() => {
              setResponseState(prev => ({...prev, success: false}));
            }, 2000);
          };
          if (!response.ok) {
            throw new Error(response.statusText);
          }
        } catch (error) {
          setResponseState(prev => ({...prev, error: error}));
          console.dir(error);
        } finally {
          setResponseState(prev => ({...prev, loading: false}));
        };
      };
      createRequest();
    }, [link]
  );

	return responseState;
}

