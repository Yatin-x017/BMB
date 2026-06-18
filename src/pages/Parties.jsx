import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLang } from "../context/LanguageContext";
import useStore from "../store/useStore";

import Card from "../components/Card";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";

import "./Parties.css";

const fmt = (n) =>
  `₹${Math.abs(n).toLocaleString(
    "en-IN"
  )}`;

const TABS = [
  { key: "all", labelKey: "all" },
  { key: "udhar", labelKey: "lena" },
  { key: "advance", labelKey: "advance" },
  { key: "settled", labelKey: "settled" },
];

export default function Parties() {
  const { t } = useLang();

  const { parties, loading } =
    useStore();

  const navigate = useNavigate();

  const [search, setSearch] =
    useState("");

  const [tab, setTab] =
    useState("all");

  const filtered = parties
    .filter((p) => {
      if (tab === "udhar")
        return p.balance > 0;

      if (tab === "advance")
        return p.balance < 0;

      if (tab === "settled")
        return p.balance === 0;

      return true;
    })
    .filter(
      (p) =>
        p.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        p.phone.includes(search)
    );

  const counts = {
    all: parties.length,
    udhar: parties.filter(
      (p) => p.balance > 0
    ).length,
    advance: parties.filter(
      (p) => p.balance < 0
    ).length,
    settled: parties.filter(
      (p) => p.balance === 0
    ).length,
  };

  if (loading) {
    return (
      <div className="loading">
        {t.loading}
      </div>
    );
  }

  return (
    <div className="page">

      <PageHeader
        title={t.parties}
        subtitle={`${parties.length} customers`}
        actions={
          <Button
            onClick={() =>
              navigate("/add")
            }
          >
            + {t.addParty}
          </Button>
        }
      />

      <Card>

        <div className="party-toolbar">

          <div className="tab-group">

            {TABS.map(
              ({
                key,
                labelKey,
              }) => (
                <button
                  key={key}
                  className={`tab-btn ${
                    tab === key
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setTab(key)
                  }
                >
                  {t[labelKey]}

                  <span>
                    {counts[key]}
                  </span>
                </button>
              )
            )}

          </div>

          <input
            className="party-search"
            placeholder={t.search}
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

      </Card>

      <Card className="party-list-card">

        {filtered.length === 0 ? (
          <div className="empty-state">

            <h3>
              No customers found
            </h3>

            <p>
              Try a different
              search term.
            </p>

          </div>
        ) : (
          <div className="party-list">

            {filtered.map((p) => {
              const positive =
                p.balance > 0;

              const settled =
                p.balance === 0;

              return (
                <div
                  key={p.id}
                  className="party-row"
                  onClick={() =>
                    navigate(
                      `/parties/${p.id}`
                    )
                  }
                >

                  <div className="party-left">

                    <div
                      className={`party-avatar ${
                        settled
                          ? "neutral"
                          : positive
                          ? "danger"
                          : "success"
                      }`}
                    >
                      {p.name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div>

                      <div className="party-name">
                        {p.name}
                      </div>

                      <div className="party-phone">
                        {p.phone ||
                          "No phone"}
                      </div>

                    </div>

                  </div>

                  <div className="party-right">

                    <div
                      className={`balance-chip ${
                        settled
                          ? "neutral"
                          : positive
                          ? "danger"
                          : "success"
                      }`}
                    >
                      {settled
                        ? "₹0"
                        : fmt(
                            p.balance
                          )}
                    </div>

                    <span className="party-status">
                      {settled
                        ? t.settled
                        : positive
                        ? t.lena
                        : t.advance}
                    </span>

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