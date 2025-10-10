// src/api/artisans.js
// Mock API for Artisans. Replace with real endpoints later.

const _db = new Map([
  [
    "1",
    {
      id: "1",
      name: "Jane Moon",
      email: "janemoon@gmail.com",
      phone: "08098989898",
      location: "Abuja",
      category: "Plumbing",
      status: "active", // 'pending' | 'active' | 'blocked'
      lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      kyc: {
        idType: "National Identity card",
        idImageUrl:
          "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=640&q=80",
        idStatus: "verified", // 'unverified' | 'verifying' | 'verified' | 'failed'
      },
    },
  ],
  [
    "2",
    {
      id: "2",
      name: "Femi Rachel",
      email: "femir@gmail.com",
      phone: "08098989898",
      location: "Ikota, Lagos",
      category: "Hairdressing",
      status: "pending",
      lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      kyc: {
        idType: "National Identity card",
        idImageUrl:
          "https://images.unsplash.com/photo-1546017538-cb79c0a67e2d?w=640&q=80",
        idStatus: "unverified",
      },
    },
  ],
]);

const sleep = (ms = 800) => new Promise((r) => setTimeout(r, ms));

export async function getArtisan(id) {
  await sleep(250);
  const item = _db.get(id);
  if (!item) throw new Error("Artisan not found");
  // return a deep clone to avoid external mutation
  return JSON.parse(JSON.stringify(item));
}

export async function blockArtisan(id) {
  await sleep();
  const a = _db.get(id);
  if (!a) throw new Error("Artisan not found");
  a.status = "blocked";
  _db.set(id, a);
  return { status: a.status };
}

export async function unblockArtisan(id) {
  await sleep();
  const a = _db.get(id);
  if (!a) throw new Error("Artisan not found");
  a.status = "active";
  _db.set(id, a);
  return { status: a.status };
}

export async function approveArtisan(id) {
  await sleep();
  const a = _db.get(id);
  if (!a) throw new Error("Artisan not found");
  a.status = "active";
  a.kyc.idStatus = "verified";
  _db.set(id, a);
  return { status: a.status, kyc: a.kyc };
}

/**
 * Verify ID. Optionally force an outcome:
 *   verifyId(id, { force: 'success' | 'fail' })
 */
export async function verifyId(id, opts = {}) {
  await sleep(1300);
  const a = _db.get(id);
  if (!a) throw new Error("Artisan not found");

  let outcome = opts.force
    ? opts.force
    : Math.random() < 0.75
    ? "success"
    : "fail";

  a.kyc.idStatus = outcome === "success" ? "verified" : "failed";
  _db.set(id, a);

  return { kyc: a.kyc };
}

export async function requestIdReupload(id) {
  await sleep(700);
  const a = _db.get(id);
  if (!a) throw new Error("Artisan not found");
  // After asking for reupload we reset to unverified
  a.kyc.idStatus = "unverified";
  _db.set(id, a);
  return { ok: true };
}
