import React, { useState } from "react";
import { Form } from "antd";

// Components
import TripCard from "./components/TripCard";
import PassengerModal from "./components/PassengerModal";
import EditTicketModal from "./components/EditTicketModal";
import EditTripStatusModal from "./components/EditTripStatusModal";
import DriverListModal from "./components/DriverListModal";
import DriverTripsModal from "./components/DriverTripsModal";

// Hooks
import {
  useTrips,
  useDrivers,
  useDriverTrips,
  useTripPassengers,
  useUpdateTicket,
  useUpdateTripStatus,
} from "./hooks/useDriverData";

// Types
import type { Trip, Driver, Passenger } from "../../app/api/driver";

const DriverManagement: React.FC = () => {
  // State for modals
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Passenger | null>(null);
  
  // Modal visibility states
  const [isPassengerModalVisible, setIsPassengerModalVisible] = useState(false);
  const [isEditTicketModalVisible, setIsEditTicketModalVisible] = useState(false);
  const [isEditTripStatusVisible, setIsEditTripStatusVisible] = useState(false);
  const [isDriverListVisible, setIsDriverListVisible] = useState(false);
  const [isDriverTripsVisible, setIsDriverTripsVisible] = useState(false);

  // Forms
  const [form] = Form.useForm();
  const [statusForm] = Form.useForm();

  // React Query hooks
  const { data: trips = [], isLoading: tripsLoading } = useTrips();
  const { 
    data: drivers = [], 
    refetch: refetchDrivers,
    isLoading: driversLoading 
  } = useDrivers();
  
  const { 
    data: driverTrips = [], 
    refetch: refetchDriverTrips 
  } = useDriverTrips(selectedDriver?.id || 0);
  
  const { 
    data: passengersData, 
    refetch: refetchPassengers 
  } = useTripPassengers(selectedTrip?.trip_id || 0);

  // Mutations
  const updateTicketMutation = useUpdateTicket();
  const updateTripStatusMutation = useUpdateTripStatus();

  // Event handlers
  const handleTripClick = async (trip: Trip) => {
    setSelectedTrip(trip);
    setIsPassengerModalVisible(true);
    await refetchPassengers();
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

  const handleDriverClick = async (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDriverTripsVisible(true);
    await refetchDriverTrips();
  };

  const handleManageDrivers = async () => {
    setIsDriverListVisible(true);
    await refetchDrivers();
  };

  // Submit handlers
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
    });

    setIsEditTicketModalVisible(false);
    form.resetFields();
  };

  const onUpdateTripStatus = async (values: { status: string }) => {
    if (!selectedTrip) return;

    updateTripStatusMutation.mutate({
      tripId: selectedTrip.trip_id,
      data: values,
    });

    setIsEditTripStatusVisible(false);
    statusForm.resetFields();
  };

  return (
    <div className="p-6">
      {/* Header with manage drivers button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleManageDrivers}
          disabled={driversLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
        >
          {driversLoading ? "Loading..." : "Manage Drivers"}
        </button>
      </div>

      {/* Trip cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tripsLoading ? (
          <div className="col-span-full text-center py-8">Loading trips...</div>
        ) : (
          trips.map((trip) => (
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
        onCancel={() => setIsPassengerModalVisible(false)}
        passengers={passengersData?.passengers || []}
        onEditTicket={handleEditTicket}
      />

      <EditTicketModal
        visible={isEditTicketModalVisible}
        onCancel={() => setIsEditTicketModalVisible(false)}
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

      <DriverListModal
        visible={isDriverListVisible}
        onCancel={() => setIsDriverListVisible(false)}
        drivers={drivers}
        onViewDriverTrips={handleDriverClick}
      />

      <DriverTripsModal
        visible={isDriverTripsVisible}
        onCancel={() => setIsDriverTripsVisible(false)}
        selectedDriver={selectedDriver}
        driverTrips={driverTrips}
      />

      {/* Hidden forms for mutation callbacks */}
      <Form form={form} onFinish={onUpdateTicket} style={{ display: 'none' }} />
      <Form form={statusForm} onFinish={onUpdateTripStatus} style={{ display: 'none' }} />
    </div>
  );
};

export default DriverManagement;
