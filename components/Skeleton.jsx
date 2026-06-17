export function Skeleton({ width = "100%", height = 16, radius, style }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: radius ?? "var(--radius-sm)", ...style }}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <Skeleton width={160} height={26} style={{ marginBottom: 8 }} />
          <Skeleton width={200} height={13} />
        </div>
        <Skeleton width={110} height={38} radius="var(--radius)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 32 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ background: "var(--surface)", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <Skeleton width={40} height={40} radius="var(--radius-sm)" />
            <div style={{ flex: 1 }}>
              <Skeleton width="60%" height={11} style={{ marginBottom: 8 }} />
              <Skeleton width="40%" height={22} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--surface)", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <Skeleton width={140} height={14} />
        </div>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: i === 4 ? "none" : "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Skeleton width={38} height={38} radius="50%" />
              <div>
                <Skeleton width={120} height={14} style={{ marginBottom: 6 }} />
                <Skeleton width={160} height={11} />
              </div>
            </div>
            <Skeleton width={70} height={24} radius={20} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 6, withTabs = false }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <Skeleton width={140} height={26} style={{ marginBottom: 8 }} />
          <Skeleton width={120} height={13} />
        </div>
        <Skeleton width={120} height={38} radius="var(--radius)" />
      </div>

      {withTabs && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} width={70} height={32} radius={20} />
          ))}
        </div>
      )}

      <Skeleton height={42} radius="var(--radius)" style={{ marginBottom: 16 }} />

      <div style={{ background: "var(--surface)", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", overflow: "hidden" }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: i === rows - 1 ? "none" : "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Skeleton width={42} height={42} radius="50%" />
              <div>
                <Skeleton width={120} height={14} style={{ marginBottom: 6 }} />
                <Skeleton width={90} height={11} />
              </div>
            </div>
            <Skeleton width={64} height={24} radius={20} />
          </div>
        ))}
      </div>
    </div>
  );
}
