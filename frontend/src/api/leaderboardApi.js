import api from './api';

// Function to fetch top scorers from the backend
export const fetchTopScorers = async (filters = {}) => {
  const { league, team, nationality, limit = 10 } = filters;
  
  try {
    const params = { limit };
    
    // Apply only one filter based on priority (due to backend limitation)
    if (league) {
      params.league = league;
    } else if (team) {
      params.team = team;
    } else if (nationality) {
      params.nationality = nationality;
    }
    
    const response = await api.get('/top-scorers-ranked', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching top scorers:', error);
    throw error;
  }
};