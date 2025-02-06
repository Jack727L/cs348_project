import api from './api';

/**
 * Fetches recent games from the API based on the specified league.
 *
 * @param {string} league - The league to filter the recent games by. Use 'all' to fetch all leagues.
 * @returns {Promise<Array>} - A promise that resolves to an array of recent games.
 * @throws {Object} - Throws error response data if the API call fails.
 */
export const fetchRecentGames = async (league = 'all') => {
  try {
    const response = await api.get('/recentgames', { params: { league } });
    return response.data;
  } catch (error) {
    console.error('Error fetching recent games:', error);
    throw error.response ? error.response.data : { message: 'An unexpected error occurred' };
  }
};

export const fetchLeagues = async () => {
  try {
    const response = await api.get('/leagues');
    return response.data;
  } catch (error) {
    console.error('Error fetching leagues:', error);
    throw error.response ? error.response.data : { message: 'An unexpected error occurred' };
  }
};