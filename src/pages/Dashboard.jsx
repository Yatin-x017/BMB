import { useNavigate } from "react-router-dom";

import { useLang } from "../context/LanguageContext";
import useStore from "../store/useStore";

import Card from "../components/Card";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";

import "./Dashboard.css";

const fmt = (n) =>
  `₹${Math.abs(n).toLocaleString("en-IN")}`;

const fmtDate = (d) => {
  const date = new Date(d);

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
    }
  );
};

export default function Dashboard() {
  const { t } = useLang();

  const { parties, entries, loading } =
    useStore();

  const navigate = useNavigate();

  const totalLena = parties.reduce(
    (s, p) =>
      p.balance > 0
        ? s + p.balance
        : s,
    0
  );

  const totalAdvance =
    parties.reduce(
      (s, p) =>
        p.balance < 0
          ? s + Math.abs(p.balance)
          : s,
      0
    );

  const netBalance =
    totalLena - totalAdvance;

  const recent = [...entries]
    .sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    )
    .slice(0, 8);

  const getParty = (id) =>
    parties.find((p) => p.id === id);

  if (loading) {
    return (
      <div className="dashboard-loading">
        {t.loading}
      </div>
    );
  }

  return (
    <div className="page">

      <PageHeader
        title={t.dashboard}
        subtitle={new Date().toLocaleDateString(
          "en-IN",
          {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        )}
        actions={
          <Button
            onClick={() =>
              navigate("/add")
            }
          >
            + {t.addEntry}
          </Button>
        }
      />

      <div className="dashboard-grid">

        <StatCard
          title={t.parties}
          value={parties.length}
          subtitle="Customers"
          icon="👥"
        />

        <StatCard
          title={t.totalUdhar}
          value={fmt(totalLena)}
          subtitle="Receivable"
          icon="📈"
        />

        <StatCard
          title={t.totalAdvance}
          value={fmt(totalAdvance)}
          subtitle="Advance"
          icon="📉"
        />

        <StatCard
          title={
            netBalance >= 0
              ? `Net ${t.lena}`
              : `Net ${t.advance}`
          }
          value={fmt(netBalance)}
          subtitle="Balance"
          icon="💰"
        />

      </div>

      <Card className="activity-card">

        <div className="activity-header">

          <h2>
            {t.recentActivity}
          </h2>

          <button
            className="view-all-btn"
            onClick={() =>
              navigate("/parties")
            }
          >
            View All →
          </button>

        </div>

        {recent.length === 0 ? (
          <div className="empty-state">

            <div className="empty-icon">
              📒
            </div>

            <p>
              {t.noRecords}
            </p>

            <Button
              onClick={() =>
                navigate("/add")
              }
            >
              + {t.addEntry}
            </Button>

          </div>
        ) : (
          <div className="activity-list">

            {recent.map((e) => {
              const party =
                getParty(
                  e.party_id
                );

              const isUdhar =
                e.type ===
                "udhar";

              return (
                <div
                  key={e.id}
                  className="activity-row"
                  onClick={() =>
                    navigate(
                      `/parties/${e.party_id}`
                    )
                  }
                >

                  <div className="activity-left">

                    <div
                      className={`avatar ${
                        isUdhar
                          ? "avatar-red"
                          : "avatar-green"
                      }`}
                    >
                      {party?.name?.[0]?.toUpperCase() ||
                        "?"}
                    </div>

                    <div>

                      <div className="activity-name">
                        {party?.name ||
                          "Unknown"}
                      </div>

                      <div className="activity-meta">
                        {isUdhar
                          ? t.udhar
                          : t.payment}

                        {e.note &&
                          ` · ${e.note}`}

                        {" · "}
                        {fmtDate(
                          e.date
                        )}
                      </div>

                    </div>

                  </div>

                  <div
                    className={`amount-chip ${
                      isUdhar
                        ? "amount-red"
                        : "amount-green"
                    }`}
                  >
                    {isUdhar
                      ? "-"
                      : "+"}
                    {fmt(e.amount)}
                  </div>

                </div>
              );
            })}

          </div>
        )}

      </Card>

    </div>
  );
}