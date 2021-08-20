import {deleteTokens, GetRefreshToken, setTokens, GetUserId} from "./Tokens";

const SITE = 'http://localhost:8000/api/v1/'

export {SITE};

export default class Services {

    _url = SITE

    async httpRequest({method, url, token, data, formData}) {
        const token_auth = token ? {'Authorization': `Bearer ${token}`} : {};
        const body_data = data ? {body: JSON.stringify(data)} : {};

        const jsonSettings = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                ...token_auth,
            },
            ...body_data,
        };

        const formDataSettings = {
            method: method,
            headers: {
                ...token_auth,
            },
            body: data,
        };

        const settings = formData ? formDataSettings : jsonSettings;

        const res = await fetch(this._url + url, settings);

        if (!res.ok) {

            if (res.status === 401) {
                const refresh_token = GetRefreshToken();
                const user_id = GetUserId();
                if (refresh_token) {
                    deleteTokens();
                    return await this.httpRequest(
                        {
                            method: 'POST', url: 'auth/refresh', data: {'refresh_token': refresh_token},
                        }
                    )
                        .then(async res => {
                            if (res.access_token) {
                                await setTokens({...res, 'refresh_token': refresh_token, 'user_id': user_id});
                                return await this.httpRequest(
                                    {method, url, token: res.access_token, data, formData}
                                );
                            } else if (res.detail) {
                                window.location.href = '/login';
                            }
                        })
                        .catch(error => console.log(error));
                }
            }

            if (res.status !== 400 && res.status !== 422 && res.status !== 401) {
                const json = await res.json();
                if (res.status === 403 && json.detail.toLowerCase().indexOf('not activated') + 1) {
                    alert('You need activated. Please check your email!');
                }
                if (res.status === 403) {
                    return json;
                }
                throw new Error(`Error ${url}, Status = ${res.status}`);
            }
        }

        return await res.json();
    }

    register = async (data) => {
        return await this.httpRequest({method: 'POST', url: 'auth/register', data});
    }

    login = async (data) => {
        return await this.httpRequest({method: 'POST', url: 'auth/login', data, formData: true});
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

    changePassword = async (token, data) => {
        return await this.httpRequest(
            {method: 'PUT', url: 'auth/change-password', token, data}
        );
    }

    uploadAvatar = async (data, token) => {
        return await this.httpRequest(
            {method: 'POST', url: 'auth/avatar', token, data, formData: true}
        );
    }

    resetPasswordRequest = async (email) => {
        return await this.httpRequest(
            {method: 'GET', url: `auth/request-password-reset?email=${email}`}
        );
    }

    resetPassword = async (data, token) => {
        return await this.httpRequest(
            {method: 'POST', url: `auth/password-reset?token=${token}`, data}
        );
    }

    categories = async () => {
        return await this.httpRequest({method: 'GET', url: 'categories/'});
    }

    removeCategory = async (id, token) => {
        return await this.httpRequest({method: 'DELETE', url: `categories/${id}`, token});
    }

    createCategory = async (token, data) => {
        return await this.httpRequest({method: 'POST', url: 'categories/', token, data});
    }

    updateCategory = async (pk, token, data) => {
        return await this.httpRequest(
            {method: 'PUT', url: `categories/${pk}`, token, data}
        );
    }

    categoryVideos = async (category_id) => {
        return await this.httpRequest(
            {method: 'GET', url: `categories/videos/${category_id}`}
        );
    }

    videos = async (page = 1) => {
        return await this.httpRequest({method: 'GET', url: `videos/?page=${page}`});
    }

    video = async (video_id) => {
        return await this.httpRequest({method: 'GET', url: `videos/${video_id}`})
    }

    vote = async (data, token) => {
        return await this.httpRequest({method: 'POST', url: 'videos/vote', data, token});
    }

    channel = async (channel_id, token) => {
        return await this.httpRequest(
            {method: 'GET', url: `auth/channel?pk=${channel_id}`, token}
        );
    }

    channelVideos = async (channel_id) => {
        return await this.httpRequest(
            {method: 'GET', url: `auth/channel/videos/${channel_id}`}
        );
    }

    follow = async (user_id, token) => {
        return await this.httpRequest(
            {method: 'POST', url: `auth/follow?to_id=${user_id}`, token}
        );
    }

    unfollow = async (user_id, token) => {
        return await this.httpRequest(
            {method: 'POST', url: `auth/unfollow?to_id=${user_id}`, token}
        );
    }

    subscriptions = async (token) => {
        return await this.httpRequest({method: 'GET', url: 'auth/followed', token});
    }

    comments = async (video_id) => {
        return await this.httpRequest({method: 'GET', url: `comments/video/${video_id}`})
    }

    createComment = async (data, token) => {
        return await this.httpRequest({method: 'POST', url: 'comments/', data, token});
    }

    addVideo = async (data, token) => {
        return await this.httpRequest(
            {method: 'POST', url: 'videos/', token, data, formData: true}
        );
    }

    historyAdd = async (token, pk) => {
        return await this.httpRequest(
            {method: 'POST', url: `videos/add-to-history?pk=${pk}`, token},
        );
    }

    history = async (token) => {
        return await this.httpRequest({method: 'GET', token, url: 'auth/history'});
    }

    clearHistory = async (token) => {
        return await this.httpRequest({method: 'DELETE', url: 'videos/history/clear', token});
    }

    getUsername = async (email) => {
        return await this.httpRequest(
            {method: 'POST', url: `auth/username?email=${email}`},
        );
    }

    search = async (q) => {
        return await this.httpRequest(
            {method: 'GET', url: `videos/search?q=${q}`},
        )
    }

    twoStepAuth = async (data) => {
        return await this.httpRequest(
            {method: 'POST', url: 'auth/2-auth', data, formData: true}
        );
    }

    toggleStepAuth = async (token) => {
        return await this.httpRequest({method: 'GET', url: 'auth/2-auth-toggle', token});
    }

}
