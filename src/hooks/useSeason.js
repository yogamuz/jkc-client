import { useState, useCallback } from "react";
import * as seasonService from "../services/seasonService";

const SEASON_CACHE_KEY = "jokicalm_seasons_cache";

const readSeasonCache = () => {
  try {
    const raw = localStorage.getItem(SEASON_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeSeasonCache = (data) => {
  try {
    localStorage.setItem(SEASON_CACHE_KEY, JSON.stringify(data));
  } catch {
    // storage penuh / disabled, abaikan saja
  }
};

const useSeason = () => {
  const [seasons, setSeasons] = useState(() => readSeasonCache() || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = async (fn) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchAll = useCallback(
    () =>
      run(async () => {
        const res = await seasonService.getAllSeasons();
        setSeasons(res.data);
        writeSeasonCache(res.data);
        return res.data;
      }),
    [],
  );

  const create = (body) =>
    run(async () => {
      const r = await seasonService.createSeason(body);
      await fetchAll();
      return r;
    });
  const update = (id, b) =>
    run(async () => {
      const r = await seasonService.updateSeason(id, b);
      await fetchAll();
      return r;
    });
  const remove = (id) =>
    run(async () => {
      const r = await seasonService.deleteSeason(id);
      await fetchAll();
      return r;
    });
  const addCol = (id, b) =>
    run(async () => {
      const r = await seasonService.addColumn(id, b);
      await fetchAll();
      return r;
    });
  const removeCol = (id, k) =>
    run(async () => {
      const r = await seasonService.removeColumn(id, k);
      await fetchAll();
      return r;
    });
  const updateRates = (id, b) =>
    run(async () => {
      const r = await seasonService.updateRates(id, b);
      await fetchAll();
      return r;
    });

  return {
    seasons,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove,
    addCol,
    removeCol,
    updateRates,
  };
};

export default useSeason;
