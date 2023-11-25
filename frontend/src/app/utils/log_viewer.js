"use client";
import { useState, useEffect } from "react";
import "../globals.css";

const LogViewer = () => {
  const MAX_PAGE_DISPLAY = 5; // Max Page Numbers to display
  const [error, setError] = useState(null); // Error in API state
  const [successMsg, setSuccessMsg] = useState(null); // API success state
  const [logs, setLogs] = useState([]); // Logs array state
  // Filters state
  const [filters, setFilters] = useState({
    level: "",
    resourceId: "",
    timestampStart: "",
    timestampEnd: "",
    traceId: "",
    spanId: "",
    commit: "",
    parentResourceId: "",
  });
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Function to fetch logs data based on filters and pagination
  const fetchLogs = async () => {
    try {
      const response = await fetch(
        `${process.env.SERVER_URL}/filter/query/?page=${pagination.page}&limit=${pagination.limit}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filters),
        }
      );

      // Convert the response to json
      const data = await response.json();

      // If API status code is 200
      if (response.ok) {
        setLogs(data.logs); // Set the logs array
        setPagination({ ...pagination, totalPages: data.totalPages }); // Set the totalPages
        setSuccessMsg(data.msg); // Set the success message
        setError(null); // Set the error as null
      } else {
        setError(data.msg); // Set the error as the messaage received
        setSuccessMsg(null); // Set the success message as null
        setLogs([]); // Empty the logs array
        setPagination({
          ...pagination,
          page: 1,
          totalPages: 1,
        }); // Re-set the page and total Pages
      }
    } catch (error) {
      setSuccessMsg(null);
      setLogs([]);
      setError("Error fetching Logs data");
      setPagination({
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [pagination.page, pagination.limit]); // Re-fetch every time when page number or limit change

  // For default when we clear any filter then default fetch should be called without any filters
  useEffect(() => {
    const areAllFiltersEmpty = Object.values(filters).every(
      (value) => value === ""
    );
    if (areAllFiltersEmpty) {
      fetchLogs();
    }
  }, [filters]);

  const handleSearch = () => {
    setPagination({ ...pagination, page: 1 });
    fetchLogs();
  }; // When search button is clicked

  // Function to handle filter changes
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  };

  // Function to handle pagination changes
  const handlePaginationChange = (event) => {
    const newLimit = parseInt(event.target.value);
    setPagination({ ...pagination, limit: newLimit, page: 1 });
  };

  // Function to handle page change
  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  // Function to add Page buttons (logic)
  const renderPagination = () => {
    const pages = [];
    const currentPage = pagination.page;
    const totalPages = pagination.totalPages;

    // When the total pages is less than max_page
    if (totalPages <= MAX_PAGE_DISPLAY) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            disabled={currentPage === i}
            className={currentPage === i ? "active-page" : ""}
          >
            {i}
          </button>
        );
      }
    } else {
      let startPage = 1;
      let endPage = MAX_PAGE_DISPLAY;

      // Find the start page and end page to display, eg:- if max_page=5 then from current page then we display from -2 to +2 from current page
      if (currentPage > Math.floor(MAX_PAGE_DISPLAY / 2)) {
        startPage = currentPage - Math.floor(MAX_PAGE_DISPLAY / 2);
        endPage = currentPage + Math.floor(MAX_PAGE_DISPLAY / 2);
      }

      // To control overflow
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = totalPages - MAX_PAGE_DISPLAY + 1;
      }

      // Logic to add the buffer page button in starting
      if (startPage !== 1) {
        pages.push(
          <button key={1} onClick={() => handlePageChange(1)}>
            1
          </button>
        );
        pages.push(<span key="ellipsis-start">...</span>);
      }

      // Add the displayed page buttons
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            disabled={currentPage === i}
            className={currentPage === i ? "active-page" : ""}
          >
            {i}
          </button>
        );
      }

      // Logic to add the buffer page button in end
      if (endPage !== totalPages) {
        pages.push(<span key="ellipsis-end">...</span>);
        pages.push(
          <button key={totalPages} onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </button>
        );
      }
    }

    return pages;
  };

  return (
    <div className="log-viewer-container">
      {/* Filter Inputs */}
      <div>
        <input
          type="text"
          name="level"
          placeholder="Level"
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="message"
          placeholder="Message"
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="resourceId"
          placeholder="ResourceId"
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="timestampStart"
          placeholder="Timestamp Start"
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="timestampEnd"
          placeholder="Timestamp End"
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="traceId"
          placeholder="TraceId"
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="spanId"
          placeholder="SpanId"
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="commit"
          placeholder="Commit"
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="parentResourceId"
          placeholder="Parent Resource Id"
          onChange={handleFilterChange}
          className="filter-input"
        />
      </div>

      <div className="search-container">
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      {/* Display Error */}
      {error && <div className="error-message">{error}</div>}

      {/* Display Success Message */}
      {successMsg && <div className="success-message">{successMsg}</div>}

      {/* Table */}
      <table className="logs-table">
        <thead>
          <tr>
            <th>Level</th>
            <th>Message</th>
            <th>ResourceId</th>
            <th>Timestamp</th>
            <th>TraceId</th>
            <th>SpanId</th>
            <th>Commit</th>
            <th>Parent Resource Id</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td>{log.level}</td>
              <td>{log.message}</td>
              <td>{log.resourceId}</td>
              <td>{log.timestamp.toLocaleString()}</td>
              <td>{log.traceId}</td>
              <td>{log.spanId}</td>
              <td>{log.commit}</td>
              <td>{log.metadata.parentResourceId}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination-container">
        <select onChange={handlePaginationChange}>
          <option value="10">10</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <div>{renderPagination()}</div>
      </div>
    </div>
  );
};

export default LogViewer;
