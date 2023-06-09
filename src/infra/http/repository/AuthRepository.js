import { environment } from "../../../../environments/environment";

const POST_METHOD = 'POST';
const HEADERS = {
    'Content-Type':
        'application/json',
    'X-Requested-With':
        'XMLHttpRequest'
};
const REGISTER_URL = '/api/auth/signup';
const LOGIN_URL = '/api/auth/login';

const AuthRepository = {
    singUp: async (request) => await fetch(environment.URL + REGISTER_URL, {
        method: POST_METHOD,
        body: JSON.stringify(request),
        headers: HEADERS,
    }),
    login: async (request) => await fetch(environment.URL + LOGIN_URL, {
        method: POST_METHOD,
        body: JSON.stringify(request),
        headers: HEADERS,
    }),
}
export default AuthRepository;