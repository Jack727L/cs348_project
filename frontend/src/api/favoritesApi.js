import api from './api';

export const fetchFavoriteTeams = async (userId) => {
    try {
        const response = await api.get('/favorite/team/view', { params: { userid: userId } });
        return response.data;
    } catch (error) {
        console.error('Error fetching favorite teams:', error);
        throw error.response ? error.response.data : { message: 'An unexpected error occurred' };
    }
};

export const fetchFavoritePlayers = async (userId) => {
    try {
        const response = await api.get('/favorite/player/view', { params: { userid: userId } });
        return response.data;
    } catch (error) {
        console.error('Error fetching favorite players:', error);
        throw error.response ? error.response.data : { message: 'An unexpected error occurred' };
    }
};

export const modifyFavoriteTeam = async (userId, teamId) => {
    try {
        const response = await api.get('/favorite/team/add', { 
        params: { 
            userid: userId,
            teamid: teamId 
        } 
        });
        return response.data;
    } catch (error) {
        console.error('Error modifying favorite team:', error);
        throw error.response ? error.response.data : { message: 'An unexpected error occurred' };
    }
};

export const modifyFavoritePlayer = async (userId, playerId) => {
    try {
        const response = await api.get('/favorite/player/add', { 
        params: { 
            userid: userId,
            playerid: playerId 
        } 
        });
        return response.data;
    } catch (error) {
        console.error('Error modifying favorite player:', error);
        throw error.response ? error.response.data : { message: 'An unexpected error occurred' };
    }
};

export const fetchNotifications = async (userId) => {
    try {
        const response = await api.get(`/notifications/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error.response ? error.response.data : { message: 'An unexpected error occurred' };
    }
};
