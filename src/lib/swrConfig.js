const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("An error occurred while fetching data.");
  return res.json();
};

export const swrOptions = {
  fetcher,
  revalidateOnFocus: false, // Don't refetch when switching tabs
  revalidateOnReconnect: false, // Don't refetch on network change
  shouldRetryOnError: false, // Don't retry failed requests
  keepPreviousData: true, // Keep last known good data
  dedupingInterval: 60000, // Reduce how often it refetches
};
