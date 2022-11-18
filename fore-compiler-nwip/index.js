async function get() {
  const res = await fetch("link");
  const data = await res.json();
  return data;
}
