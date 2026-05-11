import api from "./api";

export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

export const getPendingStaffRequests = () => {
  return api.get("/auth/staff-requests");
};

export const approveStaffRequest = (staffId) => {
  return api.patch(`/auth/staff-requests/${staffId}/approve`);
};

export const rejectStaffRequest = (staffId) => {
  return api.patch(`/auth/staff-requests/${staffId}/reject`);
};

export const changePassword = (data) => {
  return api.put("/auth/change-password", data);
};