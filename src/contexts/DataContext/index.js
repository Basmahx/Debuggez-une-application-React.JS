import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null);

  const getData = useCallback(async () => {
    try {
      const fetchedData = await api.loadData();
      setData(fetchedData);
    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    if (!data) {
      getData();
    }
  }, [data, getData]);

  // compute last event only when data changes
  useEffect(() => {
    if (data && data.events) {
      const sortedEvents = data.events.sort(
        (evtA, evtB) => new Date(evtA.date) - new Date(evtB.date)
      );
      setLast(sortedEvents[sortedEvents.length - 1]);
    }
  }, [data]);

  // used useMemo to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      data,
      error,
      last,
    }),
    [data, error, last]
  );

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;
