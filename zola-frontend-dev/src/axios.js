import axios from "axios";

const axiosClient = axios.create();

axiosClient.defaults.baseURL = process.env.REACT_APP_API_URL;
axiosClient.defaults.headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const appendPath = (path) => {
  return path.startsWith("/") ? path.slice(1, path.length) : path;
};

const appendOption = (options) => {
  let config = {
    headers: {
      Authorization: localStorage.getItem("access_token")
        ? `Bearer ${localStorage.getItem("access_token")}`
        : "",
    },
  };

  if (options && options.headers) {
    const headerOptions = Object.entries(options.headers);
    for (const headerOption of headerOptions) {
      config.headers = {
        ...config.headers,
        [headerOption[0]]: headerOption[1],
      };
    }
  }

  return config;
};

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location = "/login";
    }

    return Promise.reject(error);
  }
);

export const get = (path, options = {}) => {
  return axiosClient
    .get(appendPath(path), appendOption(options))
    .then((response) => response);
};

export const post = (path, payload, options = {}) => {
  return axiosClient
    .post(appendPath(path), payload, appendOption(options))
    .then((response) => response);
};

export const put = (path, payload, options = {}) => {
  return axiosClient
    .put(appendPath(path), payload, appendOption(options))
    .then((response) => response);
};

export const patch = (path, payload, options = {}) => {
  return axiosClient
    .patch(appendPath(path), payload, appendOption(options))
    .then((response) => response);
};

export const del = (path, options) => {
  return axiosClient
    .delete(appendPath(path), appendOption(options))
    .then((response) => response);
};