import React, { useState, useEffect } from "react";
import { Calendar, Badge, Modal, Input, Button, Select, message } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

type Event = {
  date: string;
  type: "success" | "processing" | "default" | "error" | "warning";
  content: string;
};

const CalendarWithEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(() => {
    const storedEvents = localStorage.getItem("events");
    return storedEvents ? JSON.parse(storedEvents) : [];
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState<Event>({
    date: dayjs().format("YYYY-MM-DD"),
    type: "info",
    content: "",
  });

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const getListData = (date: Dayjs): Event[] => {
    return events.filter((event) => event.date === date.format("YYYY-MM-DD"));
  };

  const dateCellRender = (date: Dayjs) => {
    const isToday = date.isSame(dayjs(), "day");
    const listData = getListData(date);

    return (
      <div className={isToday ? "bg-blue-100 rounded-lg p-1" : ""}>
        <ul className="events">
          {listData.map((item, index) => (
            <li key={index}>
              <Badge status={item.type} text={item.content} />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const handleAddEvent = () => {
    const isDuplicate = events.some(
      (event) =>
        event.date === newEvent.date && event.type === newEvent.type
    );

    if (isDuplicate) {
      Modal.error({
        title: "Duplicate Event",
        content: "An event with the same date and type already exists.",
      });
      return;
    }

    setEvents([...events, newEvent]);
    message.success("Event added successfully!");
    setIsModalVisible(false);
    setNewEvent({ date: dayjs().format("YYYY-MM-DD"), type: "info", content: "" });
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-center text-xl font-bold mb-4">Event Calendar</h2>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        className="mb-4"
      >
        Add Event
      </Button>
      <Calendar dateCellRender={dateCellRender} />
      <Modal
        title="Add Event"
        visible={isModalVisible}
        onOk={handleAddEvent}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          placeholder="Event Content"
          value={newEvent.content}
          onChange={(e) =>
            setNewEvent({ ...newEvent, content: e.target.value })
          }
          className="mb-2"
        />
        <Select
          value={newEvent.type}
          onChange={(value) => setNewEvent({ ...newEvent, type: value })}
          className="mb-2"
          options={[
            { value: "success", label: "Success" },
            { value: "warning", label: "Warning" },
            { value: "error", label: "Error" },
            { value: "info", label: "Info" },
          ]}
        />
        <Input
          type="date"
          value={newEvent.date}
          onChange={(e) =>
            setNewEvent({ ...newEvent, date: e.target.value })
          }
        />
      </Modal>
    </div>
  );
};

export default CalendarWithEvents;