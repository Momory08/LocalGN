export const useAuth = () => {
  const token = localStorage.getItem("token");
  return !!token; // true si connecté, false sinon
};
