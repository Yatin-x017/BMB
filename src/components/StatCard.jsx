import "./StatCard.css";

export default function StatCard({
  title,
  value,
  icon,
  subtitle,
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className="stat-card-title">
          {title}
        </div>

        <div className="stat-card-icon">
          {icon}
        </div>
      </div>

      <div className="stat-card-value">
        {value}
      </div>

      {subtitle && (
        <div className="stat-card-subtitle">
          {subtitle}
        </div>
      )}
    </div>
  );
}