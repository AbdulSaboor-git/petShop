import useSWR from "swr";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

export const useGlobalSWR = (key) =>
  useSWR(key, fetcher, {
    revalidateOnFocus: false, // Doesn't refetch on window focus
    revalidateOnReconnect: true, // Refetches when network reconnects
    refreshInterval: 0, // No automatic interval-based refetch
    dedupingInterval: 120000, // Avoids redundant fetches within 60s
    shouldRetryOnError: false, // Doesn't retry on error
  });
