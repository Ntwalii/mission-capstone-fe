import { clearToken } from "@/utils/auth";
import { useNavigate } from "react-router-dom";

function useLogout() {
  const navigate = useNavigate();
  return () => {
    clearToken();
    navigate("/auth", { replace: true });
  };
}
