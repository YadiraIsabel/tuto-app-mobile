import NewRepository from "../../../infra/db/repository/NewRepository";

const DeleteNewUseCase = {
    dispatch: async (id) => {
        try {
            return await NewRepository.delete(id);
        } catch (error) {
            alert(`Error eliminando la noticia: ${error}`);
        }
    }
}
export default DeleteNewUseCase;