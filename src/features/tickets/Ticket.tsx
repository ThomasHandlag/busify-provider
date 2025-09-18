import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Space,
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
  Alert,
} from "antd";
import {
  BookOutlined,
  SearchOutlined,
  ClearOutlined,
  DollarOutlined,
  PhoneOutlined,
  UserOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  getTicketsByOperatorId,
  type TicketSearchParams,
} from "../../app/api/ticket";
import type { FormProps, TableProps } from "antd";
import { operatorStore } from "../../stores/operator_store";
import type { Ticket } from "../../stores/ticket_store";
import TicketDetailModal from "./TicketDetailModel";

const { Title, Text } = Typography;
const { Option } = Select;

const TicketPage: React.FC = () => {
  const [form] = Form.useForm();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const operator = operatorStore();

  useEffect(() => {
    if (operator.operator) {
      loadTickets(operator?.operator?.id);
    }
  }, [operator.operator]);

  const loadTickets = async (operatorId: number) => {
    setLoading(true);
    try {
      const response = await getTicketsByOperatorId(operatorId);
      setTickets(response.result.map((item) => item.tickets));
    } catch (error) {
      console.error("Error loading tickets:", error);
      message.error("Không thể tải danh sách vé");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "green";
      case "cancelled":
        return "red";
      case "used":
        return "blue";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "valid":
        return "Có hiệu lực";
      case "cancelled":
        return "Đã hủy";
      case "used":
        return "Đã sử dụng";
      default:
        return status;
    }
  };

  const handleViewDetail = (record: Ticket) => {
    setSelectedTicket(record);
    setIsModalVisible(true);
  };

  const columns: TableProps<Ticket>["columns"] = [
    {
      title: "Mã vé",
      dataIndex: "ticketCode",
      key: "ticketCode",
      width: 100,
      render: (code) => (
        <Text strong style={{ color: "#1890ff" }}>
          {code}
        </Text>
      ),
    },
    {
      title: "Tên hành khách",
      dataIndex: "passengerName",
      key: "passengerName",
      render: (name) => (
        <Space>
          <UserOutlined />
          {name}
        </Space>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "passengerPhone",
      key: "passengerPhone",
      render: (phone) => (
        <Space>
          <PhoneOutlined />
          {phone}
        </Space>
      ),
    },
    {
      title: "Số ghế",
      dataIndex: "seatNumber",
      key: "seatNumber",
      render: (seat) => <Tag color="cyan">{seat}</Tag>,
    },
    {
      title: "Giá vé",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <Space>
          <DollarOutlined />
          {price.toLocaleString("vi-VN")} VNĐ
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Người bán",
      dataIndex: "sellerName",
      key: "sellerName",
      render: (name) => (
        <Space>
          <UserOutlined />
          {name ?? "System"}
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          />
        </Tooltip>
      ),
    },
  ];

  const handleSearch: FormProps<TicketSearchParams>["onFinish"] = async (
    values: TicketSearchParams
  ) => {
    const { keyword, code, sellerName, status } = values;

    setLoading(true);
    setHasSearched(true);

    const filteredTickets = tickets.filter((ticket) => {
      const matchesName = keyword
        ? ticket.passengerName.toLowerCase().includes(keyword.toLowerCase()) ||
          ticket.passengerPhone.includes(keyword)
        : true;
      const matchesCode = code
        ? ticket.ticketCode.toLowerCase().includes(code.toLowerCase())
        : true;
      const matchesSeller = sellerName
        ? ticket.sellerName.toLowerCase().includes(sellerName.toLowerCase())
        : true;
      const matchesStatus = status
        ? ticket.status.toLowerCase().includes(status.toLowerCase())
        : true;
      return matchesCode && matchesName && matchesSeller && matchesStatus;
    });

    setTickets(filteredTickets);
    setLoading(false);
  };

  const handleReset = async () => {
    form.resetFields();
    setHasSearched(false);
    setLoading(true);

    if (operator.operator) {
      try {
        const response = await getTicketsByOperatorId(operator.operator.id);
        if (response.result && response.result.length > 0) {
          const tickets = response.result.flatMap((item) => item.tickets);
          setTickets(tickets);
        } else {
          setTickets([]);
        }
      } catch (error) {
        message.error("Không thể tải danh sách vé");
        console.error(error);
      }
    }
    setLoading(false);
  };

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
        <Form<TicketSearchParams>
          form={form}
          layout="vertical"
          onFinish={handleSearch}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={12}>
              <Form.Item name="keyword" label="Tìm kiếm">
                <Input placeholder="Tên/SĐT khách hàng" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item name="status" label="Trạng thái">
                <Select allowClear placeholder="Chọn trạng thái">
                  <Option value="valid">Đã xác nhận</Option>
                  <Option value="cancelled">Đã hủy</Option>
                  <Option value="used">Đã sử dụng</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} lg={6}>
              <Form.Item name="code" label="Mã vé">
                <Input placeholder="Mã vé" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} lg={12}>
              <Form.Item name="sellerName" label="Người bán">
                <Input placeholder="Người bán" />
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
                      handleReset();
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

      {/* Search Results Table */}
      <Card>
        {hasSearched && tickets.length > 0 && (
          <Alert
            message={`Tìm thấy ${tickets.length} kết quả phù hợp`}
            type="success"
            showIcon
            style={{ marginBottom: "16px" }}
          />
        )}
        {!hasSearched && tickets.length > 0 && (
          <Alert
            message={`Hiển thị tất cả ${tickets.length} vé trong hệ thống`}
            type="info"
            showIcon
            style={{ marginBottom: "16px" }}
          />
        )}
        <Table
          columns={columns}
          dataSource={tickets}
          rowKey="ticketId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} vé`,
          }}
        />
      </Card>
      <TicketDetailModal
        ticket={selectedTicket}
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedTicket(null);
        }}
      />
    </div>
  );
};

export default TicketPage;
