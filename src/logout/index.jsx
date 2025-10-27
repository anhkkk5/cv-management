import { useNavigate } from "react-router-dom";
import { deleteAllCookies } from "../helpers/cookie";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkLogin } from "../actions/login";

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Perform logout operations
    const handleLogout = () => {
      // Delete all cookies first
      deleteAllCookies();

      // Update Redux state
      dispatch(checkLogin(false));

      // Navigate to login page after a short delay
      setTimeout(() => {
        navigate("/");
      }, 1000);
    };

    handleLogout();
  }, [navigate, dispatch]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <h2>Đang đăng xuất...</h2>
      <p>Vui lòng chờ trong giây lát</p>
    </div>
  );
}

export default Logout;
