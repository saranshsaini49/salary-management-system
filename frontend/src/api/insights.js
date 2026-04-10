import api from "./client";

export function fetchCountryInsights(country) {
  return api.get(`/insights/country/${encodeURIComponent(country)}`).then((r) => r.data);
}

export function fetchJobTitleInsights(country, jobTitle) {
  return api.get("/insights/job_title", {
    params: { country, job_title: jobTitle },
  }).then((r) => r.data);
}

export function fetchTopRoles() {
  return api.get("/insights/top_roles").then((r) => r.data);
}
