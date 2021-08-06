const GetToken = () => {
    return localStorage.getItem('token');
};

const setToken = (data) => {
    localStorage.setItem('token', data);
};

export {GetToken, setToken};
