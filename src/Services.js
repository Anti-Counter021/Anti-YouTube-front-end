export default class Services {

    _url = 'http://localhost:8000/api/v1/'

    async httpRequest({method, url, token, data}) {
        const token_auth = token ? {'Authorization': `Token ${token}`} : {};
        const body_data = data ? {body: JSON.stringify(data)} : {};
        const res = await fetch(this._url + url, {
            method: method,
            headers: {
                'Content-type': 'application/json',
                ...token_auth,
            },
            ...body_data,
        });

        if (!res.ok) {
            if (res.status !== 400 && res.status !== 422) {
                throw new Error(`Error ${url}, Status = ${res.status}`);
            }
        }

        return await res.json();
    }

    register = async (data) => {
        return await this.httpRequest({method: 'POST', url: 'auth/register', data});
    }

    login = async (data) => {
        return await this.httpRequest({method: 'POST', url: 'auth/login', data});
    }

    activate = async (token) => {
        return await this.httpRequest({method: 'POST', url: 'auth/activate', data: {uuid: token}});
    }

}
