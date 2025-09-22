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
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  ClearOutlined,
  PlusOutlined,
  TeamOutlined,
  CarOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { getEmployees, deleteEmployee } from "../../app/api/employee";
import type { TableProps } from "antd";
import type { EmployeeData } from "../../stores/employee_store";
import EmployeeModal from "./employee-modal";

const { Title, Text } = Typography;
const { Option } = Select;

const EmployeePage: React.FC = () => {
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isEmployeeModalVisible, setIsEmployeeModalVisible] = useState(false);
  const [employeeForm] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    loadEmployees({ page: 1, size: 10 });
  }, []);

  const loadEmployees = async (params: any = {}) => {
    setLoading(true);
    try {
      const query = {
        page: params.page || pagination.current,
        size: params.size || pagination.pageSize,
        keyword: params.keyword,
        status: params.status,
      };

      const response = await getEmployees(query);

      setEmployees(response.result);
      setPagination({
        current: response.pageNumber,
        pageSize: response.pageSize,
        total: response.totalRecords,
      });

      if (params.keyword || params.status) {
        setHasSearched(true);
        if (response.result.length === 0) {
          message.info("Không tìm thấy nhân viên nào");
        } else {
          message.success(`Tìm thấy ${response.totalRecords} nhân viên`);
        }
      }
    } catch (error) {
      console.error("Error loading employees:", error);
      message.error("Không thể tải danh sách nhân viên");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (values: any) => {
    await loadEmployees({
      page: 1,
      size: pagination.pageSize,
      ...values,
    });
  };

  const handleReset = () => {
    form.resetFields();
    setHasSearched(false);
    loadEmployees({ page: 1, size: pagination.pageSize });
  };

  const handleTableChange = (paginationConfig: any) => {
    loadEmployees({
      page: paginationConfig.current,
      size: paginationConfig.pageSize,
      ...form.getFieldsValue(),
    });
  };

  const handleDelete = (record: EmployeeData) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa nhân viên này?",
      content: `Hành động này sẽ xóa vĩnh viễn nhân viên ${record.fullName}`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await deleteEmployee(record.id, true);
          if (response.code === 200) {
            message.success(`Đã xóa nhân viên ${record.fullName}`);
            loadEmployees({
              page: pagination.current,
              size: pagination.pageSize,
            });
          } else {
            message.error(`Không thể xóa nhân viên ${record.fullName}`);
          }
        } catch (error: any) {
          const errMsg =
            error.response?.data?.message ||
            "An error occurred while deleting the employee";
          message.error(errMsg);
        }
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "inactive":
        return "orange";
      case "suspended":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "inactive":
        return "Ngừng hoạt động";
      case "suspended":
        return "Bị cấm";
      default:
        return status;
    }
  };

  const getEmployeeTypeTag = (type: string) => {
    let color = "";
    let text = "";
    let icon = null;

    switch (type) {
      case "DRIVER":
        color = "green";
        text = "Tài xế";
        icon = <CarOutlined />;
        break;
      case "STAFF":
        color = "purple";
        text = "Nhân viên bán vé";
        icon = <IdcardOutlined />;
        break;
    }

    return (
      <Tag
        color={color}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 8px",
          borderRadius: "16px",
        }}
      >
        {icon}
        {text}
      </Tag>
    );
  };

  const columns: TableProps<EmployeeData>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (name) => <Text strong>{name}</Text>,
      width: 180,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Loại nhân viên",
      dataIndex: "employeeType",
      key: "employeeType",
      width: 160,
      render: (type: string) => getEmployeeTypeTag(type),
    },
    {
      title: "Số GPLX",
      dataIndex: "driverLicenseNumber",
      key: "driverLicenseNumber",
      width: 140,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: 200,
    },
    {
      title: "SĐT",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 140,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
      width: 120,
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
              onClick={() => message.info(`Chi tiết nhân viên: ${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                employeeForm.setFieldsValue({ ...record });
                setIsEmployeeModalVisible(true);
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
    active: employees.filter((e) => e.status === "active").length,
    inactive: employees.filter((e) => e.status === "inactive").length,
    suspended: employees.filter((e) => e.status === "suspended").length,
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
            title: "Quản lý nhân viên",
          },
        ]}
      />

      <Title level={2} style={{ marginBottom: "24px" }}>
        <TeamOutlined /> Quản lý nhân viên
      </Title>

      <Card style={{ marginBottom: "24px" }}>
        <Form form={form} layout="vertical" onFinish={handleSearch}>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="keyword" label="Tìm kiếm theo tên/email">
                <Input
                  placeholder="Nhập tên hoặc email"
                  prefix={<UserOutlined />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="status" label="Trạng thái">
                <Select allowClear placeholder="Chọn trạng thái">
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Ngừng hoạt động</Option>
                  <Option value="suspended">Bị cấm</Option>
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
                      employeeForm.resetFields();
                      setIsEmployeeModalVisible(true);
                    }}
                  >
                    Thêm nhân viên
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={6} md={6} lg={6} xl={6}>
          <Card>
            <Statistic
              title="Tổng số nhân viên"
              value={pagination.total}
              valueStyle={{ color: "#1890ff" }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6} md={6} lg={6} xl={6}>
          <Card>
            <Statistic
              title="Hoạt động"
              value={stats.active}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6} md={6} lg={6} xl={6}>
          <Card>
            <Statistic
              title="Ngừng hoạt động"
              value={stats.inactive}
              valueStyle={{ color: "#ff974d" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6} md={6} lg={6} xl={6}>
          <Card>
            <Statistic
              title="Bị cấm"
              value={stats.suspended}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        {employees.length === 0 && !loading ? (
          <Empty description="Không có nhân viên nào" />
        ) : (
          <>
            {hasSearched ? (
              <Alert
                message={`Tìm thấy ${pagination.total} nhân viên phù hợp`}
                type="success"
                showIcon
                style={{ marginBottom: "16px" }}
              />
            ) : (
              <Alert
                message={`Hiển thị tất cả ${pagination.total} nhân viên trong hệ thống`}
                type="info"
                showIcon
                style={{ marginBottom: "16px" }}
              />
            )}
            <Table
              columns={columns}
              dataSource={employees}
              rowKey="id"
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} nhân viên`,
              }}
              onChange={handleTableChange}
              loading={loading}
              scroll={{ x: 1500 }}
            />
          </>
        )}
      </Card>

      <EmployeeModal
        isModalVisible={isEmployeeModalVisible}
        setIsModalVisible={setIsEmployeeModalVisible}
        form={employeeForm}
        onSuccess={() =>
          loadEmployees({ page: pagination.current, size: pagination.pageSize })
        }
      />
    </div>
  );
};

export default EmployeePage;
