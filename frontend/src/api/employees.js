import api from "./client";

export function fetchEmployees({ page, perPage, search, country, jobTitle }) {
  return api.get("/employees", {
    params: {
      page,
      per_page: perPage,
      search: search || undefined,
      country: country || undefined,
      job_title: jobTitle || undefined,
    },
  }).then((r) => r.data);
}

export function createEmployee(data) {
  return api.post("/employees", { employee: data }).then((r) => r.data);
}

export function updateEmployee(id, data) {
  return api.put(`/employees/${id}`, { employee: data }).then((r) => r.data);
}

export function deleteEmployee(id) {
  return api.delete(`/employees/${id}`);
}
