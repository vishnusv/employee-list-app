import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';

interface Employee {
  id: number;
  name: string;
  role: string;
  startDate: Date;
  endDate: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = openDB('employeeDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('employees')) {
          db.createObjectStore('employees', { keyPath: 'id', autoIncrement: true });
        }
      }
    });
  }

  async addEmployee(employee: Omit<Employee, 'id'>): Promise<IDBValidKey> {
    const db = await this.dbPromise;
    return db.add('employees', employee);
  }
  async updateEmployee(employee: Employee): Promise<IDBValidKey> {
    const db = await this.dbPromise;
    const existingEmployee = await db.get('employees', employee.id);
    if (!existingEmployee) {
      throw new Error(`Employee with ID ${employee.id} not found.`);
    }
    return db.put('employees', employee);
  }

  async getAllEmployees(): Promise<Employee[]> {
    const db = await this.dbPromise;
    return db.getAll('employees');
  }

  async deleteEmployee(employeeId: number): Promise<void> {
    const db = await this.dbPromise;
    return db.delete('employees', employeeId);
  }
}