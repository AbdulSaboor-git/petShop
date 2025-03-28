const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const fetcher = async (url) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  const res = await fetch(`${API_BASE_URL}${url}`, {
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  if (!res.ok) throw new Error("Failed to fetch data");

  return res.json();
};

export const swrOptions = {
  fetcher,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
};
