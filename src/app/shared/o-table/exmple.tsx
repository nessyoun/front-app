import { useState } from "react";
import { CrudTable } from "./o-table";

// Define entity type
type PurchaseOrder = {
    id: number;
    orderNumber: string;
    vendor: string;
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
    isUrgent: boolean;
    createdAt: string;
    notes: string;
    metadata: { department: string; approver: string };
  };
  
  // Define configuration
  const purchaseOrderConfig: EntityConfig<PurchaseOrder> = {
    entity: 'Purchase Order',
    idKey: 'id',
    fields: [
      { key: 'id', label: 'ID', type: 'number', visible: true, editable: false },
      { key: 'orderNumber', label: 'Order Number', type: 'string', required: true, visible: true, searchable: true, editable: true },
      { key: 'vendor', label: 'Vendor', type: 'string', required: true, visible: true, searchable: true, editable: true },
      { key: 'amount', label: 'Amount', type: 'number', required: true, visible: true, searchable: true, editable: true },
      { key: 'status', label: 'Status', type: 'enum', enumValues: ['pending', 'approved', 'rejected'], visible: false, editable: true },
      { key: 'isUrgent', label: 'Urgent', type: 'boolean', visible: false, editable: true },
      { key: 'createdAt', label: 'Created At', type: 'date', visible: false, editable: false },
      { key: 'notes', label: 'Notes', type: 'string', visible: false, editable: true, searchable: true },
      { key: 'metadata', label: 'Metadata', type: 'json', visible: false, editable: true }
    ]
  };
  
  // Sample data
  const sampleData: PurchaseOrder[] = [
    {
      id: 1,
      orderNumber: 'PO-2025-001',
      vendor: 'Acme Corp',
      amount: 5000,
      status: 'approved',
      isUrgent: false,
      createdAt: '2025-01-15T10:00:00Z',
      notes: 'Standard office supplies order',
      metadata: { department: 'IT', approver: 'John Doe' }
    },
    {
      id: 2,
      orderNumber: 'PO-2025-002',
      vendor: 'Tech Solutions',
      amount: 12500,
      status: 'pending',
      isUrgent: true,
      createdAt: '2025-02-01T14:30:00Z',
      notes: 'Urgent server hardware purchase',
      metadata: { department: 'Operations', approver: 'Jane Smith' }
    },
    {
      id: 3,
      orderNumber: 'PO-2025-003',
      vendor: 'Office Depot',
      amount: 750,
      status: 'approved',
      isUrgent: false,
      createdAt: '2025-03-10T09:15:00Z',
      notes: 'Monthly stationery order',
      metadata: { department: 'Admin', approver: 'Bob Johnson' }
    }
  ];
  
  // Example component
  export default function CrudTableExample() {
    const [orders, setOrders] = useState(sampleData);
  
    const handleCreate = async (values: Partial<PurchaseOrder>): Promise<PurchaseOrder> => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      const newOrder: PurchaseOrder = {
        id: Math.max(...orders.map(o => o.id)) + 1,
        orderNumber: values.orderNumber || '',
        vendor: values.vendor || '',
        amount: values.amount || 0,
        status: values.status || 'pending',
        isUrgent: values.isUrgent || false,
        createdAt: new Date().toISOString(),
        notes: values.notes || '',
        metadata: values.metadata || { department: '', approver: '' }
      };
      setOrders(prev => [...prev, newOrder]);
      return newOrder;
    };
  
    const handleUpdate = async (values: PurchaseOrder): Promise<PurchaseOrder> => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      setOrders(prev => prev.map(o => o.id === values.id ? values : o));
      return values;
    };
  
    const handleDelete = async (id: number): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      setOrders(prev => prev.filter(o => o.id !== id));
    };
  
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Purchase Orders Management</h1>
        <CrudTable
          config={purchaseOrderConfig}
          data={orders}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    );
  }