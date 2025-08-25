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
  DatePicker,
} from "antd";
import {
  BookOutlined,
  EditOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import {
  getTickets,
  updateTicketStatus,
  cancelTicket,
} from "../../app/api/ticket";
import type { TableProps } from "antd";
import type { TicketData } from "../../stores/ticket_store";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const TicketPage: React.FC = () => {
  const [form] = Form.useForm();
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    loadTickets({ page: 1, size: 10 });
  }, []);

  const loadTickets = async (params: any = {}) => {
    setLoading(true);
    try {
      const response = await getTickets(params);
      setTickets(response.result);
      setPagination({
        current: response.pageNumber,
        pageSize: response.pageSize,
        total: response.totalRecords,
      });
    } catch (error) {
      console.error("Error loading tickets:", error);
      message.error("Không thể tải danh sách vé");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (values: any) => {
    const { dateRange, ...rest } = values;
    const params = {
      ...rest,
      fromDate: dateRange?.[0]?.format("YYYY-MM-DD"),
      toDate: dateRange?.[1]?.format("YYYY-MM-DD"),
      page: 1,
      size: pagination.pageSize,
    };
    await loadTickets(params);
  };

  const handleCancel = (record: TicketData) => {
    Modal.confirm({
      title: "Xác nhận hủy vé",
      content: `Bạn có chắc chắn muốn hủy vé ${record.id}?`,
      okText: "Hủy vé",
      okType: "danger",
      cancelText: "Đóng",
      onOk: async () => {
        try {
          await cancelTicket(record.id);
          message.success("Hủy vé thành công");
          loadTickets({
            page: pagination.current,
            size: pagination.pageSize,
          });
        } catch (error) {
          message.error("Không thể hủy vé");
        }
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange";
      case "confirmed":
        return "green";
      case "cancelled":
        return "red";
      case "completed":
        return "blue";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "cancelled":
        return "Đã hủy";
      case "completed":
        return "Hoàn thành";
      default:
        return status;
    }
  };

  const columns: TableProps<TicketData>["columns"] = [
    {
      title: "Mã vé",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Tuyến xe",
      dataIndex: "routeName",
      key: "routeName",
      width: 200,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      width: 150,
    },
    {
      title: "SĐT",
      dataIndex: "customerPhone",
      key: "customerPhone",
      width: 120,
    },
    {
      title: "Số ghế",
      dataIndex: "seatNumber",
      key: "seatNumber",
      width: 100,
    },
    {
      title: "Giá vé",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} VND`,
      width: 120,
    },
    {
      title: "Ngày đặt",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
      width: 150,
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
          {record.status === "pending" && (
            <Tooltip title="Xác nhận">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => updateTicketStatus(record.id, "confirmed")}
              />
            </Tooltip>
          )}
          {["pending", "confirmed"].includes(record.status) && (
            <Tooltip title="Hủy vé">
              <Button
                type="link"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleCancel(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Breadcrumb
        style={{ marginBottom: "16px" }}
        items={[{ title: "Quản lý vận hành" }, { title: "Quản lý vé" }]}
      />

      <Title level={2} style={{ marginBottom: "24px" }}>
        <BookOutlined /> Quản lý vé
      </Title>

      <Card style={{ marginBottom: "24px" }}>
        <Form form={form} layout="vertical" onFinish={handleSearch}>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="keyword" label="Tìm kiếm">
                <Input placeholder="Tên/SĐT khách hàng" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="status" label="Trạng thái">
                <Select allowClear placeholder="Chọn trạng thái">
                  <Option value="pending">Chờ xác nhận</Option>
                  <Option value="confirmed">Đã xác nhận</Option>
                  <Option value="cancelled">Đã hủy</Option>
                  <Option value="completed">Hoàn thành</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} lg={12}>
              <Form.Item name="dateRange" label="Thời gian">
                <RangePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                  >
                    Tìm kiếm
                  </Button>
                  <Button
                    icon={<ClearOutlined />}
                    onClick={() => {
                      form.resetFields();
                      loadTickets({ page: 1, size: 10 });
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={tickets}
          rowKey="id"
          pagination={pagination}
          loading={loading}
          scroll={{ x: 1500 }}
        />
      </Card>
    </div>
  );
};

export default TicketPage;
