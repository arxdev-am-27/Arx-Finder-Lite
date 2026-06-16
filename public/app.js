async function addDocument() {
  const name = document.getElementById("name").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;

  const response = await fetch("/api/documents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      category,
      description
    })
  });

  const data = await response.json();

  alert("Saved document #" + data.id);
}

async function searchDocuments() {
  const search = document.getElementById("search").value;

  const response = await fetch(
    `/api/documents?search=${encodeURIComponent(search)}`
  );

  const documents = await response.json();

  const results = document.getElementById("results");

  results.innerHTML = documents
    .map(
      doc => `
      <div class="result">
        <strong>${doc.name}</strong><br>
        ${doc.category || "No Category"}<br>
        ${doc.description || ""}
      </div>
    `
    )
    .join("");
}