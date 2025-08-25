import { Card, Row, Col, Typography } from "antd";
import { Pie, Bar, Line } from "@ant-design/charts";

const { Title } = Typography;

// Dữ liệu mẫu
const tripStatusData = [
  { type: "Đã lên lịch", value: 40 },
  { type: "Đúng giờ", value: 30 },
  { type: "Bị hoãn", value: 10 },
  { type: "Đã khởi hành", value: 15 },
  { type: "Đã đến nơi", value: 20 },
  { type: "Đã hủy", value: 5 },
];

const employeeStatusData = [
  { type: "Hoạt động", value: 60 },
  { type: "Ngừng hoạt động", value: 25 },
  { type: "Bị cấm", value: 5 },
];

const revenueData = [
  { month: "Tháng 1", revenue: 120 },
  { month: "Tháng 2", revenue: 150 },
  { month: "Tháng 3", revenue: 180 },
  { month: "Tháng 4", revenue: 90 },
  { month: "Tháng 5", revenue: 200 },
  { month: "Tháng 6", revenue: 170 },
];

const ReportPage = () => {
  const pieConfig = {
    appendPadding: 10,
    data: tripStatusData,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name} {percentage}",
    },
    interactions: [{ type: "element-active" }],
  };

  const barConfig = {
    data: employeeStatusData,
    xField: "value",
    yField: "type",
    seriesField: "type",
    legend: { position: "top-left" },
    color: ["#52c41a", "#ff974d", "#ff4d4f"],
  };

  const lineConfig = {
    data: revenueData,
    xField: "month",
    yField: "revenue",
    smooth: true,
    label: {},
    point: { size: 4, shape: "circle" },
    color: "#1890ff",
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Báo cáo tổng hợp
      </Title>
      <Row gutter={24}>
        <Col xs={24} md={12} xl={8}>
          <Card title="Tỷ lệ trạng thái chuyến xe" style={{ marginBottom: 24 }}>
            <Pie {...pieConfig} />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <Card title="Nhân viên theo trạng thái" style={{ marginBottom: 24 }}>
            <Bar {...barConfig} />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card title="Doanh thu theo tháng" style={{ marginBottom: 24 }}>
            <Line {...lineConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReportPage;
