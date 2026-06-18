import { useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

import { useLang } from "../context/LanguageContext";
import useStore from "../store/useStore";

import Card from "../components/Card";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";

import "./UdharDetail.css";

const fmt = (n) =>
  `₹${Math.abs(n).toLocaleString(
    "en-IN"
  )}`;

const fmtDate = (d) =>
  new Date(d).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

export default function UdharDetail() {
  const { id } = useParams();

  const { t } = useLang();

  const {
    parties,
    entries,
    deleteEntry,
    deleteParty,
  } = useStore();

  const navigate = useNavigate();

  const [deleteTxn, setDeleteTxn] =
    useState(null);

  const [deleteCustomer,
    setDeleteCustomer] =
    useState(false);

  const party = parties.find(
    (p) => p.id === id
  );

  if (!party) {
    return (
      <div className="not-found">
        <h2>
          Customer not found
        </h2>

        <Button
          onClick={() =>
            navigate("/parties")
          }
        >
          Back
        </Button>
      </div>
    );
  }

  const txns = entries
    .filter(
      (e) => e.party_id === id
    )
    .sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );

  const positive =
    party.balance > 0;

  const settled =
    party.balance === 0;

  let running = 0;

  const chronological =
    [...txns].reverse();

  const runningMap = {};

  chronological.forEach(
    (txn) => {
      running +=
        txn.type === "udhar"
          ? txn.amount
          : -txn.amount;

      runningMap[txn.id] =
        running;
    }
  );

  return (
    <div className="page">

      <PageHeader
        title={party.name}
        subtitle={
          party.phone ||
          "No phone number"
        }
        actions={
          <Button
            onClick={() =>
              navigate("/add", {
                state: {
                  party_id: id,
                },
              })
            }
          >
            + {t.addEntry}
          </Button>
        }
      />

      <div className="detail-grid">

        <Card className="customer-card">

          <div
            className={`customer-avatar ${
              settled
                ? "neutral"
                : positive
                ? "danger"
                : "success"
            }`}
          >
            {party.name
              ?.charAt(0)
              ?.toUpperCase()}
          </div>

          <h3>{party.name}</h3>

          <p>
            {party.phone ||
              "No phone"}
          </p>

          <div
            className={`balance-box ${
              settled
                ? "neutral"
                : positive
                ? "danger"
                : "success"
            }`}
          >
            <div className="balance-value">
              {settled
                ? "₹0"
                : fmt(
                    party.balance
                  )}
            </div>

            <div>
              {settled
                ? t.settled
                : positive
                ? t.lena
                : t.advance}
            </div>
          </div>

          <div className="customer-meta">

            <div>
              Transactions
            </div>

            <strong>
              {txns.length}
            </strong>

          </div>

          <Button
            variant="danger"
            onClick={() =>
              setDeleteCustomer(
                true
              )
            }
          >
            Delete Customer
          </Button>

        </Card>

        <Card className="ledger-card">

          <div className="ledger-header">

            <h3>
              Transactions
            </h3>

            <span>
              {txns.length} records
            </span>

          </div>

          {txns.length === 0 ? (
            <div className="empty-ledger">

              <h4>
                No Transactions
              </h4>

              <p>
                Add the first
                entry for this
                customer.
              </p>

            </div>
          ) : (
            <div className="ledger-list">

              {txns.map(
                (txn) => {
                  const isUdhar =
                    txn.type ===
                    "udhar";

                  return (
                    <div
                      key={txn.id}
                      className="txn-row"
                    >

                      <div
                        className={`txn-indicator ${
                          isUdhar
                            ? "danger"
                            : "success"
                        }`}
                      />

                      <div className="txn-main">

                        <div className="txn-top">

                          <div>

                            <div
                              className={`txn-type ${
                                isUdhar
                                  ? "danger"
                                  : "success"
                              }`}
                            >
                              {isUdhar
                                ? t.udhar
                                : t.payment}
                            </div>

                            <div className="txn-date">
                              {fmtDate(
                                txn.date
                              )}
                            </div>

                            {txn.note && (
                              <div className="txn-note">
                                {
                                  txn.note
                                }
                              </div>
                            )}

                          </div>

                          <div
                            className={`txn-amount ${
                              isUdhar
                                ? "danger"
                                : "success"
                            }`}
                          >
                            {isUdhar
                              ? "-"
                              : "+"}
                            {fmt(
                              txn.amount
                            )}
                          </div>

                        </div>

                        <div className="txn-footer">

                          <span>
                            Running
                            Balance:
                          </span>

                          <strong>
                            {fmt(
                              runningMap[
                                txn.id
                              ]
                            )}
                          </strong>

                          {deleteTxn ===
                          txn.id ? (
                            <div className="delete-confirm">

                              <button
                                onClick={() =>
                                  deleteEntry(
                                    txn.id
                                  )
                                }
                              >
                                Delete
                              </button>

                              <button
                                onClick={() =>
                                  setDeleteTxn(
                                    null
                                  )
                                }
                              >
                                Cancel
                              </button>

                            </div>
                          ) : (
                            <button
                              className="delete-btn"
                              onClick={() =>
                                setDeleteTxn(
                                  txn.id
                                )
                              }
                            >
                              Delete
                            </button>
                          )}

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </Card>

      </div>

      {deleteCustomer && (
        <div
          className="modal-overlay"
          onClick={() =>
            setDeleteCustomer(
              false
            )
          }
        >
          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h3>
              Delete Customer
            </h3>

            <p>
              Delete{" "}
              <strong>
                {party.name}
              </strong>{" "}
              and all related
              transactions?
            </p>

            <div className="modal-actions">

              <Button
                variant="secondary"
                onClick={() =>
                  setDeleteCustomer(
                    false
                  )
                }
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                onClick={async () => {
                  await deleteParty(
                    id
                  );

                  navigate(
                    "/parties"
                  );
                }}
              >
                Delete
              </Button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}