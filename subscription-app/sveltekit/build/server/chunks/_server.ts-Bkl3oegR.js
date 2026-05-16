import { j as json } from './index-lhTMmBNn.js';
import * as fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), "subscriptions.json");
function getAll() {
  if (!fs.existsSync(DB_PATH)) return [];
  const data = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  return Array.isArray(data) ? data : [];
}
function create(subscription) {
  const all = getAll();
  const newSub = { ...subscription, id: crypto.randomUUID() };
  all.push(newSub);
  save(all);
  return newSub;
}
function update(id, updates) {
  const all = getAll();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...updates };
  save(all);
  return all[idx];
}
function remove(id) {
  const all = getAll();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  all.splice(idx, 1);
  save(all);
  return true;
}
function save(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
const GET = async ({ url }) => {
  const filterCategory = url.searchParams.get("category");
  const filterStatus = url.searchParams.get("status");
  let data = getAll();
  if (filterCategory) data = data.filter((s) => s.category === filterCategory);
  if (filterStatus) data = data.filter((s) => s.status === filterStatus);
  return json({ success: true, data });
};
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, cost } = body;
    if (!name || typeof cost !== "number" || cost <= 0) {
      return json({ success: false, error: "Missing required fields: name, cost (>0)" }, { status: 400 });
    }
    const [category, frequency, startDate, nextBillingDate] = [
      body.category,
      body.frequency,
      body.startDate,
      body.nextBillingDate
    ];
    if (!category || !frequency || !startDate || !nextBillingDate) {
      return json({ success: false, error: "Missing required fields: category, frequency, startDate, nextBillingDate" }, { status: 400 });
    }
    const created = create(body);
    return json({ success: true, data: created });
  } catch (e) {
    return json({ success: false, error: e instanceof Error ? e.message : "Failed to create subscription" }, { status: 500 });
  }
};
const PUT = async ({ request, params }) => {
  try {
    const body = await request.json();
    const [cost] = [body.cost];
    if (typeof cost === "number" && cost <= 0) {
      return json({ success: false, error: "Cost must be greater than 0" }, { status: 400 });
    }
    const updated = update(params.id, body);
    if (!updated) {
      return json({ success: false, error: "Subscription not found" }, { status: 404 });
    }
    return json({ success: true, data: updated });
  } catch (e) {
    return json({ success: false, error: e instanceof Error ? e.message : "Failed to update subscription" }, { status: 500 });
  }
};
const DELETE = async ({ params }) => {
  const deleted = remove(params.id);
  if (!deleted) {
    return json({ success: false, error: "Subscription not found" }, { status: 404 });
  }
  return json({ success: true });
};

export { DELETE, GET, POST, PUT };
//# sourceMappingURL=_server.ts-Bkl3oegR.js.map
