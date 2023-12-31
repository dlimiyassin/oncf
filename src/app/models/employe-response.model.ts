import { Employe } from "./employe.model";

export interface EmployeResponse {
  content: Employe[];
  totalPages: number;
}