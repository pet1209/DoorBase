/*=============== SHOW MENU ===============*/
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId);

  toggle.addEventListener("click", () => {
    nav.classList.toggle("show-menu");
    toggle.classList.toggle("show-icon");
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("active");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const toggleSwitch = document.getElementById("toggle-theme");
  const header = document.querySelector(".header");

  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("active");
  });

  function setDarkMode() {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
  }

  function setLightMode() {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  }

  function setTheme() {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    if (isDarkMode) {
      setDarkMode();
      toggleSwitch.checked = true;
    } else {
      setLightMode();
      toggleSwitch.checked = false;
    }
  }

  const links = header.querySelectorAll(".nav__link");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      setTimeout(setTheme, 5);
    });
  });

  setTimeout(setTheme, 100);

  toggleSwitch.addEventListener("change", function () {
    if (this.checked) {
      setDarkMode();
      localStorage.setItem("darkMode", "true");
    } else {
      setLightMode();
      localStorage.setItem("darkMode", "false");
    }
  });
});

showMenu("nav-toggle", "nav-menu");

// Check if the device is mobile
function isMobileDevice() {
  return window.innerWidth <= 768; // You can adjust the width according to your needs
}

// Run the script only if it is a mobile device
if (isMobileDevice()) {
  /*=============== DROPDOWN MENU ===============*/
  const dropdownItems = document.querySelectorAll(".dropdown__item");
  const dropdownSubItems = document.querySelectorAll(".dropdown__subitem");

  dropdownItems.forEach((item) => {
    const link = item.querySelector(".nav__link");
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const submenu = item.querySelector(".dropdown__menu");
      if (submenu) {
        if (submenu.classList.contains("show-submenu")) {
          submenu.classList.toggle("show-submenu");
        } else {
          document
            .querySelectorAll(".dropdown__menu")
            .forEach((menu) => menu.classList.remove("show-submenu"));
          submenu.classList.toggle("show-submenu");
        }
      }
    });
  });

  dropdownSubItems.forEach((subItem) => {
    const link = subItem.querySelector(".dropdown__link");
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const subSubmenu = subItem.querySelector(".dropdown__submenu");
      if (subSubmenu) {
        if (subSubmenu.classList.contains("dropdown-subitem")) {
          subSubmenu.classList.remove("dropdown-subitem");
        } else {
          document
            .querySelectorAll(".dropdown__submenu")
            .forEach((menu) => menu.classList.remove("show-submenu2"));
          subSubmenu.classList.add("dropdown-subitem");
        }
      }
    });
  });

  /*=============== CLOSE MENU ON LINK CLICK ===============*/
  const alinkItems = document.querySelectorAll(".dropdown__link");
  alinkItems.forEach((link) => {
    link.addEventListener("click", () => {
      const navMenu = document.getElementById("nav-menu");
      navMenu.classList.toggle("show-menu");

      const toggleIcon = document.getElementById("nav-toggle");
      toggleIcon.classList.toggle("show-icon");
    });
  });
}

// Function to filter////////////////////////////////////////////////////////////////////////////

function filter() {
  // Function to filter divs based on input value
  function filterContent(filterElement) {
    const input = filterElement.querySelector("input");
    const divs = filterElement.querySelectorAll("div");

    input.addEventListener("input", function () {
      const filterValue = input.value.toLowerCase();
      divs.forEach((div) => {
        if (div.id.toLowerCase().includes(filterValue)) {
          div.classList.remove("hidden");
        } else {
          div.classList.add("hidden");
        }
      });
    });
  }
  // Find all elements with class 'filter' and apply filterContent to each
  document.querySelectorAll(".filter").forEach((filterElement) => {
    filterContent(filterElement);
  });
}

function topup() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

////to triger list of htmx trigers
function triggerAll(className) {
  console.log(`triggerAll called with class name: ${className}`);
  const elements = document.querySelectorAll(`.${className}`);
  console.log(`Elements found:`, elements);

  elements.forEach((element) => {
    console.log(`Triggering event for element:`, element);
    const event = new CustomEvent("Update", {
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(event);
  });
}

// Listener for the custom event
document.addEventListener("Update", function (event) {
  console.log("update event triggered for:", event.target);
  // Your code to handle the event here
});

// function updateSelect(selectId) {
//     // Get the main select element by ID
//     const mainSelect = document.getElementById(selectId);
//     const options = mainSelect.options;

//     // Store the selected option value of the main select element
//     const selectedValue = mainSelect.value;

//     // Find all other select elements with the same class as the ID of the main select element
//     const otherSelects = document.querySelectorAll(`.${selectId}`);

//     otherSelects.forEach(select => {
//         // Store the current selected value of the select element
//         const currentSelectedValue = select.value;

//         // Clear existing options
//         select.innerHTML = '';

//         // Add options from the main select element
//         for (let option of options) {
//             const newOption = document.createElement('option');
//             newOption.value = option.value;
//             newOption.text = option.text;

//             // If the option value matches the previously selected value, mark it as selected
//             if (option.value === currentSelectedValue) {
//                 newOption.selected = true;
//             }

//             select.appendChild(newOption);
//         }

//         // If no option was previously selected, use the selected value from the main select element
//         if (!select.value) {
//             select.value = selectedValue;
//         }
//     });
// }

// document.addEventListener('DOMContentLoaded', function() {
//     console.log("DOM fully loaded and parsed");
//     // Call updateSelect function here if needed after DOM is loaded
//     // updateSelect('mainSelect');
// });

function updateSelect(className, data) {
  // Find all select elements with the provided className
  const selects = document.querySelectorAll(`.${className}`);
  selects.forEach((select, index) => {
    // Store the current selected value of the select element
    const currentSelectedValue = select.value;
    // Prepare the new options and check if the current selected value is in the new options
    let isSelectedValuePresent = false;
    const newOptions = data.map((optionData) => {
      const newOption = document.createElement("option");
      newOption.value = optionData.value;
      newOption.text = optionData.text;

      if (String(optionData.value) === String(currentSelectedValue)) {
        newOption.selected = true;
        isSelectedValuePresent = true;
      }
      return newOption;
    });
    select.innerHTML = "";
    newOptions.forEach((newOption) => select.appendChild(newOption));
    // If the previously selected value is not present, use the first option as the default
    if (!isSelectedValuePresent && data.length > 0) {
      select.value = data[0].value;
    }
  });
}

// Ensure the function is available globally
window.updateSelect = updateSelect;

function checkboxwatch(id) {
  const outputContainer = document.getElementById("output-" + id);
  const selectedInput = document.getElementById("selected-" + id);
  function renderSelected() {
    const checkboxes = Array.from(
      checkboxContainer.querySelectorAll('input[type="checkbox"]:checked')
    );
    const selected = checkboxes.map((checkbox, index) => {
      return {
        id: checkbox.value,
        name: checkbox.name,
        position: index,
      };
    });
    outputContainer.innerHTML = selected
      .map(
        (contract, index) => `
            <lu class="section" data-index="${index}" data-id="${contract.id}">
                <strong><i class="ri-corner-down-right-line"></i> ${contract.name}</strong> 
                <i class="ri-arrow-up-line move-up button" data-index="${index}"></i>
                <i class="ri-arrow-down-line move-down button" data-index="${index}"></i>
                <i id="delete" class="ri-delete-bin-line remove button" data-index="${index}"></i>
            </lu>
        `
      )
      .join("");

    addEventListeners();
    updateSelected();
  }
  function updateSelected() {
    const selected = [];
    const sections = Array.from(outputContainer.querySelectorAll(".section"));
    sections.forEach((section, index) => {
      const contractId = section.getAttribute("data-id");
      const contractName = section.querySelector("strong").innerText.trim();
      selected.push({
        id: contractId,
        name: contractName,
        position: index,
      });
    });
    selectedInput.value = JSON.stringify(selected); // Update hidden input with JSON string
  }
  function moveUp(event) {
    const index = parseInt(event.target.getAttribute("data-index"));
    if (index > 0) {
      const current = outputContainer.querySelector(
        `.section[data-index="${index}"]`
      );
      const previous = outputContainer.querySelector(
        `.section[data-index="${index - 1}"]`
      );
      outputContainer.insertBefore(current, previous);
      updateIndices();
      updateSelected();
    }
  }
  function moveDown(event) {
    const index = parseInt(event.target.getAttribute("data-index"));
    const current = outputContainer.querySelector(
      `.section[data-index="${index}"]`
    );
    const next = outputContainer.querySelector(
      `.section[data-index="${index + 1}"]`
    );
    if (next) {
      outputContainer.insertBefore(next, current);
      updateIndices();
      updateSelected();
    }
  }
  const checkboxContainer = document.getElementById(id);
  function removeItem(event) {
    const index = parseInt(event.target.getAttribute("data-index"));
    const checkbox = checkboxContainer.querySelector(
      `input[value="${event.target.closest(".section").dataset.id}"]`
    );
    checkbox.checked = false;
    renderSelected();
  }
  function updateIndices() {
    outputContainer.querySelectorAll(".section").forEach((line, index) => {
      line.setAttribute("data-index", index);
      line.querySelector(".move-up").setAttribute("data-index", index);
      line.querySelector(".move-down").setAttribute("data-index", index);
      line.querySelector(".remove").setAttribute("data-index", index);
    });
  }
  function addEventListeners(id) {
    outputContainer.querySelectorAll(".move-up").forEach((a) => {
      a.addEventListener("click", moveUp);
    });
    outputContainer.querySelectorAll(".move-down").forEach((a) => {
      a.addEventListener("click", moveDown);
    });
    outputContainer.querySelectorAll(".remove").forEach((a) => {
      a.addEventListener("click", removeItem);
    });
    checkboxContainer.querySelectorAll(".section").forEach((section) => {
      if (!section.classList.contains("listener-added")) {
        section.addEventListener("click", function (event) {
          if (
            event.target.tagName !== "INPUT" &&
            event.target.tagName !== "BUTTON"
          ) {
            const checkbox = section.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            renderSelected();
          }
        });
        section.classList.add("listener-added");
      }
    });
  }
  checkboxContainer.addEventListener("change", renderSelected);
  renderSelected();
}

window.checkboxwatch = checkboxwatch;

function addCheckboxToggleListeners() {
  const checkboxSections = document.querySelectorAll(".section.checkbox");

  checkboxSections.forEach((section) => {
    section.addEventListener("click", function (event) {
      if (
        event.target.tagName !== "INPUT" &&
        event.target.tagName !== "BUTTON"
      ) {
        const checkbox = section.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;
      }
    });
  });
}

window.addCheckboxToggleListeners = addCheckboxToggleListeners;
