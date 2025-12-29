import React, { useMemo, useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react"; // Dodałem Text
import { Calendar, dayjsLocalizer, Views } from "react-big-calendar";
import dayjs from "dayjs";
import "dayjs/locale/pl";
import type { AppState } from "../types";

dayjs.locale("pl");
const localizer = dayjsLocalizer(dayjs);

export const RenewalsCalendar: React.FC<{ data: AppState }> = ({ data }) => {
  const { subs, categories } = data;

  const catById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c] as const)),
    [categories]
  );

  const events = useMemo(
    () =>
      subs
        .filter((s) => s.active && s.nextRenewal)
        .map((s) => {
          const start = dayjs(s.nextRenewal).startOf("day").toDate();
          const end = dayjs(s.nextRenewal).add(1, "day").startOf("day").toDate();
          const cat = catById[s.categoryId];
          return {
            id: s.id,
            title: `${s.name} • ${s.price.toFixed(2)} ${s.currency}`,
            start,
            end,
            allDay: true,
            resource: { color: cat?.color ?? "#3182CE" },
          };
        }),
    [subs, catById]
  );

  const eventPropGetter = (event: any) => ({
    style: {
      backgroundColor: event?.resource?.color || "#3182CE",
      borderRadius: 8,
      color: "#fff",
      border: "none",
      padding: "2px 6px",
      opacity: 0.95,
    },
  });

  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const handleViewChange = (newView: Views) => setView(newView);
  const handleNavigate = (action: "PREV" | "NEXT") => {
    const d = dayjs(date).add(action === "NEXT" ? 1 : -1, "month").toDate();
    setDate(d);
  };

  return (
    <Box
      bg="white"
      p={3}
      rounded="2xl"
      shadow="sm"
      border="1px"
      borderColor="gray.100"
      _dark={{ bg: "gray.700", borderColor: "gray.600" }}
    >
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={view}
        date={date}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        onView={handleViewChange}
        onNavigate={(newDate) => setDate(newDate)}
        style={{ height: 600 }}
        eventPropGetter={eventPropGetter}
        popup
        culture="pl"
        formats={{
            weekdayFormat: (date, culture, localizer) =>
              localizer?.format(date, "dddd", culture).charAt(0).toUpperCase() || "",
        }}
        components={{
          month: {
            header: ({ label }) => (
                <Box bg="purple.500" color="white" py={2} mb={1} borderRadius="md" textAlign="center">
                    <Text fontWeight="bold">{label}</Text>
                </Box>
            ),
          },
          toolbar: ({ label, onNavigate }: any) => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
              }}
            >
              <Button
                onClick={() => onNavigate("PREV")}
                _dark={{ bg: "gray.600", color: "white" }}
                variant="outline"
              >
                {"<"}
              </Button>
              <div>{label}</div>
              <Button
                onClick={() => onNavigate("NEXT")}
                _dark={{ bg: "gray.600", color: "white" }}
                variant="outline"
              >
                {">"}
              </Button>
            </div>
          ),
        }}
        dayPropGetter={(dayDate) => {
          const today = dayjs().startOf("day");
          const d = dayjs(dayDate).startOf("day");

          const isToday = d.isSame(today, "day");

          const currentViewMonth = dayjs(date).month();
          const currentViewYear = dayjs(date).year();
          const isInCurrentViewMonth =
            d.month() === currentViewMonth && d.year() === currentViewYear;

          return {
            style: {
              backgroundColor: isToday ? "#E9D8FD" : isInCurrentViewMonth ? "transparent" : "#F7FAFC", // Lekka zmiana koloru today
              color: isToday ? "inherit" : undefined,
              fontWeight: isToday ? "bold" : undefined,
            },
          };
        }}
      />
    </Box>
  );
};