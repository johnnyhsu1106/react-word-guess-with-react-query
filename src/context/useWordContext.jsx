import { useState, useEffect, useMemo, useCallback, useContext, createContext } from 'react'
import useFetchWord  from '../hooks/useFetchWord';
import  BODY_PARTS  from '../utils/body';


const WordContext = createContext();

const useWordContext = () => {
  return useContext(WordContext);
};


const WordProvider = ({ children }) => {
  const { word, isLoading, isError, refetch } = useFetchWord();
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  
  const [correctLetters, incorrectLetters, isGameOver] = useMemo(() => {
    const wordSet = new Set(word);
    const correctLetters = new Set();
    const incorrectLetters = new Set();

    for (const guessLetter of guessedLetters) {
      if (wordSet.has(guessLetter)) {
        correctLetters.add(guessLetter);
      } else {
        incorrectLetters.add(guessLetter);
      }
    }
    // Once the incorrectness guess is more than 5 times, game over
    const isGameOver = incorrectLetters.size >= BODY_PARTS.length; 
    
    return [correctLetters, incorrectLetters, isGameOver];
  }, [guessedLetters]);


  const hasFoundWinner = useMemo(() => {
    if (!word || word === '') {
      return false;
    }
    
    for (let letter of word) {
      if (!guessedLetters.has(letter)) {
        return false;
      }
    }
    return true;
  }, [guessedLetters]);


  const handleGuessedLetterAdd = useCallback((letter) => {
    if (guessedLetters.has(letter) || isGameOver || hasFoundWinner) {
      return;
    }
    setGuessedLetters((prevGuessedLetters) => {
      return new Set([...prevGuessedLetters, letter]);
    })
    
  }, [guessedLetters, isGameOver, hasFoundWinner]);


  // Handle Key(letters) Press  Event
  useEffect(() => {
    const handler = (e) => {
      const { key } = e;
      // only a to z is valid
      if (!key.match(/^[a-z]$/) && !key.match(/^[A-Z]$/)) {
        return;
      }
  
      handleGuessedLetterAdd(key.toLowerCase());
    }

    document.addEventListener('keypress', handler);

    return () => {
      document.removeEventListener('keypress', handler);
    }
  }, [guessedLetters]);


  // Handle Key(Enter) Press Event - get new word to start new game
  useEffect(() => {
    const handler = (e) => {
      const { key } = e;
      if (key !== 'Enter') {
        return;
      };

      refetch();
      setGuessedLetters(new Set());
    }

    document.addEventListener('keypress', handler);

    return () => {
      document.removeEventListener('keypress', handler);
    }
  }, [])


  const handleNextButtonClick = () => {
    refetch();
    setGuessedLetters(new Set());
  };

  const context = {
    word,
    numOfIncorrectGuess: incorrectLetters.size,
    hasFoundWinner,
    isGameOver,
    isLoading,
    isError,
    guessedLetters,
    correctLetters,
    incorrectLetters,
    handleGuessedLetterAdd,
    handleNextButtonClick
  };

  return (
    <WordContext.Provider value={context}>
      {children}
    </WordContext.Provider>
  )
}

export { useWordContext, WordProvider };
