import { Card, Row, Col, Typography, Empty } from "antd";
import { Bar, Line } from "@ant-design/charts";
import React, { useEffect } from "react";
import { getReportYearly } from "../../app/api/report";
import { operatorStore } from "../../stores/operator_store";

const { Title } = Typography;

type ChartData = {
  [key: string]: string | number;
};

export const RandomColor = (): string => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const ReportPage = () => {
  const [revenueData, setRevenueData] = React.useState<ChartData[]>([]);
  const [tripsData, setTripsData] = React.useState<ChartData[]>([]);
  const [ratioData, setRatioData] = React.useState<ChartData[]>([]);
  const operator = operatorStore();

  useEffect(() => {
    const fetchData = async () => {
      if (operator?.operator?.id) {
        const reportData = await getReportYearly(
          operator?.operator?.id || 0,
          new Date().getFullYear()
        );
        console.log(reportData);
        reportData
          .sort(
            (a, b) =>
              new Date(a.reportDate).getTime() -
              new Date(b.reportDate).getTime()
          )
          .forEach((item) => {
            const reportMonth = new Date(item.reportDate);
            const revenue = item.data.totalRevenue;
            const tripsCount = item.data.totalTrips ?? 0;
            const cancelRatio = item.data.cancelTicketRatio ?? 0;

            setRevenueData((prev) => [
              ...prev,
              {
                month: reportMonth.toLocaleString("vi-VN", { month: "long" }),
                revenue: Number(revenue),
              },
            ]);
            setTripsData((prev) => [
              ...prev,
              {
                month: reportMonth.toLocaleString("vi-VN", { month: "long" }),
                tripsCount,
              },
            ]);
            setRatioData((prev) => [
              ...prev,
              {
                month: reportMonth.toLocaleString("vi-VN", { month: "long" }),
                cancelRatio,
                usedRatio: 100 - cancelRatio,
              },
            ]);
          });
      }
    };
    fetchData();
  }, []);

  const cancelRatioPie = {
    data: ratioData,
    xField: "month",
    yField: "cancelRatio",
    colorField: "month",
    color: "#1890ff",
    label: {
      style: { fill: "#FFFFFF", opacity: 0.6 },
    },
    xAxis: { min: 0 },
  };

  const tripsBars = {
    data: tripsData,
    xField: "month",
    yField: "tripsCount",
    color: "#1890ff",
    label: {
      style: { fill: "#FFFFFF", opacity: 0.6 },
    },
    xAxis: { min: 0 },
  };

  const revenueLine = {
    data: revenueData,
    xField: "month",
    yField: "revenue",
    shapeField: "smooth",
    scale: {
      y: {
        domainMin: 0,
      },
    },
    interaction: {
      tooltip: {
        marker: false,
      },
    },
    // smooth: true,
    label: {
      style: { fill: "#aaa" },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (v: any) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    },
    point: { size: 4, shape: "circle" },
    color: "#1890ff",
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Báo cáo tổng hợp
      </Title>
      <Row gutter={24}>
        <Col span={24} style={{ marginBottom: 24 }}>
          <Card title="Số vé hoàn trả mỗi tháng" style={{ marginBottom: 24 }}>
            {ratioData.length > 0 ? (
              <Bar {...cancelRatioPie} />
            ) : (
              <Empty description="Chưa có dữ liệu" />
            )}
          </Card>
        </Col>
        <Col span={24}>
          <Card
            title="Các chuyến đã hoàn thành trong tháng"
            style={{ marginBottom: 24 }}
          >
            {tripsData.length > 0 ? (
              <Bar {...tripsBars} />
            ) : (
              <Empty description="Chưa có dữ liệu" />
            )}
          </Card>
        </Col>
        <Col span={24}>
          <Card title="Doanh thu theo tháng" style={{ marginBottom: 24 }}>
            {revenueData.length > 0 ? (
              <Line {...revenueLine} />
            ) : (
              <Empty description="Chưa có dữ liệu" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReportPage;
