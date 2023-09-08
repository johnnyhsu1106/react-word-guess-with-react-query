import Container from './components/Container';
import Drawing from './components/Drawing';
import Word from './components/Word';
import Keyboard from './components/Keyboard';
import Message from './components/Message';
import { WordProvider } from './context/useWordContext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import './App.css';

const queryClient = new QueryClient();


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WordProvider>
        <Container>
          <Drawing />
          <Word />
          <Keyboard />
          <Message />
        </Container>
      </WordProvider>
    </QueryClientProvider>
  )
}

export default App;
