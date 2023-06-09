import TokenRepository from "../../../infra/session/repository/TokenRepository";

const PersistTokenUseCase = {
    dispatch: async (token) => {
        try {
            await TokenRepository.persistToken(token);
        } catch (error) {
            alert(`Error al persistir el token: ${error}`);
        }
    }
}
export default PersistTokenUseCase;