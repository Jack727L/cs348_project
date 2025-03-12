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

export const searchGames = async ({ start_date, end_date, league }) => {
  try {
    const response = await api.get('/game', { 
      params: { 
        start_date, 
        end_date, 
        league 
      } 
    });
    return response.data;
  } catch (error) {
    console.error('Error searching games:', error);
    throw error.response ? error.response.data : { message: 'An unexpected error occurred' };
  }
};