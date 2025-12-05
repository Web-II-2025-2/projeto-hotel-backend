import { Request, Response } from "express";
import { EmployeeService } from "../services/EmployeeService";
import { EmployeeAttributes, EmployeeCreationAttributes } from "../models/Employee";

const employeeService = new EmployeeService();

export class EmployeeController {
    
    async createEmployee(req: Request<{}, {}, EmployeeCreationAttributes>, res: Response) {
        try {
            const employee = await employeeService.createEmployee(req.body);
            return res.status(201).json(employee);
        } catch (e: any) {
            return res.status(400).json({ error: e.message });
        }
    }

    async getEmployee(req: Request, res: Response) {
        try {
            const employee = await employeeService.getEmployee(Number(req.params.id));
            return res.json(employee);
        } catch (e: any) {
            return res.status(404).json({ error: e.message });
        }
    }

    async updateEmployee(req: Request<{ id: string }, {}, EmployeeAttributes>, res: Response) {
        try {
            const employee = await employeeService.updateEmployee(Number(req.params.id), req.body);
            return res.json(employee);
        } catch (e: any) {
            return res.status(404).json({ error: e.message });
        }
    }

    async getAllEmployees(req: Request, res: Response) {
        try {
            const employees = await employeeService.getAllEmployees();
            return res.json(employees);
        } catch (e: any) {
            return res.status(400).json({ error: e.message });
        }
    }

    async deleteEmployee(req: Request, res: Response) {
        try {
            await employeeService.deleteEmployee(Number(req.params.id));
            return res.status(204).send();
        } catch (e: any) {
            return res.status(404).json({ error: e.message });
        }
    }
}
