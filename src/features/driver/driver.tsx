import React, { useState } from "react";
import { Form } from "antd";

// Components
import TripCard from "./components/TripCard";
import PassengerModal from "./components/PassengerModal";
import EditTicketModal from "./components/EditTicketModal";
import EditTripStatusModal from "./components/EditTripStatusModal";

// Hooks
import {
  useTrips,
  useTripPassengers,
  useUpdateTicket,
  useUpdateTripStatus,
} from "./hooks/useDriverData";

// Types
import type { Trip, Passenger } from "../../app/api/driver";

const DriverManagement: React.FC = () => {
  // State for modals
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Passenger | null>(null);

  // Modal visibility states
  const [isPassengerModalVisible, setIsPassengerModalVisible] = useState(false);
  const [isEditTicketModalVisible, setIsEditTicketModalVisible] =
    useState(false);
  const [isEditTripStatusVisible, setIsEditTripStatusVisible] = useState(false);

  // Forms
  const [form] = Form.useForm();
  const [statusForm] = Form.useForm();

  // React Query hooks
  const { data: trips = [], isLoading: tripsLoading } = useTrips();

  const { data: passengersData } = useTripPassengers(selectedTrip?.trip_id || 0);

  // Mutations
  const updateTicketMutation = useUpdateTicket();
  const updateTripStatusMutation = useUpdateTripStatus();

  // Event handlers
  const handleTripClick = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsPassengerModalVisible(true);
    // Data will be automatically fetched due to tripId change
  };

  const handleEditTicket = (passenger: Passenger) => {
    setSelectedTicket(passenger);
    // Reset form trước khi set giá trị mới
    form.resetFields();
    // Set giá trị cho form
    form.setFieldsValue({
      passengerPhone: passenger.passengerPhone,
      email: passenger.email,
      seatNumber: passenger.seatNumber,
      status: passenger.status,
    });
    setIsEditTicketModalVisible(true);
  };

  const handleEditTripStatus = (trip: Trip) => {
    setSelectedTrip(trip);
    statusForm.setFieldsValue({ status: trip.status });
    setIsEditTripStatusVisible(true);
  };

  // Submit handlers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onUpdateTicket = async (values: any) => {
    if (!selectedTrip || !selectedTicket) return;

    const updateData = {
      passengerName: selectedTicket.passengerName,
      passengerPhone: values.passengerPhone,
      email: values.email,
      seatNumber: values.seatNumber,
      status: values.status,
    };

    updateTicketMutation.mutate({
      tripId: selectedTrip.trip_id,
      ticketId: selectedTicket.ticketId,
      data: updateData,
    }, {
      onSuccess: () => {
        // Reset tất cả state liên quan
        setIsEditTicketModalVisible(false);
        setSelectedTicket(null);
        form.resetFields();
        
        // Đợi một chút để đảm bảo UI được update
        setTimeout(() => {
          console.log("Ticket updated and states reset");
        }, 100);
      }
    });
  };

  const handleCloseEditTicketModal = () => {
    setIsEditTicketModalVisible(false);
    setSelectedTicket(null);
    form.resetFields();
  };

  const handleClosePassengerModal = () => {
    setIsPassengerModalVisible(false);
    // Reset selected trip khi đóng modal passengers để đảm bảo query được reset
    setTimeout(() => {
      setSelectedTrip(null);
    }, 300); // Delay để modal animation hoàn thành
  };

  const onUpdateTripStatus = async (values: { status: string }) => {
    if (!selectedTrip) return;

    updateTripStatusMutation.mutate({
      tripId: selectedTrip.trip_id,
      data: values,
    }, {
      onSuccess: () => {
        setIsEditTripStatusVisible(false);
        statusForm.resetFields();
      }
    });
  };
  return (
    <div className="p-6">
      {/* Trip cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tripsLoading ? (
          <div className="col-span-full text-center py-8">Loading trips...</div>
        ) : (
          trips.map((trip: Trip) => (
            <TripCard
              key={trip.trip_id}
              trip={trip}
              onViewPassengers={handleTripClick}
              onEditStatus={handleEditTripStatus}
            />
          ))
        )}
      </div>

      {/* Modals */}
      <PassengerModal
        visible={isPassengerModalVisible}
        onCancel={handleClosePassengerModal}
        passengers={passengersData?.passengers || []}
        onEditTicket={handleEditTicket}
      />

      <EditTicketModal
        visible={isEditTicketModalVisible}
        onCancel={handleCloseEditTicketModal}
        onOk={() => form.submit()}
        form={form}
        passenger={selectedTicket}
      />

      <EditTripStatusModal
        visible={isEditTripStatusVisible}
        onCancel={() => setIsEditTripStatusVisible(false)}
        onOk={() => statusForm.submit()}
        form={statusForm}
      />

      {/* Hidden forms for mutation callbacks */}
      <Form form={form} onFinish={onUpdateTicket} style={{ display: "none" }} />
      <Form
        form={statusForm}
        onFinish={onUpdateTripStatus}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default DriverManagement;
