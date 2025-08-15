import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Card,
  Tag,
  Modal,
  Form,
  Select,
  InputNumber,
  message,
  Badge,
  Tooltip,
  Row,
  Col,
  DatePicker,
  Typography,
  Dropdown
} from 'antd';
import type { MenuProps } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CarOutlined,
  ToolOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  MoreOutlined,
  ExportOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

// Bus interface
interface Bus {
  id: string;
  busNumber: string;
  model: string;
  manufacturer: string;
  capacity: number;
  yearOfManufacture: number;
  plateNumber: string;
  status: 'active' | 'maintenance' | 'inactive' | 'out-of-service';
  fuelType: 'diesel' | 'electric' | 'hybrid' | 'cng';
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  mileage: number;
  routeAssigned?: string;
  driverAssigned?: string;
  insuranceExpiry: string;
  registrationExpiry: string;
  createdAt: string;
  updatedAt: string;
}

// Sample data
const sampleBusData: Bus[] = [
  {
    id: '1',
    busNumber: 'BUS-001',
    model: 'Volvo 9700',
    manufacturer: 'Volvo',
    capacity: 45,
    yearOfManufacture: 2020,
    plateNumber: 'ABC-1234',
    status: 'active',
    fuelType: 'diesel',
    lastMaintenanceDate: '2024-01-15',
    nextMaintenanceDate: '2024-04-15',
    mileage: 125000,
    routeAssigned: 'Route A',
    driverAssigned: 'John Doe',
    insuranceExpiry: '2024-12-31',
    registrationExpiry: '2024-11-30',
    createdAt: '2023-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    busNumber: 'BUS-002',
    model: 'Mercedes Citaro',
    manufacturer: 'Mercedes-Benz',
    capacity: 40,
    yearOfManufacture: 2021,
    plateNumber: 'XYZ-5678',
    status: 'maintenance',
    fuelType: 'electric',
    lastMaintenanceDate: '2024-02-01',
    nextMaintenanceDate: '2024-05-01',
    mileage: 89000,
    routeAssigned: 'Route B',
    driverAssigned: 'Jane Smith',
    insuranceExpiry: '2024-12-31',
    registrationExpiry: '2024-10-15',
    createdAt: '2023-02-15',
    updatedAt: '2024-02-01'
  },
  {
    id: '3',
    busNumber: 'BUS-003',
    model: 'Scania Citywide',
    manufacturer: 'Scania',
    capacity: 50,
    yearOfManufacture: 2019,
    plateNumber: 'DEF-9012',
    status: 'active',
    fuelType: 'hybrid',
    lastMaintenanceDate: '2024-01-20',
    nextMaintenanceDate: '2024-04-20',
    mileage: 156000,
    routeAssigned: 'Route C',
    driverAssigned: 'Mike Johnson',
    insuranceExpiry: '2024-12-31',
    registrationExpiry: '2024-09-30',
    createdAt: '2023-03-01',
    updatedAt: '2024-01-20'
  },
  {
    id: '4',
    busNumber: 'BUS-004',
    model: 'MAN Lion City',
    manufacturer: 'MAN',
    capacity: 35,
    yearOfManufacture: 2022,
    plateNumber: 'GHI-3456',
    status: 'inactive',
    fuelType: 'cng',
    lastMaintenanceDate: '2024-01-10',
    nextMaintenanceDate: '2024-04-10',
    mileage: 45000,
    routeAssigned: undefined,
    driverAssigned: undefined,
    insuranceExpiry: '2024-12-31',
    registrationExpiry: '2024-08-15',
    createdAt: '2023-04-15',
    updatedAt: '2024-01-10'
  }
];

const BusPage: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>(sampleBusData);
  const [filteredBuses, setFilteredBuses] = useState<Bus[]>(sampleBusData);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [fuelTypeFilter, setFuelTypeFilter] = useState<string>('all');
  
  // Modal states
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [form] = Form.useForm();

  // Filter buses based on search and filters
  useEffect(() => {
    let filtered = buses;

    // Search filter
    if (searchText) {
      filtered = filtered.filter(bus =>
        bus.busNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        bus.model.toLowerCase().includes(searchText.toLowerCase()) ||
        bus.manufacturer.toLowerCase().includes(searchText.toLowerCase()) ||
        bus.plateNumber.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(bus => bus.status === statusFilter);
    }

    // Fuel type filter
    if (fuelTypeFilter !== 'all') {
      filtered = filtered.filter(bus => bus.fuelType === fuelTypeFilter);
    }

    setFilteredBuses(filtered);
  }, [buses, searchText, statusFilter, fuelTypeFilter]);

  // Status color mapping
  const getStatusColor = (status: Bus['status']) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'maintenance':
        return 'orange';
      case 'inactive':
        return 'gray';
      case 'out-of-service':
        return 'red';
      default:
        return 'default';
    }
  };

  // Status icon mapping
  const getStatusIcon = (status: Bus['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircleOutlined />;
      case 'maintenance':
        return <ToolOutlined />;
      case 'inactive':
        return <StopOutlined />;
      case 'out-of-service':
        return <ExclamationCircleOutlined />;
      default:
        return null;
    }
  };

  // Table columns
  const columns: ColumnsType<Bus> = [
    {
      title: 'Bus Number',
      dataIndex: 'busNumber',
      key: 'busNumber',
      width: 120,
      fixed: 'left',
      sorter: (a, b) => a.busNumber.localeCompare(b.busNumber),
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Model & Manufacturer',
      key: 'modelManufacturer',
      width: 200,
      render: (_, record) => (
        <div>
          <div>{record.model}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.manufacturer}
          </Text>
        </div>
      ),
    },
    {
      title: 'Plate Number',
      dataIndex: 'plateNumber',
      key: 'plateNumber',
      width: 120,
      render: (text) => <Text code>{text}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Maintenance', value: 'maintenance' },
        { text: 'Inactive', value: 'inactive' },
        { text: 'Out of Service', value: 'out-of-service' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag icon={getStatusIcon(status)} color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 100,
      sorter: (a, b) => a.capacity - b.capacity,
      render: (capacity) => `${capacity} seats`,
    },
    {
      title: 'Fuel Type',
      dataIndex: 'fuelType',
      key: 'fuelType',
      width: 100,
      filters: [
        { text: 'Diesel', value: 'diesel' },
        { text: 'Electric', value: 'electric' },
        { text: 'Hybrid', value: 'hybrid' },
        { text: 'CNG', value: 'cng' },
      ],
      onFilter: (value, record) => record.fuelType === value,
      render: (fuelType) => (
        <Tag color={
          fuelType === 'electric' ? 'green' :
          fuelType === 'hybrid' ? 'blue' :
          fuelType === 'cng' ? 'orange' : 'default'
        }>
          {fuelType.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Mileage',
      dataIndex: 'mileage',
      key: 'mileage',
      width: 120,
      sorter: (a, b) => a.mileage - b.mileage,
      render: (mileage) => `${mileage.toLocaleString()} km`,
    },
    {
      title: 'Route Assigned',
      dataIndex: 'routeAssigned',
      key: 'routeAssigned',
      width: 120,
      render: (route) => route ? <Tag>{route}</Tag> : <Text type="secondary">Unassigned</Text>,
    },
    {
      title: 'Next Maintenance',
      dataIndex: 'nextMaintenanceDate',
      key: 'nextMaintenanceDate',
      width: 150,
      sorter: (a, b) => dayjs(a.nextMaintenanceDate).unix() - dayjs(b.nextMaintenanceDate).unix(),
      render: (date) => {
        const maintenanceDate = dayjs(date);
        const isOverdue = maintenanceDate.isBefore(dayjs());
        const isUpcoming = maintenanceDate.diff(dayjs(), 'days') <= 7;
        
        return (
          <Tooltip title={isOverdue ? 'Maintenance overdue!' : isUpcoming ? 'Maintenance due soon' : ''}>
            <Badge
              status={isOverdue ? 'error' : isUpcoming ? 'warning' : 'default'}
              text={maintenanceDate.format('MMM DD, YYYY')}
            />
          </Tooltip>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => {
        const actionItems: MenuProps['items'] = [
          {
            key: 'view',
            icon: <EyeOutlined />,
            label: 'View Details',
            onClick: () => handleView(record),
          },
          {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit',
            onClick: () => handleEdit(record),
          },
          {
            type: 'divider',
          },
          {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Delete',
            danger: true,
            onClick: () => handleDelete(record.id),
          },
        ];

        return (
          <Space>
            <Tooltip title="View Details">
              <Button 
                type="text" 
                icon={<EyeOutlined />} 
                onClick={() => handleView(record)}
              />
            </Tooltip>
            <Tooltip title="Edit">
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
            <Dropdown menu={{ items: actionItems }} trigger={['click']}>
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  // Row selection
  const rowSelection: TableRowSelection<Bus> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  // Handlers
  const handleAdd = () => {
    form.resetFields();
    setIsAddModalVisible(true);
  };

  const handleEdit = (bus: Bus) => {
    setSelectedBus(bus);
    form.setFieldsValue({
      ...bus,
      lastMaintenanceDate: dayjs(bus.lastMaintenanceDate),
      nextMaintenanceDate: dayjs(bus.nextMaintenanceDate),
      insuranceExpiry: dayjs(bus.insuranceExpiry),
      registrationExpiry: dayjs(bus.registrationExpiry),
    });
    setIsEditModalVisible(true);
  };

  const handleView = (bus: Bus) => {
    setSelectedBus(bus);
    setIsViewModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this bus?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        setBuses(buses.filter(bus => bus.id !== id));
        message.success('Bus deleted successfully');
      },
    });
  };

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select buses to delete');
      return;
    }

    Modal.confirm({
      title: `Are you sure you want to delete ${selectedRowKeys.length} bus(es)?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        setBuses(buses.filter(bus => !selectedRowKeys.includes(bus.id)));
        setSelectedRowKeys([]);
        message.success(`${selectedRowKeys.length} bus(es) deleted successfully`);
      },
    });
  };

  const handleFormSubmit = async (values: Record<string, unknown>) => {
    try {
      setLoading(true);
      
      const busData = {
        ...values,
        lastMaintenanceDate: dayjs(values.lastMaintenanceDate as string).format('YYYY-MM-DD'),
        nextMaintenanceDate: dayjs(values.nextMaintenanceDate as string).format('YYYY-MM-DD'),
        insuranceExpiry: dayjs(values.insuranceExpiry as string).format('YYYY-MM-DD'),
        registrationExpiry: dayjs(values.registrationExpiry as string).format('YYYY-MM-DD'),
        updatedAt: dayjs().format('YYYY-MM-DD'),
      };

      if (selectedBus) {
        // Edit existing bus
        setBuses(buses.map(bus => 
          bus.id === selectedBus.id ? { ...bus, ...busData } : bus
        ));
        message.success('Bus updated successfully');
        setIsEditModalVisible(false);
      } else {
        // Add new bus
        const newBus: Bus = {
          id: Date.now().toString(),
          ...busData,
          createdAt: dayjs().format('YYYY-MM-DD'),
        } as Bus;
        setBuses([...buses, newBus]);
        message.success('Bus added successfully');
        setIsAddModalVisible(false);
      }
      
      form.resetFields();
      setSelectedBus(null);
    } catch {
      message.error('Operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    message.info('Export functionality will be implemented');
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      message.success('Data refreshed');
    }, 1000);
  };

  const renderBusForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFormSubmit}
      initialValues={{
        status: 'active',
        fuelType: 'diesel',
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="busNumber"
            label="Bus Number"
            rules={[{ required: true, message: 'Please enter bus number' }]}
          >
            <Input placeholder="e.g., BUS-001" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="plateNumber"
            label="Plate Number"
            rules={[{ required: true, message: 'Please enter plate number' }]}
          >
            <Input placeholder="e.g., ABC-1234" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="manufacturer"
            label="Manufacturer"
            rules={[{ required: true, message: 'Please enter manufacturer' }]}
          >
            <Input placeholder="e.g., Volvo" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="model"
            label="Model"
            rules={[{ required: true, message: 'Please enter model' }]}
          >
            <Input placeholder="e.g., 9700" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="capacity"
            label="Capacity (seats)"
            rules={[{ required: true, message: 'Please enter capacity' }]}
          >
            <InputNumber min={1} max={100} placeholder="45" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="yearOfManufacture"
            label="Year of Manufacture"
            rules={[{ required: true, message: 'Please enter year' }]}
          >
            <InputNumber 
              min={1990} 
              max={new Date().getFullYear()} 
              placeholder="2020" 
              style={{ width: '100%' }} 
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="mileage"
            label="Mileage (km)"
            rules={[{ required: true, message: 'Please enter mileage' }]}
          >
            <InputNumber min={0} placeholder="125000" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="maintenance">Maintenance</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="out-of-service">Out of Service</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="fuelType"
            label="Fuel Type"
            rules={[{ required: true, message: 'Please select fuel type' }]}
          >
            <Select>
              <Option value="diesel">Diesel</Option>
              <Option value="electric">Electric</Option>
              <Option value="hybrid">Hybrid</Option>
              <Option value="cng">CNG</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="routeAssigned"
            label="Route Assigned"
          >
            <Select placeholder="Select route" allowClear>
              <Option value="Route A">Route A</Option>
              <Option value="Route B">Route B</Option>
              <Option value="Route C">Route C</Option>
              <Option value="Route D">Route D</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="driverAssigned"
            label="Driver Assigned"
          >
            <Select placeholder="Select driver" allowClear>
              <Option value="John Doe">John Doe</Option>
              <Option value="Jane Smith">Jane Smith</Option>
              <Option value="Mike Johnson">Mike Johnson</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="lastMaintenanceDate"
            label="Last Maintenance Date"
            rules={[{ required: true, message: 'Please select date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="nextMaintenanceDate"
            label="Next Maintenance Date"
            rules={[{ required: true, message: 'Please select date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="insuranceExpiry"
            label="Insurance Expiry"
            rules={[{ required: true, message: 'Please select date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="registrationExpiry"
            label="Registration Expiry"
            rules={[{ required: true, message: 'Please select date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );

  const renderBusDetails = () => {
    if (!selectedBus) return null;

    return (
      <div style={{ padding: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <Row gutter={16}>
                <Col span={8}>
                  <Text strong>Bus Number:</Text>
                  <div>{selectedBus.busNumber}</div>
                </Col>
                <Col span={8}>
                  <Text strong>Plate Number:</Text>
                  <div><Text code>{selectedBus.plateNumber}</Text></div>
                </Col>
                <Col span={8}>
                  <Text strong>Status:</Text>
                  <div>
                    <Tag icon={getStatusIcon(selectedBus.status)} color={getStatusColor(selectedBus.status)}>
                      {selectedBus.status.toUpperCase()}
                    </Tag>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Vehicle Information" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div><Text strong>Manufacturer:</Text> {selectedBus.manufacturer}</div>
                <div><Text strong>Model:</Text> {selectedBus.model}</div>
                <div><Text strong>Year:</Text> {selectedBus.yearOfManufacture}</div>
                <div><Text strong>Capacity:</Text> {selectedBus.capacity} seats</div>
                <div><Text strong>Fuel Type:</Text> 
                  <Tag color={
                    selectedBus.fuelType === 'electric' ? 'green' :
                    selectedBus.fuelType === 'hybrid' ? 'blue' :
                    selectedBus.fuelType === 'cng' ? 'orange' : 'default'
                  }>
                    {selectedBus.fuelType.toUpperCase()}
                  </Tag>
                </div>
                <div><Text strong>Mileage:</Text> {selectedBus.mileage.toLocaleString()} km</div>
              </Space>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Assignments" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div><Text strong>Route:</Text> {selectedBus.routeAssigned || 'Unassigned'}</div>
                <div><Text strong>Driver:</Text> {selectedBus.driverAssigned || 'Unassigned'}</div>
              </Space>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Maintenance" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div><Text strong>Last Maintenance:</Text> {dayjs(selectedBus.lastMaintenanceDate).format('MMM DD, YYYY')}</div>
                <div><Text strong>Next Maintenance:</Text> {dayjs(selectedBus.nextMaintenanceDate).format('MMM DD, YYYY')}</div>
              </Space>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Legal & Insurance" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div><Text strong>Insurance Expiry:</Text> {dayjs(selectedBus.insuranceExpiry).format('MMM DD, YYYY')}</div>
                <div><Text strong>Registration Expiry:</Text> {dayjs(selectedBus.registrationExpiry).format('MMM DD, YYYY')}</div>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CarOutlined /> Bus Management
        </Title>
        <Text type="secondary">Manage your bus fleet inventory and information</Text>
      </div>

      {/* Filters and Actions */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search buses..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={setSearchText}
              enterButton={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">All Status</Option>
              <Option value="active">Active</Option>
              <Option value="maintenance">Maintenance</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="out-of-service">Out of Service</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="Fuel Type"
              value={fuelTypeFilter}
              onChange={setFuelTypeFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">All Fuel Types</Option>
              <Option value="diesel">Diesel</Option>
              <Option value="electric">Electric</Option>
              <Option value="hybrid">Hybrid</Option>
              <Option value="cng">CNG</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Space wrap>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAdd}
              >
                Add Bus
              </Button>
              <Button 
                danger
                icon={<DeleteOutlined />} 
                onClick={handleBulkDelete}
                disabled={selectedRowKeys.length === 0}
              >
                Delete Selected ({selectedRowKeys.length})
              </Button>
              <Button 
                icon={<ExportOutlined />} 
                onClick={handleExport}
              >
                Export
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleRefresh}
                loading={loading}
              >
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Summary Stats */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Text strong style={{ fontSize: '24px', color: '#52c41a' }}>
                {buses.filter(b => b.status === 'active').length}
              </Text>
              <div>Active Buses</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Text strong style={{ fontSize: '24px', color: '#faad14' }}>
                {buses.filter(b => b.status === 'maintenance').length}
              </Text>
              <div>In Maintenance</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Text strong style={{ fontSize: '24px', color: '#1890ff' }}>
                {buses.length}
              </Text>
              <div>Total Buses</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Text strong style={{ fontSize: '24px', color: '#722ed1' }}>
                {Math.round(buses.reduce((acc, bus) => acc + bus.capacity, 0) / buses.length) || 0}
              </Text>
              <div>Avg Capacity</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredBuses}
          rowKey="id"
          loading={loading}
          rowSelection={rowSelection}
          scroll={{ x: 1400 }}
          pagination={{
            total: filteredBuses.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} buses`,
          }}
          size="middle"
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={selectedBus ? 'Edit Bus' : 'Add New Bus'}
        open={isAddModalVisible || isEditModalVisible}
        onCancel={() => {
          setIsAddModalVisible(false);
          setIsEditModalVisible(false);
          setSelectedBus(null);
          form.resetFields();
        }}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => {
              setIsAddModalVisible(false);
              setIsEditModalVisible(false);
              setSelectedBus(null);
              form.resetFields();
            }}
          >
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={loading}
            onClick={() => form.submit()}
          >
            {selectedBus ? 'Update' : 'Add'} Bus
          </Button>,
        ]}
        width={800}
        destroyOnClose
      >
        {renderBusForm()}
      </Modal>

      {/* View Details Modal */}
      <Modal
        title={`Bus Details - ${selectedBus?.busNumber}`}
        open={isViewModalVisible}
        onCancel={() => {
          setIsViewModalVisible(false);
          setSelectedBus(null);
        }}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>,
          <Button 
            key="edit" 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => {
              setIsViewModalVisible(false);
              handleEdit(selectedBus!);
            }}
          >
            Edit Bus
          </Button>,
        ]}
        width={1000}
      >
        {renderBusDetails()}
      </Modal>
    </div>
  );
};

export default BusPage;