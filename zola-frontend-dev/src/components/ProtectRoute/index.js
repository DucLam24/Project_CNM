import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectAuthRoutes = ({ redirectPath, children }) => {
  return (
    <>
      {localStorage.getItem("access_token") ? (
        <Navigate to={redirectPath} replace />
      ) : (
        children
      )}
    </>
  );
};

export { ProtectAuthRoutes };

ProtectAuthRoutes.propTypes = {
  redirectPath: PropTypes.string,
  children: PropTypes.node.isRequired,
};

ProtectAuthRoutes.defaultProps = {
  redirectPath: "",
  children: <></>,
};
