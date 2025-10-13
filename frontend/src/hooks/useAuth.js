// src/hooks/useAuth.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthAPI } from "../lib/auth";

export const useLogin = () =>
  useMutation({
    mutationFn: AuthAPI.login,
  });

export const useSignup = () =>
  useMutation({
    mutationFn: AuthAPI.signup,
  });

export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: AuthAPI.me,
    retry: 1,
  });

export const useLogout = () => {
  const qc = useQueryClient();
  return () => {
    AuthAPI.logout();
    qc.clear();
  };
};
