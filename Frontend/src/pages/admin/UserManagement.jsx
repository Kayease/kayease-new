import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../contexts/AuthContext";
import { userApi } from "../../utils/userApi";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

const RoleEditor = ({ roles, user, onSave }) => {
  const [selected, setSelected] = React.useState((user.roles || []).map(r => r._id || r));
  const [saving, setSaving] = React.useState(false);

  const toggle = (roleId) => {
    setSelected(prev => prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]);
  };

  const save = async () => {
    try {
      setSaving(true);
      await onSave(selected);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <details className="group">
          <summary className="list-none cursor-pointer px-3 py-1 border rounded-lg text-sm text-slate-700 hover:bg-slate-50">Roles</summary>
          <div className="absolute z-10 mt-2 w-56 bg-white border rounded-lg shadow-lg p-2 max-h-64 overflow-auto">
            {roles.map(r => (
              <label key={r._id} className="flex items-center gap-2 px-2 py-1 hover:bg-slate-50 rounded">
                <input type="checkbox" checked={selected.includes(r._id)} onChange={() => toggle(r._id)} />
                <span className="text-sm">{r.name}</span>
              </label>
            ))}
            <div className="pt-2 flex justify-end">
              <Button size="sm" onClick={save} disabled={saving} className="bg-primary text-white">
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    isActive: true,
  });

  // Load users on component mount
  useEffect(() => {
    loadInitial();
  }, []);

  const loadInitial = async () => {
    await Promise.all([loadUsers(), loadRoles()]);
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const response = await userApi.getAllRoles();
      setRoles(response.data || []);
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        roles: formData.roles || []
      };
      await userApi.createUser(payload);
      toast.success("User created successfully");
      setShowCreateModal(false);
      resetForm();
      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user");
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password || undefined,
        roles: formData.roles || undefined,
        isActive: formData.isActive
      };
      await userApi.updateUser(selectedUser._id, payload);
      toast.success("User updated successfully");
      setShowEditModal(false);
      resetForm();
      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await userApi.updateUser(userId, { isActive: !currentStatus });
      toast.success(
        `User ${currentStatus ? "deactivated" : "activated"} successfully`
      );
      loadUsers();
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  const handleReplaceRoles = async (userId, roleIds) => {
    try {
      await userApi.updateUserRoles(userId, roleIds);
      toast.success("Roles updated");
      loadUsers();
    } catch (error) {
      toast.error("Failed to update roles");
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete?._id) return;
    try {
      setIsDeleting(true);
      await userApi.deleteUser(userToDelete._id);
      toast.success("User deleted successfully");
      setShowDeleteModal(false);
      setUserToDelete(null);
      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      roles: [],
      isActive: true,
    });
    setSelectedUser(null);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      roles: (user.roles || []).map(r => r._id || r),
      isActive: user.isActive,
    });
    setShowEditModal(true);
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || (user.roles || []).some(r => (r.name || r) === roleFilter);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Get user statistics
  const stats = {
    total: users.length,
    admins: users.filter((u) => (u.roles || []).some(r => (r.name || r) === 'ADMIN')).length,
    active: users.filter((u) => u.isActive).length,
    inactive: users.filter((u) => !u.isActive).length,
    newUsers: users.filter((u) => {
      const createdAt = new Date(u.createdAt);
      const now = new Date();
      const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
      return diffDays <= 7; // Users registered in last 7 days
    }).length,
  };

  const isNewUser = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffDays = (now - created) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-slate-800">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="Users" size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Admins</p>
                <p className="text-2xl font-bold text-slate-800">
                  {stats.admins}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active</p>
                <p className="text-2xl font-bold text-slate-800">
                  {stats.active}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Icon
                  name="CheckCircle"
                  size={24}
                  className="text-emerald-600"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Inactive</p>
                <p className="text-2xl font-bold text-slate-800">
                  {stats.inactive}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Icon name="XCircle" size={24} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Icon
                  name="Search"
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="all">All Roles</option>
              {roles.map(r => (
                <option key={r._id} value={r.name}>{r.name}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <Button
              onClick={loadUsers}
              variant="outline"
              iconName="RefreshCw"
              className="px-6"
            >
              Refresh
            </Button>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary hover:bg-primary/90 text-white"
              iconName="UserPlus"
              iconPosition="left"
            >
              Create User
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-slate-600 mt-2">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                      Roles
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                            <Icon
                              name="User"
                              size={20}
                              className="text-white"
                            />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-slate-800">
                                {user.name}
                              </p>
                            </div>
                            <p className="text-sm text-slate-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {(user.roles || []).map((r) => (
                            <span key={r._id || r} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${ (r.name || r) === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800' }`}>
                              <Icon name={(r.name || r) === 'ADMIN' ? 'Shield' : 'User'} size={12} className="mr-1" />
                              {r.name || r}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            user.isActive
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          <Icon
                            name={user.isActive ? "CheckCircle" : "XCircle"}
                            size={12}
                            className="mr-1"
                          />
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600">
                          <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(user.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(user)}
                            className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                            iconName="Edit"
                          >
                            Edit
                          </Button>

                          <RoleEditor roles={roles} user={user} onSave={(roleIds) => handleReplaceRoles(user._id, roleIds)} />

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleToggleUserStatus(user._id, user.isActive)
                            }
                            className={`${
                              user.isActive
                                ? "text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                                : "text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
                            }`}
                            iconName={user.isActive ? "XCircle" : "CheckCircle"}
                          >
                            {user.isActive ? "Deactivate" : "Activate"}
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteModal(user)}
                            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
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

              {filteredUsers.length === 0 && (
                <div className="p-8 text-center">
                  <Icon
                    name="Users"
                    size={48}
                    className="text-slate-300 mx-auto mb-4"
                  />
                  <p className="text-slate-600">
                    No users found matching your criteria
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">
                Create New User
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Icon name="X" size={20} className="text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Roles
                </label>
                <div className="grid grid-cols-2 gap-2 border border-slate-200 rounded-lg p-3 max-h-40 overflow-auto">
                  {roles.map(r => (
                    <label key={r._id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={(formData.roles || []).includes(r._id)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const current = new Set(formData.roles || []);
                          if (checked) current.add(r._id); else current.delete(r._id);
                          setFormData({ ...formData, roles: Array.from(current) });
                        }}
                      />
                      {r.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary/20"
                />
                <label htmlFor="isActive" className="text-sm text-slate-700">
                  Active account
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                >
                  Create User
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">
                Edit User
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Icon name="X" size={20} className="text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleEditUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Roles
                </label>
                <div className="grid grid-cols-2 gap-2 border border-slate-200 rounded-lg p-3 max-h-40 overflow-auto">
                  {roles.map(r => (
                    <label key={r._id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={(formData.roles || []).includes(r._id)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const current = new Set(formData.roles || []);
                          if (checked) current.add(r._id); else current.delete(r._id);
                          setFormData({ ...formData, roles: Array.from(current) });
                        }}
                      />
                      {r.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary/20"
                />
                <label
                  htmlFor="editIsActive"
                  className="text-sm text-slate-700"
                >
                  Active account
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                >
                  Update User
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        itemName={userToDelete?.name}
        itemType="user"
        isLoading={isDeleting}
      />
    </AdminLayout>
  );
};

export default UserManagement;
