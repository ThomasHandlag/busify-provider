import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Table,
  Space,
  Typography,
  Row,
  Col,
  Statistic,
  Alert,
  Breadcrumb,
  Empty,
  Tooltip,
  Modal,
  message,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ClearOutlined,
  SwapOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import { getRoutes, deleteRoute } from "../../app/api/route_api";
import type { RouteData, RouteResponse } from "../../stores/route_store";
import RouteModal from "./route-modal";
import RouteStopModal from "./route-stop-modal";

const { Title, Text } = Typography;

const RoutePage: React.FC = () => {
  const [form] = Form.useForm();
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isRouteModalVisible, setIsRouteModalVisible] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);
  const [isRouteStopModalVisible, setIsRouteStopModalVisible] = useState(false);

  const [routeForm] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    loadRoutes({ page: 1, size: 10 });
  }, []);

  const loadRoutes = async (params: any = {}) => {
    setLoading(true);
    try {
      const query = {
        page: params.page || pagination.current,
        size: params.size || pagination.pageSize,
        keyword: params.keyword,
      };
      const response: RouteResponse = await getRoutes(query);
      setRoutes(response.result);
      setPagination({
        current: response.pageNumber,
        pageSize: response.pageSize,
        total: response.totalRecords,
      });
      if (params.keyword) {
        setHasSearched(true);
        if (response.result.length === 0) {
          message.info("Không tìm thấy tuyến đường nào");
        } else {
          message.success(`Tìm thấy ${response.totalRecords} tuyến đường`);
        }
      }
    } catch (error) {
      message.error("Không thể tải danh sách tuyến đường");
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (values: any) => {
    await loadRoutes({
      page: 1,
      size: pagination.pageSize,
      ...values,
    });
  };

  const handleReset = () => {
    form.resetFields();
    setHasSearched(false);
    loadRoutes({ page: 1, size: pagination.pageSize });
  };

  const handleTableChange = (paginationConfig: any) => {
    loadRoutes({
      page: paginationConfig.current,
      size: paginationConfig.pageSize,
      ...form.getFieldsValue(),
    });
  };

  const handleDelete = (record: RouteData) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa tuyến đường này?",
      content: `Xóa vĩnh viễn tuyến: ${record.name}`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await deleteRoute(record.id, true);
          if (response.code === 200) {
            message.success(`Đã xóa tuyến đường ${record.name}`);
            loadRoutes({
              page: pagination.current,
              size: pagination.pageSize,
            });
          } else {
            message.error(`Xóa thất bại`);
          }
        } catch (error: any) {
          message.error(
            error?.response?.data?.message || "Có lỗi khi xóa tuyến đường"
          );
        }
      },
    });
  };

  const columns: TableProps<RouteData>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tên tuyến",
      dataIndex: "name",
      key: "name",
      render: (name) => <Text strong>{name}</Text>,
      width: 200,
    },
    {
      title: "Điểm xuất phát",
      dataIndex: "startLocationAddress",
      key: "startLocationAddress",
      width: 250,
    },
    {
      title: "Điểm kết thúc",
      dataIndex: "endLocationAddress",
      key: "endLocationAddress",
      width: 250,
    },
    {
      title: "Thời gian dự kiến (phút)",
      dataIndex: "defaultDurationMinutes",
      key: "defaultDurationMinutes",
      width: 150,
    },
    {
      title: "Giá mặc định",
      dataIndex: "defaultPrice",
      key: "defaultPrice",
      render: (price) => `${price.toLocaleString()} đ`,
      width: 120,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem tất cả điểm dừng">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedRouteId(record.id);
                setIsRouteStopModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                routeForm.setFieldsValue(record);
                setIsRouteModalVisible(true);
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

  return (
    <div style={{ padding: "24px" }}>
      <Breadcrumb
        style={{ marginBottom: "16px" }}
        items={[{ title: "Nhà xe" }, { title: "Quản lý tuyến đường" }]}
      />
      <Title level={2} style={{ marginBottom: "24px" }}>
        <SwapOutlined /> Quản lý tuyến đường
      </Title>
      <Card style={{ marginBottom: "24px" }}>
        <Form form={form} layout="vertical" onFinish={handleSearch}>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="keyword" label="Từ khóa">
                <Input
                  placeholder="Nhập tên tuyến, điểm xuất phát/kết thúc"
                  prefix={<SwapOutlined />}
                />
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
                      routeForm.resetFields();
                      setIsRouteModalVisible(true);
                    }}
                  >
                    Thêm tuyến
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng số tuyến"
              value={pagination.total}
              prefix={<SwapOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>
      <Card>
        {routes.length === 0 && !loading ? (
          <Empty description="Không có tuyến nào" />
        ) : (
          <>
            {hasSearched ? (
              <Alert
                message={`Tìm thấy ${pagination.total} tuyến phù hợp`}
                type="success"
                showIcon
                style={{ marginBottom: "16px" }}
              />
            ) : (
              <Alert
                message={`Hiển thị tất cả ${pagination.total} tuyến trong hệ thống`}
                type="info"
                showIcon
                style={{ marginBottom: "16px" }}
              />
            )}
            <Table
              columns={columns}
              dataSource={routes}
              rowKey="id"
              loading={loading}
              scroll={{ x: 1000 }}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} tuyến`,
              }}
              onChange={handleTableChange}
            />
          </>
        )}
      </Card>
      <RouteModal
        isModalVisible={isRouteModalVisible}
        setIsModalVisible={setIsRouteModalVisible}
        form={routeForm}
        onSuccess={() =>
          loadRoutes({ page: pagination.current, size: pagination.pageSize })
        }
      />
      <RouteStopModal
        routeId={selectedRouteId}
        visible={isRouteStopModalVisible}
        onClose={() => setIsRouteStopModalVisible(false)}
      />
    </div>
  );
};

export default RoutePage;
