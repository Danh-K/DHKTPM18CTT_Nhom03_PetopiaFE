"use client";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useEffect, useState } from "react";

function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validToken = token && token !== "undefined" && token !== "null" && token.trim() !== "";
    const validUser = !!user;

    setIsAuthenticated(validToken && validUser);
    setLoading(false);
  }, [token, user]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return { user, token, isAuthenticated, loading, logout: handleLogout };
}

export default useAuth;