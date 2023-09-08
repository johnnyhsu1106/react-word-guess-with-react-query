import { useQuery } from '@tanstack/react-query'

const API_ENDPOINT = 'https://random-word-api.vercel.app/api?words=1';
const queryKey = 'word';


const useFetchWord = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await fetch(API_ENDPOINT);
      if (!res.ok) {
        throw new Error('Invalid Https Request');
      }
      return res.json();
    }
  });

  const word = data && data[0];

  return { word, isLoading, isError, refetch };
}

export default useFetchWord;
