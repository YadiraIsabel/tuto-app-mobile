import NewRepository from "../../infra/db/repository/NewRepository";
import NoticiaMapper from "../mapper/NoticiaMapper";

const GetAllNewsUseCase = {
    dispatch: async () => {
        try {
            const news = await NewRepository.getAll();
            const newsMapped = [];
            news.forEach(n => newsMapped.push(NoticiaMapper.apply(n)));
            return newsMapped;
        } catch (error) {
            alert('Error obteniendo as noticias', error);
        }
    }
}
export default GetAllNewsUseCase;