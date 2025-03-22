const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("An error occurred while fetching data.");
  return res.json();
};

export const swrOptions = {
  fetcher,
  revalidateOnFocus: true, // Re-fetch data when window regains focus
  revalidateOnReconnect: true, // Re-fetch when network reconnects
  keepPreviousData: true,
  // dedupingInterval: 60000, //60 seconds
};
