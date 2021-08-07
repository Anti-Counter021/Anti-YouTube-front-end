const GetAccessToken = () => {
    return localStorage.getItem('access_token');
};

const GetRefreshToken = () => {
    return localStorage.getItem('refresh_token');
};

const setTokens = (data) => {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
};

const deleteTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

export {GetAccessToken, GetRefreshToken, setTokens, deleteTokens};
