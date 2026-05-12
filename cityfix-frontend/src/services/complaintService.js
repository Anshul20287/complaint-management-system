import api from "./api";

export const createComplaint = (formData) =>
  api.post("/complaints", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const getMyComplaints = () => api.get("/complaints/my");
export const updateComplaint = (id, formData) =>
  api.put(`/complaints/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
export const getAllComplaints = () => api.get("/complaints");
export const getComplaintById = (id) => api.get(`/complaints/${id}`);
export const assignComplaint = (id, staffId) =>
  api.put(`/complaints/${id}/assign`, { staffId });
export const getStaffByCategory = (category) =>
  api.get(`/complaints/staff/by-category/${encodeURIComponent(category)}`);
export const getStaffAssignedComplaints = (category) =>
  api.get("/complaints/assigned/list", {
    params: category ? { category } : {}
  });
export const updateComplaintStatus = (id, status) =>
  api.put(`/complaints/${id}/status`, { status });
export const addComplaintRemark = (id, message) =>
  api.put(`/complaints/${id}/remarks`, { message });
export const getHeatmapData = () => api.get("/complaints/heatmap");
export const getPublicHeatmapData = () => api.get("/complaints/public-heatmap");

// New verified workflow endpoints
export const startWork = (id, data) =>
  api.put(`/complaints/${id}/start-work`, data);

export const completeWork = (id, formData) =>
  api.put(`/complaints/${id}/complete-work`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const verifyCitizen = (id, data) =>
  api.put(`/complaints/${id}/verify`, data);

export const rejectUpdate = (id, data) =>
  api.put(`/complaints/${id}/reject-update`, data);

export const getComplaintTimeline = (id) =>
  api.get(`/complaints/${id}/timeline`);

export const complaintService = {
  createComplaint,
  getMyComplaints,
  updateComplaint,
  getAllComplaints,
  getComplaintById,
  assignComplaint,
  getStaffByCategory,
  getStaffAssignedComplaints,
  updateComplaintStatus,
  addComplaintRemark,
  getHeatmapData,
  getPublicHeatmapData,
  startWork,
  completeWork,
  verifyCitizen,
  rejectUpdate,
  getComplaintTimeline
};