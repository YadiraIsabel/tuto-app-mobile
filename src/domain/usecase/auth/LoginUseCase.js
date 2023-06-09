import AuthRepository from "../../../infra/http/repository/AuthRepository";
import ResponseMapper from "../../mapper/ResponseMapper";

const LoginUseCase = {
    dispatch: async (request) => {
        try {
            const response = await AuthRepository.login(request);
            return await ResponseMapper.apply(response);
        } catch (error) {
            alert(`Error registrando usuario: ${error}`);
        }
    }
}
export default LoginUseCase;