/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Table,
  Space,
  Typography,
  Tag,
  Row,
  Col,
  Statistic,
  Alert,
  Breadcrumb,
  Empty,
  Tooltip,
  message,
  Select,
  Modal,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  CarOutlined,
  ClearOutlined,
  DeleteOutlined,
  PlusOutlined,
  WifiOutlined,
  VideoCameraOutlined,
  RestOutlined,
  ThunderboltOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import { getBuses, deleteBus } from "../../app/api/bus";
import type { BusData, BusResponse } from "../../stores/bus_store";
import BusModal from "./bus-modal";
import BusDetailModal from "./bus-detail";

const { Title, Text } = Typography;
const { Option } = Select;

const BusPage: React.FC = () => {
  const [form] = Form.useForm();
  const [buses, setBuses] = useState<BusData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isBusModalVisible, setIsBusModalVisible] = useState(false);
  const [selectedBus, setSelectedBus] = useState<BusData | null>(null);
  const [isBusDetailVisible, setIsBusDetailVisible] = useState(false);
  const [busForm] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Load dữ liệu ban đầu
  useEffect(() => {
    loadBuses({ page: 1, size: 10 });
  }, []);

  const loadBuses = async (params: any = {}) => {
    setLoading(true);
    try {
      const query = {
        page: params.page || pagination.current,
        size: params.size || pagination.pageSize,
        keyword: params.keyword,
        status: params.status,
      };

      const response: BusResponse = await getBuses(query);

      setBuses(response.result);
      setPagination({
        current: response.pageNumber,
        pageSize: response.pageSize,
        total: response.totalRecords,
      });

      if (params.licensePlate || params.status) {
        setHasSearched(true);
        if (response.result.length === 0) {
          message.info("Không tìm thấy xe nào");
        } else {
          message.success(`Tìm thấy ${response.totalRecords} xe`);
        }
      }
    } catch (error) {
      console.error("Error loading buses:", error);
      message.error("Không thể tải danh sách xe");
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBus = (bus: BusData) => {
    setSelectedBus(bus);
    setIsBusDetailVisible(true);
  };

  // Search
  const handleSearch = async (values: any) => {
    await loadBuses({
      page: 1,
      size: pagination.pageSize,
      ...values,
    });
  };

  // Reset
  const handleReset = () => {
    form.resetFields();
    setHasSearched(false);
    loadBuses({ page: 1, size: pagination.pageSize });
  };

  // Chuyển trang
  const handleTableChange = (paginationConfig: any) => {
    loadBuses({
      page: paginationConfig.current,
      size: paginationConfig.pageSize,
      ...form.getFieldsValue(), // giữ filter khi chuyển trang
    });
  };

  const handleDelete = (record: BusData) => {
    Modal.confirm({
      title: "Are you sure you want to delete this bus?",
      content: `This will permanently delete ${record.licensePlate} and all associated data.`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const response = await deleteBus(record.id, true); // truyền isDelete = true
          if (response.code === 200) {
            message.success(`Đã xóa xe khách ${record.licensePlate}`);
            loadBuses({
              page: pagination.current,
              size: pagination.pageSize,
            });
          } else {
            message.error(`Failed to delete bus ${record.licensePlate}`);
          }
        } catch (error: any) {
          const errMsg =
            error.response?.data?.message ||
            "An error occurred while deleting the bus";
          message.error(errMsg);
        }
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "under_maintenance":
        return "orange";
      case "out_of_service":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Đang hoạt động";
      case "under_maintenance":
        return "Bảo trì";
      case "out_of_service":
        return "Ngưng hoạt động";
      default:
        return status;
    }
  };

  const columns: TableProps<BusData>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => a.id - b.id,
      // defaultSortOrder: "ascend",
    },
    {
      title: "Biển số",
      dataIndex: "licensePlate",
      key: "licensePlate",
      render: (plate) => <Text strong>{plate}</Text>,
      width: 150,
    },
    {
      title: "Mã mẫu xe",
      dataIndex: "modelId",
      key: "modelId",
      width: 140,
    },
    {
      title: "Số ghế",
      dataIndex: "totalSeats",
      key: "totalSeats",
      width: 100,
    },
    {
      title: "Mã nhà xe",
      dataIndex: "operatorId",
      key: "operatorId",
      width: 140,
    },
    {
      title: "Mã sơ đồ ghế",
      dataIndex: "seatLayoutId",
      key: "seatLayoutId",
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
      width: 150,
    },
    {
      title: "Tiện ích",
      key: "amenities",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          {record.amenities.wifi && (
            <Tag color="blue" style={{ border: "none", background: "none" }}>
              <WifiOutlined style={{ marginRight: 4 }} />
              WiFi
            </Tag>
          )}
          {record.amenities.tv && (
            <Tag
              color="geekblue"
              style={{ border: "none", background: "none" }}
            >
              <VideoCameraOutlined style={{ marginRight: 4 }} />
              TV
            </Tag>
          )}
          {record.amenities.toilet && (
            <Tag color="volcano" style={{ border: "none", background: "none" }}>
              <RestOutlined style={{ marginRight: 4 }} />
              Toilet
            </Tag>
          )}
          {record.amenities.charging && (
            <Tag color="purple" style={{ border: "none", background: "none" }}>
              <ThunderboltOutlined style={{ marginRight: 4 }} />
              Sạc
            </Tag>
          )}
          {record.amenities.air_conditioner && (
            <Tag color="cyan" style={{ border: "none", background: "none" }}>
              <DesktopOutlined style={{ marginRight: 4 }} />
              Điều hòa
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewBus(record)}
            />
          </Tooltip>

          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                busForm.setFieldsValue({
                  ...record,
                  amenities: Object.keys(record.amenities).filter(
                    (key) => record.amenities[key] === true
                  ),
                });
                setIsBusModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
      width: 120,
      fixed: "right",
    },
  ];

  // Thống kê theo dữ liệu hiện tại
  const stats = {
    active: buses.filter((b) => b.status === "active").length,
    maintenance: buses.filter((b) => b.status === "under_maintenance").length,
    out_of_service: buses.filter((b) => b.status === "out_of_service").length,
  };

  return (
    <div style={{ padding: "24px" }}>
      <Breadcrumb
        style={{ marginBottom: "16px" }}
        items={[
          {
            title: "Quản lý phương tiện",
          },
          {
            title: "Xe khách",
          },
        ]}
      />

      <Title level={2} style={{ marginBottom: "24px" }}>
        <CarOutlined /> Quản lý xe khách
      </Title>

      {/* Search Form */}
      <Card style={{ marginBottom: "24px" }}>
        <Form form={form} layout="vertical" onFinish={handleSearch}>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="keyword" label="Từ khóa">
                <Input
                  placeholder="Nhập biển số, mẫu xe"
                  prefix={<CarOutlined />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="status" label="Trạng thái">
                <Select placeholder="Chọn trạng thái" allowClear>
                  <Option value="active">Đang hoạt động</Option>
                  <Option value="under_maintenance">Bảo trì</Option>
                  <Option value="out_of_service">Ngưng hoạt động</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={12}>
              <Form.Item label=" " style={{ marginBottom: 0 }}>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                    loading={loading}
                  >
                    Tìm kiếm
                  </Button>
                  <Button icon={<ClearOutlined />} onClick={handleReset}>
                    Xóa bộ lọc
                  </Button>
                  <Button
                    icon={<PlusOutlined />}
                    type="dashed"
                    onClick={() => {
                      busForm.resetFields();
                      setIsBusModalVisible(true);
                    }}
                  >
                    Thêm xe
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng số xe"
              value={pagination.total}
              prefix={<CarOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đang hoạt động"
              value={stats.active}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đang bảo trì"
              value={stats.maintenance}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Ngưng hoạt động"
              value={stats.out_of_service}
              valueStyle={{ color: "#f5222d" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Results Table */}
      <Card>
        {buses.length === 0 && !loading ? (
          <Empty description="Không có xe nào" />
        ) : (
          <>
            {hasSearched ? (
              <Alert
                message={`Tìm thấy ${pagination.total} xe phù hợp`}
                type="success"
                showIcon
                style={{ marginBottom: "16px" }}
              />
            ) : (
              <Alert
                message={`Hiển thị tất cả ${pagination.total} xe trong hệ thống`}
                type="info"
                showIcon
                style={{ marginBottom: "16px" }}
              />
            )}
            <Table
              columns={columns}
              dataSource={buses}
              rowKey="id"
              loading={loading}
              scroll={{ x: 1200 }}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} xe`,
              }}
              onChange={handleTableChange}
            />
          </>
        )}
      </Card>
      <BusModal
        isModalVisible={isBusModalVisible}
        setIsModalVisible={setIsBusModalVisible}
        form={busForm}
        onSuccess={() =>
          loadBuses({ page: pagination.current, size: pagination.pageSize })
        }
      />
      <BusDetailModal
        bus={selectedBus}
        isVisible={isBusDetailVisible}
        onClose={() => setIsBusDetailVisible(false)}
      />
    </div>
  );
};

export default BusPage;
