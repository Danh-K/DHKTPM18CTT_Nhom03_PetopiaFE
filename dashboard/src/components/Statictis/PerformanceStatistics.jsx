"use client";

import { useEffect, useMemo, useState } from "react";
import {
  HiChartBar,
  HiCheckCircle,
  HiClock,
  HiExclamationCircle,
  HiLightningBolt,
  HiRefresh,
  HiXCircle,
} from "react-icons/hi";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import performanceStatisticsService from "../../api/performanceStatisticsService";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const formatNumber = (num) =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(
    Number.isFinite(num) ? num : 0
  );

const formatMs = (ms) =>
  `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 3 }).format(
    Number.isFinite(ms) ? ms : 0
  )} ms`;

const formatPercent = (value, digits = 1) =>
  `${new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number.isFinite(value) ? value : 0)}%`;

const TabButton = ({ active, onClick, label, description }) => (
  <button
    onClick={onClick}
    className={`flex-1 text-left border rounded-xl px-4 py-3 transition ${
      active
        ? "bg-sky-600/20 border-sky-500 text-sky-100 shadow-md shadow-sky-900/40"
        : "bg-slate-900/60 border-slate-700 text-slate-200 hover:border-slate-500"
    }`}
  >
    <p className="font-semibold">{label}</p>
    <p className="text-xs text-slate-300 mt-1">{description}</p>
  </button>
);

const Pill = ({ children, color = "slate" }) => {
  const bg =
    color === "green"
      ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/40"
      : color === "amber"
      ? "bg-amber-500/15 text-amber-200 border-amber-400/40"
      : color === "rose"
      ? "bg-rose-500/15 text-rose-200 border-rose-400/40"
      : "bg-slate-500/15 text-slate-200 border-slate-400/30";
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${bg}`}
    >
      {children}
    </span>
  );
};

const Badge = ({ children }) => (
  <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-800 text-slate-100 border border-slate-700 text-xs">
    {children}
  </span>
);

const EmptyState = ({ message }) => (
  <div className="py-10 flex flex-col items-center gap-2 text-slate-300">
    <HiExclamationCircle className="h-8 w-8 text-amber-300" />
    <p className="text-sm">{message}</p>
  </div>
);

export default function PerformanceStatistics() {
  const [activeTab, setActiveTab] = useState("system");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [systemOverview, setSystemOverview] = useState(null);
  const [endpoints, setEndpoints] = useState([]);
  const [httpMetrics, setHttpMetrics] = useState([]);
  const [recentErrors, setRecentErrors] = useState([]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [uriFilter, setUriFilter] = useState("");

  const handleRefresh = () => setRefreshTick((tick) => tick + 1);

  useEffect(() => {
    if (!autoRefresh) return undefined;
    const id = setInterval(() => {
      setRefreshTick((tick) => tick + 1);
    }, 5000);
    return () => clearInterval(id);
  }, [autoRefresh]);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (activeTab === "system") {
          const data = await performanceStatisticsService.getSystemPerformance();
          if (!cancelled) setSystemOverview(data);
        } else if (activeTab === "endpoints") {
          const data = await performanceStatisticsService.getEndpointsPerformance();
          if (!cancelled) {
            const sorted =
              Array.isArray(data) && data.length
                ? [...data].sort(
                    (a, b) =>
                      (b?.avgResponseTimeMs || 0) -
                      (a?.avgResponseTimeMs || 0)
                  )
                : [];
            setEndpoints(sorted);
          }
        } else if (activeTab === "metrics") {
          const data =
            (await performanceStatisticsService.getHttpMetrics()) || [];
          if (!cancelled) setHttpMetrics(Array.isArray(data) ? data : []);
        } else if (activeTab === "errors") {
          const data = await performanceStatisticsService.getRecentErrors(20);
          if (!cancelled) setRecentErrors(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.message || "Có lỗi xảy ra khi tải dữ liệu hiệu suất."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [activeTab, refreshTick]);

  // ======= TÍNH TOÁN SỐ LIỆU CHO TAB SYSTEM =======
  const successRequests = systemOverview?.successRequests || 0;
  const clientErrors = systemOverview?.clientErrors || 0;
  const serverErrors = systemOverview?.serverErrors || 0;
  const totalRequests = successRequests + clientErrors + serverErrors;

  const successRate =
    totalRequests > 0 ? (successRequests / totalRequests) * 100 : 0;
  const clientErrorRate =
    totalRequests > 0 ? (clientErrors / totalRequests) * 100 : 0;
  const serverErrorRate =
    totalRequests > 0 ? (serverErrors / totalRequests) * 100 : 0;

  const totalErrorRequests = clientErrors + serverErrors;

  const memoryUsagePercent = useMemo(() => {
    if (!systemOverview?.memoryMaxMb) return 0;
    return (systemOverview.memoryUsedMb / systemOverview.memoryMaxMb) * 100;
  }, [systemOverview]);

  const statusChartData = useMemo(
    () => [
      { name: "Success", value: successRequests },
      { name: "4xx", value: clientErrors },
      { name: "5xx", value: serverErrors },
    ],
    [successRequests, clientErrors, serverErrors]
  );

  const filteredHttpMetrics = useMemo(() => {
    return httpMetrics.filter((row) => {
      if (
        statusFilter !== "all" &&
        String(row.status ?? "") !== String(statusFilter)
      ) {
        return false;
      }
      if (
        methodFilter !== "all" &&
        row.method &&
        row.method.toUpperCase() !== methodFilter.toUpperCase()
      ) {
        return false;
      }
      if (uriFilter.trim()) {
        const q = uriFilter.trim().toLowerCase();
        const uri = (row.uri || "").toLowerCase();
        if (!uri.includes(q)) return false;
      }
      return true;
    });
  }, [httpMetrics, statusFilter, methodFilter, uriFilter]);

  const renderLoading = () => (
    <div className="py-10 flex flex-col items-center gap-3 text-slate-200">
      <div className="w-10 h-10 border-4 border-sky-500/30 border-t-sky-400 rounded-full animate-spin" />
      <p className="text-sm">Đang tải dữ liệu...</p>
    </div>
  );

  const renderError = () => (
    <div className="py-8 px-4 bg-rose-500/10 border border-rose-400/50 rounded-xl text-rose-100 flex items-start gap-3">
      <HiXCircle className="h-6 w-6 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold">Không thể tải dữ liệu</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-rose-950 font-semibold text-sm"
        >
          <HiRefresh className="h-4 w-4" />
          Thử tải lại
        </button>
      </div>
    </div>
  );

  // ====== UI TAB SYSTEM ======
  const renderSystem = () => (
    <div className="space-y-5">
      {/* Hàng 1: 4 thẻ gauge + RAM */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <RateCard
          title="Tỉ lệ thành công"
          rate={successRate}
          detail={`${successRequests} / ${totalRequests} requests`}
          color="green"
        />
        <RateCard
          title="Tỉ lệ lỗi client (4xx)"
          rate={clientErrorRate}
          detail={`${clientErrors} requests`}
          color="amber"
        />
        <RateCard
          title="Tỉ lệ lỗi server (5xx)"
          rate={serverErrorRate}
          detail={`${serverErrors} requests`}
          color="rose"
        />
        <RateCard
          title="Sử dụng bộ nhớ"
          rate={memoryUsagePercent}
          detail={`${formatNumber(
            systemOverview?.memoryUsedMb
          )} / ${formatNumber(systemOverview?.memoryMaxMb)} MB`}
          color="sky"
        />
      </div>

      {/* Hàng 2: Biểu đồ + các card tổng quan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart bên trái (chiếm 2/3) */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg shadow-slate-950/50"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Phân bố requests
              </p>
              <p className="text-lg font-semibold text-slate-50">
                Success vs 4xx vs 5xx
              </p>
            </div>
            <Badge>
              <HiLightningBolt className="h-4 w-4 mr-1" />
              Snapshot hiện tại
            </Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData} barSize={42}>
                <defs>
                  <linearGradient
                    id="successGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>

                  <linearGradient
                    id="clientErrorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>

                  <linearGradient
                    id="serverErrorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#fb7185" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1f2937"
                  opacity={0.4}
                />

                <XAxis
                  dataKey="name"
                  stroke="#e2e8f0"
                  tick={{ fill: "#e2e8f0", fontWeight: 500 }}
                />

                <YAxis
                  stroke="#e2e8f0"
                  tick={{ fill: "#e2e8f0" }}
                  allowDecimals={false}
                />

                <Tooltip
                  cursor={{ fill: "#1e293b", opacity: 0.3 }}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    color: "#f1f5f9",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                />

                <Bar
                  dataKey="value"
                  shape={(props) => {
                    const { x, y, width, height, payload } = props;
                    let fillColor = "url(#successGradient)";

                    if (payload.name === "4xx")
                      fillColor = "url(#clientErrorGradient)";
                    if (payload.name === "5xx")
                      fillColor = "url(#serverErrorGradient)";

                    return (
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill={fillColor}
                        rx={8}
                        ry={8}
                      />
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Cột card bên phải */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          <MetricCard
            label="Tổng requests"
            value={totalRequests}
            icon={<HiChartBar className="h-5 w-5 text-sky-300" />}
          />
          <MetricCard
            label="Thời gian phản hồi trung bình"
            value={formatMs(systemOverview?.avgResponseTimeMs)}
            icon={<HiClock className="h-5 w-5 text-sky-300" />}
          />
          <MetricCard
            label="Tổng số requests lỗi (4xx + 5xx)"
            value={totalErrorRequests}
            icon={<HiXCircle className="h-5 w-5 text-rose-300" />}
          />
        </motion.div>
      </div>
    </div>
  );

  const renderEndpoints = () => (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-lg shadow-slate-950/50 overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-slate-800">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Endpoint performance
          </p>
          <p className="text-lg font-semibold text-slate-50">
            Sắp xếp theo Avg Response Time (desc)
          </p>
        </div>
        <Pill color="amber">{formatNumber(endpoints.length)} endpoints</Pill>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800/80 text-slate-200">
            <tr>
              <th className="px-4 py-3 text-left">Method</th>
              <th className="px-4 py-3 text-left">URI</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Avg (ms)</th>
              <th className="px-4 py-3 text-right">Max (ms)</th>
              <th className="px-4 py-3 text-right">2xx</th>
              <th className="px-4 py-3 text-right">4xx</th>
              <th className="px-4 py-3 text-right">5xx</th>
              <th className="px-4 py-3 text-left">Top exceptions</th>
            </tr>
          </thead>
          <tbody>
            {endpoints.length === 0 && (
              <tr>
                <td colSpan={9}>
                  <EmptyState message="Chưa có dữ liệu endpoint." />
                </td>
              </tr>
            )}
            {endpoints.map((item, idx) => (
              <tr
                key={`${item.method}-${item.uri}-${idx}`}
                className="border-t border-slate-800 hover:bg-slate-800/40 transition"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <Pill color="green">{item.method}</Pill>
                </td>
                <td className="px-4 py-3 text-slate-100">{item.uri}</td>
                <td className="px-4 py-3 text-right">
                  {formatNumber(item.totalRequests)}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatNumber(item.avgResponseTimeMs)}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatNumber(item.maxResponseTimeMs)}
                </td>
                <td className="px-4 py-3 text-right text-emerald-200">
                  {formatNumber(item.successRequests)}
                </td>
                <td className="px-4 py-3 text-right text-amber-200">
                  {formatNumber(item.clientErrorRequests)}
                </td>
                <td className="px-4 py-3 text-right text-rose-200">
                  {formatNumber(item.serverErrorRequests)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(item.topExceptions) &&
                    item.topExceptions.length > 0 ? (
                      item.topExceptions.map((ex, i) => (
                        <Badge key={`${ex}-${i}`}>{ex}</Badge>
                      ))
                    ) : (
                      <span className="text-slate-400 text-xs">Không có</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMetrics = () => (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-lg shadow-slate-950/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex flex-wrap items-center gap-3 justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Raw HTTP metrics
          </p>
          <p className="text-lg font-semibold text-slate-50">
            Lọc theo status / method / uri
          </p>
        </div>
        <Pill>{formatNumber(filteredHttpMetrics.length)} records</Pill>
      </div>

      <div className="px-5 py-4 flex flex-wrap gap-3 border-b border-slate-800 bg-slate-900">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-100 text-sm rounded-lg px-3 py-2"
        >
          <option value="all">Status (tất cả)</option>
          <option value="200">200</option>
          <option value="201">201</option>
          <option value="400">400</option>
          <option value="401">401</option>
          <option value="403">403</option>
          <option value="404">404</option>
          <option value="500">500</option>
          <option value="502">502</option>
          <option value="503">503</option>
        </select>
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-100 text-sm rounded-lg px-3 py-2"
        >
          <option value="all">Method (tất cả)</option>
          {["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input
          value={uriFilter}
          onChange={(e) => setUriFilter(e.target.value)}
          placeholder="/api/pets..."
          className="flex-1 min-w-[220px] bg-slate-800 border border-slate-700 text-slate-100 text-sm rounded-lg px-3 py-2 placeholder:text-slate-500"
        />
        <button
          onClick={() => {
            setStatusFilter("all");
            setMethodFilter("all");
            setUriFilter("");
            handleRefresh();
          }}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-sm hover:border-slate-500"
        >
          Đặt lại
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800/80 text-slate-200">
            <tr>
              <th className="px-4 py-3 text-left">Method</th>
              <th className="px-4 py-3 text-left">URI</th>
              <th className="px-4 py-3 text-right">Status</th>
              <th className="px-4 py-3 text-left">Exception</th>
              <th className="px-4 py-3 text-right">Count</th>
              <th className="px-4 py-3 text-right">Mean (ms)</th>
              <th className="px-4 py-3 text-right">Max (ms)</th>
            </tr>
          </thead>
          <tbody>
            {filteredHttpMetrics.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <EmptyState message="Không có HTTP metrics phù hợp bộ lọc." />
                </td>
              </tr>
            )}
            {filteredHttpMetrics.map((row, idx) => (
              <tr
                key={`${row.method}-${row.uri}-${row.status}-${idx}`}
                className="border-t border-slate-800 hover:bg-slate-800/40 transition"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <Pill color="green">{row.method}</Pill>
                </td>
                <td className="px-4 py-3 text-slate-100">{row.uri}</td>
                <td className="px-4 py-3 text-right text-slate-200">
                  {row.status}
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {row.exception || <span className="text-slate-500">-</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatNumber(row.count)}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatNumber(row.meanMs)}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatNumber(row.maxMs)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderErrors = () => (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-lg shadow-slate-950/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Recent errors (RAM)
          </p>
          <p className="text-lg font-semibold text-slate-50">20 lỗi gần nhất</p>
        </div>

        {/* Cụm Auto-refresh 5s (đã làm lại) */}
        <div className="flex items-center">
          <div className="flex items-center gap-3 bg-slate-900/70 border border-slate-700 rounded-xl px-3 py-2">
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  autoRefresh ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                }`}
              />
              <span className="text-xs font-medium text-slate-100">
                Auto-refresh
              </span>
              <span className="text-[11px] text-slate-400">(5s)</span>
            </div>
            <label className="flex items-center gap-2 text-xs md:text-sm text-slate-200">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="accent-sky-500 h-4 w-4"
              />
              <span>{autoRefresh ? "On" : "Off"}</span>
            </label>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-xs md:text-sm font-medium text-slate-100 border border-slate-600 hover:border-sky-500 hover:bg-slate-800/80 transition"
            >
              <HiRefresh className="h-4 w-4" />
              <span>Làm mới</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800/80 text-slate-200">
            <tr>
              <th className="px-4 py-3 text-left">Thời gian</th>
              <th className="px-4 py-3 text-left">Method</th>
              <th className="px-4 py-3 text-left">Path</th>
              <th className="px-4 py-3 text-left">Query</th>
              <th className="px-4 py-3 text-left">Exception</th>
              <th className="px-4 py-3 text-left">Message</th>
            </tr>
          </thead>
          <tbody>
            {recentErrors.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyState message="Chưa ghi nhận lỗi nào." />
                </td>
              </tr>
            )}
            {recentErrors.map((err, idx) => (
              <tr
                key={`${err.timestamp}-${idx}`}
                className="border-t border-slate-800 hover:bg-slate-800/40 transition"
              >
                <td className="px-4 py-3 whitespace-nowrap text-slate-300">
                  {new Date(err.timestamp).toLocaleString("vi-VN")}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Pill color="rose">{err.method}</Pill>
                </td>
                <td className="px-4 py-3 text-slate-100">{err.path}</td>
                <td className="px-4 py-3 text-slate-300">
                  {err.query || <span className="text-slate-500">-</span>}
                </td>
                <td className="px-4 py-3">
                  <Badge>{err.exceptionClass}</Badge>
                </td>
                <td className="px-4 py-3 text-slate-200">{err.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 px-4 py-6 text-slate-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-900/90 border border-sky-500/20 rounded-2xl px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-2xl shadow-slate-950/70"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <HiChartBar className="h-7 w-7 text-sky-400" />
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Admin Performance
              </h1>
            </div>
            <p className="text-sm text-slate-200">
              Giám sát hệ thống, endpoint, raw HTTP metrics và lỗi gần nhất.
            </p>
          </div>

          {/* Cụm Auto-refresh 5s (đã làm lại) */}
          <div className="flex items-center">
            <div className="flex items-center gap-3 bg-slate-900/70 border border-slate-700 rounded-xl px-3 py-2">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    autoRefresh ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                  }`}
                />
                <span className="text-xs font-medium text-slate-100">
                  Auto-refresh
                </span>
                <span className="text-[11px] text-slate-400">(5s)</span>
              </div>
              <label className="flex items-center gap-2 text-xs md:text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="accent-sky-500 h-4 w-4"
                />
                <span>{autoRefresh ? "On" : "Off"}</span>
              </label>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-xs md:text-sm font-medium text-slate-100 border border-slate-600 hover:border-sky-500 hover:bg-slate-800/80 transition"
              >
                <HiRefresh className="h-4 w-4" />
                <span>Làm mới</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <TabButton
            active={activeTab === "system"}
            onClick={() => setActiveTab("system")}
            label="System"
            description="Tổng quan request, response time, RAM"
          />
          <TabButton
            active={activeTab === "endpoints"}
            onClick={() => setActiveTab("endpoints")}
            label="Endpoints"
            description="Sortable theo Avg Response Time desc"
          />
          <TabButton
            active={activeTab === "metrics"}
            onClick={() => setActiveTab("metrics")}
            label="Raw Metrics"
            description="HTTP metrics lọc theo status/method/uri"
          />
          <TabButton
            active={activeTab === "errors"}
            onClick={() => setActiveTab("errors")}
            label="Errors"
            description="Lỗi gần nhất trong RAM"
          />
        </div>

        {loading && renderLoading()}
        {error && renderError()}
        {!loading && !error && (
          <>
            {activeTab === "system" && renderSystem()}
            {activeTab === "endpoints" && renderEndpoints()}
            {activeTab === "metrics" && renderMetrics()}
            {activeTab === "errors" && renderErrors()}
          </>
        )}
      </div>
    </div>
  );
}

// Card hiển thị tỉ lệ dạng gauge đơn giản
function RateCard({ title, rate, detail, color }) {
  const barColor =
    color === "green"
      ? "from-emerald-400 to-emerald-500"
      : color === "amber"
      ? "from-amber-400 to-amber-500"
      : color === "rose"
      ? "from-rose-400 to-rose-500"
      : "from-sky-400 to-sky-500";

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-md shadow-slate-950/40">
      <p className="text-xs uppercase tracking-wide text-slate-400">
        {title}
      </p>
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-2xl font-bold text-slate-50">
            {formatPercent(rate, 1)}
          </p>
          <p className="text-xs text-slate-300 mt-1">{detail}</p>
        </div>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${barColor}`}
          style={{ width: `${Math.min(rate, 100)}%` }}
        />
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon }) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-md shadow-slate-950/40">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="text-xl font-semibold text-slate-50 mt-1">
          {typeof value === "string" ? value : formatNumber(value)}
        </p>
      </div>
      <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center text-slate-100">
        {icon}
      </div>
    </div>
  );
}
