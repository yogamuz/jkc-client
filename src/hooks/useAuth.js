import { useState } from "react";
import { loginUser, getMe, logoutUser } from "../services/authService";

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const login = async ({ username, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser({ username, password });
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    try {
      const data = await getMe();
      setUser(data.user);
      return data.user;
    } catch {
      setUser(null);
      return null;
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };
  return { login, logout, checkSession, loading, error, user, setUser };
};

export default useAuth;
