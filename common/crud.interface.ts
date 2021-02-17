export interface CRUD {
  list: (limit: number, page: number) => Promise<any>;
  create: (resource: any, file: any) => Promise<any>;
  readById: (resourceId: any) => Promise<any>;
  deleteById: (resourceId: any) => Promise<string>;
  patchById: (resourceId: any, file: any, id: number) => Promise<string>;
}
