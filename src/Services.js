export default class Services {

    _url = 'http://localhost:8000/api/v1/'

    async httpRequest({method, url, token, data}) {
        const token_auth = token ? {'Authorization': `Bearer ${token}`} : {};
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

    getProfileChangeData = async (token) => {
        return await this.httpRequest({method: 'GET', url: 'auth/change-data', token});
    }

    putProfileChangeData = async (token, data) => {
        return await this.httpRequest({method: 'PUT', url: 'auth/change-data', token, data});
    }

    uploadAvatar = async (data, token) => {
        const res = await fetch(`${this._url}auth/avatar`, {
            method: 'POST',
            body: data,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) {
            if (res.status !== 400) {
                throw new Error(`Error auth/avatar, Status = ${res.status}`);
            }
        }

        return await res.json();
    }

}
