// src/pages/admindashboard/usermgt/clients/ClientProfile.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ConfirmBlockDialog from "../../../../components/ui/ConfirmBlockDialog";
import BlockToast from "../../../../components/ui/BlockToast";

const fallback = [
  { id: "1", name: "Jane Moon",  email: "janemoon@gmail.com",  phone: "08098989898", location: "No 12 Okota street, Kubwa, Abuja", city: "Abuja",        status: "Active",  avatar: "https://i.pravatar.cc/96?img=1",  joined: "July 1st, 2025" },
  { id: "2", name: "Obong Emma", email: "obongem@gmail.com",   phone: "08098989898", location: "Port-harcourt",                        city: "Port-harcourt", status: "Active",  avatar: "https://i.pravatar.cc/96?img=11", joined: "July 1st, 2025" },
  { id: "3", name: "Femi Rachel",email: "femir@gmail.com",     phone: "08098989898", location: "Lagos",                                 city: "Lagos",          status: "Blocked", avatar: "https://i.pravatar.cc/96?img=5",  joined: "July 1st, 2025" },
  { id: "4", name: "Jane Moon",  email: "janemoon@gmail.com",  phone: "08098989898", location: "Abuja",                                 city: "Abuja",          status: "Inactive",avatar: "https://i.pravatar.cc/96?img=2",  joined: "July 1st, 2025" },
];

export default function ClientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [store, setStore] = useState(() => {
    const raw = localStorage.getItem("fixion:clients");
    return raw ? JSON.parse(raw) : fallback;
  });

  const client = useMemo(
    () => store.find((c) => String(c.id) === String(id)) ?? fallback[0],
    [store, id]
  );

  const [openBlock, setOpenBlock] = useState(false);
  const [toast, setToast] = useState(false);
  const [toastText, setToastText] = useState("");

  useEffect(() => {
    localStorage.setItem("fixion:clients", JSON.stringify(store));
  }, [store]);

  const isBlocked = client.status === "Blocked";

  const handleBlockToggle = () => {
    if (!isBlocked) {
      setOpenBlock(true);
    } else {
      const updated = store.map((c) =>
        c.id === client.id ? { ...c, status: "Active" } : c
      );
      setStore(updated);
      setToastText(`You unblocked ${client.name}`);
      setToast(true);
    }
  };

  const confirmBlock = () => {
    const updated = store.map((c) =>
      c.id === client.id ? { ...c, status: "Blocked" } : c
    );
    setStore(updated);
    setOpenBlock(false);
    setToastText(`You blocked ${client.name}`);
    setToast(true);
  };

  return (
    <div className="min-w-0">
      <div className="mb-25">
        <nav className="text-xs text-gray-500">
          <Link to="/admindashboard/usermgt/clients" className="hover:underline">
            User Mgt
          </Link>{" "}
          <span>›</span>{" "}
          <span className="text-gray-700">Clients</span>
        </nav>
      </div>

      {/* Desktop: two columns; Mobile: stacked */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT: identity + actions */}
        <aside className="lg:basis-[340px] lg:flex-none lg:shrink-0">
          <div className="rounded-2xl ring-1 ring-gray-200 bg-white p-6">
            <div className="flex flex-col items-start gap-4">
              <img
                src={client.avatar}
                alt=""
                className="h-18 w-16 rounded-full object-cover"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-[18px] font-semibold text-gray-900">
                    {client.name}
                  </h2>
                  <span
                    className={`text-xs lowercase ${
                      isBlocked
                        ? "text-rose-600"
                        : client.status === "Active"
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    ({client.status.toLowerCase()})
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-gray-500">
                  Last signed in 5 mins ago
                </p>
              </div>
            </div>

            {/* email chip + copy */}
            <div className="mt-5 flex items-center gap-3">
              <span className="inline-flex items-center rounded-lg ring-1 ring-gray-300 bg-white px-3 py-1 text-xs">
                <span className="mr-2 font-medium text-gray-700">Email:</span>
                <span className="text-gray-700">{client.email}</span>
              </span>
              <button
                onClick={() => navigator.clipboard?.writeText(client.email)}
                className="rounded-full ring-1 ring-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
              >
                copy
              </button>
            </div>

            {/* actions */}
            <div className="mt-4 flex flex-col gap-3">
              <button
                onClick={() => navigate("history")}
                className="inline-flex w-max items-center gap-2 rounded-xl bg-[#0D1B6B] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
              >
                {/* dot icon */}
                <span className="inline-block h-2 w-2 rounded-full bg-white/70" />
                Booking history
              </button>

              <button
                onClick={handleBlockToggle}
                className="inline-flex w-max items-center gap-2 rounded-xl border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
              >
                {/* ban ring */}
                <span className="inline-block h-2.5 w-2.5 rounded-full ring-2 ring-rose-300" />
                {isBlocked ? "Unblock user" : "Block user"}
              </button>
            </div>

            <p className="mt-5 border-t border-gray-200 pt-3 text-xs text-gray-500">
              Joined:{" "}
              <span className="font-semibold text-gray-900">{client.joined}</span>
            </p>
          </div>
        </aside>

        {/* RIGHT: info card */}
        <section className="flex-1 min-w-0">
          <div className="rounded-2xl bg-gray-100 p-5 ring-1 ring-gray-100">
            <h3 className="text-[15px] font-semibold text-gray-900">
              Client Information
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">
              Manage client profile
            </p>

            <div className="mt-4 space-y-3">
              <InfoRow label="Email" value={client.email} />
              <InfoRow label="Phone number" value={client.phone} />
              <InfoRow label="Location" value={client.location} />
            </div>
          </div>
        </section>
      </div>

      {/* Modal */}
      <ConfirmBlockDialog
        open={openBlock}
        onClose={() => setOpenBlock(false)}
        onConfirm={confirmBlock}
      />

      {/* Toast */}
      <BlockToast show={toast} onDone={() => setToast(false)} message={toastText} />
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3">
      <div>
        <p className="text-[13px] font-semibold text-gray-800">{label}</p>
        <p className="mt-0.5 text-sm text-gray-700 break-words">{value}</p>
      </div>
      <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-3.5 w-3.5 text-gray-500"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16Zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        Verified
      </span>
    </div>
  );
}
