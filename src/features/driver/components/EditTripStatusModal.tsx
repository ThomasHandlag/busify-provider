import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Alert } from "antd";

interface EditTripStatusModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  currentStatus?: string;
}

const EditTripStatusModal: React.FC<EditTripStatusModalProps> = ({
  visible,
  onCancel,
  onOk,
  form,
  currentStatus = 'scheduled',
}) => {
  const [validationError, setValidationError] = useState<string>("");

  // Định nghĩa logic validation theo yêu cầu mới
  const statusTransitions: Record<string, string[]> = {
    scheduled: ['departed'], // Chỉ có thể chuyển sang departed
    departed: ['delayed', 'arrived', 'cancelled'], // Có thể chuyển sang delayed, arrived hoặc cancelled
    delayed: ['arrived', 'cancelled'], // Có thể chuyển sang arrived hoặc cancelled
    arrived: [], // Trạng thái cuối - không thể thay đổi
    cancelled: ['delayed', 'arrived'] // Có thể chuyển sang delayed hoặc arrived nếu cần khôi phục
  };

  // Lấy danh sách trạng thái có thể chuyển đổi
  const getAvailableStatuses = (current: string): string[] => {
    return statusTransitions[current] || [];
  };

  const availableStatuses = getAvailableStatuses(currentStatus);

  // Validate status transition
  const validateStatusTransition = (newStatus: string) => {
    const allowed = getAvailableStatuses(currentStatus);
    if (!allowed.includes(newStatus)) {
      let errorMessage = "";
      switch (currentStatus) {
        case 'scheduled':
          errorMessage = "Từ trạng thái scheduled chỉ có thể chuyển sang departed";
          break;
        case 'departed':
          errorMessage = "Từ trạng thái departed chỉ có thể chuyển sang delayed, arrived hoặc cancelled";
          break;
        case 'delayed':
          errorMessage = "Từ trạng thái delayed chỉ có thể chuyển sang arrived hoặc cancelled";
          break;
        case 'arrived':
        case 'cancelled':
          errorMessage = `Không thể thay đổi từ trạng thái '${getStatusLabel(currentStatus)}' (trạng thái cuối)`;
          break;
        default:
          errorMessage = "Chuyển đổi trạng thái không hợp lệ";
      }
      setValidationError(errorMessage);
      return false;
    }
    setValidationError("");
    return true;
  };

  // Lấy label cho status
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      scheduled: 'Scheduled',
      departed: 'Departed',
      arrived: 'Arrived',
      delayed: 'Delayed',
      cancelled: 'Cancelled'
    };
    return labels[status] || status;
  };

  // Reset validation khi modal đóng
  useEffect(() => {
    if (!visible) {
      setValidationError("");
    }
  }, [visible]);

  const handleStatusChange = (value: string) => {
    validateStatusTransition(value);
    form.setFieldsValue({ status: value });
  };

  const handleOk = () => {
    const formValues = form.getFieldsValue();
    if (formValues.status && validateStatusTransition(formValues.status)) {
      onOk();
    }
  };

  return (
    <Modal
      title="Edit Trip Status"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        
        
        {validationError && (
          <Alert
            message="Validation Error"
            description={validationError}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form.Item 
          name="status" 
          label="New Status" 
          rules={[
            { required: true, message: 'Please select a status' },
            {
              validator: (_, value) => {
                if (value && !validateStatusTransition(value)) {
                  return Promise.reject(new Error('Invalid status transition'));
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <Select 
            placeholder="Select new status"
            onChange={handleStatusChange}
            disabled={currentStatus === 'arrived'}
          >
            {['scheduled', 'departed', 'delayed', 'arrived', 'cancelled'].map(status => {
              const isAllowed = availableStatuses.includes(status);
              const isCurrentStatus = status === currentStatus;
              
              return (
                <Select.Option 
                  key={status} 
                  value={status}
                  disabled={!isAllowed || isCurrentStatus}
                  style={{
                    color: !isAllowed || isCurrentStatus ? '#ccc' : 'inherit',
                    backgroundColor: isCurrentStatus ? '#f5f5f5' : 'inherit'
                  }}
                >
                  {getStatusLabel(status)}
                  {isCurrentStatus && ' (Current)'}
                  {!isAllowed && !isCurrentStatus && ' (Not allowed)'}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        {currentStatus === 'arrived' && (
          <Alert
            message="Cannot change status"
            description="Status 'Arrived' is final and cannot be changed."
            type="info"
            showIcon
          />
        )}
        
        
      </Form>
    </Modal>
  );
};

export default EditTripStatusModal;
