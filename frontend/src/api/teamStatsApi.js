import api from './api';

export const getTeamDetails = async (teamId) => {
  try {
    const response = await api.get('/teams/details', {
      params: { team: teamId },
      headers: {
        'Accept': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching team details:', error);
    throw error;
  }
};