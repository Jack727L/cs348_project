import api from './api';

export const fetchRecentGames = async (league = 'all', page = 1, page_size = 10) => {
  try {
    const response = await api.get('/recentgames', { params: { league, page, page_size } });
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

export const searchGames = async ({ start_date, end_date, league, page = 1, page_size = 10 }) => {
  try {
    const response = await api.get('/game', { 
      params: { 
        start_date, 
        end_date, 
        league, 
        page, 
        page_size
      } 
    });
    return response.data;
  } catch (error) {
    console.error('Error searching games:', error);
    throw error.response ? error.response.data : { message: 'An unexpected error occurred' };
  }
};