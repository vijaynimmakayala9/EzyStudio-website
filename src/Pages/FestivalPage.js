// FestivalPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";

const API_URL = "http://194.164.148.244:4061/api/poster/festival";

// ✅ Convert selected local date -> backend UTC ISO format
function toAPIDateString(date) {
  const local = new Date(date);
  local.setHours(0, 0, 0, 0); // midnight local
  return local.toISOString(); // backend stored in UTC
}

// ✅ UI display (19 Sep)
function formatDisplayDate(date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

const FestivalPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateList, setDateList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [festivals, setFestivals] = useState([]);
  const [error, setError] = useState("");

  // prepare next 5 dates
  useEffect(() => {
    const list = [];
    const start = new Date();
    for (let i = 0; i < 5; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      list.push(d);
    }
    setDateList(list);
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    fetchFestivalsForDate(selectedDate);
  }, [selectedDate]);

  const fetchFestivalsForDate = async (date) => {
    setLoading(true);
    setError("");
    setFestivals([]);

    try {
      const festivalDate = toAPIDateString(date);

      const res = await axios.post(API_URL, { festivalDate });
      const data =
        res.data?.posters || res.data?.data || res.data?.festivals || res.data || [];

      const normalized = Array.isArray(data) ? data : [data];

      // ✅ filter local date
      const filtered = normalized.filter((item) => {
        if (!item.festivalDate) return true;
        const itemDate = new Date(item.festivalDate);
        return itemDate.toDateString() === new Date(date).toDateString();
      });

      setFestivals(filtered);
    } catch (err) {
      console.error("Error fetching festival posters:", err);
      setError(
        err?.response?.data?.message || "Failed to fetch festival posters. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderDateCard = (d) => {
    const isSelected =
      new Date(d).toDateString() === new Date(selectedDate).toDateString();

    return (
      <div
        key={d.toString()}
        onClick={() => setSelectedDate(d)}
        style={{
          minWidth: 80,
          height: 95,
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
          cursor: "pointer",
          boxShadow: isSelected
            ? "0 6px 18px rgba(69,45,180,0.18)"
            : "0 3px 8px rgba(0,0,0,0.06)",
          background: isSelected ? "#2E1EA8" : "#ffffff",
          color: isSelected ? "#fff" : "#111827",
          border: "1px solid rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 700 }}>
          {formatDisplayDate(d).split(" ")[0]}
        </div>
        <div style={{ fontSize: 12 }}>{formatDisplayDate(d).split(" ")[1]}</div>
      </div>
    );
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <h3 style={{ marginBottom: 4, fontWeight: 700 }}>Upcoming Festivals</h3>
      <p style={{ marginTop: 0, marginBottom: 18, color: "#6b7280" }}>
        Never miss a celebration
      </p>

      {/* Date selector */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {dateList.map((d) => renderDateCard(d))}
      </div>

      {/* Festival posters */}
      <div style={{ minHeight: 260 }}>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 200,
            }}
          >
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <div
            style={{
              padding: 20,
              borderRadius: 12,
              background: "#fff2f0",
              color: "#9b2c2c",
            }}
          >
            {error}
          </div>
        ) : festivals.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: 30,
              boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              No festivals found
            </div>
            <div style={{ color: "#6b7280" }}>Try selecting a different date</div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 15,
            }}
          >
            {festivals.map((f) => (
              <div
                key={f._id || Math.random()}
                style={{
                  borderRadius: 10,
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              >
                <img
                  src={
                    f.posterImage?.url ||
                    f.designData?.bgImage?.url ||
                    (f.images && f.images[0])
                  }
                  alt="festival-poster"
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FestivalPage;
