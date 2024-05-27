import { io } from "socket.io-client";

const appendPath = (path) => {
  return path.startsWith("/") ? path.slice(1, path.length) : path;
};

const appendOption = (options) => {
  let config = {
    extraHeaders: {
      Authorization: localStorage.getItem("access_token")
        ? `Bearer ${localStorage.getItem("access_token")}`
        : "",
    },
  };

  if (options) {
    for (const option of Object.entries(options)) {
      config = {
        ...config,
        [option[0]]: option[1],
      };
    }
  }

  return config;
};

export const getSocket = (path, options) => {
  return io(
    `${process.env.REACT_APP_SOCKET_URL}${path ? appendPath(path) : ""}`,
    appendOption(options)
  );
};
