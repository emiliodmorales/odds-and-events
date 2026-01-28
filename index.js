// State
const bank = [];
const odds = [];
const evens = [];
let ascending = true;

function addNumber(n) {
  const number = Number(n);
  if (Number.isNaN(number)) {
    return;
  }
  if (!Number.isInteger(number)) {
    return;
  }

  bank.push(n);
  render();
}

function addNumbers(input) {
  const numbers = input.split(",");
  numbers.forEach(addNumber);
  render();
}

function randomNumber() {
  const n = Math.floor(Math.random() * 200 - 100);
  addNumber(n);
  render();
}

function sort(n) {
  if (n < 1) return;
  if (bank.length < 1) {
    return;
  }

  const number = bank.splice(0, 1);
  if (number % 2 == 0) evens.push(number);
  else odds.push(number);

  sort(n - 1);
  render();
}

function sortAll() {
  sort(bank.length);
}

function sortList(a, b) {
  if (ascending) return a - b;
  else return b - a;
}

function toggleDropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function setSorting(isAscending) {
  ascending = isAscending;
  document.getElementById("myDropdown").classList.remove("show");
  render();
}

// Components
function NumberList(array) {
  const $list = document.createElement("ul");
  const $numbers = array.sort(sortList).map(NumberItem);
  $list.replaceChildren(...$numbers);
  return $list;
}

function NumberItem(number) {
  const $number = document.createElement("li");
  $number.textContent = number;
  return $number;
}

function NumberForm() {
  const $form = document.createElement("form");
  $form.innerHTML = `
    <label>
      Add a number to the bank
      <input type="text" name="number" required>
    </label>

    <button type="submit">Add number(s)</button>
    <button id="randomNumber">Add random number</button>
  `;

  $form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData($form);
    const number = formData.get("number");
    addNumbers(number);
    $form.reset();
  });

  const $randomNumber = $form.querySelector("#randomNumber");
  $randomNumber.addEventListener("click", randomNumber);

  return $form;
}

function SortForm() {
  const $form = document.createElement("form");
  $form.innerHTML = `
    <label>
      How many numbers to sort
      <input type="number" min="1" value="1" name="n" required>
    </label>

    <button type="submit">Sort</button>
    <button id="sortAll">Sort All</button>
  `;

  $form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData($form);
    const n = formData.get("n");
    sort(n);
  });

  const $sortAll = $form.querySelector("#sortAll");
  $sortAll.addEventListener("click", sortAll);

  return $form;
}

function SortingDropdown() {
  const $dropdown = document.createElement("div");
  $dropdown.classList.add("dropdown");
  $dropdown.innerHTML = `
    <button class="dropbtn">Sort: ${ascending ? "Ascending" : "Descending"}</button>
    <div id="myDropdown" class="dropdown-content">
      <button id="ascending">Ascending</button>
      <button id="descending">Descending</button>
    </div>
  `;

  const $dropbtn = $dropdown.querySelector(".dropbtn");
  $dropbtn.addEventListener("click", toggleDropdown);

  const $ascending = $dropdown.querySelector("#ascending");
  $ascending.addEventListener("click", () => setSorting(true));

  const $descending = $dropdown.querySelector("#descending");
  $descending.addEventListener("click", () => setSorting(false));

  return $dropdown;
}

// Render
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Odds and Events</h1>
    <NumberForm></NumberForm>
    <SortForm></SortForm>
    <SortingDropdown></SortingDropdown>

    <h2>Bank</h2>
    <Bank></Bank>
    <h2>Odds</h2>
    <Odds></Odds>
    <h2>Evens</h2>
    <Evens></Evens>
  `;
  $app.querySelector("NumberForm").replaceWith(NumberForm());
  $app.querySelector("SortForm").replaceWith(SortForm());
  $app.querySelector("SortingDropdown").replaceWith(SortingDropdown());

  $app.querySelector("Bank").replaceWith(NumberList(bank));
  $app.querySelector("Odds").replaceWith(NumberList(odds));
  $app.querySelector("Evens").replaceWith(NumberList(evens));
}
render();
