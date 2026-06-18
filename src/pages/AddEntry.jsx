import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useLang } from "../context/LanguageContext";
import useStore from "../store/useStore";

import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import PageHeader from "../components/PageHeader";

import "./AddEntry.css";

export default function AddEntry() {
  const { t } = useLang();

  const navigate = useNavigate();
  const location = useLocation();

  const { parties, addEntry, addParty } = useStore();

  const preSelected = location.state?.party_id ?? "";

  const [form, setForm] = useState({
    party_id: preSelected,
    amount: "",
    type: "udhar",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  const [newPartyMode, setNewPartyMode] = useState(false);

  const [newParty, setNewParty] = useState({
    name: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key, value) =>
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  const handleSubmit = async () => {
    setError("");

    let partyId = form.party_id;

    if (newPartyMode) {
      if (!newParty.name.trim()) {
        setError("Customer name is required");
        return;
      }
    } else {
      if (!partyId) {
        setError("Please select a customer");
        return;
      }
    }

    if (
      !form.amount ||
      isNaN(form.amount) ||
      Number(form.amount) <= 0
    ) {
      setError("Enter a valid amount");
      return;
    }

    setLoading(true);

    if (newPartyMode) {
      const { data, error: pErr } =
        await addParty({
          name: newParty.name,
          phone: newParty.phone,
        });

      if (pErr) {
        setError(pErr.message);
        setLoading(false);
        return;
      }

      partyId = data.id;
    }

    const { error: eErr } =
      await addEntry({
        party_id: partyId,
        amount: Number(form.amount),
        type: form.type,
        date: form.date,
        note: form.note.trim(),
      });

    setLoading(false);

    if (eErr) {
      setError(eErr.message);
      return;
    }

    navigate(`/parties/${partyId}`);
  };

  const selectedParty =
    parties.find(
      (p) => p.id === form.party_id
    );

  return (
    <div className="page">

      <button
        className="back-link"
        onClick={() => navigate(-1)}
      >
        ← {t.back}
      </button>

      <PageHeader
        title={t.addEntry}
        subtitle="Record a transaction"
      />

      <div className="entry-layout">

        <Card>

          <div className="form-section">
            <label className="section-label">
              Transaction Type
            </label>

            <div className="type-grid">

              <button
                className={`type-card ${
                  form.type === "udhar"
                    ? "type-card-active debt"
                    : ""
                }`}
                onClick={() =>
                  set("type", "udhar")
                }
              >
                <span className="type-icon">
                  📤
                </span>
                <span>Udhar</span>
              </button>

              <button
                className={`type-card ${
                  form.type === "payment"
                    ? "type-card-active payment"
                    : ""
                }`}
                onClick={() =>
                  set("type", "payment")
                }
              >
                <span className="type-icon">
                  📥
                </span>
                <span>Payment</span>
              </button>

            </div>
          </div>

          <div className="form-section">

            <div className="section-row">
              <label className="section-label">
                Customer
              </label>

              <button
                className="link-btn"
                onClick={() =>
                  setNewPartyMode(
                    (v) => !v
                  )
                }
              >
                {newPartyMode
                  ? "Select Existing"
                  : "+ Add Customer"}
              </button>
            </div>

            {!newPartyMode ? (
              <select
                className="modern-select"
                value={form.party_id}
                onChange={(e) =>
                  set(
                    "party_id",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select Customer
                </option>

                {parties.map((p) => (
                  <option
                    key={p.id}
                    value={p.id}
                  >
                    {p.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="stack">
                <Input
                  label="Customer Name"
                  value={newParty.name}
                  onChange={(e) =>
                    setNewParty({
                      ...newParty,
                      name:
                        e.target.value,
                    })
                  }
                />

                <Input
                  label="Phone"
                  value={newParty.phone}
                  onChange={(e) =>
                    setNewParty({
                      ...newParty,
                      phone:
                        e.target.value,
                    })
                  }
                />
              </div>
            )}

          </div>

          <div className="form-section">
            <Input
              label="Amount"
              type="number"
              value={form.amount}
              onChange={(e) =>
                set(
                  "amount",
                  e.target.value
                )
              }
            />
          </div>

          <div className="two-col">

            <Input
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) =>
                set(
                  "date",
                  e.target.value
                )
              }
            />

            <Input
              label="Note"
              value={form.note}
              onChange={(e) =>
                set(
                  "note",
                  e.target.value
                )
              }
            />

          </div>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          <div className="action-row">

            <Button
              variant="secondary"
              onClick={() =>
                navigate(-1)
              }
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
            >
              {loading
                ? "Saving..."
                : t.save}
            </Button>

          </div>

        </Card>

        <Card className="preview-card">

          <h3>Preview</h3>

          <div className="preview-item">
            <span>Customer</span>
            <strong>
              {newPartyMode
                ? newParty.name || "-"
                : selectedParty?.name ||
                  "-"}
            </strong>
          </div>

          <div className="preview-item">
            <span>Amount</span>
            <strong>
              {form.amount
                ? `₹${Number(
                    form.amount
                  ).toLocaleString(
                    "en-IN"
                  )}`
                : "₹0"}
            </strong>
          </div>

          <div className="preview-item">
            <span>Date</span>
            <strong>
              {form.date}
            </strong>
          </div>

        </Card>

      </div>
    </div>
  );
}