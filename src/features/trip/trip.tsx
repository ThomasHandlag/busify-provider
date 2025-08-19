import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Space,
  Modal,
  message,
  Typography,
  Tag,
  Tooltip,
  Form,
  Input,
  Select,
  Row,
  Col,
  Breadcrumb,
  Empty,
  Statistic,
  Alert,
} from "antd";
import {
  CarOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  ClearOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { getTrips, deleteTrip } from "../../app/api/trip";
import type { TableProps } from "antd";
import type { TripData, TripResponse } from "../../stores/trip_store";
import TripModal from "./trip-modal";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

const TripPage: React.FC = () => {
  const [form] = Form.useForm();
  const [trips, setTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isTripModalVisible, setIsTripModalVisible] = useState(false);
  const [tripForm] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    loadTrips({ page: 1, size: 10 });
  }, []);

  const loadTrips = async (params: any = {}) => {
    setLoading(true);
    try {
      const query = {
        page: params.page || pagination.current,
        size: params.size || pagination.pageSize,
        keyword: params.keyword,
        status: params.status,
      };

      const response = await getTrips(query);

      setTrips(response.result.result);
      setPagination({
        current: response.result.pageNumber,
        pageSize: response.result.pageSize,
        total: response.result.totalRecords,
      });

      if (params.routeName || params.status) {
        setHasSearched(true);
        if (response.result.result.length === 0) {
          message.info("Không tìm thấy chuyến xe nào");
        } else {
          message.success(`Tìm thấy ${response.result.totalRecords} chuyến xe`);
        }
      }
    } catch (error) {
      console.error("Error loading trips:", error);
      message.error("Không thể tải danh sách chuyến xe");
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (values: any) => {
    await loadTrips({
      page: 1,
      size: pagination.pageSize,
      ...values,
    });
  };

  const handleReset = () => {
    form.resetFields();
    setHasSearched(false);
    loadTrips({ page: 1, size: pagination.pageSize });
  };

  const handleTableChange = (paginationConfig: any) => {
    loadTrips({
      page: paginationConfig.current,
      size: paginationConfig.pageSize,
      ...form.getFieldsValue(),
    });
  };

  const handleDelete = (record: TripData) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa chuyến xe này?",
      content: `Hành động này sẽ xóa vĩnh viễn chuyến xe ${record.routeName}`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await deleteTrip(record.id, true);
          if (response.code === 200) {
            message.success(`Đã xóa chuyến xe ${record.routeName}`);
            loadTrips({
              page: pagination.current,
              size: pagination.pageSize,
            });
          } else {
            message.error(`Không thể xóa chuyến xe ${record.routeName}`);
          }
        } catch (error: any) {
          const errMsg =
            error.response?.data?.message ||
            "An error occurred while deleting the trip";
          message.error(errMsg);
        }
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "blue";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Đã lên lịch";
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const columns: TableProps<TripData>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tuyến đường",
      dataIndex: "routeName",
      key: "routeName",
      render: (name) => <Text strong>{name}</Text>,
      width: 200,
    },
    {
      title: "Xe",
      dataIndex: "busId",
      key: "busId",
      width: 120,
    },
    {
      title: "Tài xế",
      dataIndex: "driverId",
      key: "driverId",
      width: 120,
    },
    {
      title: "Thời gian khởi hành",
      dataIndex: "departureTime",
      key: "departureTime",
      render: (time) => dayjs(time).format("DD/MM/YYYY HH:mm"),
      width: 180,
    },
    {
      title: "Thời gian đến",
      dataIndex: "estimatedArrivalTime",
      key: "estimatedArrivalTime",
      render: (time) => dayjs(time).format("DD/MM/YYYY HH:mm"),
      width: 180,
    },
    {
      title: "Giá vé",
      dataIndex: "pricePerSeat",
      key: "pricePerSeat",
      render: (price) => `${price.toLocaleString()} VND`,
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
      title: "Thao tác",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => message.info(`Chi tiết chuyến xe: ${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                tripForm.setFieldsValue({
                  ...record,
                  departureTime: dayjs(record.departureTime),
                  estimatedArrivalTime: dayjs(record.estimatedArrivalTime),
                });
                setIsTripModalVisible(true);
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
    },
  ];

  const stats = {
    scheduled: trips.filter((t) => t.status === "scheduled").length,
    completed: trips.filter((t) => t.status === "completed").length,
    cancelled: trips.filter((t) => t.status === "cancelled").length,
  };

  return (
    <div style={{ padding: "24px" }}>
      <Breadcrumb
        style={{ marginBottom: "16px" }}
        items={[
          {
            title: "Quản lý vận hành",
          },
          {
            title: "Quản lý chuyến xe",
          },
        ]}
      />

      <Title level={2} style={{ marginBottom: "24px" }}>
        <CarOutlined /> Quản lý chuyến xe
      </Title>

      <Card style={{ marginBottom: "24px" }}>
        <Form form={form} layout="vertical" onFinish={handleSearch}>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="keyword" label="Tìm kiếm theo tuyến đường">
                <Input
                  placeholder="Nhập tên tuyến đường"
                  prefix={<CarOutlined />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="status" label="Trạng thái">
                <Select allowClear placeholder="Chọn trạng thái">
                  <Option value="scheduled">Đã lên lịch</Option>
                  <Option value="completed">Đã hoàn thành</Option>
                  <Option value="cancelled">Đã hủy</Option>
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
                      tripForm.resetFields();
                      setIsTripModalVisible(true);
                    }}
                  >
                    Thêm chuyến xe
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng số chuyến xe"
              value={pagination.total}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Đã lên lịch"
              value={stats.scheduled}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Đã hoàn thành"
              value={stats.completed}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        {trips.length === 0 && !loading ? (
          <Empty description="Không có chuyến xe nào" />
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
                message={`Hiển thị tất cả ${pagination.total} chuyến xe trong hệ thống`}
                type="info"
                showIcon
                style={{ marginBottom: "16px" }}
              />
            )}
            <Table
              columns={columns}
              dataSource={trips}
              rowKey="id"
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
              loading={loading}
              scroll={{ x: 1500 }}
            />
          </>
        )}
      </Card>

      <TripModal
        isModalVisible={isTripModalVisible}
        setIsModalVisible={setIsTripModalVisible}
        form={tripForm}
        onSuccess={() =>
          loadTrips({ page: pagination.current, size: pagination.pageSize })
        }
      />
    </div>
  );
};

export default TripPage;
