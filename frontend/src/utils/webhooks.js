const getWebhooks = async () => {
  return fetch("/api/webhook", {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },
  });
};

const getWebhook = async (id) => {
  return fetch(`/api/webhook/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },
  });
};

const createWebhook = async (options) => {
  return fetch("/api/webhook", {
    method: "POST",
    credentials: "include",
    body: options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },
  });
};

const updateWebhook = async (id, updates) => {
  return fetch(`/api/webhook/${id}`, {
    method: "PUT",
    credentials: "include",
    body: updates,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },
  });
};

const deleteWebhook = async (id) => {
  return fetch(`/api/webhook/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },
  });
};

export { getWebhooks, getWebhook, createWebhook, updateWebhook, deleteWebhook };
