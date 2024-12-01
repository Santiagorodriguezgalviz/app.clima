import { createApi } from 'unsplash-js';

// Using a demo access key - replace with your own in production
const unsplash = createApi({
  accessKey: 'V_sJ1WXKW9VlgqimR0zUxDpNDRf7fdPgqOGYEbNXh0w'
});

export const getCityImage = async (city: string): Promise<string> => {
  try {
    const result = await unsplash.search.getPhotos({
      query: `${city} city landscape`,
      orientation: 'landscape',
      perPage: 1,
    });

    if (result.response?.results[0]) {
      return result.response.results[0].urls.regular;
    }

    // Fallback image for cities without results
    return 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80';
  } catch (error) {
    console.error('Error fetching city image:', error);
    return 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80';
  }
};