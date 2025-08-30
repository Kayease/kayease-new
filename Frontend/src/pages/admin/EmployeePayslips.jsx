import React, { useState, useEffect } from "react";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import AdminLayout from "components/admin/AdminLayout";

const EmployeePayslips = () => {
  const { user } = useAuth();
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchPayslipsData();
  }, []);

  const fetchPayslipsData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call when backend is ready
      // const response = await api.get('/api/employee/payslips');
      // setPayslips(response.data);

      // Mock data for now
      const mockData = [
        {
          id: 1,
          month: "February",
          year: 2024,
          grossSalary: 5000,
          netSalary: 4200,
          deductions: 800,
          allowances: 500,
          status: "paid",
          paidDate: "2024-02-28",
          downloadUrl: "#",
          details: {
            basicSalary: 4000,
            houseRentAllowance: 2000,
            medicalAllowance: 500,
            transportAllowance: 500,
            incomeTax: 400,
            providentFund: 200,
            healthInsurance: 200,
          },
        },
        {
          id: 2,
          month: "January",
          year: 2024,
          grossSalary: 5000,
          netSalary: 4200,
          deductions: 800,
          allowances: 500,
          status: "paid",
          paidDate: "2024-01-31",
          downloadUrl: "#",
          details: {
            basicSalary: 4000,
            houseRentAllowance: 2000,
            medicalAllowance: 500,
            transportAllowance: 500,
            incomeTax: 400,
            providentFund: 200,
            healthInsurance: 200,
          },
        },
        {
          id: 3,
          month: "December",
          year: 2023,
          grossSalary: 5000,
          netSalary: 4200,
          deductions: 800,
          allowances: 500,
          status: "paid",
          paidDate: "2023-12-31",
          downloadUrl: "#",
          details: {
            basicSalary: 4000,
            houseRentAllowance: 2000,
            medicalAllowance: 500,
            transportAllowance: 500,
            incomeTax: 400,
            providentFund: 200,
            healthInsurance: 200,
          },
        },
        {
          id: 4,
          month: "November",
          year: 2023,
          grossSalary: 5000,
          netSalary: 4200,
          deductions: 800,
          allowances: 500,
          status: "paid",
          paidDate: "2023-11-30",
          downloadUrl: "#",
          details: {
            basicSalary: 4000,
            houseRentAllowance: 2000,
            medicalAllowance: 500,
            transportAllowance: 500,
            incomeTax: 400,
            providentFund: 200,
            healthInsurance: 200,
          },
        },
        {
          id: 5,
          month: "October",
          year: 2023,
          grossSalary: 5000,
          netSalary: 4200,
          deductions: 800,
          allowances: 500,
          status: "paid",
          paidDate: "2023-10-31",
          downloadUrl: "#",
          details: {
            basicSalary: 4000,
            houseRentAllowance: 2000,
            medicalAllowance: 500,
            transportAllowance: 500,
            incomeTax: 400,
            providentFund: 200,
            healthInsurance: 200,
          },
        },
      ];

      setPayslips(mockData);
    } catch (error) {
      console.error("Error fetching payslips data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (payslip) => {
    try {
      // TODO: Replace with actual download functionality when backend is ready
      // const response = await api.get(`/api/employee/payslips/${payslip.id}/download`);
      // Create and download PDF

      toast.success(`Downloading ${payslip.month} ${payslip.year} payslip...`);

      // Simulate download delay
      setTimeout(() => {
        toast.success("Payslip downloaded successfully!");
      }, 2000);
    } catch (error) {
      toast.error("Failed to download payslip. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return "CheckCircle";
      case "pending":
        return "Clock";
      case "processing":
        return "Loader";
      default:
        return "Circle";
    }
  };

  const getStatusIconColor = (status) => {
    switch (status) {
      case "paid":
        return "text-green-500";
      case "pending":
        return "text-yellow-500";
      case "processing":
        return "text-blue-500";
      default:
        return "text-gray-400";
    }
  };

  const getMonthNumber = (monthName) => {
    const months = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };
    return months[monthName] || 0;
  };

  const filteredPayslips = payslips.filter((payslip) => {
    const payslipDate = new Date(payslip.year, getMonthNumber(payslip.month));
    return (
      payslipDate.getMonth() === selectedMonth &&
      payslipDate.getFullYear() === selectedYear
    );
  });

  const totalEarningsThisYear = payslips
    .filter((payslip) => payslip.year === selectedYear)
    .reduce((sum, payslip) => sum + payslip.netSalary, 0);

  const averageMonthlySalary =
    payslips.length > 0
      ? Math.round(
          payslips.reduce((sum, payslip) => sum + payslip.netSalary, 0) /
            payslips.length
        )
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
            <h1 className="text-3xl font-bold text-slate-800">Payslips</h1>
            <p className="text-slate-600 mt-2">
              View and download your monthly payslips
            </p>
          </div>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Total Earnings ({selectedYear})
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  ${totalEarningsThisYear.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Icon name="DollarSign" size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Average Monthly Salary
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  ${averageMonthlySalary.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Icon name="TrendingUp" size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Total Payslips
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {payslips.length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Icon name="FileText" size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Payslips List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800">
              Payslip History
            </h2>
          </div>

          <div className="divide-y divide-slate-200">
            {filteredPayslips.map((payslip) => (
              <div
                key={payslip.id}
                className="p-6 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-slate-100 rounded-lg">
                      <Icon
                        name="FileText"
                        size={24}
                        className="text-slate-600"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        {payslip.month} {payslip.year} Payslip
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-slate-600">
                          Paid:{" "}
                          {new Date(payslip.paidDate).toLocaleDateString()}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            payslip.status
                          )}`}
                        >
                          <Icon
                            name={getStatusIcon(payslip.status)}
                            size={12}
                            className={`mr-1 ${getStatusIconColor(
                              payslip.status
                            )}`}
                          />
                          {payslip.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Net Salary</p>
                      <p className="text-lg font-semibold text-slate-800">
                        ${payslip.netSalary.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500">
                        Gross: ${payslip.grossSalary.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleDownload(payslip)}
                      variant="outline"
                      size="sm"
                      iconName="Download"
                      iconPosition="left"
                    >
                      Download
                    </Button>
                  </div>
                </div>

                {/* Salary Breakdown */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Basic Salary</p>
                    <p className="font-medium text-slate-800">
                      ${payslip.details.basicSalary.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Allowances</p>
                    <p className="font-medium text-green-600">
                      +${payslip.allowances.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Deductions</p>
                    <p className="font-medium text-red-600">
                      -${payslip.deductions.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Net Pay</p>
                    <p className="font-semibold text-slate-800">
                      ${payslip.netSalary.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredPayslips.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Icon name="FileText" size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                No payslips found
              </h3>
              <p className="text-slate-600">
                No payslips found for the selected month and year.
              </p>
            </div>
          )}
        </div>

                 {/* Salary Information */}
         <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
           <h2 className="text-xl font-semibold text-slate-800 mb-4">
             Current Salary Structure
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <h3 className="text-lg font-medium text-slate-800 mb-3">
                 Earnings & Allowances
               </h3>
               <div className="space-y-2">
                 <div className="flex justify-between">
                   <span className="text-slate-600">Basic Salary</span>
                   <span className="font-medium">$4,500</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-slate-600">House Rent Allowance (HRA)</span>
                   <span className="font-medium text-green-600">+$2,250</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-slate-600">Medical Allowance</span>
                   <span className="font-medium text-green-600">+$750</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-slate-600">Transport Allowance</span>
                   <span className="font-medium text-green-600">+$500</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-slate-600">Performance Bonus</span>
                   <span className="font-medium text-green-600">+$1,000</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-slate-600">Overtime Pay</span>
                   <span className="font-medium text-green-600">+$300</span>
                 </div>
                 <div className="border-t pt-2">
                   <div className="flex justify-between font-semibold">
                     <span>Total Earnings</span>
                     <span className="text-green-600">$9,300</span>
                   </div>
                 </div>
               </div>
             </div>

             <div>
               <h3 className="text-lg font-medium text-slate-800 mb-3">
                 Deductions & Taxes
               </h3>
               <div className="space-y-2">
                 <div className="flex justify-between">
                   <span className="text-slate-600">Federal Income Tax</span>
                   <span className="font-medium text-red-600">-$1,395</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-slate-600">State Income Tax</span>
                   <span className="font-medium text-red-600">-$465</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-slate-600">Social Security (6.2%)</span>
                   <span className="font-medium text-red-600">-$576.60</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-slate-600">Medicare (1.45%)</span>
                   <span className="font-medium text-red-600">-$134.85</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-slate-600">Health Insurance Premium</span>
                   <span className="font-medium text-red-600">-$250</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-slate-600">401(k) Contribution</span>
                   <span className="font-medium text-red-600">-$450</span>
                 </div>
                 <div className="border-t pt-2">
                   <div className="flex justify-between font-semibold">
                     <span>Total Deductions</span>
                     <span className="text-red-600">-$3,271.45</span>
                   </div>
                 </div>
               </div>
             </div>
           </div>

           {/* Net Pay Summary */}
           <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
             <div className="flex justify-between items-center">
               <div>
                 <h4 className="text-lg font-semibold text-slate-800">Net Take-Home Pay</h4>
                 <p className="text-sm text-slate-600">After all deductions and taxes</p>
               </div>
               <div className="text-right">
                 <p className="text-3xl font-bold text-blue-600">$6,028.55</p>
                 <p className="text-sm text-slate-500">Monthly</p>
               </div>
             </div>
           </div>

           {/* Additional Benefits */}
           <div className="mt-6">
             <h3 className="text-lg font-medium text-slate-800 mb-3">
               Additional Benefits
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                 <div className="flex items-center space-x-2">
                   <Icon name="Heart" size={16} className="text-green-600" />
                   <span className="font-medium text-slate-800">Health Benefits</span>
                 </div>
                 <p className="text-sm text-slate-600 mt-1">Medical, Dental, Vision</p>
               </div>
               <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                 <div className="flex items-center space-x-2">
                   <Icon name="Calendar" size={16} className="text-blue-600" />
                   <span className="font-medium text-slate-800">Paid Time Off</span>
                 </div>
                 <p className="text-sm text-slate-600 mt-1">20 days annually</p>
               </div>
               <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                 <div className="flex items-center space-x-2">
                   <Icon name="TrendingUp" size={16} className="text-purple-600" />
                   <span className="font-medium text-slate-800">Retirement Plan</span>
                 </div>
                 <p className="text-sm text-slate-600 mt-1">401(k) with 6% match</p>
               </div>
             </div>
           </div>

           {/* Salary History */}
           <div className="mt-6">
             <h3 className="text-lg font-medium text-slate-800 mb-3">
               Salary History
             </h3>
             <div className="space-y-2">
               <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                 <div>
                   <span className="font-medium text-slate-800">2024</span>
                   <p className="text-sm text-slate-600">Current Year</p>
                 </div>
                 <div className="text-right">
                   <span className="font-semibold text-slate-800">$6,028.55</span>
                   <p className="text-sm text-green-600">+8.5% increase</p>
                 </div>
               </div>
               <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                 <div>
                   <span className="font-medium text-slate-800">2023</span>
                   <p className="text-sm text-slate-600">Previous Year</p>
                 </div>
                 <div className="text-right">
                   <span className="font-semibold text-slate-800">$5,556.27</span>
                   <p className="text-sm text-green-600">+6.2% increase</p>
                 </div>
               </div>
               <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                 <div>
                   <span className="font-medium text-slate-800">2022</span>
                   <p className="text-sm text-slate-600">Starting Year</p>
                 </div>
                 <div className="text-right">
                   <span className="font-semibold text-slate-800">$5,232.65</span>
                   <p className="text-sm text-slate-500">Initial salary</p>
                 </div>
               </div>
             </div>
           </div>
         </div>
      </div>
    </AdminLayout>
  );
};

export default EmployeePayslips;
