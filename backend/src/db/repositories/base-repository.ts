import { randomUUID } from 'node:crypto';
import { query } from '../connection.js';

export abstract class BaseRepository<T extends { id: string }, CreateData, UpdateData> {
  protected abstract readonly table: string;
  protected abstract map(row: Record<string, unknown>): T;
  protected abstract createColumns(data: CreateData): Readonly<Record<string, unknown>>;
  protected abstract updateColumns(data: UpdateData): Readonly<Record<string, unknown>>;

  async findAll(): Promise<T[]> { return (await query<Record<string, unknown>>(`SELECT * FROM ${this.table}`)).map((row) => this.map(row)); }
  async findById(id: string): Promise<T | null> { const rows = await query<Record<string, unknown>>(`SELECT * FROM ${this.table} WHERE id = $1`, [id]); return rows[0] ? this.map(rows[0]) : null; }
  async create(data: CreateData): Promise<T> {
    const columns = { id: randomUUID(), ...this.createColumns(data) };
    return this.executeInsert(columns);
  }
  async update(id: string, data: UpdateData): Promise<T | null> {
    const columns = this.updateColumns(data); const keys = Object.keys(columns);
    if (keys.length === 0) return this.findById(id);
    const values = keys.map((key) => columns[key]!);
    const assignments = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const rows = await query<Record<string, unknown>>(`UPDATE ${this.table} SET ${assignments} WHERE id = $${keys.length + 1} RETURNING *`, [...values, id]);
    return rows[0] ? this.map(rows[0]) : null;
  }
  async delete(id: string): Promise<boolean> { return (await query(`DELETE FROM ${this.table} WHERE id = $1 RETURNING id`, [id])).length > 0; }
  private async executeInsert(columns: Readonly<Record<string, unknown>>): Promise<T> {
    const keys = Object.keys(columns); const values = keys.map((key) => columns[key]!);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
    const rows = await query<Record<string, unknown>>(`INSERT INTO ${this.table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`, values);
    return this.map(rows[0]!);
  }
}
