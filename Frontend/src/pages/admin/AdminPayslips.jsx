import React, { useState, useEffect } from "react";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import AdminLayout from "components/admin/AdminLayout";
import { toast } from "react-toastify";

const AdminPayslips = () => {
  const { user } = useAuth();
  const [payslips, setPayslips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const [formData, setFormData] = useState({
    employeeId: "",
    month: "",
    year: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
    overtime: "",
    bonus: "",
    remarks: "",
  });

  useEffect(() => {
    fetchPayslips();
    fetchEmployees();
  }, []);

  const fetchPayslips = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call when backend is ready
      // const response = await api.get('/api/admin/payslips');
      // setPayslips(response.data);
      
      // Mock data for now
      setPayslips([
        {
          id: 1,
          employeeId: "EMP001",
          employeeName: "John Doe",
          role: "Developer",
          month: "January",
          year: "2024",
          basicSalary: 5000,
          allowances: 800,
          deductions: 200,
          overtime: 300,
          bonus: 500,
          totalSalary: 6400,
          status: "paid",
          paidDate: "2024-01-31",
          remarks: "Performance bonus included",
        },
        {
          id: 2,
          employeeId: "EMP002",
          employeeName: "Jane Smith",
          role: "Designer",
          month: "January",
          year: "2024",
          basicSalary: 4500,
          allowances: 600,
          deductions: 150,
          overtime: 200,
          bonus: 0,
          totalSalary: 5150,
          status: "pending",
          paidDate: null,
          remarks: "Regular salary",
        },
        {
          id: 3,
          employeeId: "EMP003",
          employeeName: "Mike Johnson",
          role: "Manager",
          month: "January",
          year: "2024",
          basicSalary: 7000,
          allowances: 1000,
          deductions: 300,
          overtime: 500,
          bonus: 1000,
          totalSalary: 9200,
          status: "paid",
          paidDate: "2024-01-31",
          remarks: "Leadership bonus",
        },
      ]);
    } catch (error) {
      console.error("Error fetching payslips:", error);
      toast.error("Failed to fetch payslips");
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
        { id: "EMP001", name: "John Doe", role: "Developer", email: "john@example.com" },
        { id: "EMP002", name: "Jane Smith", role: "Designer", email: "jane@example.com" },
        { id: "EMP003", name: "Mike Johnson", role: "Manager", email: "mike@example.com" },
        { id: "EMP004", name: "Sarah Wilson", role: "QA Engineer", email: "sarah@example.com" },
        { id: "EMP005", name: "David Brown", role: "HR Manager", email: "david@example.com" },
      ]);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleGeneratePayslip = async (e) => {
    e.preventDefault();
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await api.post('/api/admin/payslips', formData);
      // setPayslips([...payslips, response.data]);
      
      // Mock creation
      const selectedEmp = employees.find(emp => emp.id === formData.employeeId);
      const newPayslip = {
        id: Date.now(),
        employeeId: formData.employeeId,
        employeeName: selectedEmp?.name || "Unknown",
        role: selectedEmp?.role || "Unknown",
        month: formData.month,
        year: formData.year,
        basicSalary: parseFloat(formData.basicSalary),
        allowances: parseFloat(formData.allowances),
        deductions: parseFloat(formData.deductions),
        overtime: parseFloat(formData.overtime),
        bonus: parseFloat(formData.bonus),
        totalSalary: parseFloat(formData.basicSalary) + parseFloat(formData.allowances) + parseFloat(formData.overtime) + parseFloat(formData.bonus) - parseFloat(formData.deductions),
        status: "pending",
        paidDate: null,
        remarks: formData.remarks,
      };
      setPayslips([...payslips, newPayslip]);
      
      setShowGenerateModal(false);
      setFormData({
        employeeId: "",
        month: "",
        year: "",
        basicSalary: "",
        allowances: "",
        deductions: "",
        overtime: "",
        bonus: "",
        remarks: "",
      });
      toast.success("Payslip generated successfully");
    } catch (error) {
      console.error("Error generating payslip:", error);
      toast.error("Failed to generate payslip");
    }
  };

  const handleMarkAsPaid = async (payslipId) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // await api.put(`/api/admin/payslips/${payslipId}/mark-paid`);
      
      // Mock update
      const updatedPayslips = payslips.map(payslip =>
        payslip.id === payslipId 
          ? { ...payslip, status: "paid", paidDate: new Date().toISOString().split('T')[0] }
          : payslip
      );
      setPayslips(updatedPayslips);
      toast.success("Payslip marked as paid");
    } catch (error) {
      console.error("Error marking payslip as paid:", error);
      toast.error("Failed to mark payslip as paid");
    }
  };

  const handleDeletePayslip = async (payslipId) => {
    if (window.confirm("Are you sure you want to delete this payslip?")) {
      try {
        // TODO: Replace with actual API call when backend is ready
        // await api.delete(`/api/admin/payslips/${payslipId}`);
        
        // Mock deletion
        setPayslips(payslips.filter(payslip => payslip.id !== payslipId));
        toast.success("Payslip deleted successfully");
      } catch (error) {
        console.error("Error deleting payslip:", error);
        toast.error("Failed to delete payslip");
      }
    }
  };

  const openViewModal = (payslip) => {
    setSelectedPayslip(payslip);
    setShowViewModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredPayslips = payslips.filter(payslip => {
    if (filter === "all") return true;
    if (filter === "employee" && selectedEmployee) {
      return payslip.employeeId === selectedEmployee;
    }
    return payslip.status === filter;
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

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
            <h1 className="text-3xl font-bold text-slate-800">Payslips</h1>
            <p className="text-slate-600 mt-1">Generate and manage payslips for all employees</p>
          </div>
          <Button
            onClick={() => setShowGenerateModal(true)}
            className="bg-primary hover:bg-primary/90"
            iconName="Plus"
            iconPosition="left"
          >
            Generate Payslip
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Payslips</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
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

        {/* Payslips Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Basic Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Total Salary
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
                {filteredPayslips.map((payslip) => (
                  <tr key={payslip.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {payslip.employeeName}
                        </div>
                        <div className="text-sm text-slate-500">
                          {payslip.role} • {payslip.employeeId}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {payslip.month} {payslip.year}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        ${payslip.basicSalary.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        ${payslip.totalSalary.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          payslip.status
                        )}`}
                      >
                        {payslip.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => openViewModal(payslip)}
                          variant="outline"
                          size="sm"
                          iconName="Eye"
                        >
                          View
                        </Button>
                        {payslip.status === "pending" && (
                          <Button
                            onClick={() => handleMarkAsPaid(payslip.id)}
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            iconName="Check"
                          >
                            Mark Paid
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDeletePayslip(payslip.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          iconName="Trash2"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Generate Payslip Modal */}
        {showGenerateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Generate New Payslip</h2>
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <form onSubmit={handleGeneratePayslip} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Employee
                    </label>
                    <select
                      required
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Employee</option>
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} - {employee.role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Month
                    </label>
                    <select
                      required
                      value={formData.month}
                      onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Month</option>
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Year
                    </label>
                    <select
                      required
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Basic Salary
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.basicSalary}
                      onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Allowances
                    </label>
                    <input
                      type="number"
                      value={formData.allowances}
                      onChange={(e) => setFormData({ ...formData, allowances: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Deductions
                    </label>
                    <input
                      type="number"
                      value={formData.deductions}
                      onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Overtime
                    </label>
                    <input
                      type="number"
                      value={formData.overtime}
                      onChange={(e) => setFormData({ ...formData, overtime: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Bonus
                    </label>
                    <input
                      type="number"
                      value={formData.bonus}
                      onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Remarks
                    </label>
                    <input
                      type="text"
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowGenerateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Generate Payslip
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Payslip Modal */}
        {showViewModal && selectedPayslip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Payslip Details</h2>
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
                      <p className="font-medium">{selectedPayslip.employeeName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Employee ID</p>
                      <p className="font-medium">{selectedPayslip.employeeId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Role</p>
                      <p className="font-medium">{selectedPayslip.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Period</p>
                      <p className="font-medium">{selectedPayslip.month} {selectedPayslip.year}</p>
                    </div>
                  </div>
                </div>

                {/* Salary Breakdown */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Salary Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Basic Salary</span>
                      <span className="font-medium">${selectedPayslip.basicSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Allowances</span>
                      <span className="font-medium">${selectedPayslip.allowances.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Overtime</span>
                      <span className="font-medium">${selectedPayslip.overtime.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Bonus</span>
                      <span className="font-medium">${selectedPayslip.bonus.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-slate-600">Gross Salary</span>
                      <span className="font-medium">
                        ${(selectedPayslip.basicSalary + selectedPayslip.allowances + selectedPayslip.overtime + selectedPayslip.bonus).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Deductions</span>
                      <span>-${selectedPayslip.deductions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 text-lg font-bold">
                      <span>Net Salary</span>
                      <span>${selectedPayslip.totalSalary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Status and Remarks */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Status & Remarks</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Status</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          selectedPayslip.status
                        )}`}
                      >
                        {selectedPayslip.status}
                      </span>
                    </div>
                    {selectedPayslip.paidDate && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Paid Date</span>
                        <span className="font-medium">{selectedPayslip.paidDate}</span>
                      </div>
                    )}
                    {selectedPayslip.remarks && (
                      <div>
                        <span className="text-slate-600">Remarks</span>
                        <p className="font-medium mt-1">{selectedPayslip.remarks}</p>
                      </div>
                    )}
                  </div>
                </div>
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
                    // TODO: Implement PDF download
                    toast.info("PDF download feature coming soon");
                  }}
                  className="bg-primary hover:bg-primary/90"
                  iconName="Download"
                  iconPosition="left"
                >
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPayslips;
