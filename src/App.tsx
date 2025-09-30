import React, { useState, useEffect } from 'react';
import { Table, Button, Input, DatePicker, Switch, Space, message } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined, CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { EditableQuote } from './types/Quote';
import quoteData from './data/QuoteData.json';
import dayjs from 'dayjs';

const App: React.FC = () => {
  const [quotes, setQuotes] = useState<EditableQuote[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load data from localStorage or use initial data
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
      setQuotes(JSON.parse(savedQuotes));
    } else {
      setQuotes(quoteData as EditableQuote[]);
    }
  }, []);

  const saveToLocalStorage = (updatedQuotes: EditableQuote[]) => {
    localStorage.setItem('quotes', JSON.stringify(updatedQuotes));
  };

  const formatDate = (dateString: string): string => {
    return dayjs(dateString).format('YYYY-MM-DD');
  };

  const handleEdit = (record: EditableQuote) => {
    setQuotes(prev => prev.map(quote => 
      quote.id === record.id 
        ? { 
            ...quote, 
            isEditing: true,
            editedFields: {
              quoteDate: quote.quoteDate,
              firstCost: quote.costing.firstCost,
              retailPrice: quote.clubCosting.retailPrice,
              committedFlag: quote.committedFlag
            }
          }
        : quote
    ));
  };

  const handleSave = (record: EditableQuote) => {
    if (!record.editedFields) return;

    const updatedQuote: EditableQuote = {
      ...record,
      quoteDate: record.editedFields.quoteDate || record.quoteDate,
      costing: {
        ...record.costing,
        firstCost: record.editedFields.firstCost || record.costing.firstCost
      },
      clubCosting: {
        ...record.clubCosting,
        retailPrice: record.editedFields.retailPrice || record.clubCosting.retailPrice
      },
      committedFlag: record.editedFields.committedFlag !== undefined ? record.editedFields.committedFlag : record.committedFlag,
      isEditing: false,
      hasUnsavedChanges: false,
      editedFields: undefined
    };

    const updatedQuotes = quotes.map(quote => 
      quote.id === record.id ? updatedQuote : quote
    );

    setQuotes(updatedQuotes);
    saveToLocalStorage(updatedQuotes);
    message.success('Quote saved successfully');
  };

  const handleCancel = (record: EditableQuote) => {
    setQuotes(prev => prev.map(quote => 
      quote.id === record.id 
        ? { 
            ...quote, 
            isEditing: false,
            hasUnsavedChanges: false,
            editedFields: undefined
          }
        : quote
    ));
  };

  const handleFieldChange = (record: EditableQuote, field: string, value: any) => {
    setQuotes(prev => prev.map(quote => 
      quote.id === record.id 
        ? { 
            ...quote, 
            hasUnsavedChanges: true,
            editedFields: {
              ...quote.editedFields,
              [field]: value
            }
          }
        : quote
    ));
  };

  const toggleExpand = (recordId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recordId)) {
        newSet.delete(recordId);
      } else {
        newSet.add(recordId);
      }
      return newSet;
    });
  };

  const columns: ColumnsType<EditableQuote> = [
    {
      title: 'Expand',
      key: 'expand',
      width: 80,
      render: (_, record) => (
        <Button
          type="text"
          icon={expandedRows.has(record.id) ? <CaretDownOutlined /> : <CaretRightOutlined />}
          onClick={() => toggleExpand(record.id)}
        />
      ),
    },
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      key: 'itemName',
      width: 200,
    },
    {
      title: 'Item Description',
      dataIndex: 'itemDescription',
      key: 'itemDescription',
      width: 300,
      ellipsis: true,
    },
    {
      title: 'Supplier',
      dataIndex: ['supplier', 'name'],
      key: 'supplier',
      width: 150,
    },
    {
      title: 'Quote Date',
      dataIndex: 'quoteDate',
      key: 'quoteDate',
      width: 120,
      render: (_, record) => {
        if (record.isEditing) {
          return (
            <DatePicker
              value={dayjs(record.editedFields?.quoteDate || record.quoteDate)}
              onChange={(date) => handleFieldChange(record, 'quoteDate', date?.format('YYYY-MM-DD'))}
              format="YYYY-MM-DD"
              size="small"
            />
          );
        }
        return formatDate(record.quoteDate);
      },
    },
    {
      title: 'First Cost ($)',
      dataIndex: ['costing', 'firstCost'],
      key: 'firstCost',
      width: 120,
      render: (_, record) => {
        if (record.isEditing) {
          return (
            <Input
              type="number"
              value={record.editedFields?.firstCost || record.costing.firstCost}
              onChange={(e) => handleFieldChange(record, 'firstCost', parseFloat(e.target.value))}
              size="small"
              prefix="$"
            />
          );
        }
        return `$${record.costing.firstCost.toFixed(2)}`;
      },
    },
    {
      title: 'Retail Price ($)',
      dataIndex: ['clubCosting', 'retailPrice'],
      key: 'retailPrice',
      width: 120,
      render: (_, record) => {
        if (record.isEditing) {
          return (
            <Input
              type="number"
              value={record.editedFields?.retailPrice || record.clubCosting.retailPrice}
              onChange={(e) => handleFieldChange(record, 'retailPrice', parseFloat(e.target.value))}
              size="small"
              prefix="$"
            />
          );
        }
        return `$${record.clubCosting.retailPrice.toFixed(2)}`;
      },
    },
    {
      title: 'Committed',
      dataIndex: 'committedFlag',
      key: 'committedFlag',
      width: 100,
      render: (_, record) => {
        if (record.isEditing) {
          return (
            <Switch
              checked={record.editedFields?.committedFlag !== undefined ? record.editedFields.committedFlag : record.committedFlag}
              onChange={(checked) => handleFieldChange(record, 'committedFlag', checked)}
              size="small"
            />
          );
        }
        return record.committedFlag ? 'Yes' : 'No';
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => {
        if (record.isEditing) {
          return (
            <Space>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                size="small"
                onClick={() => handleSave(record)}
              >
                Save
              </Button>
              <Button
                icon={<CloseOutlined />}
                size="small"
                onClick={() => handleCancel(record)}
              >
                Cancel
              </Button>
            </Space>
          );
        }
        return (
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
        );
      },
    },
  ];

  const expandedRowRender = (record: EditableQuote) => {
    const materialCostingColumns: ColumnsType<{ materialDescription: string; costPerSellingUnit: number }> = [
      {
        title: 'Material Description',
        dataIndex: 'materialDescription',
        key: 'materialDescription',
      },
      {
        title: 'Cost Per Selling Unit ($)',
        dataIndex: 'costPerSellingUnit',
        key: 'costPerSellingUnit',
        render: (value: number) => `$${value.toFixed(2)}`,
      },
    ];

    return (
      <div className="material-costing-table">
        <h4>Component Material Costing</h4>
        <Table
          columns={materialCostingColumns}
          dataSource={record.costing.componentMaterialCosting}
          pagination={false}
          size="small"
          rowKey="materialDescription"
        />
      </div>
    );
  };

  return (
    <div className="quotes-container">
      <div className="quotes-header">
        <h1>Product Quotes Manager</h1>
      </div>
      <div className="quotes-table">
        <Table
          columns={columns}
          dataSource={quotes}
          rowKey="id"
          expandable={{
            expandedRowKeys: Array.from(expandedRows),
            expandedRowRender,
            onExpand: (expanded, record) => {
              if (!expanded) {
                setExpandedRows(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(record.id);
                  return newSet;
                });
              }
            },
          }}
          rowClassName={(record) => {
            if (record.isEditing) return 'editing-row';
            if (record.hasUnsavedChanges) return 'unsaved-changes';
            return '';
          }}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} quotes`,
          }}
        />
      </div>
    </div>
  );
};

export default App;
