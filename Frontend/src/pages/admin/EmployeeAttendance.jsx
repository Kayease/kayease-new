import React, { useState, useEffect } from "react";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import AdminLayout from "components/admin/AdminLayout";

const EmployeeAttendance = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState("clocked-out");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchAttendanceData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call when backend is ready
      // const response = await api.get('/api/employee/attendance');
      // setAttendance(response.data);

      // Mock data for now
      const mockData = [
        {
          id: 1,
          date: "2024-02-15",
          clockIn: "09:00:00",
          clockOut: "17:30:00",
          totalHours: 8.5,
          status: "completed",
          notes: "Regular work day",
        },
        {
          id: 2,
          date: "2024-02-14",
          clockIn: "08:45:00",
          clockOut: "18:00:00",
          totalHours: 9.25,
          status: "completed",
          notes: "Extended hours for project deadline",
        },
        {
          id: 3,
          date: "2024-02-13",
          clockIn: "09:15:00",
          clockOut: "17:00:00",
          totalHours: 7.75,
          status: "completed",
          notes: "Left early for doctor appointment",
        },
        {
          id: 4,
          date: "2024-02-12",
          clockIn: "09:00:00",
          clockOut: null,
          totalHours: null,
          status: "clocked-in",
          notes: "Currently working",
        },
        {
          id: 5,
          date: "2024-02-11",
          clockIn: "08:30:00",
          clockOut: "17:30:00",
          totalHours: 9.0,
          status: "completed",
          notes: "Weekend overtime",
        },
        {
          id: 6,
          date: "2024-02-10",
          clockIn: null,
          clockOut: null,
          totalHours: 0,
          status: "absent",
          notes: "Weekend",
        },
        {
          id: 7,
          date: "2024-02-09",
          clockIn: "09:00:00",
          clockOut: "17:00:00",
          totalHours: 8.0,
          status: "completed",
          notes: "Regular work day",
        },
        {
          id: 8,
          date: "2024-02-08",
          clockIn: "08:45:00",
          clockOut: "17:15:00",
          totalHours: 8.5,
          status: "completed",
          notes: "Regular work day",
        },
      ];

      setAttendance(mockData);

      // Check if user is currently clocked in
      const todayRecord = mockData.find(
        (record) =>
          record.date === new Date().toISOString().split("T")[0] &&
          record.status === "clocked-in"
      );
      setCurrentStatus(todayRecord ? "clocked-in" : "clocked-out");
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // await api.post('/api/employee/attendance/clock-in');

      const newRecord = {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        clockIn: new Date().toTimeString().split(" ")[0],
        clockOut: null,
        totalHours: null,
        status: "clocked-in",
        notes: "Clocked in",
      };

      setAttendance((prev) => [newRecord, ...prev]);
      setCurrentStatus("clocked-in");
      toast.success("Successfully clocked in!");
    } catch (error) {
      toast.error("Failed to clock in. Please try again.");
    }
  };

  const handleClockOut = async () => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // await api.post('/api/employee/attendance/clock-out');

      const today = new Date().toISOString().split("T")[0];
      const clockOutTime = new Date().toTimeString().split(" ")[0];

      setAttendance((prev) =>
        prev.map((record) => {
          if (record.date === today && record.status === "clocked-in") {
            const clockInTime = record.clockIn;
            const totalHours = calculateHours(clockInTime, clockOutTime);
            return {
              ...record,
              clockOut: clockOutTime,
              totalHours,
              status: "completed",
              notes: "Clocked out",
            };
          }
          return record;
        })
      );

      setCurrentStatus("clocked-out");
      toast.success("Successfully clocked out!");
    } catch (error) {
      toast.error("Failed to clock out. Please try again.");
    }
  };

  const calculateHours = (clockIn, clockOut) => {
    const [inHour, inMin] = clockIn.split(":").map(Number);
    const [outHour, outMin] = clockOut.split(":").map(Number);
    const totalMinutes = outHour * 60 + outMin - (inHour * 60 + inMin);
    return Math.round((totalMinutes / 60) * 100) / 100;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "clocked-in":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "absent":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "CheckCircle";
      case "clocked-in":
        return "Clock";
      case "absent":
        return "XCircle";
      default:
        return "Circle";
    }
  };

  const getStatusIconColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "clocked-in":
        return "text-blue-500";
      case "absent":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  const filteredAttendance = attendance.filter((record) => {
    const recordDate = new Date(record.date);
    return (
      recordDate.getMonth() === selectedMonth &&
      recordDate.getFullYear() === selectedYear
    );
  });

  const totalHoursThisMonth = filteredAttendance
    .filter((record) => record.totalHours)
    .reduce((sum, record) => sum + record.totalHours, 0);

  const averageHoursPerDay =
    filteredAttendance.length > 0
      ? Math.round((totalHoursThisMonth / filteredAttendance.length) * 100) /
        100
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Attendance</h1>
            <p className="text-slate-600 mt-2">
              Track your work hours and attendance
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-slate-500">Current Time</p>
              <p className="text-lg font-mono font-semibold text-slate-800">
                {currentTime.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Clock In/Out Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                {currentStatus === "clocked-in"
                  ? "Currently Working"
                  : "Not Clocked In"}
              </h2>
              <p className="text-slate-600">
                {currentStatus === "clocked-in"
                  ? "You are currently clocked in. Click below to clock out when you finish work."
                  : "Click below to clock in when you start work."}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {currentStatus === "clocked-in" ? (
                <Button
                  onClick={handleClockOut}
                  variant="default"
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  iconName="LogOut"
                  iconPosition="left"
                >
                  Clock Out
                </Button>
              ) : (
                <Button
                  onClick={handleClockIn}
                  variant="default"
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  iconName="LogIn"
                  iconPosition="left"
                >
                  Clock In
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Total Hours This Month
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {totalHoursThisMonth}h
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Icon name="Clock" size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Average Hours/Day
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {averageHoursPerDay}h
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Icon name="Activity" size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Days This Month
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {filteredAttendance.length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Icon name="Calendar" size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Month/Year Filter */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Attendance History
            </h2>
            <div className="flex items-center space-x-4">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value={0}>January</option>
                <option value={1}>February</option>
                <option value={2}>March</option>
                <option value={3}>April</option>
                <option value={4}>May</option>
                <option value={5}>June</option>
                <option value={6}>July</option>
                <option value={7}>August</option>
                <option value={8}>September</option>
                <option value={9}>October</option>
                <option value={10}>November</option>
                <option value={11}>December</option>
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
              </select>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">
                    Clock In
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">
                    Clock Out
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">
                    Total Hours
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <Icon
                          name={getStatusIcon(record.status)}
                          size={16}
                          className={getStatusIconColor(record.status)}
                        />
                        <span className="font-medium text-slate-800">
                          {new Date(record.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {record.clockIn || "—"}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {record.clockOut || "—"}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {record.totalHours ? `${record.totalHours}h` : "—"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          record.status
                        )}`}
                      >
                        {record.status.replace("-", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-sm">
                      {record.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredAttendance.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Icon name="Calendar" size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                No attendance records found
              </h3>
              <p className="text-slate-600">
                No attendance records found for the selected month and year.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default EmployeeAttendance;
