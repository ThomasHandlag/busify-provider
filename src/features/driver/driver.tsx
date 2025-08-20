import { useEffect, useState } from "react";
import { Card, Form, Input, Modal, Select, Space, Table, Button } from "antd";
import { useGNotify } from "../../app/hooks";
import apiClient from "../../app/api";

interface Trip {
  trip_id: number;
  operator_name: string;
  route: {
    start_location: string;
    end_location: string;
  };
  amenities: {
    wifi: boolean;
    air_conditioner: boolean;
  };

  average_rating: number;
  departure_time: string;
  arrival_time: string;
  status: string;
  price_per_seat: number;
  available_seats: number;
  total_seats: number;
}

interface Driver {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  employeeType: string;
  status: string;
  driverLicenseNumber: string;
  operatorId: number;
  operatorName: string;
}

interface Passenger {
  passengerName: string;
  passengerPhone: string | null;
  email: string;
  seatNumber: string;
  status: string;
  ticketCode: string;
  ticketId: number;
}

interface PassengerResponse {
  tripId: number;
  operatorName: string | null;
  routeName: string | null;
  departureTime: string | null;
  passengers: Passenger[];
}

const DriverManagement = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [isPassengerModalVisible, setIsPassengerModalVisible] = useState(false);
  const [isEditTicketModalVisible, setIsEditTicketModalVisible] =
    useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Passenger | null>(null);
  const [isEditTripStatusVisible, setIsEditTripStatusVisible] = useState(false);
  const { notify } = useGNotify();
  const [form] = Form.useForm();
  const [statusForm] = Form.useForm();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isDriverListVisible, setIsDriverListVisible] = useState(false);
  const [isDriverTripsVisible, setIsDriverTripsVisible] = useState(false);
  const [driverTrips, setDriverTrips] = useState<Trip[]>([]);

  /// lấy danh sách tất cả tài xế
  const fetchDrivers = async () => {
    try {
      const response = await apiClient.get("api/employees/drivers");
      setDrivers(response.data.result);
    } catch (error: any) {
      notify?.error({
        message: "Error",
        description: error.response?.data?.message || "Failed to fetch drivers",
        placement: "bottomRight",
      });
    }
  };

  /// lấy danh sách các tài xế theo id
  const fetchDriverTrips = async (driverId: number) => {
    try {
      const response = await apiClient.get(`api/trips/driver/${driverId}`);
      setDriverTrips(response.data.result);
    } catch (error: any) {
      notify?.error({
        message: "Error",
        description:
          error.response?.data?.message || "Failed to fetch driver trips",
        placement: "bottomRight",
      });
    }
  };

  const handleDriverClick = async (driver: Driver) => {
    setSelectedDriver(driver);
    await fetchDriverTrips(driver.id);
    setIsDriverTripsVisible(true);
  };

  ///lấy tất cả chuyến đi
  const fetchTrips = async () => {
    try {
      const response = await apiClient.get("api/trips");
      setTrips(response.data.result);
    } catch (error) {
      notify?.error({
        message: "Error",
        description: "Failed to fetch trips",
        placement: "bottomRight",
      });
    }
  };

  ///lấy danh sách khách của chuyến đi đó
  const fetchPassengers = async (tripId: number) => {
    try {
      const response = await apiClient.get(
        `api/tickets/trip/${tripId}/passengers`
      );
      const passengerData = response.data.result as PassengerResponse;
      setPassengers(passengerData.passengers);
    } catch (error) {
      notify?.error({
        message: "Error",
        description: "Failed to fetch passengers",
        placement: "bottomRight",
      });
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleTripClick = async (trip: Trip) => {
    setSelectedTrip(trip);
    await fetchPassengers(trip.trip_id);
    setIsPassengerModalVisible(true);
  };

  const handleEditTicket = (passenger: Passenger) => {
    setSelectedTicket(passenger);
    form.setFieldsValue(passenger);
    setIsEditTicketModalVisible(true);
  };

  const handleEditTripStatus = (trip: Trip) => {
    setSelectedTrip(trip);
    statusForm.setFieldsValue({ status: trip.status });
    setIsEditTripStatusVisible(true);
  };

  const onUpdateTicket = async (values: any) => {
    try {
      const updateData = {
        passengerName: selectedTicket?.passengerName, // Giữ nguyên tên khách hàng
        passengerPhone: values.passengerPhone,
        email: values.email,
        seatNumber: values.seatNumber,
        status: values.status,
      };

      ///cập nhật thông tin khách của chuyến đi đó
      await apiClient.put(
        `api/tickets/trip/${selectedTrip?.trip_id}/ticket/${selectedTicket?.ticketId}`,
        updateData
      );

      notify?.success({
        message: "Success",
        description: "Ticket updated successfully",
        placement: "bottomRight",
      });
      setIsEditTicketModalVisible(false);
      if (selectedTrip) {
        await fetchPassengers(selectedTrip.trip_id);
      }
    } catch (error: any) {
      notify?.error({
        message: "Error",
        description: error.response?.data?.message || "Failed to update ticket",
        placement: "bottomRight",
      });
      console.error("Error updating ticket:", error.response || error);
    }
  };

  ///cập nhật trạng thái chuyến đi
  const onUpdateTripStatus = async (values: { status: string }) => {
    try {
      await apiClient.put(`api/trips/${selectedTrip?.trip_id}/status`, values);
      notify?.success({
        message: "Success",
        description: "Trip status updated successfully",
        placement: "bottomRight",
      });
      setIsEditTripStatusVisible(false);
      await fetchTrips();
    } catch (error) {
      notify?.error({
        message: "Error",
        description: "Failed to update trip status",
        placement: "bottomRight",
      });
    }
  };

  const passengerColumns = [
    {
      title: "Name",
      dataIndex: "passengerName",
      key: "passengerName",
    },
    {
      title: "Phone",
      dataIndex: "passengerPhone",
      key: "passengerPhone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Seat",
      dataIndex: "seatNumber",
      key: "seatNumber",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Ticket Code",
      dataIndex: "ticketCode",
      key: "ticketCode",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Passenger) => (
        <a onClick={() => handleEditTicket(record)}>Edit</a>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            fetchDrivers();
            setIsDriverListVisible(true);
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Manage Drivers
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trips.map((trip) => (
          <Card
            key={trip.trip_id}
            title={trip.operator_name}
            extra={
              <a onClick={() => handleEditTripStatus(trip)}>Edit Status</a>
            }
            className="hover:shadow-lg transition-shadow"
          >
            <p>
              <strong>TripID:</strong> {trip.trip_id}
            </p>
            <p>
              <strong>From:</strong> {trip.route.start_location}
            </p>
            <p>
              <strong>To:</strong> {trip.route.end_location}
            </p>
            <p>
              <strong>Departure:</strong>{" "}
              {new Date(trip.departure_time).toLocaleString()}
            </p>
            <p>
              <strong>Arrival:</strong>{" "}
              {new Date(trip.arrival_time).toLocaleString()}
            </p>
            <p>
              <strong>Price:</strong> {trip.price_per_seat.toLocaleString()}đ
            </p>
            <p>
              <strong>Available Seats:</strong> {trip.available_seats}/
              {trip.total_seats}
            </p>
            <p>
              <strong>Rating:</strong>{" "}
              {trip.average_rating?.toFixed(1) || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {trip.status || "N/A"}
            </p>
            <p>
              <strong>Amenities:</strong>{" "}
              {[
                trip.amenities.wifi && "WiFi",
                trip.amenities.air_conditioner && "Air Conditioner",
              ]
                .filter(Boolean)
                .join(", ") || "None"}
            </p>

            <div className="mt-4">
              <a onClick={() => handleTripClick(trip)}>View Passengers</a>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        title="Passenger List"
        open={isPassengerModalVisible}
        onCancel={() => setIsPassengerModalVisible(false)}
        width={1000}
        footer={null}
      >
        <Table
          dataSource={passengers}
          columns={passengerColumns}
          rowKey={(record) => record.ticketId}
        />
      </Modal>

      <Modal
        title="Edit Ticket"
        open={isEditTicketModalVisible}
        onCancel={() => setIsEditTicketModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={onUpdateTicket} layout="vertical">
          <Form.Item
            name="passengerPhone"
            label="Phone Number"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="seatNumber"
            label="Seat Number"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="cancelled">Cancelled</Select.Option>
              <Select.Option value="valid">Valid</Select.Option>
              <Select.Option value="used">Used</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Trip Status"
        open={isEditTripStatusVisible}
        onCancel={() => setIsEditTripStatusVisible(false)}
        onOk={() => statusForm.submit()}
      >
        <Form form={statusForm} onFinish={onUpdateTripStatus} layout="vertical">
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="cancelled">Cancelled</Select.Option>
              <Select.Option value="delayed">Delayed</Select.Option>
              <Select.Option value="ontime">On Time</Select.Option>
              <Select.Option value="arrived">Arrived</Select.Option>
              <Select.Option value="scheduled">Scheduled</Select.Option>
              <Select.Option value="departed">Departed</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Driver List"
        open={isDriverListVisible}
        onCancel={() => setIsDriverListVisible(false)}
        width={1200}
        footer={null}
      >
        <Table
          dataSource={drivers}
          columns={[
            {
              title: "ID",
              dataIndex: "id",
              key: "id",
              width: 60,
            },
            {
              title: "Name",
              dataIndex: "fullName",
              key: "fullName",
              width: 150,
              ellipsis: true,
            },
            {
              title: "Email",
              dataIndex: "email",
              key: "email",
              width: 180,
              ellipsis: true,
            },
            {
              title: "Phone",
              dataIndex: "phoneNumber",
              key: "phoneNumber",
              width: 120,
            },
            {
              title: "License",
              dataIndex: "driverLicenseNumber",
              key: "driverLicenseNumber",
              width: 120,
              ellipsis: true,
            },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              width: 100,
            },
            {
              title: "Operator",
              dataIndex: "operatorName",
              key: "operatorName",
              width: 150,
              ellipsis: true,
            },
            {
              title: "Actions",
              key: "actions",
              width: 140,
              fixed: "right",
              render: (_: any, record: Driver) => (
                <Space direction="vertical" size={2}>
                  <Button
                    type="primary"
                    size="small"
                    style={{ width: "100%", fontSize: "10px", height: "22px" }}
                    onClick={() => handleDriverClick(record)}
                  >
                    View Trips
                  </Button>
                </Space>
              ),
            },
          ]}
          rowKey="id"
          scroll={{ x: 1000, y: 400 }}
          pagination={{ pageSize: 10 }}
        />
      </Modal>

      <Modal
        title={`Trips for ${selectedDriver?.fullName}`}
        open={isDriverTripsVisible}
        onCancel={() => setIsDriverTripsVisible(false)}
        width={1000}
        footer={null}
      >
        <Table
          dataSource={driverTrips}
          columns={[
            {
              title: "Trip ID",
              dataIndex: "tripId",
              key: "tripId",
            },
            {
              title: "From",
              dataIndex: ["startAddress"],
              key: "startAddress",
            },
            {
              title: "To",
              dataIndex: ["endAddress"],
              key: "endAddress",
            },
            {
              title: "Departure",
              dataIndex: "departureTime",
              key: "departureTime",
              render: (text: string) => new Date(text).toLocaleString(),
            },

            {
              title: "Arrival Time",
              dataIndex: "estimatedArrivalTime",
              key: "estimatedArrivalTime",
              render: (text: string) => new Date(text).toLocaleString(),
            },

            {
              title: "Status",
              dataIndex: "status",
              key: "status",
            },
            {
              title: "Rating",
              dataIndex: "averageRating",
              key: "averageRating",
              render: (rating: number) => rating?.toFixed(1) || "N/A",
            },
          ]}
          rowKey="tripId"
        />
      </Modal>
    </div>
  );
};

export default DriverManagement;
