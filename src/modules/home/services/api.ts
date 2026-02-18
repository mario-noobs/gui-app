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

export const GetFaceStatusAPI = <T>(): Promise<T> => {
  return new Promise((resolve, reject) => {
    interceptor
      .get("/api/v1/face/is-registered")
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const GetUserActivityAPI = <T>(userId: string, page = 0, size = 5): Promise<T> => {
  return new Promise((resolve, reject) => {
    interceptor
      .get(`/api/v1/audit/user/${userId}?page=${page}&size=${size}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
