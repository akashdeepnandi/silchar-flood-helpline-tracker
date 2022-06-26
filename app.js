const searchInput = document.querySelector("#search");
const tbody = document.querySelector("tbody");

const createTableRow = ({ name, description, address, numbers }) => {
  const numbers_string = numbers.reduce((acc, num) => {
    acc += `<div class="number-wrapper">
      <span class="copy-icon" onclick="copyToClipboard(${num})"></span>
      <a href="tel:${num}" class="number"/>
        ${num}
      </a>
    </div>
    `
  return acc;
  }, "");

  // case 1 desc
  // case 1 desc

  const descString = description.trim() ? 
  `<div class="description">${description}</div>\n` : "";
  const nameString = name.trim() ? 
  `<div class="name">Name: ${name}</div>\n` : "";
  const addrString = address.trim() ? 
  `<div class="address">Address: ${address}</div>\n` : "";

  const row = `
    <tr>
      <td class="details">
        ${descString}
        ${nameString}
        ${addrString}
      </td>
      <td class="numbers">${numbers_string}</td>
    </tr>
  `
  return row;
}

const renderTable = (data) => {
    const html = data.reduce((acc, rowData) => {
      acc += createTableRow(rowData);
      return acc;
    }, "");
    tbody.innerHTML = html;
}



const handleSearch = (e) => {
  const search = e.target.value;
  if(!search) {
    renderTable(helplineData);
    return;
  }
  const filteredData = helplineData.filter(({name, description, address, numbers}) => {
    const InName = name.toLowerCase().includes(search.toLowerCase());
    const InDesc = description.toLowerCase().includes(search.toLowerCase());
    const InAddress = address.toLowerCase().includes(search.toLowerCase());
    const InNums = numbers.filter((num) => {
      const numString = `${num}`;
      return numString.includes(search)
    }).length > 0;

    return InName || InDesc || InAddress || InNums;
  });

  renderTable(filteredData);
}

function debounce(func, timeout = 300){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

const debouncedSearch = debounce(handleSearch, 500);

const copyToClipboard = async (num) => {
  try {
    await navigator.clipboard.writeText(`${num}`);
    alert("Copied to clipboard");
    return;
  } catch (err) {
    console.error(err);
    alert("Copy failed");
    return;
  }
}

searchInput.addEventListener("keyup", debouncedSearch);
searchInput.value = "";
renderTable(helplineData);
