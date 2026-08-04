"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Building2, Image, ListChecks, PackageOpen, Wallet, MessageSquareText, Globe2, Plus, Trash2, Send, Check, X, Copy, Eye, EyeOff, Calendar, Sparkles, Upload } from "lucide-react";
import DashboardShell, { StatCard, StatusBadge, PageHead } from "@/components/dashboard/DashboardShell";
import api from "@/lib/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ConfirmModal from "@/components/ui/confirm-modal";
import PaymentCalendar from "@/components/ui/payment-calendar";

const NAV = [
  { key: "home", to: "/admin", end: true, label: "Home", icon: Home },
  { key: "users", to: "/admin/users", label: "Users", icon: Users },
  { key: "projects", to: "/admin/projects", label: "Projects", icon: Building2 },
  { key: "drawings", to: "/admin/drawings", label: "Drawings", icon: Image },
  { key: "stages", to: "/admin/stages", label: "Stages", icon: ListChecks },
  { key: "materials", to: "/admin/materials", label: "Material", icon: PackageOpen },
  { key: "payments", to: "/admin/payments", label: "Payment", icon: Wallet },
  { key: "queries", to: "/admin/queries", label: "Queries", icon: MessageSquareText },
  { key: "showcase", to: "/admin/cms-projects", label: "Showcase Projects", icon: Sparkles },
  { key: "cms", to: "/admin/cms", label: "Website", icon: Globe2 },
];

export default function AdminDashboard() {
  const pathname = usePathname();
  let content = <AdminHome />;
  if (pathname.includes("/admin/users")) content = <UsersPage />;
  else if (pathname.includes("/admin/projects")) content = <ProjectsPage />;
  else if (pathname.includes("/admin/drawings")) content = <DrawingsPage />;
  else if (pathname.includes("/admin/stages")) content = <StagesPage />;
  else if (pathname.includes("/admin/materials")) content = <MaterialsPage />;
  else if (pathname.includes("/admin/payments")) content = <PaymentsPage />;
  else if (pathname.includes("/admin/queries")) content = <QueriesPage />;
  else if (pathname.includes("/admin/cms-projects")) content = <ShowcaseProjectsPage />;
  else if (pathname.includes("/admin/cms")) content = <CMSPage />;

  return (
    <DashboardShell nav={NAV} title="Admin Console">
      {content}
    </DashboardShell>
  );
}

const fmt = (n) => "₹ " + (Number(n) || 0).toLocaleString("en-IN");

function AdminHome() {
  const [s, setS] = useState(null);
  useEffect(() => { api.get("/admin/stats").then(({ data }) => setS(data)); }, []);
  return (
    <>
      <PageHead subtitle="Dashboard" title="Overview" />
      <div className="p-6 md:p-10 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Projects" value={s?.total_projects ?? "—"} sub={`${s?.ongoing ?? 0} ongoing`} data-testid="stat-total-proj" />
          <StatCard label="Completed" value={s?.completed ?? "—"} sub="Delivered legacies" />
          <StatCard label="Pending Approvals" value={s?.pending_users ?? "—"} sub="Users awaiting action" tone="accent" />
          <StatCard label="Open Queries" value={s?.open_queries ?? "—"} sub="Client & contractor threads" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Received" value={fmt(s?.received)} sub="From clients" tone="dark" />
          <StatCard label="Pending from Clients" value={fmt(s?.pending_from_clients)} />
          <StatCard label="Paid to Contractors" value={fmt(s?.paid_contractors)} />
          <StatCard label="Remaining to Pay" value={fmt(s?.remaining_contractors)} />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <StatCard label="Approved Clients" value={s?.total_clients ?? "—"} />
          <StatCard label="Approved Professionals" value={s?.total_contractors ?? "—"} />
          <StatCard label="Pending Material Requests" value={s?.pending_materials ?? "—"} />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/admin/users" className="p-5 bg-white border border-stone-alt hover:border-terracotta"><div className="label-caps">Quick action</div><div className="font-heading text-xl mt-2 tracking-tight">Review Applications</div></Link>
          <Link href="/admin/projects" className="p-5 bg-white border border-stone-alt hover:border-terracotta"><div className="label-caps">Quick action</div><div className="font-heading text-xl mt-2 tracking-tight">Create Project</div></Link>
          <Link href="/admin/cms" className="p-5 bg-white border border-stone-alt hover:border-terracotta"><div className="label-caps">Quick action</div><div className="font-heading text-xl mt-2 tracking-tight">Add Signature Project</div></Link>
        </div>
      </div>
    </>
  );
}

function UsersPage() {
  const [role, setRole] = useState("contractor");
  const [status, setStatus] = useState("all");
  const [rows, setRows] = useState([]);
  const [issued, setIssued] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [contractorTypes, setContractorTypes] = useState([]);
  const [newTypeName, setNewTypeName] = useState("");

  const toggleShowPassword = (id) => {
    setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const loadContractorTypes = useCallback(() => {
    api.get("/contractor-types").then(({ data }) => setContractorTypes(data));
  }, []);

  useEffect(() => {
    loadContractorTypes();
  }, [loadContractorTypes]);

  const load = useCallback(async () => {
    const params = { role };
    if (status !== "all") params.status = status;
    const { data } = await api.get("/admin/users", { params });
    setRows(data);
  }, [role, status]);
  useEffect(() => { load(); }, [load]);

  const addContractorType = async () => {
    if (!newTypeName.trim()) return toast.error("Enter a type name");
    try {
      await api.post("/admin/contractor-types", { name: newTypeName.trim() });
      toast.success("Contractor type added");
      setNewTypeName("");
      loadContractorTypes();
    } catch (e) {
      toast.error("Failed to add contractor type");
    }
  };

  const deleteContractorType = async (id) => {
    try {
      await api.delete(`/admin/contractor-types/${id}`);
      toast.success("Contractor type removed");
      loadContractorTypes();
    } catch (e) {
      toast.error("Failed to remove contractor type");
    }
  };

  const clearAllContractorTypes = async () => {
    try {
      await api.delete("/admin/contractor-types-clear");
      toast.success("All contractor types cleared");
      loadContractorTypes();
    } catch (e) {
      toast.error("Failed to clear contractor types");
    }
  };

  const updateContractorCategory = async (userId, category) => {
    try {
      await api.put(`/admin/users/${userId}`, { category });
      toast.success("Contractor type updated");
      load();
    } catch (e) {
      toast.error("Failed to update contractor type");
    }
  };

  const act = async (id, action) => {
    try {
      const { data } = await api.post(`/admin/users/${id}/action`, { status: action });
      if (action === "Approved") setIssued({ email: rows.find(r => r.id === id)?.email, ...data });
      toast.success(`${action}`);
      load();
    } catch (e) { toast.error("Action failed"); }
  };

  const [confirmConfig, setConfirmConfig] = useState(null);

  const deleteUser = (id) => {
    const targetUser = rows.find((r) => r.id === id);
    setConfirmConfig({
      title: "Delete User Account",
      description: `Are you sure you want to delete ${targetUser?.full_name || "this user"}? Their profile and account data will be permanently removed.`,
      onConfirm: async () => {
        try {
          await api.delete(`/admin/users/${id}`);
          toast.success("User deleted");
          load();
        } catch (e) {
          toast.error("Failed to delete user");
        }
      },
    });
  };

  const startEdit = (u) => {
    setEditingUser(u);
    setEditForm({
      full_name: u.full_name || "",
      email: u.email || "",
      phone: u.phone || "",
      address: u.address || "",
      city: u.city || "",
      user_code: u.user_code || "",
      temp_password: u.temp_password || "",
      business_name: u.business_name || "",
      category: u.category || "",
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/users/${editingUser.id}`, editForm);
      toast.success("User details updated successfully");
      setEditingUser(null);
      load();
    } catch (err) {
      toast.error("Failed to update user details");
    }
  };

  return (
    <>
      <PageHead subtitle="Users" title="Applications & Members" />
      <div className="p-6 md:p-10 space-y-6">
        <Tabs value={role} onValueChange={setRole}>
          <TabsList>
            <TabsTrigger value="contractor" data-testid="tab-contractors">Contractors</TabsTrigger>
            <TabsTrigger value="client" data-testid="tab-clients">Clients</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Top Contractor Types Management Section */}
        {role === "contractor" && (
          <div className="bg-white border border-stone-alt p-5 space-y-3 rounded-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-alt pb-3">
              <div>
                <div className="text-xs uppercase tracking-wider font-semibold text-terracotta">Management</div>
                <div className="font-heading text-lg font-semibold text-charcoal">Contractor Types / Categories</div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  className="w-48 h-9 text-xs"
                  placeholder="e.g. Painter, Interior..."
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addContractorType()}
                />
                <button onClick={addContractorType} className="btn-terra h-9 px-3 text-xs justify-center whitespace-nowrap">
                  <Plus size={14} /> Add Type
                </button>
                {contractorTypes.length > 0 && (
                  <button onClick={clearAllContractorTypes} className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium rounded-sm h-9 whitespace-nowrap">
                    Clear All
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {contractorTypes.map((ct) => (
                <span key={ct.id} className="inline-flex items-center gap-1.5 bg-[#F9F8F6] border border-stone-alt px-3 py-1 text-xs font-medium text-charcoal rounded-sm">
                  {ct.name}
                  <button
                    onClick={() => deleteContractorType(ct.id)}
                    className="text-neutral-400 hover:text-red-600 transition-colors"
                    title="Remove contractor type"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              {contractorTypes.length === 0 && (
                <span className="text-xs text-neutral-400 italic">No contractor types added yet.</span>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 items-center">
          <div className="label-caps">Filter:</div>
          {["all", "pending", "approved", "rejected"].map((s) => (
            <button key={s} onClick={() => setStatus(s)} data-testid={`filter-${s}`}
              className={`text-xs uppercase tracking-widest px-3 py-1.5 border ${status === s ? "bg-[#2B3A41] text-white border-[#2B3A41]" : "border-stone-alt bg-white"}`}>
              {s}
            </button>
          ))}
        </div>

        <div className="bg-white border border-stone-alt overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-alt text-xs uppercase tracking-widest">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3">Address</th>
                <th className="text-left p-3">User ID</th>
                <th className="text-left p-3">Password</th>
                {role === "contractor" && <th className="text-left p-3">Contractor Type</th>}
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => {
                const passVal = u.temp_password || u.password || "—";
                const isVisible = !!showPassword[u.id];
                return (
                  <tr key={u.id} className="border-t border-stone-alt hover:bg-stone-50/50 transition-colors">
                    <td className="p-3 font-medium">{u.full_name}{u.business_name ? <div className="text-xs text-neutral-500">{u.business_name}</div> : null}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.phone || "—"}</td>
                    <td className="p-3">{u.address || u.city || "—"}</td>
                    <td className="p-3 marker-num">{u.user_code || "—"}</td>
                    <td className="p-3">
                      <div className="inline-flex items-center gap-1.5 marker-num">
                        <span>{isVisible ? passVal : "••••••"}</span>
                        <button
                          type="button"
                          onClick={() => toggleShowPassword(u.id)}
                          className="text-neutral-500 hover:text-charcoal transition-colors p-1"
                          title={isVisible ? "Hide password" : "Show password"}
                        >
                          {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </td>
                    {role === "contractor" && (
                      <td className="p-3">
                        <Select
                          value={u.category || ""}
                          onValueChange={(val) => updateContractorCategory(u.id, val)}
                        >
                          <SelectTrigger className="w-40 h-8 text-xs bg-white border border-stone-alt">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {contractorTypes.map((ct) => (
                              <SelectItem key={ct.id} value={ct.name} className="text-xs">
                                {ct.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    )}
                    <td className="p-3"><StatusBadge status={u.status} /></td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {u.status === "pending" && (
                          <>
                            <button onClick={() => act(u.id, "Approved")} data-testid={`approve-${u.id}`} className="text-xs bg-emerald-700 text-white px-2.5 py-1.5 rounded-sm font-medium hover:bg-emerald-800 transition-colors"><Check size={12} className="inline mr-1" /> Approve</button>
                            <button onClick={() => act(u.id, "Rejected")} data-testid={`reject-${u.id}`} className="text-xs border border-red-200 text-red-700 px-2.5 py-1.5 rounded-sm hover:bg-red-50 transition-colors"><X size={12} className="inline mr-1" /> Reject</button>
                          </>
                        )}
                        <button onClick={() => setViewingUser(u)} className="text-xs bg-[#2B3A41] text-white px-2.5 py-1.5 rounded-sm font-medium hover:bg-black transition-colors">
                          View
                        </button>
                        <button onClick={() => startEdit(u)} className="text-xs bg-[#2B3A41] text-white px-2.5 py-1.5 rounded-sm font-medium hover:bg-black transition-colors">
                          Edit
                        </button>
                        <button onClick={() => deleteUser(u.id)} className="text-xs bg-red-600 text-white px-2.5 py-1.5 rounded-sm font-medium hover:bg-red-700 transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && <tr><td colSpan={9} className="p-8 text-center text-neutral-500">No users found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(o) => !o && setEditingUser(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit {role === "contractor" ? "Professional" : "Client"} Details</DialogTitle></DialogHeader>
          <form onSubmit={saveEdit} className="space-y-4 text-sm mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-caps mb-1 block">Full Name</label>
                <Input value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} required />
              </div>
              <div>
                <label className="label-caps mb-1 block">Email</label>
                <Input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-caps mb-1 block">Phone</label>
                <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
              </div>
              <div>
                <label className="label-caps mb-1 block">User ID / Code</label>
                <Input value={editForm.user_code} onChange={(e) => setEditForm({ ...editForm, user_code: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-caps mb-1 block">Address</label>
                <Input value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
              </div>
              <div>
                <label className="label-caps mb-1 block">City</label>
                <Input value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label-caps mb-1 block">Generated Password</label>
              <Input value={editForm.temp_password} onChange={(e) => setEditForm({ ...editForm, temp_password: e.target.value })} placeholder="Enter new password to reset" />
            </div>
            {role === "contractor" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-caps mb-1 block">Business Name</label>
                  <Input value={editForm.business_name} onChange={(e) => setEditForm({ ...editForm, business_name: e.target.value })} />
                </div>
                <div>
                  <label className="label-caps mb-1 block">Contractor Type / Category</label>
                  <Select
                    value={editForm.category || ""}
                    onValueChange={(val) => setEditForm({ ...editForm, category: val })}
                  >
                    <SelectTrigger className="w-full text-xs bg-white border border-stone-alt">
                      <SelectValue placeholder="Select contractor type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contractorTypes.map((ct) => (
                        <SelectItem key={ct.id} value={ct.name} className="text-xs">
                          {ct.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-4 border-t border-stone-alt">
              <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 border border-stone-alt text-neutral-700 hover:bg-stone-100 rounded-sm">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-terracotta text-white rounded-sm hover:bg-terracotta-dark font-medium">Save Changes</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={!!viewingUser} onOpenChange={(o) => !o && setViewingUser(null)}>
        <DialogContent className="max-w-md bg-white border border-stone-alt shadow-2xl p-6">
          <DialogHeader><DialogTitle className="font-heading text-xl">User Profile</DialogTitle></DialogHeader>
          {viewingUser && (
            <div className="space-y-4 text-sm mt-2">
              <div className="border-b border-stone-alt pb-3">
                <div className="font-heading text-2xl font-medium text-charcoal">{viewingUser.full_name}</div>
                <div className="text-xs text-neutral-500 marker-num mt-1">{viewingUser.user_code || "No ID Assigned"}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#F4F3EF] p-2.5 border border-stone-alt rounded-sm">
                  <div className="label-caps mb-1">Role</div>
                  <div className="capitalize font-medium text-sm text-charcoal">{viewingUser.role}</div>
                </div>
                <div className="bg-[#F4F3EF] p-2.5 border border-stone-alt rounded-sm">
                  <div className="label-caps mb-1">Status</div>
                  <StatusBadge status={viewingUser.status} />
                </div>
                <div className="col-span-2 bg-[#F4F3EF] p-2.5 border border-stone-alt rounded-sm">
                  <div className="label-caps mb-1">Email</div>
                  <div className="marker-num text-sm text-charcoal">{viewingUser.email}</div>
                </div>
                <div className="bg-[#F4F3EF] p-2.5 border border-stone-alt rounded-sm">
                  <div className="label-caps mb-1">Phone</div>
                  <div className="text-sm text-charcoal">{viewingUser.phone || "—"}</div>
                </div>
                <div className="bg-[#F4F3EF] p-2.5 border border-stone-alt rounded-sm">
                  <div className="label-caps mb-1">City / Address</div>
                  <div className="text-sm text-charcoal">{viewingUser.address || viewingUser.city || "—"}</div>
                </div>
                <div className="col-span-2 bg-[#F4F3EF] p-2.5 border border-stone-alt rounded-sm flex items-center justify-between">
                  <div>
                    <div className="label-caps mb-1">Generated Password</div>
                    <div className="marker-num text-base font-semibold text-terracotta">{viewingUser.temp_password || viewingUser.password || "—"}</div>
                  </div>
                  {(viewingUser.temp_password || viewingUser.password) && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(viewingUser.temp_password || viewingUser.password);
                        toast.success("Password copied to clipboard");
                      }}
                      className="p-1.5 border border-stone-alt bg-white text-neutral-700 hover:text-charcoal hover:bg-stone-100 rounded-sm text-xs flex items-center gap-1"
                    >
                      <Copy size={13} /> Copy
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!issued} onOpenChange={(o) => !o && setIssued(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Credentials issued</DialogTitle></DialogHeader>
          <div className="space-y-2 text-sm">
            <div>Email: <span className="marker-num">{issued?.email}</span></div>
            <div>User Code: <span className="marker-num">{issued?.user_code}</span></div>
            <div>Password: <span className="marker-num">{issued?.temp_password}</span> <button onClick={() => { navigator.clipboard.writeText(issued?.temp_password); toast.success("Copied"); }}><Copy size={14} className="inline" /></button></div>
            <div className="text-xs text-neutral-500">An email has been sent with these credentials.</div>
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmModal open={!!confirmConfig} onOpenChange={(o) => !o && setConfirmConfig(null)} {...confirmConfig} />
    </>
  );
}


function ProjectsPage() {
  const [rows, setRows] = useState([]);
  const [clients, setClients] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [newTypeName, setNewTypeName] = useState("");
  const [editingPt, setEditingPt] = useState(null);

  const [open, setOpen] = useState(false);
  const [editingProj, setEditingProj] = useState(null);
  const [form, setForm] = useState(defaultProject());

  function defaultProject() {
    return {
      project_type: projectTypes[0]?.name || "",
      title: "",
      description: "",
      start_date: "",
      end_date: "",
      rate: "",
      status: "In Progress",
      client_id: "",
      contractor_id: "",
      total_amount: 0,
    };
  }

  const loadProjects = async () => {
    const { data } = await api.get("/projects");
    setRows(data);
  };

  const loadProjectTypes = async () => {
    try {
      const { data } = await api.get("/project-types");
      setProjectTypes(data);
      if (data.length > 0 && !form.project_type) {
        setForm((prev) => ({ ...prev, project_type: data[0].name }));
      }
    } catch (e) {
      console.error("Failed to load project types", e);
    }
  };

  useEffect(() => {
    loadProjects();
    loadProjectTypes();
    api.get("/admin/users", { params: { role: "client", status: "approved" } }).then(({ data }) => setClients(data));
    api.get("/admin/users", { params: { role: "contractor", status: "approved" } }).then(({ data }) => setContractors(data));
  }, []);

  const handleAddType = async (e) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;
    try {
      await api.post("/project-types", { name: newTypeName.trim() });
      toast.success("Project type added");
      setNewTypeName("");
      loadProjectTypes();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to add project type");
    }
  };

  const handleUpdateType = async () => {
    if (!editingPt || !editingPt.name.trim()) return;
    try {
      await api.put(`/project-types/${editingPt.id}`, { name: editingPt.name.trim() });
      toast.success("Project type updated");
      setEditingPt(null);
      loadProjectTypes();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update project type");
    }
  };

  const [confirmConfig, setConfirmConfig] = useState(null);

  const handleDeleteType = (id) => {
    const pt = projectTypes.find((p) => p.id === id);
    setConfirmConfig({
      title: "Delete Project Type",
      description: `Are you sure you want to delete project type "${pt?.name || ""}"?`,
      onConfirm: async () => {
        try {
          await api.delete(`/project-types/${id}`);
          toast.success("Project type deleted");
          loadProjectTypes();
        } catch (err) {
          toast.error(err.response?.data?.detail || "Failed to delete");
        }
      },
    });
  };

  const submitProject = async () => {
    try {
      const payload = {
        ...form,
        rate: Number(form.rate) || 0,
        total_amount: Number(form.total_amount) || 0,
      };
      if (editingProj) {
        await api.put(`/projects/${editingProj.id}`, payload);
        toast.success("Project updated");
        setEditingProj(null);
      } else {
        await api.post("/projects", payload);
        toast.success("Project created");
      }
      setOpen(false);
      setForm(defaultProject());
      loadProjects();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed");
    }
  };

  const delProject = (id) => {
    const proj = rows.find((p) => p.id === id);
    setConfirmConfig({
      title: "Delete Project",
      description: `Are you sure you want to delete project "${proj?.title || ""}"? All associated data will be permanently removed.`,
      onConfirm: async () => {
        try {
          await api.delete(`/projects/${id}`);
          toast.success("Project deleted");
          loadProjects();
        } catch (err) {
          toast.error("Failed to delete project");
        }
      },
    });
  };

  const openEditProject = (proj) => {
    setEditingProj(proj);
    setForm({
      project_type: proj.project_type || (projectTypes[0]?.name || ""),
      title: proj.title || "",
      description: proj.description || "",
      start_date: proj.start_date || "",
      end_date: proj.end_date || "",
      rate: proj.rate || "",
      status: proj.status || "In Progress",
      client_id: proj.client_id || "",
      contractor_id: proj.contractor_id || "",
      total_amount: proj.total_amount || 0,
    });
    setOpen(true);
  };

  return (
    <>
      <PageHead subtitle="Projects" title="Projects & Types" actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              onClick={() => { setEditingProj(null); setForm(defaultProject()); }}
              data-testid="new-project" className="btn-terra">
              <Plus size={14} /> New Project
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl bg-white border border-stone-alt shadow-2xl p-6">
            <DialogHeader><DialogTitle className="font-heading text-xl">{editingProj ? "Edit Project" : "Create Project"}</DialogTitle></DialogHeader>
            <div className="grid md:grid-cols-2 gap-4 mt-2">
              <F label="Project Type">
                <Select value={form.project_type} onValueChange={(v) => setForm({ ...form, project_type: v })}>
                  <SelectTrigger data-testid="proj-type-select"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent className="bg-white border border-stone-alt shadow-xl z-[999]">
                    {projectTypes.map((pt) => (
                      <SelectItem key={pt.id} value={pt.name}>{pt.name}</SelectItem>
                    ))}
                    {projectTypes.length === 0 && <SelectItem value="">No types created yet</SelectItem>}
                  </SelectContent>
                </Select>
              </F>
              <F label="Status">
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white border border-stone-alt shadow-xl z-[999]">
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </F>
              <div className="md:col-span-2"><F label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="proj-title" /></F></div>
              <div className="md:col-span-2"><F label="Description"><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></F></div>
              <F label="Start Date"><Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></F>
              <F label="End Date"><Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></F>
              <F label="Rate (per sq ft)">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-medium text-sm">₹</span>
                  <Input
                    type="number"
                    className="pl-7"
                    placeholder="rate in per sq ft"
                    value={form.rate}
                    onChange={(e) => setForm({ ...form, rate: e.target.value })}
                  />
                </div>
              </F>
              <F label="Total Amount (₹)"><Input type="number" value={form.total_amount} onChange={(e) => setForm({ ...form, total_amount: e.target.value })} data-testid="proj-amount" /></F>
              <F label="Client">
                <Select value={form.client_id} onValueChange={(v) => setForm({ ...form, client_id: v })}>
                  <SelectTrigger data-testid="proj-client"><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent className="bg-white border border-stone-alt shadow-xl z-[999]">
                    {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.full_name} — {c.email}</SelectItem>)}
                  </SelectContent>
                </Select>
              </F>
              <F label="Contractor">
                <Select value={form.contractor_id} onValueChange={(v) => setForm({ ...form, contractor_id: v })}>
                  <SelectTrigger data-testid="proj-contractor"><SelectValue placeholder="Select contractor" /></SelectTrigger>
                  <SelectContent className="bg-white border border-stone-alt shadow-xl z-[999]">
                    {contractors.map((c) => <SelectItem key={c.id} value={c.id}>{c.full_name}{c.business_name ? ` (${c.business_name})` : ''} — {c.email}</SelectItem>)}
                  </SelectContent>
                </Select>
              </F>
            </div>
            <button onClick={submitProject} className="btn-terra mt-6 w-full justify-center" data-testid="proj-submit">
              {editingProj ? "Update Project" : "Create Project"}
            </button>
          </DialogContent>
        </Dialog>
      } />

      <div className="p-6 md:p-10 space-y-8">
        {/* Project Types Section */}
        <div className="bg-white border border-stone-alt p-6">
          <div className="label-caps mb-4 text-terracotta">Project Types</div>
          <form onSubmit={handleAddType} className="flex gap-3 mb-6">
            <Input
              placeholder="Type Name"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              className="max-w-md"
            />
            <button type="submit" className="btn-terra">
              <Plus size={14} /> Add
            </button>
          </form>

          <div className="bg-white border border-stone-alt overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-alt text-xs uppercase tracking-widest">
                <tr>
                  <th className="text-left p-3 w-12">#</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projectTypes.map((pt, idx) => (
                  <tr key={pt.id} className="border-t border-stone-alt">
                    <td className="p-3 font-medium marker-num text-neutral-500">{String(idx + 1).padStart(2, "0")}</td>
                    <td className="p-3 font-medium">{pt.name}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => setEditingPt({ id: pt.id, name: pt.name })}
                        className="text-xs text-charcoal border border-stone-alt px-2.5 py-1 hover:border-terracotta">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteType(pt.id)}
                        className="text-xs text-red-600 border border-red-200 px-2.5 py-1 hover:bg-red-50">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {projectTypes.length === 0 && (
                  <tr><td colSpan={3} className="p-6 text-center text-neutral-500">No project types created yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white border border-stone-alt p-6">
          <div className="label-caps mb-4 text-terracotta">Projects</div>
          <div className="overflow-x-auto border border-stone-alt">
            <table className="w-full text-sm">
              <thead className="bg-stone-alt text-xs uppercase tracking-widest">
                <tr>
                  <th className="text-left p-3">Title</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Client</th>
                  <th className="text-left p-3">Contractor</th>
                  <th className="text-left p-3">Rate (sq ft)</th>
                  <th className="text-left p-3">Amount</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id} className="border-t border-stone-alt">
                    <td className="p-3 font-medium">{p.title}</td>
                    <td className="p-3">{p.project_type || "—"}</td>
                    <td className="p-3">{p.client?.full_name || "—"}</td>
                    <td className="p-3">{p.contractor?.full_name || "—"}</td>
                    <td className="p-3 marker-num">{p.rate ? `₹${p.rate}/sq ft` : "—"}</td>
                    <td className="p-3 marker-num">{fmt(p.total_amount)}</td>
                    <td className="p-3"><StatusBadge status={p.status} /></td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => openEditProject(p)}
                        className="text-xs text-charcoal border border-stone-alt px-2.5 py-1 hover:border-terracotta">
                        Edit
                      </button>
                      <button
                        onClick={() => delProject(p.id)}
                        className="text-xs text-red-600 border border-red-200 px-2.5 py-1 hover:bg-red-50"
                        data-testid={`del-proj-${p.id}`}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={8} className="p-8 text-center text-neutral-500">No projects created yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Project Type Dialog */}
      <Dialog open={!!editingPt} onOpenChange={(o) => !o && setEditingPt(null)}>
        <DialogContent className="max-w-md bg-white border border-stone-alt shadow-2xl p-6">
          <DialogHeader><DialogTitle className="font-heading text-xl">Edit Project Type</DialogTitle></DialogHeader>
          {editingPt && (
            <div className="space-y-4 mt-2">
              <F label="Type Name">
                <Input
                  value={editingPt.name}
                  onChange={(e) => setEditingPt({ ...editingPt, name: e.target.value })}
                />
              </F>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setEditingPt(null)} className="px-4 py-2 border border-stone-alt text-sm">Cancel</button>
                <button onClick={handleUpdateType} className="btn-terra">Save Changes</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmModal open={!!confirmConfig} onOpenChange={(o) => !o && setConfirmConfig(null)} {...confirmConfig} />
    </>
  );
}

function ProjectPicker({ value, onChange, testid = "proj-select" }) {
  const [projects, setProjects] = useState(() => {
    try {
      const stored = sessionStorage.getItem("ul_adm_projects");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    api.get("/projects").then(({ data }) => {
      setProjects(data);
      try {
        sessionStorage.setItem("ul_adm_projects", JSON.stringify(data));
      } catch (e) { }
    });
  }, []);

  return (
    <Select value={value || ""} onValueChange={onChange}>
      <SelectTrigger data-testid={testid} className="w-72 bg-white">
        <SelectValue placeholder="Select Project" />
      </SelectTrigger>
      <SelectContent>
        {projects.map((p) => (
          <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function DrawingThumbnail({ src, alt, onClick }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      onClick={onClick}
      className="relative w-12 h-12 rounded border border-stone-alt overflow-hidden bg-stone-100 flex items-center justify-center cursor-pointer hover:opacity-85 transition-opacity"
    >
      {!loaded && !error && (
        <div className="absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {!error ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      ) : (
        <div className="text-[10px] font-bold text-neutral-400">IMG</div>
      )}
    </div>
  );
}

function DrawingsPage() {
  const [projectId, setProjectId] = useState("");
  const [projects, setProjects] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState("Plan");
  const [viewingImage, setViewingImage] = useState(null);

  useEffect(() => {
    api.get("/projects").then(({ data }) => setProjects(data));
  }, []);

  const loadDrawings = useCallback(() => {
    if (projectId) {
      setLoading(true);
      api
        .get("/drawings", { params: { project_id: projectId } })
        .then(({ data }) => setRows(data))
        .finally(() => setLoading(false));
    }
  }, [projectId]);

  useEffect(() => {
    loadDrawings();
  }, [loadDrawings]);

  const selectedProject = projects.find((p) => p.id === projectId);

  const handleFileUpload = async (e) => {
    const filesList = Array.from(e.target.files || []);
    if (!filesList.length || !projectId) return;
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("project_id", projectId);
      fd.append("category", category);
      filesList.forEach((f) => fd.append("files", f));

      await api.post("/drawings/upload-multiple", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(`Uploaded ${filesList.length} file(s)`);
      loadDrawings();
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const [confirmConfig, setConfirmConfig] = useState(null);

  const del = (id) => {
    const drawing = rows.find((d) => d.id === id);
    setConfirmConfig({
      title: "Delete Drawing",
      description: `Are you sure you want to delete "${drawing?.original_filename || "this drawing"}"?`,
      onConfirm: async () => {
        try {
          await api.delete(`/drawings/${id}`);
          toast.success("Drawing deleted");
          loadDrawings();
        } catch (err) {
          toast.error("Failed to delete drawing");
        }
      },
    });
  };

  const deleteAll = () => {
    if (!rows.length || !projectId) return;
    setConfirmConfig({
      title: "Delete All Drawings",
      description: `Are you sure you want to delete ALL ${rows.length} drawings for this project? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await api.delete(`/drawings-all`, { params: { project_id: projectId } });
          toast.success("All drawings deleted");
          loadDrawings();
        } catch (err) {
          toast.error("Failed to delete all drawings");
        }
      },
    });
  };

  const getImageUrl = (d) => {
    const token = localStorage.getItem("ul_token");
    return `${api.defaults.baseURL}/drawings/${d.id}/download?auth=${token}`;
  };

  return (
    <>
      <PageHead
        subtitle="Drawings"
        title="Drawings & Blueprints"
        actions={<ProjectPicker value={projectId} onChange={setProjectId} testid="draw-proj" />}
      />

      <div className="p-6 md:p-10 space-y-6">
        {projectId && selectedProject && (
          <>
            {/* Project Details Card */}
            <div className="bg-white border border-stone-alt p-6 flex flex-wrap justify-between gap-6 text-sm">
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-charcoal">Client ID:</span>{" "}
                  <span className="marker-num text-neutral-600 font-medium">{selectedProject.client?.user_code || "—"}</span>
                </div>
                <div>
                  <span className="font-semibold text-charcoal">Contractor ID:</span>{" "}
                  <span className="marker-num text-neutral-600 font-medium">{selectedProject.contractor?.user_code || "—"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-charcoal">Client Name:</span>{" "}
                  <span className="text-neutral-700">{selectedProject.client?.full_name || "—"}</span>
                </div>
                <div>
                  <span className="font-semibold text-charcoal">Contractor Name:</span>{" "}
                  <span className="text-neutral-700">{selectedProject.contractor?.full_name || "—"}</span>
                </div>
              </div>
            </div>

            {/* Upload Toolbar */}
            <div className="bg-white border border-stone-alt p-5 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="label-caps">Category:</div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-40" data-testid="draw-cat">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-stone-alt shadow-xl z-[999]">
                    <SelectItem value="Plan">Plan</SelectItem>
                    <SelectItem value="Interior">Interior</SelectItem>
                    <SelectItem value="Exterior">Exterior</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap gap-3 ml-auto">
                <label className="btn-terra cursor-pointer" data-testid="draw-upload-folder">
                  {uploading ? "Uploading..." : "Upload Folder"}
                  <input type="file" webkitdirectory="" directory="" multiple hidden onChange={handleFileUpload} />
                </label>

                <label className="px-4 py-2 border border-stone-alt text-charcoal font-medium text-xs rounded-sm hover:border-terracotta cursor-pointer" data-testid="draw-upload-photos">
                  {uploading ? "Uploading..." : "Upload Photos"}
                  <input type="file" multiple hidden onChange={handleFileUpload} accept="image/*" />
                </label>

                <label className="px-4 py-2 border border-stone-alt text-charcoal font-medium text-xs rounded-sm hover:border-terracotta cursor-pointer" data-testid="draw-upload-pdf">
                  {uploading ? "Uploading..." : "Upload PDF"}
                  <input type="file" multiple hidden onChange={handleFileUpload} accept="application/pdf" />
                </label>
              </div>
            </div>

            {/* Drawings Table Card */}
            <div className="bg-white border border-stone-alt p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="font-heading text-xl font-medium text-charcoal">Drawings</div>
                {rows.length > 0 && !loading && (
                  <button
                    onClick={deleteAll}
                    className="px-4 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-md hover:bg-red-700 transition-colors">
                    Delete All
                  </button>
                )}
              </div>

              <div className="overflow-x-auto border border-stone-alt rounded-sm">
                <table className="w-full text-sm">
                  <thead className="bg-[#F9F8F6] border-b border-stone-alt text-xs font-semibold text-neutral-600">
                    <tr>
                      <th className="text-left p-3 w-20">Preview</th>
                      <th className="text-left p-3">Title</th>
                      <th className="text-left p-3 w-48">Date</th>
                      <th className="text-right p-3 pr-6 w-40">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      [1, 2, 3, 4].map((i) => (
                        <tr key={i} className="animate-pulse border-t border-stone-alt">
                          <td className="p-3">
                            <div className="w-12 h-12 bg-stone-200 rounded animate-pulse" />
                          </td>
                          <td className="p-3">
                            <div className="h-4 bg-stone-200 rounded w-48 mb-2 animate-pulse" />
                            <div className="h-3 bg-stone-100 rounded w-24 animate-pulse" />
                          </td>
                          <td className="p-3">
                            <div className="h-3 bg-stone-200 rounded w-32 animate-pulse" />
                          </td>
                          <td className="p-3 text-right">
                            <div className="h-7 bg-stone-200 rounded w-28 ml-auto animate-pulse" />
                          </td>
                        </tr>
                      ))
                    ) : (
                      rows.map((d) => (
                        <tr key={d.id} className="border-t border-stone-alt hover:bg-[#FDFDFD]">
                          <td className="p-3">
                            {d.content_type?.startsWith("image/") ? (
                              <DrawingThumbnail
                                src={getImageUrl(d)}
                                alt={d.original_filename}
                                onClick={() => setViewingImage(d)}
                              />
                            ) : (
                              <div
                                onClick={() => window.open(getImageUrl(d), "_blank")}
                                className="w-12 h-12 bg-stone-100 border border-stone-alt rounded flex items-center justify-center text-[10px] font-bold text-neutral-500 cursor-pointer">
                                FILE
                              </div>
                            )}
                          </td>
                          <td className="p-3 font-medium text-charcoal truncate max-w-xs">{d.original_filename}</td>
                          <td className="p-3 text-neutral-500 marker-num text-xs">
                            {d.uploaded_at ? new Date(d.uploaded_at).toLocaleString() : "—"}
                          </td>
                          <td className="p-3 text-right pr-6 space-x-2 whitespace-nowrap">
                            {d.content_type?.startsWith("image/") && (
                              <button
                                onClick={() => setViewingImage(d)}
                                className="px-3 py-1 bg-white border border-stone-alt text-xs font-medium rounded-sm hover:border-neutral-400">
                                View
                              </button>
                            )}
                            <a
                              href={getImageUrl(d)}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 bg-white border border-stone-alt text-xs font-medium rounded-sm hover:border-neutral-400 inline-block">
                              Open
                            </a>
                            <button
                              onClick={() => del(d.id)}
                              className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-sm hover:bg-red-700">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                    {!loading && rows.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-neutral-500">
                          No drawings uploaded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {!projectId && (
          <div className="bg-white border border-stone-alt p-8 text-center text-neutral-500">
            Select a project from the dropdown above to view or upload drawings.
          </div>
        )}
      </div>

      {/* High-Resolution Image Lightbox Dialog */}
      <Dialog open={!!viewingImage} onOpenChange={(o) => !o && setViewingImage(null)}>
        <DialogContent className="max-w-4xl bg-white border border-stone-alt shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl truncate">{viewingImage?.original_filename}</DialogTitle>
          </DialogHeader>
          {viewingImage && (
            <div className="space-y-4 mt-2">
              <div className="max-h-[75vh] overflow-auto flex justify-center bg-[#F4F3EF] p-4 border border-stone-alt rounded-sm">
                <img src={getImageUrl(viewingImage)} alt={viewingImage.original_filename} className="max-w-full h-auto object-contain rounded" />
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-stone-alt">
                <a href={getImageUrl(viewingImage)} target="_blank" rel="noreferrer" className="btn-terra">
                  Full Resolution / Download
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmModal open={!!confirmConfig} onOpenChange={(o) => !o && setConfirmConfig(null)} {...confirmConfig} />
    </>
  );
}

function StagesPage() {
  const [projectId, setProjectId] = useState("");
  const [rows, setRows] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);
  const [newCatInput, setNewCatInput] = useState("");
  const [addingStageCat, setAddingStageCat] = useState(null); // category name currently adding stage to
  const [editingStage, setEditingStage] = useState(null);
  const [uncheckingStage, setUncheckingStage] = useState(null);
  const [uncheckRemark, setUncheckRemark] = useState("");
  const [editingCatName, setEditingCatName] = useState(null);
  const [newCatNameValue, setNewCatNameValue] = useState("");

  const [form, setForm] = useState({
    stage_name: "",
    description: "",
    status: "Not Started",
    category: "",
  });

  const load = useCallback(() => {
    if (projectId) {
      api.get("/stages", { params: { project_id: projectId } }).then(({ data }) => {
        setRows(data);
      });
    }
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  const baseCats = Array.isArray(customCategories) ? customCategories : [];

  // Combine default/added categories with categories found in existing stages
  const categoriesList = Array.from(
    new Set([...baseCats, ...rows.map((r) => r.category || "General")])
  ).filter(Boolean);

  const addCategory = () => {
    const val = newCatInput.trim();
    if (!val) return toast.error("Enter a valid category name");
    if (categoriesList.includes(val)) return toast.error("Category already exists");
    setCustomCategories((prev) => (Array.isArray(prev) ? [...prev, val] : [val]));
    setNewCatInput("");
    toast.success(`Category "${val}" created`);
  };

  const deleteCategory = (catName) => {
    const count = rows.filter((r) => (r.category || "General") === catName).length;
    if (count > 0) {
      if (!confirm(`Deleting "${catName}" will delete all ${count} stages inside it. Continue?`)) return;
      const catStages = rows.filter((r) => (r.category || "General") === catName);
      Promise.all(catStages.map((s) => api.delete(`/stages/${s.id}`)))
        .then(() => {
          toast.success(`Category "${catName}" and its stages deleted`);
          setCustomCategories((prev) => (Array.isArray(prev) ? prev.filter((c) => c !== catName) : []));
          load();
        })
        .catch(() => toast.error("Failed to delete category stages"));
    } else {
      setCustomCategories((prev) => (Array.isArray(prev) ? prev.filter((c) => c !== catName) : []));
      toast.success(`Category "${catName}" removed`);
    }
  };

  const renameCategory = async (oldCatName) => {
    const newName = newCatNameValue.trim();
    if (!newName || newName === oldCatName) return setEditingCatName(null);
    try {
      const catStages = rows.filter((r) => (r.category || "General") === oldCatName);
      await Promise.all(
        catStages.map((s) => api.put(`/stages/${s.id}`, { ...s, category: newName, project_id: projectId }))
      );
      setCustomCategories((prev) => (Array.isArray(prev) ? prev.map((c) => (c === oldCatName ? newName : c)) : [newName]));
      toast.success(`Category renamed to "${newName}"`);
      setEditingCatName(null);
      load();
    } catch (e) {
      toast.error("Failed to rename category");
    }
  };

  const addStageToCategory = async () => {
    if (!projectId) return toast.error("Select a project first");
    if (!form.stage_name.trim()) return toast.error("Enter stage title");

    try {
      await api.post("/stages", {
        project_id: projectId,
        stage_name: form.stage_name.trim(),
        description: form.description.trim(),
        status: form.status,
        category: addingStageCat || form.category || "General",
        order_index: rows.length,
      });

      toast.success("Stage created successfully");
      setForm({ stage_name: "", description: "", status: "Not Started", category: "" });
      setAddingStageCat(null);
      load();
    } catch (e) {
      toast.error("Failed to create stage");
    }
  };

  const approveStage = async (stageObj) => {
    try {
      await api.put(`/stages/${stageObj.id}`, {
        ...stageObj,
        status: "Completed",
        admin_remarks: "",
        project_id: projectId,
      });
      toast.success(`Stage "${stageObj.stage_name}" approved & marked as Completed`);
      load();
    } catch (e) {
      toast.error("Failed to approve stage");
    }
  };

  const submitUncheckStage = async () => {
    if (!uncheckRemark.trim()) return toast.error("Please enter a reason for unchecking");
    try {
      await api.put(`/stages/${uncheckingStage.id}`, {
        ...uncheckingStage,
        status: "In Progress",
        admin_remarks: uncheckRemark.trim(),
        project_id: projectId,
      });
      toast.success("Stage unchecked & remark saved");
      setUncheckingStage(null);
      setUncheckRemark("");
      load();
    } catch (e) {
      toast.error("Failed to uncheck stage");
    }
  };

  const saveEditStage = async () => {
    if (!editingStage || !editingStage.stage_name.trim()) return;
    try {
      await api.put(`/stages/${editingStage.id}`, {
        ...editingStage,
        project_id: projectId,
      });
      toast.success("Stage updated");
      setEditingStage(null);
      load();
    } catch (e) {
      toast.error("Failed to update stage");
    }
  };

  const updStatus = async (stageObj, newStatus) => {
    try {
      const updateData = { ...stageObj, status: newStatus, project_id: projectId };
      if (newStatus === "Completed") {
        updateData.admin_remarks = "";
      }
      await api.put(`/stages/${stageObj.id}`, updateData);
      toast.success("Stage status updated");
      load();
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const delStage = async (id) => {
    try {
      await api.delete(`/stages/${id}`);
      toast.success("Stage deleted");
      load();
    } catch (e) {
      toast.error("Failed to delete stage");
    }
  };

  const totalStages = rows.length;
  const completedStages = rows.filter((r) => r.status === "Completed").length;
  const overallPct = totalStages ? Math.round((completedStages / totalStages) * 100) : 0;

  return (
    <>
      <PageHead subtitle="Stages" title="Category & Milestone Management" actions={<ProjectPicker value={projectId} onChange={setProjectId} testid="stage-proj" />} />
      <div className="p-6 md:p-10 space-y-6">
        {projectId && (
          <>
            {/* Overall Progress Summary & Category Creator */}
            <div className="bg-white border border-stone-alt p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-alt pb-4">
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-terracotta">Overall Milestone Progress</div>
                  <div className="font-heading text-2xl font-semibold text-charcoal mt-1">{overallPct}% Completed</div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    {completedStages} of {totalStages} total stages finished across {categoriesList.length} categories.
                  </div>
                </div>

                {/* Add Category Section */}
                <div className="flex items-center gap-2">
                  <Input
                    className="w-56 h-9 text-xs"
                    placeholder="Enter category (e.g. 1st Floor)..."
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCategory()}
                  />
                  <button onClick={addCategory} className="btn-terra h-9 px-4 text-xs justify-center whitespace-nowrap">
                    <Plus size={14} /> Add Category
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-terracotta transition-all duration-300" style={{ width: `${overallPct}%` }} />
              </div>
            </div>

            {/* Category Groups View */}
            <div className="space-y-6">
              {categoriesList.map((catName) => {
                const catStages = rows.filter((r) => (r.category || "General") === catName);
                const catCompleted = catStages.filter((r) => r.status === "Completed").length;
                const catPct = catStages.length ? Math.round((catCompleted / catStages.length) * 100) : 0;
                const isEditingThisCat = editingCatName === catName;

                return (
                  <div key={catName} className="bg-white border border-stone-alt rounded-sm overflow-hidden shadow-sm">
                    {/* Category Header */}
                    <div className="bg-[#F9F8F6] border-b border-stone-alt p-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {isEditingThisCat ? (
                          <div className="flex items-center gap-2">
                            <Input
                              className="w-48 h-8 text-xs font-semibold"
                              value={newCatNameValue}
                              onChange={(e) => setNewCatNameValue(e.target.value)}
                              autoFocus
                            />
                            <button
                              onClick={() => renameCategory(catName)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingCatName(null)}
                              className="px-2.5 py-1 border border-stone-alt text-xs font-medium rounded-sm hover:bg-stone-100"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="font-heading text-lg font-semibold text-charcoal flex items-center gap-2">
                              <span>{catName}</span>
                              <span className="text-xs font-normal text-neutral-500 bg-white border border-stone-alt px-2 py-0.5 rounded-full">
                                {catStages.length} Stages ({catPct}%)
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                setEditingCatName(catName);
                                setNewCatNameValue(catName);
                              }}
                              className="text-xs text-neutral-500 hover:text-charcoal px-2 py-1 border border-stone-alt bg-white rounded-sm"
                            >
                              Rename
                            </button>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => deleteCategory(catName)}
                          className="text-xs text-red-600 hover:bg-red-50 px-2.5 py-1.5 border border-stone-alt bg-white rounded-sm font-medium"
                        >
                          Delete Category
                        </button>
                      </div>
                    </div>

                    {/* Category Stages List */}
                    <div className="p-4 space-y-3">
                      {catStages.map((s, idx) => {
                        const isCompleted = s.status === "Completed";
                        return (
                          <div
                            key={s.id}
                            className={`p-4 rounded-sm flex flex-wrap items-center justify-between gap-4 border transition-colors ${
                              isCompleted
                                ? "bg-emerald-50/40 border-emerald-200"
                                : "bg-[#FDFDFD] border-stone-alt hover:border-neutral-400"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-[240px] flex-1">
                              <span className="marker-num text-terracotta font-semibold text-sm w-7">
                                #{idx + 1}
                              </span>
                              <div>
                                <div className="font-heading text-base font-semibold text-charcoal flex items-center gap-2">
                                  <span>{s.stage_name}</span>
                                  {isCompleted && (
                                    <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider inline-flex items-center gap-1 shadow-xs">
                                      <Check size={12} /> Completed & Verified
                                    </span>
                                  )}
                                  {s.status === "Pending Approval" && (
                                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wider">
                                      Pending Approval
                                    </span>
                                  )}
                                </div>
                                {s.description && (
                                  <div className="text-xs text-neutral-500 mt-0.5">{s.description}</div>
                                )}
                                {s.admin_remarks && (
                                  <div className="mt-1 text-xs text-red-600 font-medium bg-red-50 px-2.5 py-1 rounded border border-red-100 inline-block">
                                    Unchecked Remark: {s.admin_remarks}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {/* Pending Approval Controls or Status Select */}
                              {s.status === "Pending Approval" ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => approveStage(s)}
                                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-sm flex items-center gap-1 shadow-xs"
                                  >
                                    <Check size={14} /> Approve & Tick
                                  </button>
                                  <button
                                    onClick={() => {
                                      setUncheckingStage(s);
                                      setUncheckRemark("");
                                    }}
                                    className="px-3 py-1.5 border border-red-200 text-red-700 hover:bg-red-50 text-xs font-medium rounded-sm"
                                  >
                                    Uncheck / Reject
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <Select value={s.status} onValueChange={(v) => updStatus(s, v)}>
                                    <SelectTrigger className="w-36 h-8 text-xs bg-white border border-stone-alt">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Not Started" className="text-xs">Not Started</SelectItem>
                                      <SelectItem value="In Progress" className="text-xs">In Progress</SelectItem>
                                      <SelectItem value="Completed" className="text-xs">Completed</SelectItem>
                                      <SelectItem value="Pending Approval" className="text-xs">Pending Approval</SelectItem>
                                    </SelectContent>
                                  </Select>

                                  {isCompleted && (
                                    <button
                                      onClick={() => {
                                        setUncheckingStage(s);
                                        setUncheckRemark("");
                                      }}
                                      className="px-2.5 py-1 border border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 text-xs font-medium rounded-sm"
                                      title="Uncheck stage and request revision"
                                    >
                                      Uncheck
                                    </button>
                                  )}
                                </>
                              )}

                              {/* Edit & Delete Buttons */}
                              <button
                                onClick={() => setEditingStage(s)}
                                className="px-3 py-1 border border-stone-alt bg-white text-xs font-medium rounded-sm hover:bg-stone-100"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => delStage(s.id)}
                                className="px-3 py-1 border border-stone-alt bg-white text-red-600 hover:bg-red-50 text-xs font-medium rounded-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {catStages.length === 0 && (
                        <div className="text-center py-6 text-xs text-neutral-400 border border-dashed border-stone-alt rounded-sm">
                          No stages added to "{catName}" yet. Click below to add the first stage.
                        </div>
                      )}

                      {/* Bottom Add Stage Button inside Category */}
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setAddingStageCat(catName);
                            setForm({ stage_name: "", description: "", status: "Not Started", category: catName });
                          }}
                          className="w-full py-2.5 border border-dashed border-terracotta/40 bg-stone-50 hover:bg-stone-100 text-terracotta text-xs font-medium rounded-sm flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Plus size={14} /> Add Stage to {catName}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {!projectId && <div className="bg-white border border-stone-alt p-8 text-center text-neutral-500">Select a project from the dropdown above to view or manage category stages.</div>}
      </div>

      {/* Add Stage to Category Modal */}
      <Dialog open={!!addingStageCat} onOpenChange={(o) => !o && setAddingStageCat(null)}>
        <DialogContent className="max-w-md bg-white border border-stone-alt shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg">
              Add New Stage to <span className="text-terracotta">{addingStageCat}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm mt-2">
            <div>
              <label className="label-caps mb-1 block">Stage Title *</label>
              <Input
                placeholder="e.g. Plastering & Wiring..."
                value={form.stage_name}
                onChange={(e) => setForm({ ...form, stage_name: e.target.value })}
                autoFocus
              />
            </div>
            <div>
              <label className="label-caps mb-1 block">Description</label>
              <Input
                placeholder="Optional stage details..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div>
              <label className="label-caps mb-1 block">Initial Status</label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger className="w-full text-xs bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started" className="text-xs">Not Started</SelectItem>
                  <SelectItem value="In Progress" className="text-xs">In Progress</SelectItem>
                  <SelectItem value="Completed" className="text-xs">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-stone-alt">
              <button onClick={() => setAddingStageCat(null)} className="px-4 py-2 border border-stone-alt text-xs font-medium rounded-sm hover:bg-stone-100">
                Cancel
              </button>
              <button onClick={addStageToCategory} className="px-4 py-2 bg-terracotta text-white text-xs font-medium rounded-sm hover:bg-terracotta-dark">
                Save Stage
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Stage Modal */}
      <Dialog open={!!editingStage} onOpenChange={(o) => !o && setEditingStage(null)}>
        <DialogContent className="max-w-md bg-white border border-stone-alt shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg">Edit Stage Details</DialogTitle>
          </DialogHeader>
          {editingStage && (
            <div className="space-y-4 text-sm mt-2">
              <div>
                <label className="label-caps mb-1 block">Category / Group</label>
                <Select
                  value={editingStage.category || "General"}
                  onValueChange={(v) => setEditingStage({ ...editingStage, category: v })}
                >
                  <SelectTrigger className="w-full text-xs bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesList.map((c) => (
                      <SelectItem key={c} value={c} className="text-xs">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="label-caps mb-1 block">Stage Title *</label>
                <Input
                  value={editingStage.stage_name}
                  onChange={(e) => setEditingStage({ ...editingStage, stage_name: e.target.value })}
                />
              </div>
              <div>
                <label className="label-caps mb-1 block">Description</label>
                <Input
                  value={editingStage.description || ""}
                  onChange={(e) => setEditingStage({ ...editingStage, description: e.target.value })}
                />
              </div>
              <div>
                <label className="label-caps mb-1 block">Status</label>
                <Select
                  value={editingStage.status}
                  onValueChange={(v) => setEditingStage({ ...editingStage, status: v })}
                >
                  <SelectTrigger className="w-full text-xs bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started" className="text-xs">Not Started</SelectItem>
                    <SelectItem value="In Progress" className="text-xs">In Progress</SelectItem>
                    <SelectItem value="Completed" className="text-xs">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-stone-alt">
                <button onClick={() => setEditingStage(null)} className="px-4 py-2 border border-stone-alt text-xs font-medium rounded-sm hover:bg-stone-100">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Uncheck / Reject Stage Modal */}
      <Dialog open={!!uncheckingStage} onOpenChange={(o) => !o && setUncheckingStage(null)}>
        <DialogContent className="max-w-md bg-white border border-stone-alt shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg text-red-700">
              Uncheck Stage & Request Revision
            </DialogTitle>
          </DialogHeader>
          {uncheckingStage && (
            <div className="space-y-4 text-sm mt-2">
              <p className="text-xs text-neutral-600">
                You are unchecking stage <strong className="text-charcoal">{uncheckingStage.stage_name}</strong>. Please enter the reason/remark for unchecking (visible to Contractor and Client).
              </p>
              <div>
                <label className="label-caps mb-1 block text-red-700">Reason / Remark for Unchecking *</label>
                <Input
                  placeholder="e.g. Flooring polishing incomplete, needs 2nd coat..."
                  value={uncheckRemark}
                  onChange={(e) => setUncheckRemark(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-stone-alt">
                <button onClick={() => setUncheckingStage(null)} className="px-4 py-2 border border-stone-alt text-xs font-medium rounded-sm hover:bg-stone-100">
                  Cancel
                </button>
                <button onClick={submitUncheckStage} className="px-4 py-2 bg-red-600 text-white text-xs font-medium rounded-sm hover:bg-red-700">
                  Uncheck & Send Remark
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function MaterialsPage() {
  const [projectId, setProjectId] = useState("");
  const [rows, setRows] = useState([]);
  const [rejectingItem, setRejectingItem] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const load = useCallback(() => {
    if (projectId) {
      api.get("/materials", { params: { project_id: projectId } }).then(({ data }) => setRows(data));
    } else {
      setRows([]);
    }
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  const approveItem = async (id) => {
    try {
      await api.post(`/materials/${id}/action`, { status: "Approved", admin_remarks: "" });
      toast.success("Material request approved");
      load();
    } catch (err) {
      toast.error("Failed to approve material request");
    }
  };

  const submitRejection = async () => {
    if (!rejectingItem) return;
    if (!rejectionReason.trim()) {
      toast.error("Please enter a reason for rejection");
      return;
    }
    try {
      await api.post(`/materials/${rejectingItem.id}/action`, {
        status: "Rejected",
        admin_remarks: rejectionReason.trim(),
      });
      toast.success("Material request rejected");
      setRejectingItem(null);
      setRejectionReason("");
      load();
    } catch (err) {
      toast.error("Failed to reject material request");
    }
  };

  return (
    <>
      <PageHead subtitle="Material" title="Material Requests" actions={<ProjectPicker value={projectId} onChange={setProjectId} />} />
      <div className="p-6 md:p-10 space-y-6">
        {projectId && (
          <div className="bg-white border border-stone-alt overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F9F8F6] border-b border-stone-alt text-xs font-semibold text-neutral-600">
                <tr>
                  <th className="text-left p-3">Material</th>
                  <th className="text-left p-3">Qty</th>
                  <th className="text-left p-3">Unit</th>
                  <th className="text-left p-3">Notes</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Remarks / Reason</th>
                  <th className="text-right p-3 pr-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <tr key={m.id} className="border-t border-stone-alt hover:bg-[#FDFDFD]">
                    <td className="p-3 font-medium text-charcoal">{m.material_name}</td>
                    <td className="p-3 marker-num">{m.quantity}</td>
                    <td className="p-3">{m.unit}</td>
                    <td className="p-3 text-xs text-neutral-500 max-w-xs truncate">{m.notes || "—"}</td>
                    <td className="p-3"><StatusBadge status={m.status} /></td>
                    <td className="p-3 text-xs text-neutral-600">
                      {m.admin_remarks ? (
                        <span className="text-red-600 font-medium bg-red-50 px-2 py-1 rounded border border-red-100">
                          {m.admin_remarks}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-3 text-right pr-6 whitespace-nowrap">
                      {m.status === "Pending" && (
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => approveItem(m.id)}
                            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-sm font-medium"
                            data-testid={`mat-approve-${m.id}`}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setRejectingItem(m);
                              setRejectionReason("");
                            }}
                            className="text-xs border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-sm font-medium"
                            data-testid={`mat-reject-${m.id}`}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-neutral-500">
                      No material requests found for this project.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!projectId && (
          <div className="bg-white border border-stone-alt p-8 text-center text-neutral-500">
            Select a project from the dropdown above to view or manage material requests.
          </div>
        )}
      </div>

      {/* Reject Reason Dialog */}
      <Dialog open={!!rejectingItem} onOpenChange={(o) => !o && setRejectingItem(null)}>
        <DialogContent className="max-w-md bg-white border border-stone-alt shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">Reject Material Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <p className="text-xs text-neutral-500">
              Please enter the reason for rejecting <span className="font-semibold text-charcoal">{rejectingItem?.material_name}</span>. This reason will be visible to the contractor and client.
            </p>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal uppercase tracking-wider">Reason for Rejection *</label>
              <Textarea
                rows={3}
                placeholder="Enter rejection reason or remarks..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-stone-alt">
              <button
                onClick={() => setRejectingItem(null)}
                className="px-4 py-2 border border-stone-alt text-xs font-medium rounded-sm hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-sm"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function PaymentsPage() {
  const [projectId, setProjectId] = useState("");
  const [projects, setProjects] = useState([]);
  const [rows, setRows] = useState([]);
  const [activeTab, setActiveTab] = useState("client"); // "client" | "contractor"
  const [isEditingTotal, setIsEditingTotal] = useState(false);
  const [newTotalAmount, setNewTotalAmount] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    due_date: new Date().toISOString().slice(0, 10),
  });

  const loadProjects = useCallback(() => {
    api.get("/projects").then(({ data }) => setProjects(data));
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const load = useCallback(() => {
    if (projectId) api.get("/payments", { params: { project_id: projectId } }).then(({ data }) => setRows(data));
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  const selectedProject = projects.find((p) => p.id === projectId);

  const saveTotalAmount = async () => {
    if (!selectedProject || newTotalAmount === "") return;
    try {
      const val = Number(newTotalAmount);
      await api.put(`/projects/${selectedProject.id}`, {
        ...selectedProject,
        rate: Number(selectedProject.rate) || 0,
        total_amount: val,
      });
      toast.success(`Project total amount updated to ${fmt(val)}`);
      setIsEditingTotal(false);
      loadProjects();
    } catch (err) {
      toast.error("Failed to update project total amount");
    }
  };

  const totalProjectAmount = Number(selectedProject?.total_amount) || 0;

  // Client installment metrics
  const clientRows = rows.filter((r) => r.direction === "received_from_client");
  const clientScheduledTotal = clientRows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const clientPaid = clientRows.filter((r) => r.status === "Paid").reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const clientPending = clientRows.filter((r) => r.status !== "Paid").reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const clientUnscheduled = Math.max(0, totalProjectAmount - clientScheduledTotal);

  // Contractor installment metrics
  const contractorRows = rows.filter((r) => r.direction === "paid_to_contractor");
  const contractorScheduledTotal = contractorRows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const contractorPaid = contractorRows.filter((r) => r.status === "Paid").reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const contractorPending = contractorRows.filter((r) => r.status !== "Paid").reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const contractorUnscheduled = Math.max(0, totalProjectAmount - contractorScheduledTotal);

  const filteredRows = activeTab === "client" ? clientRows : contractorRows;

  const add = async () => {
    if (!projectId) return toast.error("Select a project first");
    if (!form.amount || Number(form.amount) <= 0) return toast.error("Enter a valid amount");

    const direction = activeTab === "client" ? "received_from_client" : "paid_to_contractor";
    const nextNo = (filteredRows.reduce((max, r) => Math.max(max, Number(r.installment_no) || 0), 0)) + 1;

    try {
      await api.post("/payments", {
        project_id: projectId,
        installment_no: nextNo,
        amount: Number(form.amount),
        due_date: form.due_date,
        direction: direction,
      });

      toast.success("Installment added");
      setForm({
        amount: "",
        due_date: new Date().toISOString().slice(0, 10),
      });

      load();
    } catch (err) {
      toast.error("Failed to add installment");
    }
  };

  const mark = async (id) => {
    try {
      await api.post(`/payments/${id}/mark`, { status: "Paid" });
      toast.success("Payment marked as Paid");
      load();
    } catch (err) {
      toast.error("Failed to mark payment");
    }
  };

  const del = async (id) => {
    try {
      await api.delete(`/payments/${id}`);
      toast.success("Installment deleted");
      load();
    } catch (err) {
      toast.error("Failed to delete installment");
    }
  };

  // Progress percentages for progress bar
  const paidPct = totalProjectAmount > 0 ? Math.min(100, Math.round(((activeTab === "client" ? clientPaid : contractorPaid) / totalProjectAmount) * 100)) : 0;
  const pendingPct = totalProjectAmount > 0 ? Math.min(100, Math.round(((activeTab === "client" ? clientPending : contractorPending) / totalProjectAmount) * 100)) : 0;
  const unscheduledPct = Math.max(0, 100 - paidPct - pendingPct);

  return (
    <>
      <PageHead subtitle="Payments" title="Installments & Schedule" actions={<ProjectPicker value={projectId} onChange={setProjectId} testid="pay-proj" />} />
      <div className="p-6 md:p-10 space-y-6">
        {projectId && selectedProject && (
          <>
            {/* Financial Summary Card with Edit Total Amount option */}
            <div className="bg-white border border-stone-alt p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-alt pb-4">
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-terracotta">Financial Summary</div>
                  <div className="font-heading text-xl text-charcoal font-medium mt-1">{selectedProject.title}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    Client: <span className="font-medium text-neutral-700">{selectedProject.client?.full_name || "—"}</span> | Contractor: <span className="font-medium text-neutral-700">{selectedProject.contractor?.full_name || "—"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isEditingTotal ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-neutral-600">Total (₹):</span>
                      <Input
                        type="number"
                        className="w-36 h-9 text-sm"
                        value={newTotalAmount}
                        onChange={(e) => setNewTotalAmount(e.target.value)}
                        placeholder="Enter total amount"
                      />
                      <button onClick={saveTotalAmount} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-sm">
                        Save
                      </button>
                      <button onClick={() => setIsEditingTotal(false)} className="px-3 py-1.5 border border-stone-alt text-xs font-medium rounded-sm hover:bg-stone-100">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-[10px] uppercase font-semibold text-neutral-500">Total Agreed Amount</div>
                        <div className="marker-num text-lg font-semibold text-charcoal">{fmt(totalProjectAmount)}</div>
                      </div>
                      <button
                        onClick={() => {
                          setNewTotalAmount(totalProjectAmount);
                          setIsEditingTotal(true);
                        }}
                        className="px-3 py-1.5 border border-stone-alt text-xs font-medium text-neutral-700 hover:bg-stone-100 rounded-sm inline-flex items-center gap-1"
                      >
                        Edit Total
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm pt-1">
                <div className="bg-[#F9F8F6] p-3 border border-stone-alt rounded-sm">
                  <div className="text-xs text-neutral-500 font-medium">Total Project Amount</div>
                  <div className="marker-num text-base font-semibold text-charcoal mt-1">{fmt(totalProjectAmount)}</div>
                </div>
                <div className="bg-[#F9F8F6] p-3 border border-stone-alt rounded-sm">
                  <div className="text-xs text-neutral-500 font-medium">Received from Client</div>
                  <div className="marker-num text-base font-semibold text-emerald-700 mt-1">{fmt(clientPaid)}</div>
                </div>
                <div className="bg-[#F9F8F6] p-3 border border-stone-alt rounded-sm">
                  <div className="text-xs text-neutral-500 font-medium">Paid to Contractor</div>
                  <div className="marker-num text-base font-semibold text-blue-700 mt-1">{fmt(contractorPaid)}</div>
                </div>
              </div>
            </div>

            {/* Client vs Contractor Tabs */}
            <div className="bg-white border border-stone-alt p-6 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-[#F4F3EF] p-1 border border-stone-alt">
                  <TabsTrigger value="client" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2 text-xs font-medium uppercase tracking-wider">
                    Client Payments ({clientRows.length} Installments)
                  </TabsTrigger>
                  <TabsTrigger value="contractor" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2 text-xs font-medium uppercase tracking-wider">
                    Contractor Payments ({contractorRows.length} Payouts)
                  </TabsTrigger>
                </TabsList>

                {/* Live Installment Allocation Progress Banner */}
                <div className="mt-4 bg-[#F9F8F6] border border-stone-alt p-4 rounded-sm space-y-2">
                  <div className="flex flex-wrap items-center justify-between text-xs font-medium text-neutral-700">
                    <div>
                      {activeTab === "client" ? "Client Payment Allocation" : "Contractor Payout Allocation"}:{" "}
                      <span className="font-semibold text-charcoal">
                        {fmt(activeTab === "client" ? clientScheduledTotal : contractorScheduledTotal)}
                      </span>{" "}
                      of <span className="font-semibold text-charcoal">{fmt(totalProjectAmount)}</span> scheduled across{" "}
                      <span className="marker-num">{filteredRows.length}</span> installment(s).
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-700 font-medium">● Paid: {fmt(activeTab === "client" ? clientPaid : contractorPaid)}</span>
                      <span className="text-amber-700 font-medium">● Pending: {fmt(activeTab === "client" ? clientPending : contractorPending)}</span>
                      <span className="text-neutral-500 font-medium">● Unscheduled: {fmt(activeTab === "client" ? clientUnscheduled : contractorUnscheduled)}</span>
                    </div>
                  </div>
                  {/* Multi-segment Progress Bar */}
                  <div className="h-2 bg-stone-200 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-600 h-full transition-all duration-300" style={{ width: `${paidPct}%` }} title={`Paid: ${paidPct}%`} />
                    <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${pendingPct}%` }} title={`Pending: ${pendingPct}%`} />
                    <div className="bg-stone-300 h-full transition-all duration-300" style={{ width: `${unscheduledPct}%` }} title={`Unscheduled: ${unscheduledPct}%`} />
                  </div>
                </div>

                {/* Simplified Installment Form */}
                <div className="mt-6 bg-[#F9F8F6] border border-stone-alt p-5 grid md:grid-cols-3 gap-4 items-end rounded-sm">
                  <F label="Amount (₹)">
                    <Input
                      type="number"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      placeholder="e.g. 50000"
                      data-testid="pay-amount"
                    />
                  </F>
                  <F label="Due Date">
                    <div
                      onClick={() => setCalendarOpen(true)}
                      className="flex items-center justify-between border border-stone-alt bg-white px-3 py-2 rounded-sm cursor-pointer hover:bg-stone-50 h-9 select-none"
                      title="Click to open schedule calendar"
                    >
                      <span className="text-xs font-semibold text-charcoal">
                        {form.due_date || "Select Date"}
                      </span>
                      <Calendar size={16} className="text-terracotta" />
                    </div>
                  </F>
                  <button onClick={add} className="btn-terra justify-center h-9" data-testid="pay-add">
                    <Plus size={14} /> Add {activeTab === "client" ? "Client Installment" : "Contractor Payout"}
                  </button>
                </div>

                {/* Installments Table */}
                <div className="mt-6 overflow-x-auto border border-stone-alt rounded-sm">
                  <table className="w-full text-sm">
                    <thead className="bg-[#F9F8F6] border-b border-stone-alt text-xs font-semibold text-neutral-600">
                      <tr>
                        <th className="text-left p-3">#</th>
                        <th className="text-left p-3">Amount</th>
                        <th className="text-left p-3">Direction</th>
                        <th className="text-left p-3">Due Date</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-right p-3 pr-6">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRows.map((p, idx) => (
                        <tr key={p.id} className="border-t border-stone-alt hover:bg-[#FDFDFD]">
                          <td className="p-3 marker-num font-semibold text-charcoal">#{idx + 1}</td>
                          <td className="p-3 marker-num font-semibold text-charcoal">{fmt(p.amount)}</td>
                          <td className="p-3 text-xs text-neutral-600">
                            {p.direction === "received_from_client" ? (
                              <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                                From Client
                              </span>
                            ) : (
                              <span className="text-blue-700 font-medium bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                To Contractor
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-neutral-600 text-xs font-medium">
                            {p.due_date?.slice(0, 10) || "—"}
                          </td>
                          <td className="p-3">
                            <StatusBadge status={p.status} />
                          </td>
                          <td className="p-3 text-right pr-6 whitespace-nowrap">
                            {p.status !== "Paid" && (
                              <button
                                onClick={() => mark(p.id)}
                                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 mr-2 rounded-sm font-medium"
                                data-testid={`pay-mark-${p.id}`}
                              >
                                Mark Paid
                              </button>
                            )}
                            <button
                              onClick={() => del(p.id)}
                              className="text-xs border border-stone-alt px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-sm font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredRows.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-neutral-500">
                            No {activeTab === "client" ? "client" : "contractor"} installments scheduled.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Tabs>
            </div>
          </>
        )}
        {!projectId && <div className="bg-white border border-stone-alt p-8 text-center text-neutral-500">Select a project to view or manage payment installments.</div>}
      </div>

      {/* Custom Payment Schedule Calendar Dialog */}
      <PaymentCalendar
        open={calendarOpen}
        onOpenChange={setCalendarOpen}
        selectedDate={form.due_date}
        onSelectDate={(newDate) => {
          setForm((prev) => ({ ...prev, due_date: newDate }));
          toast.success(`Selected due date: ${newDate}`);
        }}
        installments={filteredRows}
      />
    </>
  );
}

function QueriesPage() {
  const [rows, setRows] = useState([]);
  const [reply, setReply] = useState({});
  const load = () => api.get("/queries").then(({ data }) => setRows(data));
  useEffect(() => { load(); }, []);
  const sendReply = async (q) => {
    const response = reply[q.id] || "";
    await api.post(`/queries/${q.id}/reply`, { response, resolve: true });
    toast.success("Resolved"); setReply({ ...reply, [q.id]: "" }); load();
  };
  return (
    <>
      <PageHead subtitle="Queries" title="Support Threads" />
      <div className="p-6 md:p-10 space-y-4">
        {rows.map((q) => (
          <div key={q.id} className="bg-white border border-stone-alt p-5" data-testid={`query-${q.id}`}>
            <div className="flex items-center justify-between">
              <div className="font-heading text-lg tracking-tight">{q.subject}</div>
              <StatusBadge status={q.status} />
            </div>
            <div className="text-xs text-neutral-500 mt-1">Raised by {q.raised_by_name} ({q.raised_by_role})</div>
            <div className="text-sm mt-3 text-neutral-700">{q.message}</div>
            {q.response && <div className="text-sm mt-3 border-l-2 border-terracotta pl-3 text-neutral-700"><span className="label-caps text-terracotta">Reply</span><div className="mt-1">{q.response}</div></div>}
            {q.status === "Open" && (
              <div className="mt-4 flex gap-2">
                <Input value={reply[q.id] || ""} onChange={(e) => setReply({ ...reply, [q.id]: e.target.value })} placeholder="Type reply and resolve..." />
                <button onClick={() => sendReply(q)} className="btn-terra"><Send size={14} /> Reply & Resolve</button>
              </div>
            )}
          </div>
        ))}
        {rows.length === 0 && <div className="text-sm text-neutral-500">No queries.</div>}
      </div>
    </>
  );
}

function CMSPage() {
  const [hero, setHero] = useState({ headline: "", subheadline: "", background_image: "" });
  const [signature, setSignature] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [sp, setSp] = useState({ title: "", client_name: "", contractor_name: "", floors: "", dimensions: "", location: "", description: "", image_url: "" });
  const [tm, setTm] = useState({ name: "", location: "", quote: "", image_url: "" });
  const load = async () => {
    setHero(await api.get("/cms/hero").then(r => r.data));
    setSignature(await api.get("/cms/signature-projects").then(r => r.data));
    setTestimonials(await api.get("/cms/testimonials").then(r => r.data));
  };
  useEffect(() => { load(); }, []);
  const saveHero = async () => { await api.put("/cms/hero", hero); toast.success("Hero updated"); };
  const addSig = async () => { await api.post("/cms/signature-projects", sp); setSp({ title: "", client_name: "", contractor_name: "", floors: "", dimensions: "", location: "", description: "", image_url: "" }); load(); };
  const delSig = async (id) => { await api.delete(`/cms/signature-projects/${id}`); load(); };
  const addTm = async () => { await api.post("/cms/testimonials", tm); setTm({ name: "", location: "", quote: "", image_url: "" }); load(); };
  const delTm = async (id) => { await api.delete(`/cms/testimonials/${id}`); load(); };
  return (
    <>
      <PageHead subtitle="Website" title="Content Management" />
      <div className="p-6 md:p-10 space-y-10">
        <Section title="Hero">
          <div className="grid md:grid-cols-2 gap-4">
            <F label="Headline"><Input data-testid="cms-hero-headline" value={hero.headline} onChange={(e) => setHero({ ...hero, headline: e.target.value })} /></F>
            <F label="Background Image URL"><Input data-testid="cms-hero-background" value={hero.background_image} onChange={(e) => setHero({ ...hero, background_image: e.target.value })} /></F>
            <div className="md:col-span-2"><F label="Subheadline"><Textarea data-testid="cms-hero-subheadline" value={hero.subheadline} onChange={(e) => setHero({ ...hero, subheadline: e.target.value })} /></F></div>
          </div>
          <button onClick={saveHero} className="btn-terra mt-4" data-testid="save-hero">Save Hero</button>
        </Section>

        <Section title="Signature Projects">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <F label="Title"><Input value={sp.title} onChange={(e) => setSp({ ...sp, title: e.target.value })} /></F>
            <F label="Location"><Input value={sp.location} onChange={(e) => setSp({ ...sp, location: e.target.value })} /></F>
            <F label="Client Name"><Input value={sp.client_name} onChange={(e) => setSp({ ...sp, client_name: e.target.value })} /></F>
            <F label="Contractor Name"><Input value={sp.contractor_name} onChange={(e) => setSp({ ...sp, contractor_name: e.target.value })} /></F>
            <F label="Floors"><Input value={sp.floors} onChange={(e) => setSp({ ...sp, floors: e.target.value })} /></F>
            <F label="Dimensions"><Input value={sp.dimensions} onChange={(e) => setSp({ ...sp, dimensions: e.target.value })} /></F>
            <div className="md:col-span-2"><F label="Cover Image URL"><Input value={sp.image_url} onChange={(e) => setSp({ ...sp, image_url: e.target.value })} /></F></div>
            <div className="md:col-span-2"><F label="Description"><Textarea value={sp.description} onChange={(e) => setSp({ ...sp, description: e.target.value })} /></F></div>
          </div>
          <button onClick={addSig} className="btn-terra" data-testid="add-signature"><Plus size={14} /> Add Signature Project</button>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {signature.map((s) => (
              <div key={s.id} className="border border-stone-alt bg-white overflow-hidden">
                {s.image_url && <img src={s.image_url} alt={s.title} className="w-full aspect-[16/10] object-cover" />}
                <div className="p-4"><div className="font-heading">{s.title}</div><div className="text-xs text-neutral-500">{s.location}</div><button onClick={() => delSig(s.id)} className="text-xs text-red-600 mt-2">Delete</button></div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Testimonials">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <F label="Name"><Input value={tm.name} onChange={(e) => setTm({ ...tm, name: e.target.value })} /></F>
            <F label="Location"><Input value={tm.location} onChange={(e) => setTm({ ...tm, location: e.target.value })} /></F>
            <div className="md:col-span-2"><F label="Quote"><Textarea value={tm.quote} onChange={(e) => setTm({ ...tm, quote: e.target.value })} /></F></div>
          </div>
          <button onClick={addTm} className="btn-terra" data-testid="add-testimonial"><Plus size={14} /> Add Testimonial</button>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {testimonials.map((t) => (
              <div key={t.id} className="border border-stone-alt bg-white p-4">
                <div className="text-sm italic">"{t.quote}"</div>
                <div className="text-xs text-neutral-500 mt-2">{t.name} — {t.location}</div>
                <button onClick={() => delTm(t.id)} className="text-xs text-red-600 mt-2">Delete</button>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}

const F = ({ label, children }) => (<label className="block"><div className="label-caps mb-2">{label}</div>{children}</label>);
const Section = ({ title, children }) => (
  <div className="bg-white border border-stone-alt p-6 md:p-8">
    <div className="font-heading text-2xl tracking-tight mb-6">{title}</div>
    {children}
  </div>
);

function ShowcaseProjectsPage() {
  const [items, setItems] = useState([]);
  const [signatureItems, setSignatureItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editingSignature, setEditingSignature] = useState(null);
  const [selectedShowcaseId, setSelectedShowcaseId] = useState("");
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "Residential Villa",
    location: "",
    floors: "",
    dimensions: "",
    description: "",
    overview: "",
    image_url: "",
    featuresStr: "",
  });

  const [sigForm, setSigForm] = useState({
    title: "",
    category: "Residential Villa",
    location: "",
    floors: "",
    dimensions: "",
    description: "",
    overview: "",
    image_url: "",
    featuresStr: "",
  });

  const load = useCallback(() => {
    api.get("/cms/showcase-projects").then(({ data }) => setItems(data)).catch(() => {});
    api.get("/cms/signature-projects").then(({ data }) => setSignatureItems(data)).catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleFileUpload = async (e, setFormTarget) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post("/storage/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const fullUrl = data.url.startsWith("http") ? data.url : `${window.location.origin}${data.url}`;
      setFormTarget((prev) => ({ ...prev, image_url: fullUrl }));
      toast.success("Photo uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const saveShowcase = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Enter project title");

    const payload = {
      title: form.title.trim(),
      category: form.category,
      location: form.location.trim(),
      floors: form.floors.trim(),
      dimensions: form.dimensions.trim(),
      description: form.description.trim(),
      overview: form.overview.trim(),
      image_url: form.image_url.trim(),
      features: form.featuresStr.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (editingItem) {
        await api.put(`/cms/showcase-projects/${editingItem.id}`, payload);
        toast.success("Showcase project updated");
      } else {
        await api.post("/cms/showcase-projects", payload);
        toast.success("Showcase project added");
      }
      setEditingItem(null);
      setForm({
        title: "",
        category: "Residential Villa",
        location: "",
        floors: "",
        dimensions: "",
        description: "",
        overview: "",
        image_url: "",
        featuresStr: "",
      });
      load();
    } catch (err) {
      toast.error("Failed to save showcase project");
    }
  };

  const saveSignature = async (e) => {
    e.preventDefault();
    if (!sigForm.title.trim()) return toast.error("Enter signature project title");

    const payload = {
      title: sigForm.title.trim(),
      category: sigForm.category,
      location: sigForm.location.trim(),
      floors: sigForm.floors.trim(),
      dimensions: sigForm.dimensions.trim(),
      description: sigForm.description.trim(),
      overview: sigForm.overview.trim(),
      image_url: sigForm.image_url.trim(),
      features: sigForm.featuresStr.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (editingSignature) {
        await api.put(`/cms/signature-projects/${editingSignature.id}`, payload);
        toast.success("Signature project updated");
      } else {
        await api.post("/cms/signature-projects", payload);
        toast.success("Signature project added");
      }
      setEditingSignature(null);
      setSigForm({
        title: "",
        category: "Residential Villa",
        location: "",
        floors: "",
        dimensions: "",
        description: "",
        overview: "",
        image_url: "",
        featuresStr: "",
      });
      load();
    } catch (err) {
      toast.error("Failed to save signature project");
    }
  };

  const importFromShowcase = async () => {
    if (!selectedShowcaseId) return toast.error("Please select a showcase project from the list first");
    try {
      await api.post("/cms/signature-projects/select-from-showcase", { showcase_id: selectedShowcaseId });
      toast.success("Added selected project to Signature Masterworks!");
      setSelectedShowcaseId("");
      load();
    } catch (err) {
      toast.error("Failed to import showcase project");
    }
  };

  const delShowcase = async (id) => {
    if (!confirm("Are you sure you want to delete this showcase project?")) return;
    try {
      await api.delete(`/cms/showcase-projects/${id}`);
      toast.success("Project deleted");
      load();
    } catch (err) {
      toast.error("Failed to delete project");
    }
  };

  const delSignature = async (id) => {
    if (!confirm("Are you sure you want to remove this signature masterwork?")) return;
    try {
      await api.delete(`/cms/signature-projects/${id}`);
      toast.success("Signature masterwork removed");
      load();
    } catch (err) {
      toast.error("Failed to delete signature masterwork");
    }
  };

  const startEditShowcase = (p) => {
    setEditingItem(p);
    setForm({
      title: p.title || "",
      category: p.category || "Residential Villa",
      location: p.location || "",
      floors: p.floors || "",
      dimensions: p.dimensions || "",
      description: p.description || "",
      overview: p.overview || "",
      image_url: p.image_url || "",
      featuresStr: Array.isArray(p.features) ? p.features.join(", ") : "",
    });
  };

  const startEditSignature = (p) => {
    setEditingSignature(p);
    setSigForm({
      title: p.title || "",
      category: p.category || "Residential Villa",
      location: p.location || "",
      floors: p.floors || "",
      dimensions: p.dimensions || "",
      description: p.description || "",
      overview: p.overview || "",
      image_url: p.image_url || "",
      featuresStr: Array.isArray(p.features) ? p.features.join(", ") : "",
    });
  };

  return (
    <>
      <PageHead subtitle="CMS" title="Showcase & Signature Projects Management" />
      <div className="p-6 md:p-10">
        <Tabs defaultValue="signature" className="w-full space-y-6">
          <TabsList className="bg-[#EAE7DF] border border-stone-alt p-1 rounded-sm">
            <TabsTrigger value="signature" className="data-[state=active]:bg-white data-[state=active]:text-charcoal px-5 py-2 font-medium text-xs">
              Signature Masterworks (Homepage)
            </TabsTrigger>
            <TabsTrigger value="showcase" className="data-[state=active]:bg-white data-[state=active]:text-charcoal px-5 py-2 font-medium text-xs">
              Showcase Projects (Portfolio Page)
            </TabsTrigger>
          </TabsList>

          {/* SIGNATURE MASTERWORKS TAB */}
          <TabsContent value="signature" className="space-y-8">
            {/* Quick Import From Showcase Projects Section */}
            <Section title="Select From Recent Showcase Projects">
              <div className="bg-[#F9F8F6] p-6 border border-stone-alt rounded-sm space-y-4">
                <p className="text-xs text-neutral-600">
                  Quickly select any existing Showcase Project to highlight as a <strong>Signature Masterwork</strong> on the Public Homepage.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <Select value={selectedShowcaseId} onValueChange={(val) => setSelectedShowcaseId(val)}>
                    <SelectTrigger className="w-full sm:w-96 bg-white"><SelectValue placeholder="-- Select Project from Showcase --" /></SelectTrigger>
                    <SelectContent>
                      {items.map((sp) => (
                        <SelectItem key={sp.id} value={sp.id}>
                          {sp.title} ({sp.category} - {sp.location || "Indore"})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <button
                    onClick={importFromShowcase}
                    type="button"
                    className="btn-terra whitespace-nowrap justify-center"
                    disabled={!selectedShowcaseId}
                  >
                    <Sparkles size={14} /> Add to Signature Masterworks
                  </button>
                </div>
              </div>
            </Section>

            {/* Custom Signature Form */}
            <Section title={editingSignature ? "Edit Signature Masterwork" : "Upload / Add Custom Signature Masterwork"}>
              <form onSubmit={saveSignature} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <F label="Project Title *">
                    <Input value={sigForm.title} onChange={(e) => setSigForm({ ...sigForm, title: e.target.value })} placeholder="e.g. Aasa Residence" required />
                  </F>
                  <F label="Category / Type">
                    <Select value={sigForm.category} onValueChange={(val) => setSigForm({ ...sigForm, category: val })}>
                      <SelectTrigger className="w-full bg-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Residential Villa">Residential Villa</SelectItem>
                        <SelectItem value="Commercial Hub">Commercial Hub</SelectItem>
                        <SelectItem value="Interior Architecture">Interior Architecture</SelectItem>
                        <SelectItem value="Institutional">Institutional</SelectItem>
                        <SelectItem value="Luxury Apartment">Luxury Apartment</SelectItem>
                      </SelectContent>
                    </Select>
                  </F>
                  <F label="Location">
                    <Input value={sigForm.location} onChange={(e) => setSigForm({ ...sigForm, location: e.target.value })} placeholder="e.g. Vijay Nagar, Indore" />
                  </F>
                  <F label="Floors">
                    <Input value={sigForm.floors} onChange={(e) => setSigForm({ ...sigForm, floors: e.target.value })} placeholder="e.g. G+3" />
                  </F>
                  <F label="Plot Dimensions">
                    <Input value={sigForm.dimensions} onChange={(e) => setSigForm({ ...sigForm, dimensions: e.target.value })} placeholder="e.g. 48×72 ft" />
                  </F>
                  <F label="Project Image / Photo">
                    <div className="flex gap-2 items-center">
                      <Input value={sigForm.image_url} onChange={(e) => setSigForm({ ...sigForm, image_url: e.target.value })} placeholder="Image URL or upload file" className="flex-1 text-xs" />
                      <label className="btn-terra px-3 h-10 text-xs cursor-pointer inline-flex items-center gap-1 justify-center whitespace-nowrap">
                        <Upload size={14} /> {uploading ? "Uploading..." : "Upload Photo"}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setSigForm)} disabled={uploading} />
                      </label>
                    </div>
                  </F>
                </div>

                {sigForm.image_url && (
                  <div className="w-44 h-28 border border-stone-alt rounded overflow-hidden bg-stone-100 relative">
                    <img src={sigForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <F label="Short Summary / Description">
                  <Input value={sigForm.description} onChange={(e) => setSigForm({ ...sigForm, description: e.target.value })} placeholder="Brief summary for homepage cards..." />
                </F>

                <div className="flex gap-2 pt-2">
                  <button type="submit" className="btn-terra">
                    <Plus size={14} /> {editingSignature ? "Update Signature Masterwork" : "Add Signature Masterwork"}
                  </button>
                  {editingSignature && (
                    <button type="button" onClick={() => setEditingSignature(null)} className="px-4 py-2 border border-stone-alt text-xs font-medium rounded-sm hover:bg-stone-100">
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </Section>

            {/* Current Signature Masterworks List */}
            <Section title="Active Signature Masterworks (Displayed on Public Homepage)">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {signatureItems.map((p) => (
                  <div key={p.id} className="border border-stone-alt bg-white rounded-sm overflow-hidden flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="aspect-[16/10] overflow-hidden bg-stone-100 relative">
                        <img src={p.image_url || "https://images.pexels.com/photos/9458996/pexels-photo-9458996.jpeg"} alt={p.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-terracotta text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                          {p.category}
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="font-heading text-xl font-semibold text-charcoal">{p.title}</div>
                        <div className="text-xs text-terracotta font-medium">{p.location}</div>
                        <div className="text-xs text-neutral-500 marker-num font-mono">{p.floors} · {p.dimensions}</div>
                      </div>
                    </div>

                    <div className="p-4 border-t border-stone-alt flex justify-end gap-2 bg-[#F9F8F6]">
                      <button onClick={() => startEditSignature(p)} className="px-3 py-1.5 bg-[#2B3A41] text-white text-xs font-medium rounded-sm hover:bg-black">
                        Edit
                      </button>
                      <button onClick={() => delSignature(p.id)} className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-sm hover:bg-red-700">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </TabsContent>

          {/* SHOWCASE PROJECTS TAB */}
          <TabsContent value="showcase" className="space-y-8">
            <Section title={editingItem ? "Edit Showcase Project" : "Add New Showcase Project"}>
              <form onSubmit={saveShowcase} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <F label="Project Title *">
                    <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Aasa Residence" required />
                  </F>
                  <F label="Category / Type">
                    <Select value={form.category} onValueChange={(val) => setForm({ ...form, category: val })}>
                      <SelectTrigger className="w-full bg-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Residential Villa">Residential Villa</SelectItem>
                        <SelectItem value="Commercial Hub">Commercial Hub</SelectItem>
                        <SelectItem value="Interior Architecture">Interior Architecture</SelectItem>
                        <SelectItem value="Institutional">Institutional</SelectItem>
                        <SelectItem value="Luxury Apartment">Luxury Apartment</SelectItem>
                      </SelectContent>
                    </Select>
                  </F>
                  <F label="Location">
                    <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Vijay Nagar, Indore" />
                  </F>
                  <F label="Floors">
                    <Input value={form.floors} onChange={(e) => setForm({ ...form, floors: e.target.value })} placeholder="e.g. G+3" />
                  </F>
                  <F label="Plot Dimensions">
                    <Input value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} placeholder="e.g. 48×72 ft" />
                  </F>
                  <F label="Project Image / Photo">
                    <div className="flex gap-2 items-center">
                      <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="Image URL or upload file" className="flex-1 text-xs" />
                      <label className="btn-terra px-3 h-10 text-xs cursor-pointer inline-flex items-center gap-1 justify-center whitespace-nowrap">
                        <Upload size={14} /> {uploading ? "Uploading..." : "Upload Photo"}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setForm)} disabled={uploading} />
                      </label>
                    </div>
                  </F>
                </div>

                {form.image_url && (
                  <div className="w-44 h-28 border border-stone-alt rounded overflow-hidden bg-stone-100 relative">
                    <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <F label="Short Summary / Description">
                  <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief summary displayed on cards..." />
                </F>

                <F label="Detailed Architectural Overview / Brief">
                  <Textarea value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })} placeholder="Full design philosophy and structural details for brief modal..." rows={3} />
                </F>

                <F label="Key Structural Features & Highlights (comma separated)">
                  <Input value={form.featuresStr} onChange={(e) => setForm({ ...form, featuresStr: e.target.value })} placeholder="e.g. Solar Roof Integration, Italian Marble, Smart Home" />
                </F>

                <div className="flex gap-2 pt-2">
                  <button type="submit" className="btn-terra">
                    <Plus size={14} /> {editingItem ? "Update Project" : "Add Project"}
                  </button>
                  {editingItem && (
                    <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 border border-stone-alt text-xs font-medium rounded-sm hover:bg-stone-100">
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </Section>

            <Section title="Current Showcase Projects (Portfolio Page)">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((p) => (
                  <div key={p.id} className="border border-stone-alt bg-white rounded-sm overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="aspect-[16/10] overflow-hidden bg-stone-100 relative">
                        <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-charcoal/90 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                          {p.category}
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="font-heading text-xl font-semibold text-charcoal">{p.title}</div>
                        <div className="text-xs text-terracotta font-medium">{p.location}</div>
                        <div className="text-xs text-neutral-500 marker-num font-mono">{p.floors} · {p.dimensions}</div>
                        <p className="text-xs text-neutral-600 line-clamp-2 mt-1">{p.description || p.overview}</p>
                      </div>
                    </div>

                    <div className="p-4 border-t border-stone-alt flex justify-end gap-2 bg-[#F9F8F6]">
                      <button onClick={() => startEditShowcase(p)} className="px-3 py-1.5 bg-[#2B3A41] text-white text-xs font-medium rounded-sm hover:bg-black">
                        Edit
                      </button>
                      <button onClick={() => delShowcase(p.id)} className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-sm hover:bg-red-700">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
