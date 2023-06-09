import Noticia from '../model/Noticia';

const NoticiaMapper = {
    apply: (data) => new Noticia(data.data(), data.id)
};
export default NoticiaMapper;