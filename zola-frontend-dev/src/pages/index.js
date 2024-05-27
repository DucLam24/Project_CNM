import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Box } from "@chakra-ui/react";

import { routes } from "#/routes";

const router = createBrowserRouter(routes);

const Router = () => {
  return (
    <Box height="100vh">
      <RouterProvider router={router} />
    </Box>
  );
};

export default Router;
