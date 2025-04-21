import { act } from '@testing-library/react';
import { useHistoryStore } from '../historyStore';

describe('historyStore', () => {
  it('should initialize with showHistory as false', () => {
    const { showHistory } = useHistoryStore.getState();
    expect(showHistory).toBe(false);
  });

  it('should toggle showHistory', () => {
    act(() => {
      useHistoryStore.getState().toggleHistory();
    });

    const { showHistory } = useHistoryStore.getState();
    expect(showHistory).toBe(true);
  });

  it('should toggle showHistory back to false', () => {
    act(() => {
      useHistoryStore.setState({ showHistory: true });
      useHistoryStore.getState().toggleHistory();
    });

    const { showHistory } = useHistoryStore.getState();
    expect(showHistory).toBe(false);
  });
});