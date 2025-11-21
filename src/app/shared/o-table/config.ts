type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'json' | 'relation';

type FieldConfig = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  visible?: boolean;
  searchable?: boolean;
  editable?: boolean;
  enumValues?: string[];
};

type EntityConfig<T> = {
  entity: string;
  idKey: keyof T;
  fields: FieldConfig[];
  children?: { relationKey: keyof T; entity: string }[];
};

interface CrudTableProps<T extends Record<string, any>> {
  config: EntityConfig<T>;
  data: T[];
  onCreate(values: Partial<T>): Promise<T>;
  onUpdate(values: T): Promise<T>;
  onDelete(id: T[keyof T]): Promise<void>;
}
