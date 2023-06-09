import Noticia from '../model/Noticia';
import Response from '../model/Response';
const ResponseMapper = {
    apply: async (response) => {
        var body;
        await response.json().then(j => body = j);
        return new Response(response.status, body)
    }
};
export default ResponseMapper;