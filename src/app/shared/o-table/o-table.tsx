import React, { useState, useMemo, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { TreeTable } from 'primereact/treetable';


export function CrudTable<T extends Record<string, any>>({
  config,
  data,
  onCreate,
  onUpdate,
  onDelete,
}: CrudTableProps<T>) {
  const toastRef = React.useRef<Toast>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState('');
  const [editDialog, setEditDialog] = useState(false);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<T | null>(null);
  const [formData, setFormData] = useState<Partial<T>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  // Debounce global filter
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilter(globalFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [globalFilter]);

  // Get visible fields (max 4)
  const visibleFields = useMemo(() => {
    return config.fields.filter(f => f.visible !== false).slice(0, 4);
  }, [config.fields]);

  // Get non-visible fields for preview
  const hiddenFields = useMemo(() => {
    const visibleKeys = new Set(visibleFields.map(f => f.key));
    return config.fields.filter(f => !visibleKeys.has(f.key));
  }, [config.fields, visibleFields]);

  // Filter data based on searchable fields
  const filteredData = useMemo(() => {
    if (!debouncedFilter.trim()) return data;
    
    const searchLower = debouncedFilter.toLowerCase();
    const searchableFields = config.fields.filter(f => f.searchable !== false);
    
    return data.filter(row => {
      return searchableFields.some(field => {
        const value = row[field.key];
        if (value == null) return false;
        
        if (field.type === 'date') {
          return formatDate(value).toLowerCase().includes(searchLower);
        }
        
        return String(value).toLowerCase().includes(searchLower);
      });
    });
  }, [data, debouncedFilter, config.fields]);

  // Format date for display
  const formatDate = (value: any): string => {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format field value for display
  const formatFieldValue = (field: FieldConfig, value: any): string => {
    if (value == null) return '';
    
    switch (field.type) {
      case 'date':
        return formatDate(value);
      case 'boolean':
        return value ? 'Yes' : 'No';
      case 'json':
      case 'relation':
        return JSON.stringify(value);
      default:
        return String(value);
    }
  };

  // Render field input in form
  const renderFieldInput = (field: FieldConfig) => {
    const value = formData[field.key as keyof T];
    const onChange = (val: any) => {
      setFormData(prev => ({ ...prev, [field.key]: val }));
    };

    if (!field.editable && !isCreating) {
      return (
        <div className="p-inputtext p-component p-disabled" style={{ padding: '0.75rem' }}>
          {formatFieldValue(field, value)}
        </div>
      );
    }

    switch (field.type) {
      case 'boolean':
        return (
          <Checkbox
            checked={!!value}
            onChange={e => onChange(e.checked)}
          />
        );
      
      case 'number':
        return (
          <InputNumber
            value={value as number}
            onValueChange={e => onChange(e.value)}
            className="w-full"
          />
        );
      
      case 'date':
        return (
          <Calendar
            value={value ? new Date(value as string) : null}
            onChange={e => onChange(e.value ? (e.value as Date).toISOString() : null)}
            dateFormat="M dd, yy"
            showIcon
            className="w-full"
          />
        );
      
      case 'enum':
        return (
          <Dropdown
            value={value}
            options={field.enumValues || []}
            onChange={e => onChange(e.value)}
            placeholder={`Select ${field.label}`}
            className="w-full"
          />
        );
      
      case 'json':
      case 'relation':
        return (
          <InputTextarea
            value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            onChange={e => {
              try {
                onChange(JSON.parse(e.target.value));
              } catch {
                onChange(e.target.value);
              }
            }}
            rows={3}
            className="w-full"
          />
        );
      
      default:
        return (
          <InputText
            value={value as string || ''}
            onChange={e => onChange(e.target.value)}
            className="w-full"
          />
        );
    }
  };

  // Open create dialog
  const handleCreate = () => {
    setIsCreating(true);
    setCurrentRecord(null);
    setFormData({});
    setEditDialog(true);
  };

  // Open edit dialog
  const handleEdit = (record: T) => {
    setIsCreating(false);
    setCurrentRecord(record);
    setFormData({ ...record });
    setEditDialog(true);
  };

  // Open preview dialog
  const handlePreview = (record: T) => {
    setCurrentRecord(record);
    setPreviewDialog(true);
  };

  // Handle delete with confirmation
  const handleDelete = (record: T) => {
    confirmDialog({
      message: `Are you sure you want to delete this ${config.entity}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        setLoading(true);
        try {
          await onDelete(record[config.idKey]);
          toastRef.current?.show({
            severity: 'success',
            summary: 'Deleted',
            detail: `${config.entity} deleted successfully`,
            life: 3000
          });
        } catch (error) {
          toastRef.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to delete ${config.entity}`,
            life: 3000
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Save form (create or update)
  const handleSave = async () => {
    setLoading(true);
    try {
      if (isCreating) {
        await onCreate(formData);
        toastRef.current?.show({
          severity: 'success',
          summary: 'Created',
          detail: `${config.entity} created successfully`,
          life: 3000
        });
      } else {
        await onUpdate(formData as T);
        toastRef.current?.show({
          severity: 'success',
          summary: 'Updated',
          detail: `${config.entity} updated successfully`,
          life: 3000
        });
      }
      setEditDialog(false);
    } catch (error) {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: `Failed to save ${config.entity}`,
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  // Render action buttons column
  const actionBodyTemplate = (rowData: T) => {
    return (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button
          icon="pi pi-eye"
          rounded
          text
          severity="info"
          onClick={() => handlePreview(rowData)}
          tooltip="Preview"
        />
        <Button
          icon="pi pi-pencil"
          rounded
          text
          severity="warning"
          onClick={() => handleEdit(rowData)}
          tooltip="Edit"
        />
        <Button
          icon="pi pi-trash"
          rounded
          text
          severity="danger"
          onClick={() => handleDelete(rowData)}
          tooltip="Delete"
        />
      </div>
    );
  };

  // Render children/nested data
  const renderChildren = (record: T) => {
    if (!config.children || config.children.length === 0) return null;

    return (
      <div style={{ marginTop: '1rem', paddingLeft: '1rem', borderLeft: '2px solid #dee2e6' }}>
        {config.children.map(child => {
          const childData = record[child.relationKey];
          if (!childData) return null;

          return (
            <div key={String(child.relationKey)} style={{ marginBottom: '0.5rem' }}>
              <strong>{child.entity}:</strong>
              <pre style={{ marginTop: '0.25rem', fontSize: '0.875rem' }}>
                {JSON.stringify(childData, null, 2)}
              </pre>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <Toast ref={toastRef} />
      <ConfirmDialog />

      {/* Header with search and create button */}
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1, maxWidth: '400px' }}>
          <span className="p-input-icon-left" style={{ width: '100%' }}>
            <i className="pi pi-search" />
            <InputText
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              className="w-full"
            />
          </span>
        </div>
        <Button
          label={`Create ${config.entity}`}
          icon="pi pi-plus"
          onClick={handleCreate}
          severity="success"
        />
      </div>

      {/* Data Table */}
      <TreeTable
        value={filteredData}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        loading={loading}
        emptyMessage={`No ${config.entity}s found`}
        stripedRows
      >
        {visibleFields.map(field => (
          <Column
            key={field.key}
            field={field.key}
            header={field.label}
            body={rowData => formatFieldValue(field, rowData[field.key])}
            sortable
            expander
          />
        ))}
        <Column
          header="Actions"
          body={actionBodyTemplate}
          exportable={false}
          style={{ width: '12rem', textAlign: 'center' }}
        />
      </TreeTable>

      {/* Edit/Create Dialog */}
      <Dialog
        visible={editDialog}
        onHide={() => setEditDialog(false)}
        header={isCreating ? `Create ${config.entity}` : `Edit ${config.entity}`}
        modal
        style={{ width: '600px' }}
        footer={
          <div>
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={() => setEditDialog(false)}
              severity="secondary"
              text
            />
            <Button
              label="Save"
              icon="pi pi-check"
              onClick={handleSave}
              loading={loading}
            />
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {config.fields.map(field => {
            if (field.key === config.idKey && !isCreating) return null;
            
            return (
              <div key={field.key}>
                <label htmlFor={field.key} style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  {field.label}
                  {field.required && <span style={{ color: 'red' }}> *</span>}
                </label>
                {renderFieldInput(field)}
              </div>
            );
          })}
        </div>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        visible={previewDialog}
        onHide={() => setPreviewDialog(false)}
        header={`Preview ${config.entity}`}
        modal
        style={{ width: '600px' }}
      >
        {currentRecord && (
          <div>
            {/* Show all fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
              {config.fields.map(field => (
                <React.Fragment key={field.key}>
                  <strong>{field.label}:</strong>
                  <span>{formatFieldValue(field, currentRecord[field.key])}</span>
                </React.Fragment>
              ))}
            </div>
            
            {/* Show children if configured */}
            {renderChildren(currentRecord)}
          </div>
        )}
      </Dialog>
    </div>
  );
}

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

