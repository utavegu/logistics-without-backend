import {useState, useEffect} from 'react';

export default function useJsonFetch(url) {

  const [responseState, setResponseState] = useState({
    data: null,
    isLoading: false,
    hasError: null,
  })

	useEffect(
		() => {
			const fetchData = async () => {
				setResponseState(prev => ({...prev, isLoading: true}));
				try {
					const response = await fetch(url);
					if (!response.ok) {
						throw new Error(response.statusText);
					}
					const data = await response.json();
					setResponseState(prev => ({...prev, data: data}));
					setResponseState(prev => ({...prev, hasError: null}));
				} 
				catch (error) {
					setResponseState(prev => ({...prev, hasError: error}));
					console.dir(error.message);
				} 
				finally {
					setResponseState(prev => ({...prev, isLoading: false}));
				}
			};
			fetchData();
		},
		[url]
	);

	return responseState;
} 