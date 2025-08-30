import React, { useState, useEffect } from "react";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import AdminLayout from "components/admin/AdminLayout";

const EmployeeCalendar = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    startDate: "",
    endDate: "",
    reason: "",
    type: "sick",
  });

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls when backend is ready
      // const [holidaysResponse, leavesResponse] = await Promise.all([
      //   api.get('/api/employee/holidays'),
      //   api.get('/api/employee/leaves')
      // ]);
      // setHolidays(holidaysResponse.data);
      // setLeaves(leavesResponse.data);

      // Mock data for now
      const mockHolidays = [
        {
          id: 1,
          name: "New Year's Day",
          date: "2024-01-01",
          type: "public",
        },
        {
          id: 2,
          name: "Independence Day",
          date: "2024-08-15",
          type: "public",
        },
        {
          id: 3,
          name: "Republic Day",
          date: "2024-01-26",
          type: "public",
        },
        {
          id: 4,
          name: "Gandhi Jayanti",
          date: "2024-10-02",
          type: "public",
        },
        {
          id: 5,
          name: "Christmas",
          date: "2024-12-25",
          type: "public",
        },
      ];

      const mockLeaves = [
        {
          id: 1,
          startDate: "2024-02-20",
          endDate: "2024-02-22",
          reason: "Family vacation",
          type: "annual",
          status: "approved",
          days: 3,
        },
        {
          id: 2,
          startDate: "2024-03-15",
          endDate: "2024-03-15",
          reason: "Doctor appointment",
          type: "sick",
          status: "pending",
          days: 1,
        },
        {
          id: 3,
          startDate: "2024-04-10",
          endDate: "2024-04-12",
          reason: "Wedding ceremony",
          type: "personal",
          status: "approved",
          days: 3,
        },
      ];

      setHolidays(mockHolidays);
      setLeaves(mockLeaves);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Replace with actual API call when backend is ready
      // await api.post('/api/employee/leaves', leaveForm);

      const newLeave = {
        id: Date.now(),
        ...leaveForm,
        status: "pending",
        days: calculateDays(leaveForm.startDate, leaveForm.endDate),
      };

      setLeaves((prev) => [...prev, newLeave]);
      setShowLeaveModal(false);
      setLeaveForm({
        startDate: "",
        endDate: "",
        reason: "",
        type: "sick",
      });
      toast.success("Leave request submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit leave request. Please try again.");
    }
  };

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end dates
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case "sick":
        return "bg-red-100 text-red-800 border-red-200";
      case "annual":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "personal":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getLeaveTypeIcon = (type) => {
    switch (type) {
      case "sick":
        return "Heart";
      case "annual":
        return "Sun";
      case "personal":
        return "User";
      default:
        return "Calendar";
    }
  };

  const getLeaveTypeIconColor = (type) => {
    switch (type) {
      case "sick":
        return "text-red-500";
      case "annual":
        return "text-blue-500";
      case "personal":
        return "text-purple-500";
      default:
        return "text-gray-400";
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isHoliday = (date) => {
    const dateString = date.toISOString().split("T")[0];
    return holidays.some((holiday) => holiday.date === dateString);
  };

  const isLeave = (date) => {
    const dateString = date.toISOString().split("T")[0];
    return leaves.some((leave) => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const current = new Date(dateString);
      return current >= start && current <= end;
    });
  };

  const getLeaveForDate = (date) => {
    const dateString = date.toISOString().split("T")[0];
    return leaves.find((leave) => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const current = new Date(dateString);
      return current >= start && current <= end;
    });
  };

  const getHolidayForDate = (date) => {
    const dateString = date.toISOString().split("T")[0];
    return holidays.find((holiday) => holiday.date === dateString);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-slate-50"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const holiday = getHolidayForDate(date);
      const leave = getLeaveForDate(date);

      let cellClass =
        "h-24 p-2 border border-slate-200 hover:bg-slate-50 cursor-pointer";
      let content = [];

      if (isToday(date)) {
        cellClass += " bg-blue-50 border-blue-300";
      }

      if (holiday) {
        cellClass += " bg-red-50 border-red-300";
        content.push(
          <div
            key="holiday"
            className="text-xs bg-red-100 text-red-800 px-1 py-0.5 rounded mb-1"
          >
            {holiday.name}
          </div>
        );
      }

      if (leave) {
        const typeClass =
          leave.type === "sick"
            ? "bg-red-100 text-red-800"
            : leave.type === "annual"
            ? "bg-blue-100 text-blue-800"
            : "bg-purple-100 text-purple-800";
        content.push(
          <div
            key="leave"
            className={`text-xs ${typeClass} px-1 py-0.5 rounded mb-1`}
          >
            {leave.type} leave
          </div>
        );
      }

      content.push(
        <div key="day" className="text-sm font-medium text-slate-800">
          {day}
        </div>
      );

      days.push(
        <div
          key={day}
          className={cellClass}
          onClick={() => setSelectedDate(date)}
        >
          {content}
        </div>
      );
    }

    return days;
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

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
            <h1 className="text-3xl font-bold text-slate-800">Calendar</h1>
            <p className="text-slate-600 mt-2">
              View holidays and manage your leave requests
            </p>
          </div>
          <Button
            onClick={() => setShowLeaveModal(true)}
            variant="default"
            size="lg"
            iconName="Plus"
            iconPosition="left"
          >
            Apply for Leave
          </Button>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                onClick={prevMonth}
                variant="outline"
                size="sm"
                iconName="ChevronLeft"
              />
              <Button
                onClick={nextMonth}
                variant="outline"
                size="sm"
                iconName="ChevronRight"
              />
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="h-8 flex items-center justify-center text-sm font-semibold text-slate-600 bg-slate-50 rounded"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {renderCalendar()}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-50 border border-blue-300 rounded"></div>
              <span>Today</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-50 border border-red-300 rounded"></div>
              <span>Holiday</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 rounded"></div>
              <span>Sick Leave</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 rounded"></div>
              <span>Annual Leave</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-100 rounded"></div>
              <span>Personal Leave</span>
            </div>
          </div>
        </div>

        {/* Leave Requests */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            My Leave Requests
          </h2>
          <div className="space-y-4">
            {leaves.map((leave) => (
              <div
                key={leave.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-lg ${getLeaveTypeColor(
                      leave.type
                    )}`}
                  >
                    <Icon
                      name={getLeaveTypeIcon(leave.type)}
                      size={20}
                      className={getLeaveTypeIconColor(leave.type)}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {leave.reason}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {new Date(leave.startDate).toLocaleDateString()} -{" "}
                      {new Date(leave.endDate).toLocaleDateString()}(
                      {leave.days} day{leave.days > 1 ? "s" : ""})
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                      leave.status
                    )}`}
                  >
                    {leave.status.toUpperCase()}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLeaveTypeColor(
                      leave.type
                    )}`}
                  >
                    {leave.type.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {leaves.length === 0 && (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Icon name="Calendar" size={24} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                No leave requests
              </h3>
              <p className="text-slate-600">
                You haven't submitted any leave requests yet.
              </p>
            </div>
          )}
        </div>

        {/* Holidays */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Upcoming Holidays
          </h2>
          <div className="space-y-3">
            {holidays
              .filter((holiday) => new Date(holiday.date) >= new Date())
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 5)
              .map((holiday) => (
                <div
                  key={holiday.id}
                  className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Icon
                        name="Calendar"
                        size={16}
                        className="text-red-600"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-800">
                        {holiday.name}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {new Date(holiday.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    Holiday
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Leave Application Modal */}
        {showLeaveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">
                  Apply for Leave
                </h3>
                <button
                  onClick={() => setShowLeaveModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <form onSubmit={handleLeaveSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Leave Type
                  </label>
                  <select
                    value={leaveForm.type}
                    onChange={(e) =>
                      setLeaveForm((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="sick">Sick Leave</option>
                    <option value="annual">Annual Leave</option>
                    <option value="personal">Personal Leave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={leaveForm.startDate}
                    onChange={(e) =>
                      setLeaveForm((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={leaveForm.endDate}
                    onChange={(e) =>
                      setLeaveForm((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Reason
                  </label>
                  <textarea
                    value={leaveForm.reason}
                    onChange={(e) =>
                      setLeaveForm((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                    placeholder="Please provide a reason for your leave request..."
                    required
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowLeaveModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="default">
                    Submit Request
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default EmployeeCalendar;
