
import interceptor from "../../services/axios";
import { IFace } from "../../models/face";

export const RegisterFaceBiometricAPI = <T>(data: IFace): Promise<T> => {
return new Promise((resolve, reject) => {
    interceptor
    .post("/api/v1/face/register-identity", data)
    .then((response) => {
        resolve(response.data);
    })
    .catch((err) => {
        reject(err);
    });
});
};