import { openDb } from "idb";

const dbPromise = openDb("prototype", 1, db => {
  db.createObjectStore("fonto", { keyPath: "id" });
});

const writeData = async (st, data) => {
  const db = await dbPromise;
  const tx = db.transaction(st, "readwrite");
  const store = tx.objectStore(st);
  store.put(data);
  return tx.complete;
};

const readDataById = async (st, id) => {
  const db = await dbPromise;
  const tx = db.transaction(st);
  const store = tx.objectStore(st);
  return store.get(id);
};

const readAllData = async st => {
  const db = await dbPromise;
  const tx = db.transaction(st);
  const store = tx.objectStore(st);
  return store.getAll();
};

const clearAllData = async st => {
  const db = await dbPromise;
  const tx = db.transaction(st, "readwrite");
  const store = tx.objectStore(st);
  store.clear();
  return tx.complete;
};

const deleteDataById = async (st, id) => {
  const db = await dbPromise;
  const tx = db.transaction(st, "readwrite");
  const store = tx.objectStore(st);
  store.delete(id);
  return tx.complete;
};

export { writeData, readDataById, readAllData, clearAllData, deleteDataById };
