import api from './api';
export const getLeagueStandings = async (leagueId) => {
    try {
      const response = await api.get('/league/standings', {
        params: { league: leagueId },
        headers: {
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching league standings:', error);
      throw error;
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
  