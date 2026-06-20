import { populateFooterTimestamps } from "./lastmod.js";

const params = new URLSearchParams(window.location.search);

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

populateFooterTimestamps();
setText("display-name", params.get("name") || "friend");
setText("display-name-2", params.get("name") || "-");
setText("display-email", params.get("email") || "-");
setText("display-topic", params.get("topic") || "-");
setText("display-message", params.get("message") || "-");
