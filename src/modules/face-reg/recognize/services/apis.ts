
import interceptor from "../../services/axios";
import { IFace } from "../../models/face";

export const RecognizeFaceBiometricAPI = <T>(data: IFace): Promise<T> => {
return new Promise((resolve, reject) => {
    interceptor
    .post("/api/v1/face/recognize-identity", data)
    .then((response) => {
        resolve(response.data);
    })
    .catch((err) => {
        reject(err);
    });
});
};