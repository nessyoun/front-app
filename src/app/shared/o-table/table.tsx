import React, { useState, useEffect } from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { TreeNode } from 'primereact/treenode';





const OTable: React.FC<CrudTableProps> = ({
  TABLE_TITLE,
  columns,
  OService
}) => {

  const [nodes] = useState([
    {
      key: '0',
      data: { 
        name: 'Documents', 
        size: '75kb', 
        type: 'Folder' 
      },
      children: [
        {
          key: '0-0',
          data: { 
            name: 'Work', 
            size: '55kb', 
            type: 'Folder' 
          },
          children: [
            {
              key: '0-0-0',
              data: { 
                name: 'Report.doc', 
                size: '25kb', 
                type: 'Document' 
              }
            },
            {
              key: '0-0-1',
              data: { 
                name: 'Presentation.ppt', 
                size: '30kb', 
                type: 'Presentation' 
              }
            }
          ]
        },
        {
          key: '0-1',
          data: { 
            name: 'Personal', 
            size: '20kb', 
            type: 'Folder' 
          },
          children: [
            {
              key: '0-1-0',
              data: { 
                name: 'Resume.pdf', 
                size: '20kb', 
                type: 'Document' 
              }
            }
          ]
        }
      ]
    },
    {
      key: '1',
      data: { 
        name: 'Pictures', 
        size: '150kb', 
        type: 'Folder' 
      },
      children: [
        {
          key: '1-0',
          data: { 
            name: 'Vacation.jpg', 
            size: '100kb', 
            type: 'Image' 
          }
        },
        {
          key: '1-1',
          data: { 
            name: 'Family.png', 
            size: '50kb', 
            type: 'Image' 
          }
        }
      ]
    }
  ]);
  return (
    <div className="card">
    <h4>{TABLE_TITLE}</h4>
    <TreeTable value={nodes} tableStyle={{ minWidth: '50rem' }}>
    {columns.map((col) => (
        <Column key={col.field} field={col.field} header={col.header} />
    ))}
    </TreeTable>
</div>

  );
};

export default OTable;
        





