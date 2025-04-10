import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
}

type LoadMoreFunction<T> = (page: number) => Promise<T[]>;

export function useInfiniteScroll<T>(
  loadMore: LoadMoreFunction<T>,
  options: UseInfiniteScrollOptions = {}
) {
  const { threshold = 100 } = options;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    const scrolledToBottom =
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - threshold;

    if (scrolledToBottom) {
      loadMoreItems();
    }
  }, [loading, hasMore]);

  const loadMoreItems = async () => {
    setLoading(true);
    try {
      const newItems = await loadMore(page);
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setPage((p) => p + 1);
      }
    } catch (error) {
      console.error('Error loading more items:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    loading,
    hasMore,
    loadMore: loadMoreItems,
  };
}
