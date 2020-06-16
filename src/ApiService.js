let baseUrl = (process.env.REACT_APP_API_URL) || "http://localhost:4000";

const consomeApi = (parametro = '', method='GET', body) => {
    return fetch(baseUrl + parametro, {
        method, headers: {'content-type': 'application/json'}, body
    })
    .then(res => ApiService.TrataErros(res))
    .then(res => res.json());
}

const ApiService = {

    getCurriculum : url => consomeApi(url, 'GET'),
    postResultados : (url, participant_info) => consomeApi(url, 'POST', participant_info),

    TrataErros : res => {
        if(!res.ok){

            throw Error(res.responseText);
        }
        return res;
    }

}

export default ApiService;