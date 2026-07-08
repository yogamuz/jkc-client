import { useState, useCallback } from "react";
import * as orderService from "../services/orderService";

const buildOrderCacheKey = (seasonId) => `jokicalm_orders_${seasonId}`;
const DASHBOARD_CACHE_KEY = "jokicalm_dashboard_cache";

const readCache = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeCache = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // abaikan
  }
};

const useOrder = () => {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [workerSummary, setWorkerSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = async (fn) => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = useCallback(
    (seasonId, filters = {}) =>
      run(async () => {
        const res = await orderService.getOrders(seasonId, filters);
        setOrders(res.data);
        writeCache(buildOrderCacheKey(seasonId), res.data);
        return res.data;
      }),
    [],
  );

  const fetchSummary = useCallback(
    (seasonId) =>
      run(async () => {
        const res = await orderService.getSeasonSummary(seasonId);
        setSummary(res.data);
        return res.data;
      }),
    [],
  );

  const fetchDashboard = useCallback(
    () =>
      run(async () => {
        const res = await orderService.getDashboardSummary();
        setDashboard(res.data);
        writeCache(DASHBOARD_CACHE_KEY, res.data);
        return res.data;
      }),
    [],
  );

  const fetchWorkerSummary = useCallback(
    (seasonId) =>
      run(async () => {
        const res = await orderService.getWorkerSummary(seasonId);
        setWorkerSummary(res.data);
        return res.data;
      }),
    [],
  );

  const create = (body) => run(async () => orderService.createOrder(body));
  const update = (id, body) =>
    run(async () => orderService.updateOrder(id, body));
  const remove = (id) => run(async () => orderService.deleteOrder(id));
  const markPaid = (id, name, isPaid) =>
    run(async () => orderService.markWorkerPaid(id, name, isPaid));

  return {
    orders,
    summary,
    dashboard,
    workerSummary,
    loading,
    error,
    fetchOrders,
    fetchSummary,
    fetchDashboard,
    fetchWorkerSummary,
    create,
    update,
    remove,
    markPaid,
    setOrders,
  };
};

export default useOrder;
