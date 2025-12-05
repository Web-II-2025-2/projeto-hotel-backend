import Employee, { EmployeeCreationAttributes, EmployeeAttributes } from "../models/Employee";

export class EmployeeRepository {
  
  async findByEmail(email: string): Promise<Employee | null> {
    return await Employee.findOne( { where: { email } })
  }
  
  async create(data: EmployeeCreationAttributes): Promise<Employee> {
    return await Employee.create(data);
  }

  async findById(id: number): Promise<Employee | null> {
    return await Employee.findByPk(id);
  }

  async findAll(): Promise<Employee[]> {
    return await Employee.findAll();
  }

  async update(id: number, data: Partial<EmployeeAttributes>): Promise<Employee | null> {
    const employee = await Employee.findByPk(id);
    if (!employee) return null;
    return await employee.update(data);
  }

  async delete(id: number){
    return await Employee.destroy({where: { id }});
  }
}