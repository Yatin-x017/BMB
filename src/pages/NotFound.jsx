import { useNavigate } from "react-router-dom";

import Button from "../components/Button";

import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">

      <div className="notfound-card">

        <div className="notfound-code">
          404
        </div>

        <h1>
          Page Not Found
        </h1>

        <p>
          The page you're looking for
          doesn't exist or may have
          been moved.
        </p>

        <div className="notfound-actions">

          <Button
            onClick={() =>
              navigate("/")
            }
          >
            Go to Dashboard
          </Button>

        </div>

      </div>

    </div>
  );
}