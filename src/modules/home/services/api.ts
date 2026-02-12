import interceptor from "../../core/services/axios";

export const GetProfileAPI = <T>(): Promise<T> => {
    return new Promise((resolve, reject) => {
      interceptor
        .post("/api/v1/profile")
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };