// src/scripts/common/transition.js
setTimeout(() => {
  document.documentElement.classList.add("transition");
}, 0);

// src/scripts/common/modal.js
var moonModal = new MoonModal({
  modal: {
    active: "modal--open",
    associated: {}
  },
  overlay: {
    el: ".overlay",
    active: "overlay--active"
  },
  timeout: 200
});
moonModal.info.overlay.addEventListener("click", () => {
  moonModal.close();
});
var listOpenButtons = document.querySelectorAll("[data-modal-open]");
if (listOpenButtons.length) {
  listOpenButtons.forEach((block) => {
    const id = block.getAttribute("data-modal-open");
    block.addEventListener("click", () => {
      moonModal.open(id);
    });
  });
}
var listCloseButtons = document.querySelectorAll("[data-modal-close]");
if (listCloseButtons.length) {
  listCloseButtons.forEach((block) => {
    block.addEventListener("click", () => {
      moonModal.close();
    });
  });
}
document.addEventListener("click", ({ target }) => {
  if (target.classList.contains("modal"))
    moonModal.close();
});

// src/modules/header-submenu/header-menu.module.js
document.addEventListener("DOMContentLoaded", () => {
  const block = document.querySelector(".header");
  const listHeaderMenu = block.querySelectorAll(".header-submenu");
  const overlay = document.querySelector(".overlay");
  function stateChange() {
    listHeaderMenu.forEach((headerMenu) => {
      const panel = headerMenu.querySelector('[data-id="panel"]');
      const body = headerMenu.querySelector(".header-submenu__body");
      if (body) {
        panel.addEventListener("click", handleMenuClick);
      }
    });
    overlay.addEventListener("click", closeMenus);
  }
  function handleMenuClick() {
    const submenu = this.closest(".header-submenu");
    const isSubmenuActive = this.parentElement.classList.contains("header-submenu--active");
    if (!submenu.hasAttribute("data-id")) {
      closeMenus();
      if (!isSubmenuActive) {
        this.parentElement.classList.add("header-submenu--active");
        overlay.classList.add("overlay--active");
      }
    }
  }
  function closeMenus() {
    listHeaderMenu.forEach((headerMenu) => {
      headerMenu.classList.remove("header-submenu--active");
    });
    overlay.classList.remove("overlay--active");
  }
  stateChange();
  window.addEventListener("resize", stateChange);
});

// src/modules/header/utils.js
function initHeaderAccordion(block) {
  const panel = block.querySelector(`[data-id="panel"]`);
  if (!panel)
    return;
  panel.addEventListener("click", shit);
  function shit() {
    block.classList.toggle("active");
  }
}
function mobileMenuHandler(mobSearch, headerSearch) {
  const overlay = document.querySelector(".overlay");
  mobSearch.addEventListener("click", () => {
    headerSearch.classList.add("header-search--active");
    overlay.classList.add("overlay--active");
  });
  overlay.addEventListener("click", () => {
    headerSearch.classList.remove("header-search--active");
    overlay.classList.remove("overlay--active");
  });
  document.addEventListener("click", ({ target }) => {
    if (!mobSearch.contains(target) && !headerSearch.contains(target)) {
      headerSearch.classList.remove("header-search--active");
    }
  });
}

// src/modules/header/header-control.module.js
document.addEventListener("DOMContentLoaded", () => {
  const block = document.querySelector(".header");
  const logo = block.querySelector(".logo");
  const headerTop = block.querySelector(".header__top-container");
  const headerTopRight = headerTop.querySelector(".header__top-right");
  const headerSearch = headerTop.querySelector(".header-search");
  const headerBottom = block.querySelector(".header__bottom-container");
  const headerBottomRight = headerBottom.querySelector(".header__bottom-right");
  const mobSearch = block.querySelector(`[data-id="search"]`);
  const headerMenuWrap = block.querySelector(".header__menu-wrap");
  const navItems = Array.from(headerMenuWrap.querySelectorAll(".header-submenu:not([data-showmore])"));
  const showMoreButton = block.querySelector(`[data-showmore]`);
  const showMoreList = block.querySelector(`[data-showmore-menu]`);
  const minVisibleItems = 1;
  const containerGap = parseFloat(getComputedStyle(headerBottom).gap);
  function setMenuList() {
    const gap = window.matchMedia("(max-width:1880px)").matches ? 42 : 24;
    function calculateMenuWidth() {
      const headerWidth = headerBottom.clientWidth;
      const logoWidth = logo.clientWidth;
      const rightSectionWidth = headerBottomRight.clientWidth;
      const showMoreButtonWidth = showMoreButton.clientWidth;
      return headerWidth - containerGap * 2 - logoWidth - rightSectionWidth - gap * 2 - 30;
    }
    function resetMenu() {
      showMoreList.innerHTML = "";
      navItems.forEach((item) => {
        item.removeAttribute("data-id");
        headerMenuWrap.insertBefore(item, showMoreButton);
      });
      showMoreButton.style.display = "none";
    }
    function populateShowMoreList(items) {
      showMoreList.innerHTML = "";
      items.forEach((item) => {
        showMoreList.appendChild(item);
        if (item.querySelector(`[data-id="panel"]`)) {
          item.setAttribute("data-id", "accordion");
          initHeaderAccordion(item);
        }
      });
      showMoreButton.style.display = items.length > 0 ? "block" : "none";
    }
    function handleMenu() {
      if (window.innerWidth > 1279) {
        resetMenu();
        const menuWidth = calculateMenuWidth();
        let totalWidth = 0;
        let fitCount = 0;
        navItems.forEach((item, index) => {
          const itemWidth = item.getBoundingClientRect().width + gap;
          if (totalWidth + itemWidth <= menuWidth || fitCount < minVisibleItems) {
            totalWidth += itemWidth;
            fitCount++;
          }
        });
        const showMoreItems = navItems.slice(fitCount);
        populateShowMoreList(showMoreItems);
      } else {
        resetMenu();
      }
    }
    window.addEventListener("resize", handleMenu);
    handleMenu();
  }
  function updateHeaderSearchPosition() {
    if (window.matchMedia("(max-width: 1279px)").matches) {
      headerBottomRight.insertAdjacentElement("beforebegin", headerSearch);
    } else {
      headerTopRight.insertAdjacentElement("afterbegin", headerSearch);
    }
  }
  window.addEventListener("resize", updateHeaderSearchPosition);
  updateHeaderSearchPosition();
  setMenuList();
  mobileMenuHandler(mobSearch, headerSearch);
});

// src/modules/ui-tabs/ui-tabs.module.js
document.addEventListener("DOMContentLoaded", () => {
  const listTabs = document.querySelectorAll(`[data-tabs]`);
  if (!listTabs.length)
    return;
  listTabs.forEach((block) => {
    const tabs = [...block.querySelectorAll(`[data-id='tab-button']`)];
    const contents = block.querySelectorAll(`[data-id='tab-content']`);
    const tabSlider = block.querySelector(".tab-slider");
    const closeAll = () => {
      contents.forEach((content) => content.removeAttribute("data-tab-active"));
      tabs.forEach((tab) => tab.removeAttribute("data-tab-active"));
    };
    tabs.forEach((tab, index) => {
      const isActive = tabs.find((tab2) => tab2.hasAttribute("data-tab-active"));
      tabSlider.style.width = isActive.clientWidth + "px";
      tabSlider.style.left = isActive.offsetLeft + "px";
      tabSlider.style.height = tab.clientHeight + "px";
    });
    const toggleTab = (index) => {
      const isActiveTab = tabs[index].hasAttribute("data-tab-active");
      const isActiveContent = contents[index].hasAttribute("data-tab-active");
      if (block.classList.contains("ui-tabs-accordion") && window.matchMedia("(max-width: 1023px)").matches) {
        if (isActiveTab && isActiveContent) {
          closeAll();
        } else {
          closeAll();
          contents[index].setAttribute("data-tab-active", "");
          tabs[index].setAttribute("data-tab-active", "");
        }
      } else {
        closeAll();
        contents[index].setAttribute("data-tab-active", "");
        tabs[index].setAttribute("data-tab-active", "");
        tabSlider.style.width = tabs[index].clientWidth + "px";
        tabSlider.style.left = tabs[index].offsetLeft + "px";
      }
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        toggleTab(index);
      });
    });
  });
});

// src/modules/ui-swiper/swiper.module.js
document.addEventListener("DOMContentLoaded", () => {
  const listSwipers = document.querySelectorAll(".ui-swiper");
  if (!listSwipers.length)
    return;
  const getSlides = (data) => {
    var _a;
    return {
      0: {
        slidesPerView: (_a = data[2]) != null ? _a : 1.3,
        spaceBetween: 24
      },
      768: {
        slidesPerView: data[1],
        spaceBetween: 24
      },
      1280: {
        spaceBetween: 40,
        slidesPerView: data[0]
      }
    };
  };
  listSwipers.forEach((block) => {
    const swiper = block.querySelector(".swiper");
    const prev = block.querySelector(`[data-id="prev"]`);
    const next = block.querySelector(`[data-id="next"]`);
    const pagination = block.querySelector(".ui-swiper__pagination");
    const check4 = block.classList.contains("ui-swiper--four-cards");
    const check3 = block.classList.contains("ui-swiper--three-cards");
    const check2 = block.classList.contains("ui-swiper--two-cards");
    new Swiper(swiper, {
      loop: false,
      breakpoints: check4 ? getSlides([4, 3]) : check3 ? getSlides([3, 2]) : check2 ? getSlides([2, 2, 1]) : getSlides([1, 1, 1]),
      navigation: {
        nextEl: next,
        prevEl: prev
      },
      pagination: {
        el: pagination,
        type: "fraction",
        renderFraction: function(currentClass, totalClass) {
          return '<span class="' + currentClass + '"></span> \u2014 <span class="' + totalClass + '"></span>';
        }
      },
      on: {
        slideChange: function() {
          console.log("\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0439 \u0438\u043D\u0434\u0435\u043A\u0441:", this.activeIndex);
          console.log("\u041E\u0431\u0449\u0435\u0435 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0441\u043B\u0430\u0439\u0434\u043E\u0432:", this.slides.length);
        }
      }
    });
  });
});

// src/modules/faq-accordion/accordion.js
document.addEventListener("DOMContentLoaded", () => {
  const listAccordions = document.querySelectorAll(".faq-accordion");
  if (!listAccordions.length)
    return;
  const closeAll = () => {
    listAccordions.forEach(
      (block) => block.classList.remove("faq-accordion--active")
    );
  };
  listAccordions.forEach((block) => {
    const panel = block.querySelector(".faq-accordion__panel");
    panel.addEventListener("click", () => {
      const isActive = block.classList.contains("faq-accordion--active");
      closeAll();
      if (!isActive) {
        block.classList.add("faq-accordion--active");
      }
    });
  });
});

// src/scripts/form-utils/form-state-control.js
var optionsEvent = {
  bubbles: true
};
var nameEventForm = {
  error: "event-error",
  change: "event-change",
  reset: "event-reset"
};
var listEvents = {
  error: new CustomEvent(nameEventForm.error, optionsEvent),
  change: new CustomEvent(nameEventForm.change, optionsEvent),
  reset: new CustomEvent(nameEventForm.reset, optionsEvent)
};
var formStateControl = {
  error(element) {
    element.dispatchEvent(listEvents.error);
  },
  errorRadio(listElement) {
    listElement.forEach((element) => element.dispatchEvent(listEvents.error));
  },
  listErrors(listElement) {
    listElement.forEach((element) => element.dispatchEvent(listEvents.error));
  },
  change(element) {
    element.dispatchEvent(listEvents.change);
  },
  changeRadio(listElement) {
    listElement.forEach((element) => element.dispatchEvent(listEvents.change));
  },
  changeArray(listElement) {
    listElement.forEach((element) => element.dispatchEvent(listEvents.change));
  },
  reset(element) {
    element.dispatchEvent(listEvents.reset);
  }
};

// src/scripts/form-utils/regexp.js
var regexp = {
  email() {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  }
};

// src/scripts/form-utils/validation.js
var validation = {
  length(input) {
    return input.value.length > 2;
  },
  masked(input) {
    return input.getAttribute("data-valid-mask") === "true";
  },
  checked(input) {
    return input.checked;
  },
  email(input) {
    return regexp.email().test(input.value);
  },
  file(input) {
    return input.files[0];
  },
  listRadio(listInput) {
    const listChecked = listInput.map((input) => input.checked);
    return listChecked.some((input) => input === true);
  },
  listInputsLength(listInput) {
    return listInput.every((input) => input.value.length > 2);
  },
  listMasked(listInput) {
    return listInput.every((input) => input.getAttribute("data-valid-mask") === "true");
  },
  filled(input) {
    return input.value.length >= 1;
  }
};

// src/scripts/form-utils/masked.js
function toggleCompleted(mask, input) {
  mask.on("complete", function() {
    input.setAttribute("data-valid-mask", "true");
  });
  mask.on("accept", function() {
    input.setAttribute("data-valid-mask", "false");
  });
}
function resetValue(input) {
  input.value = "";
}
function updateValue(mask) {
  mask.updateValue();
}
function resetCompleted(input) {
  input.dataset.completed = "false";
}
var presetMaskOptions = {
  number: {
    mask: "+{7} (000) 000-00-00",
    lazy: true,
    prepare: (appended, masked) => {
      if (appended === "8" && masked.value === "") {
        return "";
      }
      return appended;
    }
  },
  date: {
    mask: Date,
    min: new Date(1990, 0, 1),
    max: new Date(2020, 0, 1),
    lazy: true
  },
  expireDate: {
    mask: Date,
    pattern: "d.`m.`Y",
    blocks: {
      d: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 31,
        maxLength: 2
      },
      m: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 12,
        maxLength: 2
      },
      Y: {
        mask: IMask.MaskedRange,
        from: 2e3,
        to: 2050
      }
    },
    format: function(date) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return [day, month, year].map((val) => String(val).padStart(2, "0")).join(".");
    },
    parse: function(str) {
      const dayMonthYear = str.split(".");
      return new Date(dayMonthYear[2], dayMonthYear[1] - 1, dayMonthYear[0]);
    }
  },
  docNumber: {
    mask: "000 000 000",
    blocks: {
      0: {
        mask: IMask.MaskedRange,
        from: 0,
        to: 9,
        maxLength: 1
      }
    }
  }
};
function initialMasked(input, options) {
  const mask = new IMask(input, options);
  const reset = () => {
    resetValue(input);
    resetCompleted(input);
    updateValue(mask);
  };
  toggleCompleted(mask, input);
  input.addEventListener(nameEventForm.reset, () => {
    reset();
  });
  return {
    mask,
    reset
  };
}

// src/modules/footer-quiz/quiz-control.js
document.addEventListener("DOMContentLoaded", () => {
  const block = document.querySelector(".footer-quiz");
  const form = document.getElementById("footer-quiz");
  const listSteps = block.querySelectorAll(".footer-quiz__step");
  const currentStep = block.querySelector(`[data-id='current-step']`);
  const stepsCount = block.querySelector(`[data-id='steps-count']`);
  const inputName = form.querySelector(`[data-input="footer-name"]`);
  const inputPhone = form.querySelector(`[data-input="footer-phone"]`);
  const title = block.querySelector(`.footer-quiz__title`);
  const desc = block.querySelector(`.footer-quiz__desc`);
  const pagination = block.querySelector(`.footer-quiz__pagination`);
  let currentIndex = 0;
  initialMasked(inputPhone, presetMaskOptions.number);
  stepsCount.innerHTML = `${listSteps.length}`;
  const updateCurrentIndex = () => {
    currentStep.innerText = `${currentIndex + 1}`;
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    title.innerText = "\u0414\u0430\u043D\u043D\u044B\u0435 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u044B!";
    desc.innerText = "\u041D\u0430\u0448\xA0\u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442 \u0441\u0432\u044F\u0436\u0435\u0442\u0441\u044F \u0441\xA0\u0432\u0430\u043C\u0438 \u0432\xA0\u0431\u043B\u0438\u0436\u0430\u0439\u0448\u0435\u0435 \u0432\u0440\u0435\u043C\u044F";
    pagination.style.display = "none";
    listSteps.forEach((step) => {
      step.classList.remove("footer-quiz__step--active");
    });
  });
  form.addEventListener("input", () => {
    formStateControl.change(inputName);
    formStateControl.change(inputPhone);
  });
  listSteps.forEach((step, index) => {
    const button = step.querySelector(".footer-quiz__arrow-btn");
    if (button) {
      button.addEventListener("click", () => {
        let isError = true;
        if (currentIndex === 0) {
          isError = !validation.length(inputName) && formStateControl.error(inputName);
        } else if (currentIndex === 1) {
          isError = !validation.masked(inputPhone) && formStateControl.error(inputPhone);
        }
        console.log(isError);
        if (isError !== void 0) {
          step.classList.remove("footer-quiz__step--active");
          listSteps[index + 1].classList.add("footer-quiz__step--active");
          currentIndex++;
          updateCurrentIndex();
        }
      });
    }
  });
  updateCurrentIndex();
});

// src/modules/mobile-menu/copy-html.js
document.addEventListener("DOMContentLoaded", () => {
  const mobileModal = document.querySelector(".mobile-menu");
  const header = document.querySelector(".header");
  const headerTop = header.querySelector(".header__top-container");
  const headerTopLeft = headerTop.querySelector(".header__top-left").cloneNode(true);
  const headerTopRight = headerTop.querySelector(".header__top-right").cloneNode(true);
  const headerPhone = header.querySelector(".header__phone").cloneNode(true);
  const headerNav = header.querySelector(".header__menu");
  const additionalClasses = ["button", "button--purple", "button--small-pad"];
  const navMenuClone = headerNav.cloneNode(true);
  mobileModal.appendChild(navMenuClone);
  mobileModal.appendChild(headerTopLeft);
  mobileModal.appendChild(headerPhone);
  mobileModal.appendChild(headerTopRight);
  mobileModal.querySelector(`[data-header-contacts]`).classList.remove(...additionalClasses);
  const listMobileAccordions = mobileModal.querySelectorAll(
    '.header-submenu:has([data-id="panel"])'
  );
  listMobileAccordions.forEach((item) => {
    const panel = item.querySelector(`[data-id="panel"]`);
    panel.removeEventListener("click", () => item.classList.toggle("active"));
    item.setAttribute("data-id", "accordion");
    initHeaderAccordion(item);
  });
});

// src/modules/card-preview/card-detail-swiper.js
document.addEventListener("DOMContentLoaded", () => {
  const block = document.querySelector(".card-swiper");
  if (!block)
    return;
  const carouselSwiper = block.querySelector(`[data-id="swiper"]`);
  const thumbnailSwiper = block.querySelector(`[data-id="thumbnail"]`);
  const swiperNavPrev = block.querySelector(`.card-swiper__arrow--prev`);
  const swiperNavNext = block.querySelector(`.card-swiper__arrow--next`);
  const thumbNavPrev = block.querySelector(`[data-id='prev']`);
  const thumbNavNext = block.querySelector(`[data-id='next']`);
  const thumbnail = new Swiper(thumbnailSwiper, {
    spaceBetween: 10,
    slidesPerView: 4,
    direction: "vertical",
    watchSlidesProgress: true,
    navigation: {
      prevEl: thumbNavPrev,
      nextEl: thumbNavNext
    },
    breakpoints: {
      768: {
        spaceBetween: 10,
        slidesPerView: 5,
        direction: "horizontal"
      },
      1280: {
        spaceBetween: 10,
        slidesPerView: 4
      }
    }
  });
  const swiper = new Swiper(carouselSwiper, {
    spaceBetween: 16,
    effect: "fade",
    navigation: {
      nextEl: swiperNavNext,
      prevEl: swiperNavPrev
    },
    thumbs: {
      swiper: thumbnail
    }
  });
});

// src/modules/card-preview/buy-handler.js
document.addEventListener("DOMContentLoaded", () => {
  const block = document.querySelector(".card-preview");
  if (block) {
    const parent = block.querySelector(".card-preview__control");
    const previewBtn = block.querySelector(`[data-id='buy-btn']`);
    previewBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const newLink = document.createElement("a");
      newLink.textContent = "\u0412 \u041A\u043E\u0440\u0437\u0438\u043D\u0443";
      newLink.href = "javascript:void(0)";
      newLink.className = previewBtn.className;
      newLink.setAttribute("data-id", "buy-btn");
      parent.replaceChild(newLink, previewBtn);
    });
  }
});

// src/modules/detail-tabs/detail-tabs-mob.js
document.addEventListener("DOMContentLoaded", () => {
  const block = document.querySelector(".ui-tabs-accordion");
  if (block) {
    let handleResize = function() {
      const mediaQuery = window.matchMedia("(max-width: 1023px)").matches;
      if (mediaQuery) {
        listContent.forEach((content, idx) => {
          if (!content.parentNode.isEqualNode(tabsContainer)) {
            tabsContainer.appendChild(content);
          }
          listTabs[idx].insertAdjacentElement("afterend", content);
        });
      } else {
        listContent.forEach((content) => {
          if (!content.parentNode.isEqualNode(block)) {
            block.appendChild(content);
          }
        });
      }
    };
    const tabsContainer = block.querySelector(".ui-tabs-accordion__scroll");
    const listTabs = block.querySelectorAll(".ui-tabs__tab");
    const listContent = block.querySelectorAll(".ui-tabs__content");
    handleResize();
    window.addEventListener("resize", handleResize);
  }
});

// src/modules/ui-dropdown/ui-dropdown.module.js
document.addEventListener("DOMContentLoaded", () => {
  const listDropdowns = document.querySelectorAll(".ui-dropdown");
  if (!listDropdowns.length)
    return;
  const inputEvent = new Event("input", {
    bubbles: true,
    cancelable: true
  });
  const moduleToggleVisible = (block) => {
    const panel = block.querySelector(".ui-dropdown__panel");
    panel.addEventListener("click", () => {
      block.classList.add("ui-dropdown--open");
    });
    document.addEventListener("click", ({ target }) => {
      !block.contains(target) && block.classList.remove("ui-dropdown--open");
    });
  };
  const moduleClose = (close) => {
    const items = [...close.querySelectorAll(".ui-dropdown__item")];
    const panel = close.querySelector(`input[type="search"]`);
    const listItems = close.querySelectorAll(".ui-dropdown__item");
    const closeAll = () => {
      listItems.forEach(
        (elem) => elem.classList.remove("ui-dropdown__item--active")
      );
      close.classList.remove("ui-dropdown--open");
    };
    const toggleActive = (elem) => {
      elem.classList.add("ui-dropdown__item--active");
    };
    for (const element of items) {
      element.addEventListener("click", (event) => {
        panel.dispatchEvent(inputEvent);
        panel.value = event.target.innerText.trim();
        element.classList.add("ui-dropdown__item--active");
        closeAll();
        toggleActive(element);
      });
    }
  };
  listDropdowns.forEach((block) => {
    const input = block.querySelector('input[type="search"]');
    moduleToggleVisible(block);
    moduleClose(block);
    if (block.contains(input)) {
      const notFoundMessage = block.querySelector(`[data-id="not-found"]`);
      const listDropdownItems = [
        ...block.querySelectorAll(".ui-dropdown__item")
      ];
      let previousValue = "";
      input.addEventListener("focus", () => {
        if (input.value !== "") {
          previousValue = input.value;
        }
        input.value = "";
        listDropdownItems.forEach((user) => {
          user.classList.remove("ui-dropdown__item--hidden");
        });
        notFoundMessage.style.display = "none";
      });
      input.addEventListener("blur", () => {
        if (input.value.trim() === "") {
          input.value = previousValue;
        }
      });
      input.addEventListener("input", () => {
        const value = input.value.toLowerCase();
        const filteredList = listDropdownItems.filter(
          (item) => item.innerText.toLowerCase().includes(value)
        );
        listDropdownItems.forEach((user) => {
          const isVisible = user.innerText.toLowerCase().includes(value);
          user.classList.toggle("ui-dropdown__item--hidden", !isVisible);
        });
        notFoundMessage.style.display = filteredList.length === 0 ? "block" : "none";
      });
    }
  });
});

// src/modules/cost-calc/cost-calc.module.js
document.addEventListener("DOMContentLoaded", () => {
  const listCalcs = document.querySelectorAll(".cost-calc");
  if (!listCalcs.length)
    return;
  listCalcs.forEach((block) => {
    const listDropdowns = block.querySelectorAll(".ui-dropdown");
    const calculateButton = block.querySelector(".cost-calc__calculate");
    const resultBox = block.querySelector(`[data-result]`);
    const listInputs = [...block.querySelectorAll(`input[type="search"]`)];
    let resultValue = 0;
    listDropdowns.forEach((dropdown) => {
      const listItems = dropdown.querySelectorAll(`[data-value]`);
      listItems.forEach((item) => {
        item.addEventListener("click", () => {
          resultValue = item.getAttribute("data-value");
        });
      });
    });
    block.addEventListener("submit", (event) => {
      event.preventDefault();
      const isError = !validation.listInputsLength(listInputs) && formStateControl.listErrors(listInputs);
      if (isError !== void 0) {
        resultBox.innerText = numberReadable(resultValue);
      }
    });
    block.addEventListener("input", () => {
      formStateControl.changeArray(listInputs);
    });
    function numberReadable(value) {
      const formattedValue = new Intl.NumberFormat("ru-RU").format(value);
      return `${formattedValue} \u20BD`;
    }
  });
});

// src/modules/y-map/map-init.js
document.addEventListener("DOMContentLoaded", () => {
  const block = document.querySelector(".y-map");
  if (!block)
    return;
  const mapContainer = block.querySelector("#map");
  const mapWrap = block.querySelector(".y-map__wrap");
  const loader = block.querySelector(".y-map__loader");
  const initial = () => {
    const myMap = new ymaps.Map("map", {
      center: [55.746841, 37.690192],
      zoom: 15,
      controls: []
    });
    const myPlacemark = new ymaps.Placemark([55.746841, 37.690192], {
      hintContent: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u043E\u0444\u0438\u0441",
      balloonContent: "\u0420\u043E\u0441\u0441\u0438\u044F, \u0433. \u041C\u043E\u0441\u043A\u0432\u0430, 111024 \u0448\u043E\u0441\u0441\u0435 \u042D\u043D\u0442\u0443\u0437\u0438\u0430\u0441\u0442\u043E\u0432, \u0434. 2"
    }, {
      iconLayout: "default#image",
      iconImageSize: [30, 30],
      iconImageOffset: [-15, -30]
    });
    myMap.geoObjects.add(myPlacemark);
    myMap.behaviors.disable("scrollZoom");
  };
  let mapInit = false;
  mapContainer.addEventListener("mouseenter", () => {
    if (!mapInit) {
      mapInit = true;
      loader.classList.add("y-map__loader--active");
      loadMap(
        "https://api-maps.yandex.ru/2.1/?lang=ru_RU&loadByRequire=1&apikey=1c43b794-9f2d-419e-b7b8-aae259ee8651",
        (script) => {
          console.log("modal map loaded");
          ymaps.ready(() => {
            initial();
            loader.classList.remove("y-map__loader--active");
            mapWrap.style.background = "none";
          });
        }
      );
    }
  }, { once: true });
  function loadMap(src, callback) {
    let script = document.createElement("script");
    script.src = src;
    script.type = "text/javascript";
    script.onload = () => callback(script);
    mapContainer.appendChild(script);
  }
});

// src/modules/submenu-content/handle-submenu.js
document.addEventListener("DOMContentLoaded", () => {
  const listSubmenuContents = document.querySelectorAll(".submenu-content");
  const media1024 = window.matchMedia("(min-width: 1280px)").matches;
  if (media1024) {
    listSubmenuContents.forEach((block) => {
      const listSubmenuItems = block.querySelectorAll(".submenu-content__item");
      listSubmenuItems.forEach((item) => {
        const listBodies = item.querySelectorAll(".submenu-content__body");
        const itemOffsetTop = item.offsetTop;
        listBodies.forEach((body) => {
          const currentBodyOffsetTop = body.offsetTop;
          const calc = itemOffsetTop - currentBodyOffsetTop - item.clientHeight + 10;
          item.style.setProperty(
            "--body-top",
            `-${calc <= 0 ? 0 : calc}px`
          );
          item.style.setProperty("--general-height", `${block.clientHeight - 48}px`);
        });
      });
    });
  } else {
    listSubmenuContents.forEach((block) => {
      const listSubmenuItems = block.querySelectorAll(".submenu-content__item");
      listSubmenuItems.forEach((submenu) => {
        submenu.setAttribute("data-id", "accordion");
        initHeaderAccordion(submenu);
      });
    });
  }
});

// src/scripts/form-utils/input-state-event.js
document.addEventListener("DOMContentLoaded", () => {
  const listLabel = document.querySelectorAll(".label");
  const listInput = document.querySelectorAll(".input");
  const listInputSearch = document.querySelectorAll(`input[type="search"]`);
  function initListener(listInputs) {
    listInputs.forEach((block) => {
      block.addEventListener(nameEventForm.error, () => {
        block.setAttribute("is-error", "");
      });
      block.addEventListener(nameEventForm.change, () => {
        block.removeAttribute("is-error");
      });
      block.addEventListener(nameEventForm.reset, () => {
        block.removeAttribute("is-error");
      });
    });
  }
  initListener(listLabel);
  initListener(listInput);
  initListener(listInputSearch);
});

// src/modules/feedback-form/success-control.js
document.addEventListener("DOMContentLoaded", () => {
  const listFeedbackForms = document.querySelectorAll(".feedback-form");
  if (!listFeedbackForms.length)
    return;
  listFeedbackForms.forEach((block) => {
    const form = block.querySelector(".feedback-form__form");
    const frontBody = block.querySelector(`[data-id="front"]`);
    const backBody = block.querySelector(`[data-id="back"]`);
    const inputName = block.querySelector('[data-input="feedback-name"]');
    const inputPhone = block.querySelector('[data-input="feedback-phone"]');
    initialMasked(inputPhone, presetMaskOptions.number);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const isError = [
        !validation.length(inputName) && formStateControl.error(inputName),
        !validation.masked(inputPhone) && formStateControl.error(inputPhone)
      ].every((validate) => validate !== void 0);
      if (isError) {
        frontBody.classList.add("feedback-form__body--hidden");
        backBody.classList.remove("feedback-form__body--hidden");
      }
    });
    form.addEventListener("input", () => {
      formStateControl.change(inputName);
      formStateControl.change(inputPhone);
    });
  });
});

// src/modules/contacts-preview/callback-form.js
document.addEventListener("DOMContentLoaded", () => {
  const block = document.getElementById("callback");
  if (!block)
    return;
  const parentNode = block.closest(".ui-form");
  const inputName = block.querySelector('[data-input="callback-name"]');
  const inputPhone = block.querySelector('[data-input="callback-phone"]');
  const inputMail = block.querySelector('[data-input="callback-mail"]');
  initialMasked(inputPhone, presetMaskOptions.number);
  block.addEventListener("submit", (event) => {
    event.preventDefault();
    const isError = [
      !validation.length(inputName) && formStateControl.error(inputName),
      !validation.email(inputMail) && formStateControl.error(inputMail),
      !validation.masked(inputPhone) && formStateControl.error(inputPhone)
    ].some((validate) => validate !== void 0);
    if (isError) {
      parentNode.classList.add("ui-form--successful");
    }
  });
  block.addEventListener("input", () => {
    formStateControl.change(inputName);
    formStateControl.change(inputPhone);
    formStateControl.change(inputMail);
  });
});
//# sourceMappingURL=main.js.map
