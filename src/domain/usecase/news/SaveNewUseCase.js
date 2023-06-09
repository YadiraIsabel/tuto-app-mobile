import NewRepository from "../../../infra/db/repository/NewRepository";

const SaveNewUseCase = {
    dispatch: async (data) => {
        try {
            const noticia = await NewRepository.store(data);
            return noticia.id;
        } catch (error) {
            alert(`Error guardando la noticia: ${error}`);
        }
    }
}
export default SaveNewUseCase;