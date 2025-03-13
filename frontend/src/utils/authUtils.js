import { fetchFavoritePlayers, fetchFavoriteTeams } from '../api/favoritesApi';

export const getUserId = () => {
    const userCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('panel_user='));
    if (userCookie) {
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
        return userData.id;
    }
    return null;
};

export const getUser = () => {
    const userCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('panel_user='));
    if (userCookie) {
        return JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
    }
    return null;
};

export const fetchUserFavorites = async () => {
    const userId = getUserId();
    if (!userId) {
        return { teams: [], players: [] };
    }

    try {
        const [teams, players] = await Promise.all([
            fetchFavoriteTeams(userId),
            fetchFavoritePlayers(userId)
        ]);
        return {
            teams: teams || [],
            players: players || []
        };
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return { teams: [], players: [] };
    }
};

export const requireAuth = () => {
    const userId = getUserId();
    if (!userId) {
        throw new Error('Authentication required');
    }
    return userId;
}; 