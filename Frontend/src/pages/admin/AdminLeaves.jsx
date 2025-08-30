import React, { useState, useEffect } from "react";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import AdminLayout from "components/admin/AdminLayout";
import { toast } from "react-toastify";

const AdminLeaves = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call when backend is ready
      // const response = await api.get('/api/admin/leaves');
      // setLeaves(response.data);
      
      // Mock data for now
      setLeaves([
        {
          id: 1,
          employeeId: "EMP001",
          employeeName: "John Doe",
          role: "Developer",
          leaveType: "Annual Leave",
          startDate: "2024-02-15",
          endDate: "2024-02-20",
          totalDays: 6,
          reason: "Family vacation to Europe",
          status: "pending",
          appliedDate: "2024-01-15",
          approvedBy: null,
          approvedDate: null,
          remarks: "",
          documents: ["vacation_request.pdf"],
        },
        {
          id: 2,
          employeeId: "EMP002",
          employeeName: "Jane Smith",
          role: "Designer",
          leaveType: "Sick Leave",
          startDate: "2024-02-10",
          endDate: "2024-02-12",
          totalDays: 3,
          reason: "Severe flu and fever",
          status: "approved",
          appliedDate: "2024-02-09",
          approvedBy: "Admin User",
          approvedDate: "2024-02-09",
          remarks: "Approved with medical certificate",
          documents: ["medical_certificate.pdf"],
        },
        {
          id: 3,
          employeeId: "EMP003",
          employeeName: "Mike Johnson",
          role: "Manager",
          leaveType: "Personal Leave",
          startDate: "2024-02-25",
          endDate: "2024-02-26",
          totalDays: 2,
          reason: "Personal family matter",
          status: "rejected",
          appliedDate: "2024-02-20",
          approvedBy: "Admin User",
          approvedDate: "2024-02-21",
          remarks: "Rejected due to project deadline",
          documents: [],
        },
        {
          id: 4,
          employeeId: "EMP004",
          employeeName: "Sarah Wilson",
          role: "QA Engineer",
          leaveType: "Maternity Leave",
          startDate: "2024-03-01",
          endDate: "2024-05-31",
          totalDays: 92,
          reason: "Maternity leave for childbirth",
          status: "approved",
          appliedDate: "2024-01-20",
          approvedBy: "Admin User",
          approvedDate: "2024-01-22",
          remarks: "Approved as per company policy",
          documents: ["maternity_certificate.pdf"],
        },
        {
          id: 5,
          employeeId: "EMP005",
          employeeName: "David Brown",
          role: "HR Manager",
          leaveType: "Annual Leave",
          startDate: "2024-02-28",
          endDate: "2024-03-05",
          totalDays: 6,
          reason: "Spring break with family",
          status: "pending",
          appliedDate: "2024-02-15",
          approvedBy: null,
          approvedDate: null,
          remarks: "",
          documents: [],
        },
      ]);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      toast.error("Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveLeave = async (leaveId, remarks = "") => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // await api.put(`/api/admin/leaves/${leaveId}/approve`, { remarks });
      
      // Mock update
      const updatedLeaves = leaves.map(leave =>
        leave.id === leaveId 
          ? { 
              ...leave, 
              status: "approved", 
              approvedBy: user?.name || "Admin",
              approvedDate: new Date().toISOString().split('T')[0],
              remarks: remarks || leave.remarks
            }
          : leave
      );
      setLeaves(updatedLeaves);
      toast.success("Leave request approved successfully");
    } catch (error) {
      console.error("Error approving leave:", error);
      toast.error("Failed to approve leave request");
    }
  };

  const handleRejectLeave = async (leaveId, remarks = "") => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // await api.put(`/api/admin/leaves/${leaveId}/reject`, { remarks });
      
      // Mock update
      const updatedLeaves = leaves.map(leave =>
        leave.id === leaveId 
          ? { 
              ...leave, 
              status: "rejected", 
              approvedBy: user?.name || "Admin",
              approvedDate: new Date().toISOString().split('T')[0],
              remarks: remarks || leave.remarks
            }
          : leave
      );
      setLeaves(updatedLeaves);
      toast.success("Leave request rejected");
    } catch (error) {
      console.error("Error rejecting leave:", error);
      toast.error("Failed to reject leave request");
    }
  };

  const openViewModal = (leave) => {
    setSelectedLeave(leave);
    setShowViewModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getLeaveTypeColor = (leaveType) => {
    switch (leaveType) {
      case "Annual Leave":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Sick Leave":
        return "bg-red-100 text-red-800 border-red-200";
      case "Personal Leave":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Maternity Leave":
        return "bg-pink-100 text-pink-800 border-pink-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredLeaves = leaves.filter(leave => {
    if (filter === "all") return true;
    if (filter === "employee" && selectedEmployee) {
      return leave.employeeId === selectedEmployee;
    }
    return leave.status === filter;
  });

  const employees = [
    { id: "EMP001", name: "John Doe", role: "Developer" },
    { id: "EMP002", name: "Jane Smith", role: "Designer" },
    { id: "EMP003", name: "Mike Johnson", role: "Manager" },
    { id: "EMP004", name: "Sarah Wilson", role: "QA Engineer" },
    { id: "EMP005", name: "David Brown", role: "HR Manager" },
  ];

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
            <h1 className="text-3xl font-bold text-slate-800">Leave Management</h1>
            <p className="text-slate-600 mt-1">Approve and manage leave requests from employees</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Requests</p>
                <p className="text-3xl font-bold text-slate-800">{leaves.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Icon name="FileText" size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-slate-800">
                  {leaves.filter(leave => leave.status === "pending").length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Icon name="Clock" size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Approved</p>
                <p className="text-3xl font-bold text-slate-800">
                  {leaves.filter(leave => leave.status === "approved").length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Icon name="CheckCircle" size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Rejected</p>
                <p className="text-3xl font-bold text-slate-800">
                  {leaves.filter(leave => leave.status === "rejected").length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Icon name="XCircle" size={24} className="text-red-600" />
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
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="employee">Filter by Employee</option>
          </select>
          
          {filter === "employee" && (
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
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
        </div>

        {/* Leaves Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Applied Date
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
                {filteredLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {leave.employeeName}
                        </div>
                        <div className="text-sm text-slate-500">
                          {leave.role} • {leave.employeeId}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getLeaveTypeColor(
                          leave.leaveType
                        )}`}
                      >
                        {leave.leaveType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-slate-500">
                        {leave.totalDays} days
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {new Date(leave.appliedDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          leave.status
                        )}`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => openViewModal(leave)}
                          variant="outline"
                          size="sm"
                          iconName="Eye"
                        >
                          View
                        </Button>
                        {leave.status === "pending" && (
                          <>
                            <Button
                              onClick={() => handleApproveLeave(leave.id)}
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                              iconName="Check"
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleRejectLeave(leave.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              iconName="X"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Leave Modal */}
        {showViewModal && selectedLeave && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Leave Request Details</h2>
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
                      <p className="font-medium">{selectedLeave.employeeName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Employee ID</p>
                      <p className="font-medium">{selectedLeave.employeeId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Role</p>
                      <p className="font-medium">{selectedLeave.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Applied Date</p>
                      <p className="font-medium">{new Date(selectedLeave.appliedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Leave Details */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Leave Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Leave Type</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getLeaveTypeColor(
                          selectedLeave.leaveType
                        )}`}
                      >
                        {selectedLeave.leaveType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Start Date</span>
                      <span className="font-medium">{new Date(selectedLeave.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">End Date</span>
                      <span className="font-medium">{new Date(selectedLeave.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Days</span>
                      <span className="font-medium">{selectedLeave.totalDays} days</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Reason</span>
                      <p className="font-medium mt-1">{selectedLeave.reason}</p>
                    </div>
                  </div>
                </div>

                {/* Status and Approval */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Status & Approval</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Status</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          selectedLeave.status
                        )}`}
                      >
                        {selectedLeave.status}
                      </span>
                    </div>
                    {selectedLeave.approvedBy && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Approved By</span>
                        <span className="font-medium">{selectedLeave.approvedBy}</span>
                      </div>
                    )}
                    {selectedLeave.approvedDate && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Approved Date</span>
                        <span className="font-medium">{new Date(selectedLeave.approvedDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {selectedLeave.remarks && (
                      <div>
                        <span className="text-slate-600">Remarks</span>
                        <p className="font-medium mt-1">{selectedLeave.remarks}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Documents */}
                {selectedLeave.documents.length > 0 && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Documents</h3>
                    <div className="space-y-2">
                      {selectedLeave.documents.map((doc, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Icon name="FileText" size={16} className="text-slate-500" />
                          <span className="text-sm text-slate-700">{doc}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-primary border-primary hover:bg-primary/5"
                            iconName="Download"
                          >
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
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
                {selectedLeave.status === "pending" && (
                  <>
                    <Button
                      onClick={() => {
                        handleApproveLeave(selectedLeave.id);
                        setShowViewModal(false);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                      iconName="Check"
                      iconPosition="left"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => {
                        handleRejectLeave(selectedLeave.id);
                        setShowViewModal(false);
                      }}
                      className="bg-red-600 hover:bg-red-700"
                      iconName="X"
                      iconPosition="left"
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminLeaves;
