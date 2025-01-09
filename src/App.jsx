import React, { useState, useEffect } from "react";
const currentYear = new Date().getFullYear();
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const App = () => {
  // State for data, loading, filters, and sorting
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: { start: 1600, end: currentYear },
    revenue: { min: 0, max: Infinity },
    netIncome: { min: 0, max: Infinity },
  });
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [sortBy, setSortBy] = useState({
    column: "date",
    order: "des",
  });

  // Fetch data from backend
  useEffect(() => {
    fetch(`${BACKEND_URL}/get_income-statement`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const getDefaultValue = (field) => {
    switch (field) {
      case 'dateRange.start':
        return 1600;
      case 'dateRange.end':
        return currentYear;
      case 'revenue.min':
        return 0;
      case 'revenue.max':
        return Infinity;
      case 'netIncome.min':
        return 0;
      case 'netIncome.max':
        return Infinity;
      default:
        return '';
    }
  };

  // Handle changes in the filter inputs
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    let newValue = value === '' ? '' : parseFloat(value);

    if (!isNaN(newValue)) {
      setFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters };
        if (newValue == '') {
          newValue = getDefaultValue(name);
        }
        const [field, bound] = name.split('.');
        if (field && bound) {
          updatedFilters[field][bound] = newValue;
        }
        return updatedFilters;
      });
    }
  };

  const fetchFilteredData = () => {
    // Create query parameters from filters state
    const queryParams = new URLSearchParams();
    queryParams.set('dateRange.start', filters.dateRange.start);
    queryParams.set('dateRange.end', filters.dateRange.end);
    queryParams.set('revenue.min', filters.revenue.min);
    queryParams.set('revenue.max', filters.revenue.max);
    queryParams.set('netIncome.min', filters.netIncome.min);
    queryParams.set('netIncome.max', filters.netIncome.max);
    queryParams.set('sortBy', sortBy.column);
    queryParams.set('order', sortBy.order);

    // Send GET request to backend API
    fetch(`${BACKEND_URL}/filter?${queryParams.toString()}`)
    .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  // Handle sorting
  const handleSort = (column) => {
    setSortBy((prevSortBy) => ({
      column,
      order: prevSortBy.order === "asc" ? "desc" : "asc",
    }));
  }; 

  useEffect(() => {
    if (!isFirstRender) {
      // Filter/sort changed & not first render -> fetch
      fetchFilteredData();
    } else {
      setIsFirstRender(false);
    }
  }, [filters, sortBy]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mt-4 lg:mt-8 container flex flex-col mx-auto">
      {/* Filter Inputs*/}
      <div className="mb-4 bg-gray-100 text-black flex flex-wrap justify-center border border-collapse border-gray-200">
        <div className="flex justify-center">
        <label className="font-bold flex items-center">
          Year Range:
          <span className="inline-flex items-center whitespace-nowrap">
            <input
              className="w-[70px] mx-1 my-1 bg-white border border-gray-300 rounded-sm"
              type="number"
              name="dateRange.start"
              value={filters.dateRange.start !== 1600 ? filters.dateRange.start : ''}
              onChange={handleFilterChange}
            />
            -
            <input
              className="w-[70px] mx-1 mr-3 my-1 bg-white border border-gray-300 rounded-sm"
              type="number"
              name="dateRange.end"
              value={filters.dateRange.end !== currentYear ? filters.dateRange.end : ''}
              onChange={handleFilterChange}
            />
          </span>
        </label>
        </div>

        <div className="flex justify-center">
        <label className="font-bold flex items-center">
          Revenue:
          <span className="inline-flex items-center whitespace-nowrap">
            <input
              className= "w-[100px] mx-1 my-1 bg-white border border-gray-300 rounded-sm"
              type="number"
              name="revenue.min"
              value={filters.revenue.min !== 0 ? filters.revenue.min : ''}
              onChange={handleFilterChange}
            />
            -
            <input
              className= "w-[100px] mx-1 mr-3 my-1 bg-white border border-gray-300 rounded-sm"
              type="number"
              name="revenue.max"
              value={filters.revenue.max !== Infinity ? filters.revenue.max : ''}
              onChange={handleFilterChange}
            />
          </span>
        </label>
        </div>

        <div className="flex justify-center">
        <label className="font-bold text-black flex items-center">
          Net Income:
          <span className="inline-flex items-center whitespace-nowrap">
          <input
            className= "w-[100px] mx-1 my-1 bg-white border border-gray-300 rounded-sm"
            type="number"
            name="netIncome.min"
            value={filters.netIncome.min !== 0 ? filters.netIncome.min : ''}
            onChange={handleFilterChange}
          />
          -
          <input
            className= "w-[100px] mx-1 mr-3 my-1 bg-white border border-gray-300 rounded-sm"
            type="number"
            name="netIncome.max"
            value={filters.netIncome.max !== Infinity ? filters.netIncome.max : ''}
            onChange={handleFilterChange}
          />
          </span>
        </label>
        </div>
      </div>

      {/* Scrolling needed for mobile */}
      <div className="overflow-x-auto">
      {/* Table */}
      <table className="table-auto min-w-max w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 text-black" onClick={() => handleSort("date")}>
              Date {sortBy.column === "date" && (sortBy.order === "asc" ? "↑" : "↓")}
            </th>
            <th className="border px-2 text-black" onClick={() => handleSort("revenue")}>
              Revenue {sortBy.column === "revenue" && (sortBy.order === "asc" ? "↑" : "↓")}
            </th>
            <th className="border px-2 text-black" onClick={() => handleSort("netIncome")}>
              Net Income {sortBy.column === "netIncome" && (sortBy.order === "asc" ? "↑" : "↓")}
            </th>
            <th className="border px-2 text-black">Gross Profit</th>
            <th className="border px-2 text-black">EPS</th>
            <th className="border px-2 text-black">Operating Income</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index} className={index % 2 === 0 
                ? "bg-white dark:bg-gray-900"
                : "bg-gray-100 dark:bg-gray-700"}
              >
                <td className="border px-2 text-black dark:text-white text-center">{row.date}</td>
                <td className="border px-2 text-black dark:text-white text-center">{row.revenue}</td>
                <td className="border px-2 text-black dark:text-white text-center">{row.netIncome}</td>
                <td className="border px-2 text-black dark:text-white text-center">{row.grossProfit}</td>
                <td className="border px-2 text-black dark:text-white text-center">{row.eps}</td>
                <td className="border px-2 text-black dark:text-white text-center">{row.operatingIncome}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="border px-2 text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default App;
