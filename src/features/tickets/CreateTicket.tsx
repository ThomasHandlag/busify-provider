import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Typography,
  message,
  InputNumber,
  type FormProps,
  Modal,
  Select,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  NumberOutlined,
} from "@ant-design/icons";
import {
  createBooking,
  createTicket,
  getGuestsByOperator,
} from "../../app/api/ticket";
import type { CreateBookingData, GuestInfo } from "../../app/api/ticket";
import type { BusLayout, Seat } from "./SeatSelectCard";
import { getTripSeatById, type TripSeatsStatus } from "../../app/api/trip";
import { getBusSeatsLayout } from "../../app/api/bus";
import SeatSelectCard from "./SeatSelectCard";
import { useGNotify } from "../../app/hooks";
import { globStore } from "../../stores/glob_store";
import { useNavigate } from "react-router";

const { Title } = Typography;

interface TicketFormData {
  guestFullName: string;
  guestPhone: string;
  guestEmail: string;
  guestAddress?: string;
  seatNumber: string;
  totalAmount: number;
  discountCode?: string;
  customerId?: number;
}

const generateSeats = ({
  busLayout,
  pricePS,
  tripSeatsStatus,
}: {
  busLayout: BusLayout | null;
  pricePS: number;
  tripSeatsStatus: TripSeatsStatus | null;
}) => {
  const seats: Seat[] = [];

  // Return empty array if layout is null or invalid
  if (!busLayout || (!busLayout.rows && !busLayout.cols && !busLayout.floors)) {
    return seats;
  }

  // Additional validation to prevent infinite loops
  if (busLayout.rows <= 0 || busLayout.cols <= 0 || busLayout.floors <= 0) {
    return seats;
  }

  for (let floor = 1; floor <= busLayout.floors; floor++) {
    for (let row = 1; row <= busLayout.rows; row++) {
      for (let col = 0; col < busLayout.cols; col++) {
        const seatId =
          (floor - 1) * busLayout.rows * busLayout.cols +
          (row - 1) * busLayout.cols +
          col +
          1;
        const seatName = `${String.fromCharCode(65 + col)}.${row}.${floor}`;

        // Find status from trip seats data if available
        const seatStatus =
          tripSeatsStatus?.seatsStatus.find((s) => s.seatNumber === seatName)
            ?.status || "booked";

        seats.push({
          id: seatId,
          seat_number: seatName,
          status: seatStatus,
          price: pricePS,
          row: row - 1,
          column: col,
          floor,
        });
      }
    }
  }

  return seats;
};

const CreateTicket = () => {
  const { data } = globStore();
  const [form] = Form.useForm<TicketFormData>();
  const [loading, setLoading] = useState(false);
  const [busLayout, setBusLayout] = useState<BusLayout | null>(null);
  const [tripSeatsData, setTripSeatsData] = useState<TripSeatsStatus | null>(
    null
  );
  console.log(data);
  const { notify } = useGNotify();
  const navigate = useNavigate();
  const [guests, setGuests] = useState<GuestInfo[]>([]);
  useEffect(() => {
    try {
      const fetchData = async () => {
        const [layout, seatsStatus] = await Promise.all([
          getBusSeatsLayout(data.busId),
          getTripSeatById(data.tripId),
        ]);
        setBusLayout(layout);
        setTripSeatsData(seatsStatus);
      };
      fetchData();
    } catch (error) {
      console.error("Error fetching bus layout and trip seats:", error);
      notify?.error({
        message: "Error",
        description: "Failed to fetch bus layout and trip seats.",
      });
    }
  }, [data.tripId]);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const data = await getGuestsByOperator();
        setGuests(data);
        console.log("Fetched guests:", data);
      } catch (error) {
        console.error("Error fetching guests:", error);
      }
    };
    fetchGuests();
  }, []);

  const onFinish: FormProps<TicketFormData>["onFinish"] = async (values) => {
    setLoading(true);
    try {
      // Map form values to CreateBookingData structure
      const bookingData: CreateBookingData = {
        tripId: data.tripId,
        guestFullName: values.guestFullName,
        guestEmail: values.guestEmail,
        guestPhone: values.guestPhone,
        guestAddress: values.guestAddress || null,
        discountCode: values.discountCode || null,
        customerId: values.customerId || null,
        seatNumber: values.seatNumber,
        totalAmount: values.totalAmount,
      };

      // Create the booking
      const bookingId = await createBooking(bookingData);
      console.log("Created booking with ID:", bookingId);

      // If booking is successful, create ticket
      if (bookingId) {
        Modal.confirm({
          title: "Confirm Ticket Creation",
          content: `Booking created successfully with ID: ${bookingId}. Do you want to create the ticket now?`,
          onOk: async () => {
            try {
              await createTicket({
                bookingId,
                sellMethod: "MANUAL",
              });

              message.success("Ticket created successfully!");
              form.resetFields();
              navigate("/dashboard/tickets");
            } catch (error) {
              console.error("Error creating ticket:", error);
              message.error("Failed to create ticket. Please try again.");
            }
          },
        });
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      message.error("Failed to create ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Title level={4}>Create New Ticket</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          guestFullName: undefined,
          guestPhone: "",
          guestEmail: "",
          guestAddress: "",
          seatNumber: "",
          totalAmount: 0,
          discountCode: "",
        }}
      >
        {/* Guest Information */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="guestFullName"
              label="Passenger Name"
              rules={[
                { required: true, message: "Please select passenger name" },
              ]}
            >
              <Select
                showSearch
                placeholder="Select passenger name"
                optionFilterProp="children"
                onSelect={(value) => {
                  const guest = guests.find((g) => g.guestEmail === value);
                  if (guest) {
                    form.setFieldsValue({
                      guestFullName: guest.guestFullName,
                      guestEmail: guest.guestEmail,
                      guestPhone: guest.guestPhone,
                      ...(guest.guestAddress
                        ? { guestAddress: guest.guestAddress }
                        : { guestAddress: "" }),
                    });
                  }
                }}
                prefix={<UserOutlined />}
              >
                {guests.map((g) => (
                  <Select.Option key={g.guestEmail} value={g.guestEmail}>
                    {`${g.guestFullName} - ${g.guestPhone ?? ""} - ${
                      g.guestEmail ?? ""
                    }`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="guestPhone"
              label="Passenger Phone"
              rules={[
                {
                  required: true,
                  message: "Please enter passenger phone number",
                },
                {
                  pattern: /^[0-9+\-\s]+$/,
                  message: "Please enter a valid phone number",
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Enter passenger phone number"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="guestEmail"
              label="Passenger Email"
              rules={[
                { required: true, message: "Please enter passenger email" },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Enter passenger email address"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="guestAddress" label="Passenger Address">
              <Input
                prefix={<HomeOutlined />}
                placeholder="Enter passenger address (optional)"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Booking Details */}
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              name="totalAmount"
              label="Total Amount"
              rules={[
                { required: true, message: "Please enter the ticket amount" },
              ]}
            >
              <InputNumber
                addonBefore="₫"
                placeholder="Enter ticket price"
                min={0}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="discountCode" label="Discount Code (optional)">
              <Input
                prefix={<NumberOutlined />}
                placeholder="Enter discount code"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col xs={24} md={8}>
            <Form.Item name="customerId" label="Customer ID (optional)">
              <InputNumber
                placeholder="Enter customer ID if available"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="seatNumber"
          label="Select Seat Number"
          rules={[
            { required: true, message: "Please select at least one seat" },
          ]}
        >
          <SeatSelectCard
            pricePerSeat={data.price}
            seats={generateSeats({
              busLayout,
              pricePS: data.price,
              tripSeatsStatus: tripSeatsData,
            })}
            layout={busLayout}
            tripId={data.tripId}
            onSeatSelection={(seats) => {
              form.setFieldValue("seatNumber", seats.join(", "));
              form.setFieldValue("totalAmount", seats.length * data.price);
            }}
          />
          <Form.ErrorList />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Request Booking
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateTicket;
