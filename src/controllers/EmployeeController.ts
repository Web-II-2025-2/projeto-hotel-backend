import { Request, Response } from "express";
import { EmployeeService } from "../services/EmployeeService";
import { EmployeeAttributes, EmployeeCreationAttributes } from "../models/Employee";

const employeeService = new EmployeeService();

export class EmployeeController {
    
    async createEmployee(req: Request<{}, {}, EmployeeCreationAttributes>, res: Response) {
        const employee = await employeeService.createEmployee(req.body);
        return res.status(201).json(employee);
    }

    async getEmployee(req: Request, res: Response) {
        const employee = await employeeService.getEmployee(Number(req.params.id));
        return res.json(employee);
    }

    async updateEmployee(req: Request<{ id: string }, {}, EmployeeAttributes>, res: Response) {
        const employee = await employeeService.updateEmployee(Number(req.params.id), req.body);
        return res.json(employee);
    }

    async getAllEmployees(req: Request, res: Response) {
        const employees = await employeeService.getAllEmployees();
        return res.json(employees);
    }

    async deleteEmployee(req: Request, res: Response) {
        await employeeService.deleteEmployee(Number(req.params.id));
        return res.status(204).send();
    }
}
