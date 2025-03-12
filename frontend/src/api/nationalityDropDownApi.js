import api from './api';

export const getNationalities = async () => {
  try {
    const response = await api.get('/nationality', {
      headers: {
        'Accept': 'application/json',
      },
    });
    // Ensure we have an array (in case the endpoint returns a single object)
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error('Error fetching nationalities:', error);
    throw error;
  }
};