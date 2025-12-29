import React from "react";
import { Box, Tabs, TabList, Tab } from "@chakra-ui/react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";

import { TopBar } from "./components/TopBar";
import { AddSubDrawer } from "./components/AddSubDrawer";
import { usePersistentState } from "./hooks/usePersistentState";

import { DashboardPage } from "./pages/DashboardPage";
import { CalendarPage } from "./pages/CalendarPage";
import { ListPage } from "./pages/ListPage";
import { BudgetPage } from "./pages/BudgetPage";
import { SettingsPage } from "./pages/SettingsPage";
import { HistoryPage } from "./pages/HistoryPage";

export default function App() {
  const [data, setData] = usePersistentState();
  const addDisc = useDisclosure();
  const location = useLocation();

  const routes = [
    { to: "/", label: "Dashboard" },
    { to: "/calendar", label: "Kalendarz" },
    { to: "/list", label: "Lista" },
    { to: "/budget", label: "Budżet" },
    { to: "/history", label: "Historia" },
    { to: "/settings", label: "Ustawienia" },
  ];

  const activeIndex = Math.max(
    0,
    routes.findIndex((r) => r.to === location.pathname)
  );

  return (
    <Box maxW="1200px" mx="auto" p={[3, 6]}>
      <TopBar data={data} setData={setData} onOpenAdd={addDisc.onOpen} />
      <AddSubDrawer
        isOpen={addDisc.isOpen}
        onClose={addDisc.onClose}
        data={data}
        setData={setData}
      />

      <Tabs mt={5} variant="enclosed" colorScheme="purple" index={activeIndex}>
        <TabList>
          {routes.map((r) => (
            <Tab
              key={r.to}
              as={Link}
              to={r.to}
              fontWeight="medium"
              _selected={{
                color: "white",
                bg: "purple.500",
                borderColor: "purple.500",
                borderBottomColor: "purple.500"
              }}
              mr={1}
            >
              {r.label}
            </Tab>
          ))}
        </TabList>
      </Tabs>

      <Box mt={4}>
        <Routes>
          <Route path="/" element={<DashboardPage data={data} />} />
          <Route path="/calendar" element={<CalendarPage data={data} />} />
          <Route
            path="/list"
            element={<ListPage data={data} setData={setData} />}
          />
          <Route
            path="/budget"
            element={<BudgetPage data={data} setData={setData} />}
          />
          <Route path="/history" element={<HistoryPage data={data} setData={setData} />} />

          <Route
            path="/settings"
            element={<SettingsPage data={data} setData={setData} />}
          />
        </Routes>
      </Box>

      <Box mt={8} textAlign="center" color="gray.500" fontSize="sm">
        © 2025 VoD Sub Tracker
      </Box>
    </Box>
  );
}