import api from "./api";

export const getReportOverview = () => api.get("/reports/overview");
export const getResolutionTime = () => api.get("/reports/resolution-time");

export const exportCSV = () =>
  api.get("/reports/export-csv", {
    responseType: "blob"
  });