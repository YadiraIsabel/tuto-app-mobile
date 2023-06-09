import TokenRepository from "../../../infra/session/repository/TokenRepository";

const ClearTokenUseCase = {
    dispatch: async () => {
        try {
            await TokenRepository.clearToken();
        } catch (error) {
            alert(`Error limpiar el token: ${error}`);
            throw new Error(error);
        }
    }
}
export default ClearTokenUseCase;