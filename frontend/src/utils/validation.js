import { EMPLOYMENT_STATUSES } from "../constants";

export function validateEmployee(form) {
  const errs = {};

  if (!form.first_name?.trim()) errs.first_name = "Required";
  else if (form.first_name.length > 100) errs.first_name = "Max 100 characters";

  if (!form.last_name?.trim()) errs.last_name = "Required";
  else if (form.last_name.length > 100) errs.last_name = "Max 100 characters";

  if (!form.job_title?.trim()) errs.job_title = "Required";
  else if (form.job_title.length > 150) errs.job_title = "Max 150 characters";

  if (!form.country?.trim()) errs.country = "Required";
  else if (form.country.length > 100) errs.country = "Max 100 characters";

  if (form.department && form.department.length > 100) errs.department = "Max 100 characters";

  if (!form.salary || Number(form.salary) <= 0) errs.salary = "Must be greater than 0";

  if (!EMPLOYMENT_STATUSES.includes(form.employment_status))
    errs.employment_status = "Invalid status";

  return errs;
}

export const hasErrors = (errs) => Object.keys(errs).length > 0;
