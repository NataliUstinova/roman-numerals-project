import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ConverterForm from './components/ConverterForm';
import ConversionHistory from './components/ConversionHistory';
import HowItWorks from './components/HowItWorks';
import H1 from './components/ui/H1.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <H1>Roman Numerals Converter</H1>
          <div className="space-y-4">
            <HowItWorks />
            <ConverterForm />
            <ConversionHistory />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
