const GetAccessToken = () => {
    return localStorage.getItem('access_token');
};

const GetRefreshToken = () => {
    return localStorage.getItem('refresh_token');
};

const GetUserId = () => {
    return localStorage.getItem('user_id');
};

const setTokens = (data) => {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('user_id', data.user_id);
};

const deleteTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
};

export {GetAccessToken, GetRefreshToken, setTokens, deleteTokens, GetUserId};
