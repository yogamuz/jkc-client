import { useState, useCallback } from "react";
import * as auditLogService from "../services/auditLogService";

const useAuditLog = () => {
  const [logs, setLogs] = useState([]);
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

  const fetchLogs = useCallback(
    (filters = {}) =>
      run(async () => {
        const res = await auditLogService.getAuditLogs(filters);
        setLogs(res.data);
        return res.data;
      }),
    [],
  );

  return { logs, loading, error, fetchLogs };
};

export default useAuditLog;