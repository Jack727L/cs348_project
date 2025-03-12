import api from './api';

export const getPlayers = async (page, pageSize) => {
  try {
    const response = await api.get('/players', {
      params: { page, page_size: pageSize },
      headers: {
        'Accept': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
};

export const searchPlayers = async (queryParameters) => {
  try {
    const response = await api.get('/player', {
      params: queryParameters,
      headers: {
        'Accept': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching players:', error);
    throw error;
  }
};

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