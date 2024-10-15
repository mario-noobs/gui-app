import interceptor from "../../core/services/axios";

export const GetProfileAPI = <T>(): Promise<T> => {
    return new Promise((resolve, reject) => {
      interceptor
        .post("/profile", {
          headers: {
            Authorization: `${localStorage.getItem("access_token")}`,
          },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };