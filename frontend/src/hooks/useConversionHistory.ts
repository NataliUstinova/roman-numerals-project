import { useState } from 'react';
import { Conversion } from '../components/ConversionHistory';

export function useConversionHistory() {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = async () => {
    if (showHistory) {
      setShowHistory(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('/all');

      if (!response.ok) {
        setError('Failed to fetch conversions');
        return;
      }

      const data = await response.json();
      setConversions(data);
      setShowHistory(true);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load conversion history',
      );
    } finally {
      setLoading(false);
    }
  };

  const removeAll = async () => {
    try {
      setLoading(true);
      const response = await fetch('/remove', {
        method: 'DELETE',
      });

      if (!response.ok) {
        setError('Failed to remove conversions');
        return;
      }

      setConversions([]);
      setError('');
    } catch (err) {
      console.error('Remove error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to clear conversion history',
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshHistory = async () => {
    if (!showHistory) return;
    
    try {
      const response = await fetch('/all');
      if (response.ok) {
        const data = await response.json();
        setConversions(data);
      }
    } catch (err) {
      console.error('Error refreshing history:', err);
    }
  };

  return { 
    conversions, 
    showHistory, 
    loading, 
    error,
    fetchAll, 
    removeAll,
    refreshHistory
  };
}