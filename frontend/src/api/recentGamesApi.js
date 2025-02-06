import api from './api';

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