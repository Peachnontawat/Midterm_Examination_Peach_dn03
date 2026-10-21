import { apiClient } from "./client";

const fields = ["firstName", "lastName", "email", "phone", "address", "company"];

function toCreateBody(values) {
  const body = {};
  fields.forEach((key) => {
    const value = values[key]?.trim();
    if (value) body[key] = value;
  });
  return body;
}

function toUpdateBody(values) {
  const body = {};
  fields.forEach((key) => {
    const value = values[key]?.trim();
    body[key] = value ? value : null;
  });
  if (!body.firstName) delete body.firstName;
  return body;
}

export function getContactId(contact) {
  return contact?.id;
}

export async function fetchContacts() {
  const res = await apiClient.get("/contacts", { params: { page: 1, limit: 100 } });
  return res.data.data.items ?? [];
}

export async function fetchContact(id) {
  const res = await apiClient.get(`/contacts/${id}`);
  return res.data.data;
}

export async function createContact(values) {
  const res = await apiClient.post("/contacts", toCreateBody(values));
  return res.data.data;
}

export async function updateContact({ id, body }) {
  const res = await apiClient.patch(`/contacts/${id}`, toUpdateBody(body));
  return res.data.data;
}

export async function deleteContact(id) {
  await apiClient.delete(`/contacts/${id}`);
  return id;
}
