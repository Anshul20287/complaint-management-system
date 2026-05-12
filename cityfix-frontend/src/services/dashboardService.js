import api from "./api";

export const getCitizenDashboard = () => api.get("/dashboard/citizen");
export const getStaffDashboard = () => api.get("/dashboard/staff");
export const getAdminDashboard = () => api.get("/dashboard/admin");