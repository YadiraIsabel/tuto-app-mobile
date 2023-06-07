import NewRepository from "../../infra/db/repository/NewRepository";

const UpdateNewUseCase = {
    dispatch: async (id, data) => {
        try {
            return await NewRepository.update(id, data);
        } catch (error) {
            alert(`Error actualizando la noticia: ${error}`);
        }
    }
}
export default UpdateNewUseCase;