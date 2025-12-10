import { AppError } from "../error/AppError";
import Employee, { EmployeeAttributes, EmployeeCreationAttributes } from "../models/Employee";
import { EmployeeRepository } from "../repository/EmployeeRepository";

export class EmployeeService {
  private employeeRepository = new EmployeeRepository();
  async createEmployee (data: EmployeeCreationAttributes): Promise<Employee> {
    const employeeAlreadyExists = await this.employeeRepository.findByEmail(data.email);

    if (employeeAlreadyExists) throw new AppError('Este e-mail já está sendo utilizado.', 409);
    
    return await this.employeeRepository.create(data);
  }

  async getEmployee(id: number): Promise<Employee | null>  {
    const employee = await this.employeeRepository.findById(id);
    if (!employee) throw new AppError("Employee not found", 404);
    return employee;
  }
  
  async updateEmployee(id: number, data: EmployeeAttributes): Promise<Employee | null> {
    const employeeAlreadyExists = await this.employeeRepository.findByEmail(data.email);

    if (employeeAlreadyExists && employeeAlreadyExists.id !== id) throw new AppError('Este e-mail já está sendo utilizado.', 409);
    
    const employee = await this.employeeRepository.update(id, data);
      if (!employee) throw new AppError("Employee not found", 404);
    return employee;
  }

  async getAllEmployees(): Promise<Employee[]> {
    return await this.employeeRepository.findAll();
  }

  async deleteEmployee(id: number) {
    const deleted = await this.employeeRepository.delete(id);
    if (!deleted) throw new AppError("Employee not found", 404);
    return true;
  }
}
