import axios from 'axios';

const BASE_URL = 'https://photoslibrary.googleapis.com/v1';

export const getPhotos = async (token, nextPageToken = '') => {
    try {
        const response = await axios.get(`${BASE_URL}/mediaItems`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-type': 'application/json',
            },
            params: {
                pageSize: 50,
                pageToken: nextPageToken,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching photos:', error);
        throw error;
    }
};
