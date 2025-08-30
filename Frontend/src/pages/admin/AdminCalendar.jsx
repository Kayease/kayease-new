import React, { useState, useEffect } from "react";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import AdminLayout from "components/admin/AdminLayout";
import { toast } from "react-toastify";

const AdminCalendar = () => {
  const { user } = useAuth();
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [filter, setFilter] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    type: "holiday",
    description: "",
    isRecurring: false,
    recurringYear: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call when backend is ready
      // const response = await api.get('/api/admin/holidays');
      // setHolidays(response.data);
      
      // Mock data for now
      setHolidays([
        {
          id: 1,
          title: "New Year's Day",
          date: "2024-01-01",
          type: "holiday",
          description: "Public holiday for New Year celebration",
          isRecurring: true,
          recurringYear: 2024,
        },
        {
          id: 2,
          title: "Republic Day",
          date: "2024-01-26",
          type: "holiday",
          description: "National holiday celebrating Republic Day",
          isRecurring: true,
          recurringYear: 2024,
        },
        {
          id: 3,
          title: "Holi",
          date: "2024-03-25",
          type: "holiday",
          description: "Festival of colors",
          isRecurring: true,
          recurringYear: 2024,
        },
        {
          id: 4,
          title: "Independence Day",
          date: "2024-08-15",
          type: "holiday",
          description: "National Independence Day",
          isRecurring: true,
          recurringYear: 2024,
        },
        {
          id: 5,
          title: "Diwali",
          date: "2024-11-01",
          type: "holiday",
          description: "Festival of lights",
          isRecurring: true,
          recurringYear: 2024,
        },
        {
          id: 6,
          title: "Christmas",
          date: "2024-12-25",
          type: "holiday",
          description: "Christmas celebration",
          isRecurring: true,
          recurringYear: 2024,
        },
        {
          id: 7,
          title: "Company Annual Meeting",
          date: "2024-02-15",
          type: "event",
          description: "Annual company meeting and team building",
          isRecurring: false,
          recurringYear: 2024,
        },
        {
          id: 8,
          title: "Team Offsite",
          date: "2024-03-10",
          type: "event",
          description: "Team building and planning session",
          isRecurring: false,
          recurringYear: 2024,
        },
      ]);
    } catch (error) {
      console.error("Error fetching holidays:", error);
      toast.error("Failed to fetch holidays");
    } finally {
      setLoading(false);
    }
  };

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await api.post('/api/admin/holidays', formData);
      // setHolidays([...holidays, response.data]);
      
      // Mock creation
      const newHoliday = {
        id: Date.now(),
        ...formData,
      };
      setHolidays([...holidays, newHoliday]);
      
      setShowAddModal(false);
      setFormData({
        title: "",
        date: "",
        type: "holiday",
        description: "",
        isRecurring: false,
        recurringYear: new Date().getFullYear(),
      });
      toast.success("Holiday added successfully");
    } catch (error) {
      console.error("Error adding holiday:", error);
      toast.error("Failed to add holiday");
    }
  };

  const handleEditHoliday = async (e) => {
    e.preventDefault();
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await api.put(`/api/admin/holidays/${selectedHoliday.id}`, formData);
      
      // Mock update
      const updatedHolidays = holidays.map(holiday =>
        holiday.id === selectedHoliday.id ? { ...holiday, ...formData } : holiday
      );
      setHolidays(updatedHolidays);
      
      setShowEditModal(false);
      setSelectedHoliday(null);
      setFormData({
        title: "",
        date: "",
        type: "holiday",
        description: "",
        isRecurring: false,
        recurringYear: new Date().getFullYear(),
      });
      toast.success("Holiday updated successfully");
    } catch (error) {
      console.error("Error updating holiday:", error);
      toast.error("Failed to update holiday");
    }
  };

  const handleDeleteHoliday = async (holidayId) => {
    if (window.confirm("Are you sure you want to delete this holiday?")) {
      try {
        // TODO: Replace with actual API call when backend is ready
        // await api.delete(`/api/admin/holidays/${holidayId}`);
        
        // Mock deletion
        setHolidays(holidays.filter(holiday => holiday.id !== holidayId));
        toast.success("Holiday deleted successfully");
      } catch (error) {
        console.error("Error deleting holiday:", error);
        toast.error("Failed to delete holiday");
      }
    }
  };

  const openEditModal = (holiday) => {
    setSelectedHoliday(holiday);
    setFormData({
      title: holiday.title,
      date: holiday.date,
      type: holiday.type,
      description: holiday.description,
      isRecurring: holiday.isRecurring,
      recurringYear: holiday.recurringYear,
    });
    setShowEditModal(true);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setFormData({
      ...formData,
      date: date,
    });
    setShowAddModal(true);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "holiday":
        return "bg-red-100 text-red-800 border-red-200";
      case "event":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "meeting":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredHolidays = holidays.filter(holiday => {
    if (filter === "all") return true;
    return holiday.type === filter;
  });

  // Calendar generation
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const isHoliday = (date) => {
    const dateStr = formatDate(date);
    return holidays.find(holiday => holiday.date === dateStr);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-slate-50"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const holiday = isHoliday(date);
      const today = isToday(date);
      const selected = isSelected(date);

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(date)}
          className={`h-24 p-2 border border-slate-200 cursor-pointer transition-all duration-200 hover:bg-slate-50 ${
            today ? "bg-blue-50 border-blue-300" : ""
          } ${selected ? "bg-primary/10 border-primary" : ""} ${
            holiday ? "bg-red-50 border-red-300" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${
              today ? "text-blue-600" : selected ? "text-primary" : "text-slate-700"
            }`}>
              {day}
            </span>
            {holiday && (
              <Icon name="Star" size={12} className="text-red-500" />
            )}
          </div>
          {holiday && (
            <div className="mt-1">
              <div className="text-xs font-medium text-red-700 truncate">
                {holiday.title}
              </div>
              <span className={`px-1 py-0.5 rounded text-xs font-medium border ${getTypeColor(holiday.type)}`}>
                {holiday.type}
              </span>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Calendar</h1>
            <p className="text-slate-600 mt-1">Manage holidays and events for the organization</p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-primary/90"
            iconName="Plus"
            iconPosition="left"
          >
            Add Holiday/Event
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Events</p>
                <p className="text-3xl font-bold text-slate-800">{holidays.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Icon name="Calendar" size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Holidays</p>
                <p className="text-3xl font-bold text-slate-800">
                  {holidays.filter(h => h.type === "holiday").length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Icon name="Star" size={24} className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Events</p>
                <p className="text-3xl font-bold text-slate-800">
                  {holidays.filter(h => h.type === "event").length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Icon name="Calendar" size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Recurring</p>
                <p className="text-3xl font-bold text-slate-800">
                  {holidays.filter(h => h.isRecurring).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Icon name="RefreshCw" size={24} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <Button
                  onClick={() => navigateMonth(-1)}
                  variant="outline"
                  size="sm"
                  iconName="ChevronLeft"
                />
                <h2 className="text-xl font-bold text-slate-800">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <Button
                  onClick={() => navigateMonth(1)}
                  variant="outline"
                  size="sm"
                  iconName="ChevronRight"
                />
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-slate-500">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {renderCalendar()}
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Filters</h3>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Events</option>
                <option value="holiday">Holidays</option>
                <option value="event">Events</option>
                <option value="meeting">Meetings</option>
              </select>
            </div>

            {/* Events List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Upcoming Events</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredHolidays
                  .filter(holiday => new Date(holiday.date) >= new Date())
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(0, 10)
                  .map((holiday) => (
                    <div
                      key={holiday.id}
                      className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-800 text-sm">{holiday.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(holiday.date).toLocaleDateString()}
                          </p>
                          <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium border ${getTypeColor(holiday.type)}`}>
                            {holiday.type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            onClick={() => openEditModal(holiday)}
                            variant="outline"
                            size="sm"
                            iconName="Edit"
                          />
                          <Button
                            onClick={() => handleDeleteHoliday(holiday.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            iconName="Trash2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Add Holiday Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Add Holiday/Event</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <form onSubmit={handleAddHoliday} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="holiday">Holiday</option>
                    <option value="event">Event</option>
                    <option value="meeting">Meeting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="isRecurring" className="text-sm text-slate-700">
                    Recurring annually
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Add Event
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Holiday Modal */}
        {showEditModal && selectedHoliday && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Edit Holiday/Event</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <form onSubmit={handleEditHoliday} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="holiday">Holiday</option>
                    <option value="event">Event</option>
                    <option value="meeting">Meeting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="editIsRecurring"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="editIsRecurring" className="text-sm text-slate-700">
                    Recurring annually
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Update Event
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

export default AdminCalendar;
