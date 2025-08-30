import React, { useState, useEffect } from "react";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import AdminLayout from "components/admin/AdminLayout";
import { toast } from "react-toastify";

const AdminPunchData = () => {
  const { user } = useAuth();
  const [punchData, setPunchData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedEmployeeFilter, setSelectedEmployeeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchPunchData();
    fetchEmployees();
  }, []);

  const fetchPunchData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call when backend is ready
      // const response = await api.get('/api/admin/punch-data');
      // setPunchData(response.data);
      
      // Mock data for now
      setPunchData([
        {
          id: 1,
          employeeId: "EMP001",
          employeeName: "John Doe",
          role: "Developer",
          date: "2024-02-15",
          punchIn: "09:00",
          punchOut: "17:30",
          totalHours: 8.5,
          status: "present",
          overtime: 0.5,
          late: false,
          earlyLeave: false,
          location: "Office",
          notes: "Regular day",
        },
        {
          id: 2,
          employeeId: "EMP002",
          employeeName: "Jane Smith",
          role: "Designer",
          date: "2024-02-15",
          punchIn: "08:45",
          punchOut: "18:00",
          totalHours: 9.25,
          status: "present",
          overtime: 1.25,
          late: false,
          earlyLeave: false,
          location: "Office",
          notes: "Working on project deadline",
        },
        {
          id: 3,
          employeeId: "EMP003",
          employeeName: "Mike Johnson",
          role: "Manager",
          date: "2024-02-15",
          punchIn: "09:15",
          punchOut: "17:00",
          totalHours: 7.75,
          status: "present",
          overtime: 0,
          late: true,
          earlyLeave: true,
          location: "Office",
          notes: "Late arrival due to traffic",
        },
        {
          id: 4,
          employeeId: "EMP004",
          employeeName: "Sarah Wilson",
          role: "QA Engineer",
          date: "2024-02-15",
          punchIn: "09:00",
          punchOut: null,
          totalHours: 0,
          status: "present",
          overtime: 0,
          late: false,
          earlyLeave: false,
          location: "Office",
          notes: "Still working",
        },
        {
          id: 5,
          employeeId: "EMP005",
          employeeName: "David Brown",
          role: "HR Manager",
          date: "2024-02-15",
          punchIn: null,
          punchOut: null,
          totalHours: 0,
          status: "absent",
          overtime: 0,
          late: false,
          earlyLeave: false,
          location: "Remote",
          notes: "On leave",
        },
        {
          id: 6,
          employeeId: "EMP001",
          employeeName: "John Doe",
          role: "Developer",
          date: "2024-02-14",
          punchIn: "08:55",
          punchOut: "17:30",
          totalHours: 8.58,
          status: "present",
          overtime: 0.58,
          late: false,
          earlyLeave: false,
          location: "Office",
          notes: "Regular day",
        },
        {
          id: 7,
          employeeId: "EMP002",
          employeeName: "Jane Smith",
          role: "Designer",
          date: "2024-02-14",
          punchIn: "09:30",
          punchOut: "18:30",
          totalHours: 9,
          status: "present",
          overtime: 1,
          late: true,
          earlyLeave: false,
          location: "Office",
          notes: "Late arrival",
        },
        {
          id: 8,
          employeeId: "EMP003",
          employeeName: "Mike Johnson",
          role: "Manager",
          date: "2024-02-14",
          punchIn: "09:00",
          punchOut: "17:00",
          totalHours: 8,
          status: "present",
          overtime: 0,
          late: false,
          earlyLeave: false,
          location: "Office",
          notes: "Regular day",
        },
      ]);
    } catch (error) {
      console.error("Error fetching punch data:", error);
      toast.error("Failed to fetch punch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await api.get('/api/admin/employees');
      // setEmployees(response.data);
      
      // Mock data for now
      setEmployees([
        { id: "EMP001", name: "John Doe", role: "Developer" },
        { id: "EMP002", name: "Jane Smith", role: "Designer" },
        { id: "EMP003", name: "Mike Johnson", role: "Manager" },
        { id: "EMP004", name: "Sarah Wilson", role: "QA Engineer" },
        { id: "EMP005", name: "David Brown", role: "HR Manager" },
      ]);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const openViewModal = (employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 border-green-200";
      case "absent":
        return "bg-red-100 text-red-800 border-red-200";
      case "half-day":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTimeStatusColor = (isLate, isEarlyLeave) => {
    if (isLate && isEarlyLeave) return "bg-red-100 text-red-800 border-red-200";
    if (isLate) return "bg-orange-100 text-orange-800 border-orange-200";
    if (isEarlyLeave) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  const getTimeStatusText = (isLate, isEarlyLeave) => {
    if (isLate && isEarlyLeave) return "Late & Early Leave";
    if (isLate) return "Late";
    if (isEarlyLeave) return "Early Leave";
    return "On Time";
  };

  const filteredPunchData = punchData.filter(record => {
    if (filter === "all") return true;
    if (filter === "employee" && selectedEmployeeFilter) {
      return record.employeeId === selectedEmployeeFilter;
    }
    if (filter === "date" && dateFilter) {
      return record.date === dateFilter;
    }
    return record.status === filter;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPunchData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPunchData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate summary statistics
  const totalEmployees = employees.length;
  const presentToday = punchData.filter(record => 
    record.date === new Date().toISOString().split('T')[0] && record.status === "present"
  ).length;
  const absentToday = punchData.filter(record => 
    record.date === new Date().toISOString().split('T')[0] && record.status === "absent"
  ).length;
  const totalOvertime = punchData.reduce((sum, record) => sum + (record.overtime || 0), 0);

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
            <h1 className="text-3xl font-bold text-slate-800">Punch Data</h1>
            <p className="text-slate-600 mt-1">Monitor attendance and working hours for all employees</p>
          </div>
          <Button
            onClick={() => {
              // TODO: Implement export functionality
              toast.info("Export functionality coming soon");
            }}
            className="bg-primary hover:bg-primary/90"
            iconName="Download"
            iconPosition="left"
          >
            Export Data
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Employees</p>
                <p className="text-3xl font-bold text-slate-800">{totalEmployees}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Icon name="Users" size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Present Today</p>
                <p className="text-3xl font-bold text-slate-800">{presentToday}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Icon name="CheckCircle" size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Absent Today</p>
                <p className="text-3xl font-bold text-slate-800">{absentToday}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Icon name="XCircle" size={24} className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Overtime</p>
                <p className="text-3xl font-bold text-slate-800">{totalOvertime.toFixed(1)}h</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Icon name="Clock" size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Records</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="half-day">Half Day</option>
            <option value="employee">Filter by Employee</option>
            <option value="date">Filter by Date</option>
          </select>
          
          {filter === "employee" && (
            <select
              value={selectedEmployeeFilter}
              onChange={(e) => setSelectedEmployeeFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} - {employee.role}
                </option>
              ))}
            </select>
          )}

          {filter === "date" && (
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          )}
        </div>

        {/* Punch Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Punch In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Punch Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Total Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {currentItems.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {record.employeeName}
                        </div>
                        <div className="text-sm text-slate-500">
                          {record.role} • {record.employeeId}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {record.punchIn || "Not punched in"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {record.punchOut || "Not punched out"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {record.totalHours > 0 ? `${record.totalHours}h` : "0h"}
                      </div>
                      {record.overtime > 0 && (
                        <div className="text-xs text-orange-600">
                          +{record.overtime}h OT
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            record.status
                          )}`}
                        >
                          {record.status}
                        </span>
                        {(record.late || record.earlyLeave) && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getTimeStatusColor(
                              record.late, record.earlyLeave
                            )}`}
                          >
                            {getTimeStatusText(record.late, record.earlyLeave)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        onClick={() => openViewModal(record)}
                        variant="outline"
                        size="sm"
                        iconName="Eye"
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-700">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPunchData.length)} of {filteredPunchData.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <Button
                  key={number}
                  onClick={() => paginate(number)}
                  variant={currentPage === number ? "default" : "outline"}
                  size="sm"
                  className={currentPage === number ? "bg-primary text-white" : ""}
                >
                  {number}
                </Button>
              ))}
              <Button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* View Employee Details Modal */}
        {showViewModal && selectedEmployee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Employee Attendance Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Employee Info */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Employee Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Name</p>
                      <p className="font-medium">{selectedEmployee.employeeName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Employee ID</p>
                      <p className="font-medium">{selectedEmployee.employeeId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Role</p>
                      <p className="font-medium">{selectedEmployee.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Date</p>
                      <p className="font-medium">{new Date(selectedEmployee.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Attendance Details */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Attendance Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Punch In Time</p>
                      <p className="font-medium">{selectedEmployee.punchIn || "Not punched in"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Punch Out Time</p>
                      <p className="font-medium">{selectedEmployee.punchOut || "Not punched out"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Total Working Hours</p>
                      <p className="font-medium">{selectedEmployee.totalHours > 0 ? `${selectedEmployee.totalHours}h` : "0h"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Overtime</p>
                      <p className="font-medium">{selectedEmployee.overtime > 0 ? `${selectedEmployee.overtime}h` : "0h"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Location</p>
                      <p className="font-medium">{selectedEmployee.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Status</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          selectedEmployee.status
                        )}`}
                      >
                        {selectedEmployee.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Time Status */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Time Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Arrival Status</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${selectedEmployee.late ? "bg-orange-100 text-orange-800 border-orange-200" : "bg-green-100 text-green-800 border-green-200"}`}
                      >
                        {selectedEmployee.late ? "Late" : "On Time"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Departure Status</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${selectedEmployee.earlyLeave ? "bg-yellow-100 text-yellow-800 border-yellow-200" : "bg-green-100 text-green-800 border-green-200"}`}
                      >
                        {selectedEmployee.earlyLeave ? "Early Leave" : "Regular"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedEmployee.notes && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Notes</h3>
                    <p className="text-slate-700">{selectedEmployee.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6">
                <Button
                  onClick={() => setShowViewModal(false)}
                  variant="outline"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    // TODO: Implement edit functionality
                    toast.info("Edit functionality coming soon");
                  }}
                  className="bg-primary hover:bg-primary/90"
                  iconName="Edit"
                  iconPosition="left"
                >
                  Edit Record
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPunchData;
