import NewRepository from "../../../infra/db/repository/NewRepository";
import NoticiaMapper from "../../mapper/NoticiaMapper";

const GetNewUseCase = {
    dispatch: async (id) => {
        try {
            const aNew = await NewRepository.findById(id);
            return NoticiaMapper.apply(aNew);
        } catch (error) {
            alert(`Error obteniendo la noticia: ${error}`);
        }
    }
}
export default GetNewUseCase;