const GetToken = () => {
    return localStorage.getItem('token');
};

const setToken = (data) => {
    localStorage.setItem('token', data);
};

const deleteToken = () => {
    localStorage.removeItem('token');
};

export {GetToken, setToken, deleteToken};
