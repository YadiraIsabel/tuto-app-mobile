import TokenRepository from "../../../infra/session/repository/TokenRepository";

const GetTokenUseCase = {
    dispatch: async () => {
        try {
            const token = await TokenRepository.getToken();
            return token;
        } catch (error) {
            alert(`Error al persistir el token: ${error}`);
        }
    }
}
export default GetTokenUseCase;