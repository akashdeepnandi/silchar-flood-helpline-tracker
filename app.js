const searchInput = document.querySelector("#search");
const tbody = document.querySelector("tbody");
const subContents = document.querySelector(".sub-contents");
console.log(subContents);

const createCategoryLink = (category) => {
  const categoryTitle = categories[category];
  const html = `
  <li><a href="#${category}">${categoryTitle} &#8595;</a></li>
  `
  return html;
}

const renderCategoryLinks = (catKeys) => {
  const html = catKeys.reduce((acc, cat) => {
    const link = createCategoryLink(cat);
    acc += `${link}`;
    return acc;
  }, "");

  subContents.innerHTML = html;

}

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
  `<div class="name"><b>Name</b>: ${name}</div>\n` : "";
  const addrString = address.trim() ? 
  `<div class="address"><b>Address</b>: ${address}</div>\n` : "";

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

const createCategoryRow = (category, data) => {
  const categoryTitle = categories[category];
  const html = data.reduce((acc, rowData) => {
    acc += createTableRow(rowData);
    return acc;
  }, "");

  const cRow = `
  <tr class="category" id="${category}">
    <td colspan="2">${categoryTitle}</td>
  </tr>
  ${html}
  `
  return cRow;
}

const getCategoryRowHTML = (catData) => {
  const catKeys = Object.keys(catData);
  const categoryRowHTML = catKeys.reduce((acc, cat) => {
    const data = catData[cat];
    if(data.length == 0) return acc;
    let catHTML = createCategoryRow(cat, data);
    acc+= `${catHTML}\n`;
    return acc;
  }, "");

  return categoryRowHTML;
}

const renderTable = (catData) => {
    const categoryRowHTML = getCategoryRowHTML(catData);
    tbody.innerHTML = categoryRowHTML;
}



const handleSearch = (e) => {
  const search = e.target.value;
  if(!search) {
    renderTable(categoryData);
    return;
  }

  const catKeys = Object.keys(categories);
  let filteredCatData = {};
  const filteredCatKeys = catKeys.filter((cat) => {
  const title = categories[cat]; 
  const inTitle = title.toLowerCase().includes(search.toLowerCase());
  const data = categoryData[cat];
  const filteredData = data
  	.filter(({name, description, address, numbers}) => {
    const InName = name.toLowerCase().includes(search.toLowerCase());
    const InDesc = description.toLowerCase().includes(search.toLowerCase());
    const InAddress = address.toLowerCase().includes(search.toLowerCase());
    const InNums = numbers.filter((num) => {
      const numString = `${num}`;
      return numString.includes(search)
    }).length > 0;
      
      return InName || InDesc || InAddress || InNums;
    }); 

    const inData = filteredData.length > 0;
    filteredCatData[cat] = !inData && inTitle ? data : filteredData;
    return inTitle || inData;
  }); 

  renderTable(filteredCatData);
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
renderTable(categoryData);
renderCategoryLinks(Object.keys(categories));

