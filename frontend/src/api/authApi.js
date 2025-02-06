import api from './api';

export const signUp = async (userData) => {
    try {
        const formData = new FormData();
        formData.append('username', userData.username);
        formData.append('password', userData.password);

        const response = await api.post('/signup', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
        });
        return response.data;
    } catch (error) {
        console.error('Error during sign up:', error);
        throw error.response ? error.response.data : { message: 'An unexpected error occurred during sign up' };
    }
};

export const signIn = async (credentials) => {
    try {
        const formData = new FormData();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);

        const response = await api.post('/login', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
        });
        return response.data;
    } catch (error) {
        console.error('Error during sign in:', error);
        throw error.response ? error.response.data : { message: 'An unexpected error occurred during sign in' };
    }
};

export const signOut = async () => {
    try {
        const response = await api.post('/logout');
        return response.data;
    } catch (error) {
        console.error('Error during sign out:', error);
        throw error.response ? error.response.data : { message: 'An unexpected error occurred during sign out' };
    }
}; 