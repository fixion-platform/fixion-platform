export default function KPI({
  tone = "bg-gray-100",
  title,
  value,
  foot1,
  foot2,
}) {
  return (
    <div className={`rounded-2xl border border-gray-100 shadow-sm ${tone}`}>
      <div className="p-5">
        <div className="text-[13px] font-medium text-gray-700">{title}</div>
        <div className="mt-1 text-1.5xl font-semibold tracking-tight text-gray-900">
          {value}
        </div>
        {foot1 && (
          <div className="mt-2 text-[12px] text-gray-600 leading-4">{foot1}</div>
        )}
        {foot2 && (
          <div className="text-[12px] text-gray-600 leading-4">{foot2}</div>
        )}
      </div>
    </div>
  );
}