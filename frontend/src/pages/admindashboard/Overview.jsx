// src/pages/admindashboard/Overview.jsx
import KPI from "../../components/KPI";
import ActivityTable from "../../components/ActivityTable";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

// ===== MOCK DATA =====
const kpi = {
  totalUsers: {
    value: "12,068",
    foot1: "Artisans: 12,178",
    foot2: "Clients: 10,790",
  },
  activeJobs: {
    value: "214",
    foot1: "Awaiting: 68",
    foot2: "In progress: 146",
  },
  completedJobs: {
    value: "3211",
    foot1: "This week: 204",
    foot2: "This month: 816",
  },
  revenue: {
    value: "12,450,000",
    foot1: "Payments: ₦9.2M",
    foot2: "Service fee: ₦2.65M",
  },
  verification: {
    value: "103",
    foot1: "New docs: 204",
    foot2: "Flagged docs: 12",
  },
  payouts: {
    value: "1,125,000",
    foot1: "Paying today: ₦420K",
    foot2: "Delayed: ₦75K",
  },
};

const lineData = [
  { name: "Jan", clients: 2500, artisans: 1200 },
  { name: "Feb", clients: 4200, artisans: 2200 },
  { name: "Mar", clients: 6200, artisans: 3400 },
  { name: "Apr", clients: 7000, artisans: 3900 },
  { name: "May", clients: 8900, artisans: 6600 },
  { name: "Jun", clients: 7600, artisans: 5200 },
  { name: "Jul", clients: 8100, artisans: 5400 },
  { name: "Aug", clients: 7400, artisans: 5100 },
  { name: "Sep", clients: 7700, artisans: 5300 },
  { name: "Oct", clients: 6900, artisans: 4600 },
  { name: "Nov", clients: 7100, artisans: 4700 },
  { name: "Dec", clients: 7400, artisans: 4900 },
];

const revenuePie = [
  { name: "Artisan Revenue", value: 2900000 },
  { name: "Commission", value: 840000 },
  { name: "Booking Fee", value: 320000 },
];
const PIE_COLORS = ["#2D3BFD", "#F59E0B", "#111827"];

const bookedBar = [
  { name: "Pest Control", value: 890 },
  { name: "Handy", value: 820 },
  { name: "Plumbing", value: 610 },
  { name: "Cleaning", value: 520 },
  { name: "Electrical works", value: 420 },
  { name: "Car wash", value: 310 },
  { name: "Others", value: 220 },
];

const bookingRate = [
  { name: "Successful", value: 385 },
  { name: "Cancelled", value: 52 },
];
const RATE_COLORS = ["#16A34A", "#EF4444"];

const activityRows = [
  {
    id: "1",
    statusColor: "#22C55E",
    activity: "Obong Emma requested a manual payout of ₦12,500",
    time: "26 July, 2:45",
    actions: [
      { label: "Review", tone: "neutral" },
      { label: "Confirm", tone: "primary" },
    ],
  },
  {
    id: "2",
    statusColor: "#F59E0B",
    activity: "New artisan profile submitted for review",
    time: "25 July, 8:00",
    actions: [
      { label: "Review", tone: "neutral" },
      { label: "Confirm", tone: "primary" },
    ],
  },
  {
    id: "3",
    statusColor: "#F59E0B",
    activity: "Femi Rachel requested a change of artisan category",
    time: "25 July, 14:05",
    actions: [
      { label: "Review", tone: "neutral" },
      { label: "Confirm", tone: "primary" },
    ],
  },
  {
    id: "4",
    statusColor: "#F59E0B",
    activity: "Platform update scheduled for broadcast",
    time: "27 July, 8:00",
    actions: [
      { label: "Edit", tone: "neutral" },
      { label: "Confirm", tone: "primary" },
    ],
  },
  {
    id: "5",
    statusColor: "#EF4444",
    activity: "Booking dispute opened between client and artisan",
    time: "25 July, 21:45",
    actions: [
      { label: "Review", tone: "neutral" },
      { label: "Resolve", tone: "danger" },
    ],
  },
];

export default function Overview() {
  return (
    <div className="min-h-[100dvh] w-full min-w-0 bg-gray-50 p-4 md:p-6 lg:px-16 xl:px-24">
      {/* Page title */}
      <section className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight">Hello Admin</h1>
        <p className="mt-1 text-sm text-gray-500">
          10 new artisans are on queue for verification!
        </p>
      </section>

      {/* KPI Grid (6 cards) */}
      <section className="min-w-0 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 [grid-auto-rows:1fr] gap-3 sm:gap-4">
        <div className="h-full min-w-0">
          <KPI
            tone="bg-[#E9F6EF]"
            title="Total Users"
            value={kpi.totalUsers.value}
            foot1={kpi.totalUsers.foot1}
            foot2="681 new users this week"
          />
        </div>
        <div className="h-full min-w-0">
          <KPI
            tone="bg-[#FFF2E2]"
            title="Active Job requests"
            value={kpi.activeJobs.value}
            foot1={kpi.activeJobs.foot1}
            foot2={kpi.activeJobs.foot2}
          />
        </div>
        <div className="h-full min-w-0">
          <KPI
            tone="bg-[#ECEBFF]"
            title="Completed Jobs"
            value={kpi.completedJobs.value}
            foot1={kpi.completedJobs.foot1}
            foot2="5 jobs completed today"
          />
        </div>
        <div className="h-full min-w-0">
          <KPI
            tone="bg-[#FFE7E4]"
            title="Platform Revenue"
            value={`₦${kpi.revenue.value}`}
            foot1={kpi.revenue.foot1}
            foot2="₦600,000 earned this week"
          />
        </div>
        <div className="h-full min-w-0">
          <KPI
            tone="bg-[#E9F5EF]"
            title="Verification Queue"
            value={kpi.verification.value}
            foot1={kpi.verification.foot1}
            foot2="10 new artisans on queue"
          />
        </div>
        <div className="h-full min-w-0">
          <KPI
            tone="bg-[#FFEFD7]"
            title="Pending Payouts"
            value={`₦${kpi.payouts.value}`}
            foot1={kpi.payouts.foot1}
            foot2="17 artisans awaiting payment"
          />
        </div>
      </section>

      {/* Charts row: Line (left) + Donut (right) */}
      <section className="min-w-0 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[13px] font-semibold text-gray-800">
              User Registration Trends
              <div className="text-[12px] font-normal text-gray-500">Users</div>
            </div>
            <button className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600">
              This year
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineData}
                margin={{ left: 8, right: 8, top: 10, bottom: 0 }}
              >
                <CartesianGrid stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend verticalAlign="bottom" height={24} />
                <Line
                  type="monotone"
                  dataKey="clients"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="artisans"
                  stroke="#111827"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[13px] font-semibold text-gray-800">
              Revenue & Payouts
            </div>
            <button className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600">
              This month
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenuePie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {revenuePie.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `₦${Number(v).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 space-y-2 text-sm">
            {revenuePie.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[i] }}
                  />
                  <span>{s.name}</span>
                </div>
                <span className="text-gray-600">
                  ₦{s.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Second charts row: Bar (left) + small Pie (right) */}
      <section className="min-w-0 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[13px] font-semibold text-gray-800">
              Most Booked Category
              <div className="text-[12px] font-normal text-gray-500">Users</div>
            </div>
            <button className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600">
              All-time
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bookedBar}
                margin={{ left: 8, right: 8, top: 10, bottom: 10 }}
              >
                <CartesianGrid stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[13px] font-semibold text-gray-800">
              Booking Rate
            </div>
            <button className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600">
              This month
            </button>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingRate}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                >
                  {bookingRate.map((_, i) => (
                    <Cell key={i} fill={RATE_COLORS[i % RATE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 space-y-2 text-sm">
            {bookingRate.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: RATE_COLORS[i] }}
                  />
                  <span>{s.name} Bookings</span>
                </div>
                <span className="text-gray-600">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activity Table */}
      <div className="min-w-0">
        <ActivityTable rows={activityRows} />
      </div>
    </div>
  );
}
