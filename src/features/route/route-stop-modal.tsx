import React, { useEffect, useState } from "react";
import { Modal, Table, Button, Space, Tooltip, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getRouteStops, deleteRouteStop } from "../../app/api/route_stop_api";
import type { RouteStopData } from "../../stores/route_stop_store";
import RouteStopFormModal from "./route-stop-form-modal";

interface Props {
  routeId: number | null;
  visible: boolean;
  onClose: () => void;
}

const RouteStopModal: React.FC<Props> = ({ routeId, visible, onClose }) => {
  const [stops, setStops] = useState<RouteStopData[]>([]);
  const [loading, setLoading] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editingStop, setEditingStop] = useState<RouteStopData | null>(null);

  useEffect(() => {
    if (routeId && visible) {
      loadStops(routeId);
    }
  }, [routeId, visible]);

  const loadStops = async (id: number) => {
    setLoading(true);
    try {
      const response = await getRouteStops(id);
      setStops(response.result || []);
    } catch (e) {
      message.error("Không thể tải điểm dừng");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (record: RouteStopData) => {
    try {
      const response = await deleteRouteStop(
        record.routeId,
        record.locationId,
        true
      );
      if (response.code === 200) {
        message.success("Đã xóa điểm dừng");
        loadStops(record.routeId);
      } else {
        message.error(response.message || "Xóa thất bại");
      }
    } catch (e) {
      message.error("Lỗi khi xóa điểm dừng");
    }
  };

  const columns = [
    { title: "Tên điểm dừng", dataIndex: "locationName" },
    { title: "Địa chỉ", dataIndex: "locationAddress" },
    { title: "Thứ tự", dataIndex: "stopOrder" },
    { title: "Thời gian lệch (phút)", dataIndex: "timeOffsetFromStart" },
    {
      title: "Thao tác",
      render: (_: any, record: RouteStopData) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setEditingStop(record);
                setFormModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Modal
        open={visible}
        title="Danh sách điểm dừng"
        width={800}
        onCancel={onClose}
        footer={[
          <Button key="close" onClick={onClose}>
            Đóng
          </Button>,
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingStop(null);
              setFormModalVisible(true);
            }}
          >
            Thêm điểm dừng
          </Button>,
        ]}
      >
        <Table
          rowKey={(r) => `${r.routeId}-${r.locationId}`}
          dataSource={stops}
          columns={columns}
          loading={loading}
          pagination={false}
        />
      </Modal>

      <RouteStopFormModal
        visible={formModalVisible}
        stop={editingStop}
        routeId={routeId}
        onClose={() => {
          setFormModalVisible(false);
          if (routeId) loadStops(routeId);
        }}
      />
    </>
  );
};

export default RouteStopModal;
