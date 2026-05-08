import AOS from "aos";
import lozad from "lozad";
import {
	setBackgroundElement,
	detectCloseElement,
	buttonToTop,
	clickScrollToDiv,
	countUpInit,
	ToggleItem,
	replaceSvgImages,
} from "./helper";
import { header } from "./header";
import { swiperInit } from "./swiper";
import Swal from "sweetalert2";

$(document).ready(function () {
	setBackgroundElement();
	header.init();
	swiperInit();
	buttonToTop();
	replaceSvgImages();
	handleFlashSale();
	ToggleItem();
	hoverImage();
	toggleCheckbox();
	// initCountdown();
	initCountdownBuyNow();
	getHeightChild();
	showMoreContent();
	toggleFillterProduct();
	toggleProductCategory();
	// initCountdownTimeSale();
	initDragScrollTabs();
	initSystemMap();
	loadMoreJobs();

	if ($.fn.select2) {
		$.fn.select2.amd.require(["select2/i18n/vi"], function (vi) {
			$(".select2").select2({
				language: vi,
			});
		});
	}

	window.addEventListener("scroll", function () {
		const headerTop = document.querySelector(".header-top");
		const headerBottom = document.querySelector(".header-bottom");

		if (!headerTop || !headerBottom) return;

		const topHeight = headerTop.offsetHeight;
		const bottomHeight = headerBottom.offsetHeight;

		if (window.scrollY >= topHeight) {
			if (!headerBottom.classList.contains("is-fixed")) {
				headerBottom.classList.add("is-fixed");
				// thêm khoảng trống để giữ bố cục không bị nhảy
				headerBottom.parentNode.style.paddingTop = bottomHeight + "px";
			}
		} else {
			headerBottom.classList.remove("is-fixed");
			headerBottom.parentNode.style.paddingTop = "0";
		}
	});
});

function initSystemMap() {
	const $iframe = $(".system-map-frame");
	const $items = $(".system .col-right .item");

	if ($items.length === 0 || $iframe.length === 0) return;

	// Lấy item active nếu có, nếu không thì lấy item đầu tiên
	let $activeItem = $items.filter(".active");
	if ($activeItem.length === 0) {
		$activeItem = $items.first().addClass("active");
	}

	// Set src map ban đầu
	const defaultMapUrl = $activeItem.data("map");
	if (defaultMapUrl) {
		// data-map của bạn đang chứa <iframe> -> cần parse ra src
		const srcMatch = defaultMapUrl.match(/src="([^"]+)"/);
		if (srcMatch) $iframe.attr("src", srcMatch[1]);
	}

	// Sự kiện click
	$("body")
		.off("click", ".system .col-right .item")
		.on("click", ".system .col-right .item", function () {
			const mapHtml = $(this).data("map");
			if (!mapHtml) return;

			const srcMatch = mapHtml.match(/src="([^"]+)"/);
			if (srcMatch) {
				$iframe.attr("src", srcMatch[1]);
			}

			$items.removeClass("active");
			$(this).addClass("active");
		});
}

function toggleProductCategory() {
	$(".product-category").each(function () {
		const $cat = $(this);
		const $heading = $cat.find(".product-category-heading");
		const $productMain = $cat.find(".product-main");
		const $icon = $heading.find(".icon i");
		const $facet = $productMain.find(".facetwp-facet");

		// Nếu facet rỗng thì ẩn icon + bỏ margin-bottom
		if (!$facet.length || $.trim($facet.html()) === "") {
			$icon.hide();
			$heading.addClass("no-mb"); // class tùy bạn đặt
		} else {
			$icon.show();
			$heading.removeClass("no-mb");
		}
	});

	// Toggle khi click heading
	$(".product-category-heading")
		.off("click")
		.on("click", function () {
			const $heading = $(this);
			const $productMain = $heading.next(".product-main");
			const $icon = $heading.find(".icon i");

			if ($icon.is(":hidden")) return; // facet rỗng thì bỏ qua

			$productMain.stop(true, true).slideToggle(300);
			$icon.toggleClass("fa-chevron-down fa-chevron-up");
		});
}
function showNotification(type, title = "", description = "", duration = 2000) {
	const icons = ["success", "error", "warning", "info"];

	if (!icons.includes(type)) type = "info";

	Swal.fire({
		icon: type,
		title: title,
		text: description,
		timer: duration,
		showConfirmButton: false,
		toast: true, // hiện dạng toast gọn gàng
		position: "top-end", // góc trên bên phải
		timerProgressBar: true,
	});
}
// Gán vào window để global
window.showNotification = showNotification;

// Gọi sau khi facet render xong (FacetWP có event này)
$(document).on("facetwp-loaded", function () {
	toggleProductCategory();
});

function handleFlashSale() {
	$(".product-item-sale").each(function () {
		var $item = $(this);

		// ====== Xử lý sell-line ======
		$(".sell-line").each(function () {
			const $line = $(this);
			const sold = parseInt($line.data("sold")) || 0;
			const total = parseInt($line.data("total")) || 0;

			const percent = total > 0 ? Math.min((sold / total) * 100, 100) : 0;
			$line.css("--product", percent.toFixed(2)); // gán biến CSS

			$line.find("span").text(`Đã bán ${sold}`);
		});
	});
}

// === Countdown chung cho tất cả loại ===
function initCountdowns(context = document) {
	// Countdown bình thường
	context.querySelectorAll(".home-3 .countdown").forEach((el) => {
		setupCountdown(el, "dd/mm/yyyy", "Đã kết thúc");
	});

	// Countdown time-sale
	context.querySelectorAll(".time-sale .countdown").forEach((el) => {
		setupCountdownTimeSale(el);
	});
}

// Hàm setup countdown đơn giản
function setupCountdown(el, format = "dd/mm/yyyy", endText = "Đã kết thúc") {
	const targetDateStr = el.dataset.countdown || el.dataset.end;
	if (!targetDateStr) {
		console.warn("Thiếu data-countdown:", el);
		return;
	}

	// Convert dd/mm/yyyy → mm/dd/yyyy nếu cần
	let normalizedStr = targetDateStr;
	if (format === "dd/mm/yyyy") {
		normalizedStr = targetDateStr.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3");
	}

	const targetDate = new Date(normalizedStr).getTime();
	if (isNaN(targetDate)) {
		el.textContent = "Ngày không hợp lệ";
		return;
	}

	if (!el.querySelector(".hours")) {
		el.innerHTML = `
            <span class="hours">00</span> :
            <span class="minutes">00</span> :
            <span class="seconds">00</span>
        `;
	}

	const hoursEl = el.querySelector(".hours");
	const minutesEl = el.querySelector(".minutes");
	const secondsEl = el.querySelector(".seconds");

	function update() {
		const now = Date.now();
		const distance = targetDate - now;

		if (distance <= 0) {
			el.textContent = endText;
			clearInterval(intervalId);
			return;
		}

		const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((distance % (1000 * 60)) / 1000);

		hoursEl.textContent = String(hours).padStart(2, "0");
		minutesEl.textContent = String(minutes).padStart(2, "0");
		secondsEl.textContent = String(seconds).padStart(2, "0");
	}

	update();
	const intervalId = setInterval(update, 1000);
}
function setupCountdownTimeSale(el) {
	const startStr = el.dataset.start;
	const endStr = el.dataset.end;

	if (!endStr) {
		console.warn("Thiếu data-end:", el);
		return;
	}

	const normalizeISO = (str) => {
		if (!str) return null;
		let s = str;
		if (!s.includes(":")) s += "T00:00:00";
		else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) s += ":00";
		return new Date(s).getTime();
	};

	const startTime = startStr ? normalizeISO(startStr) : null;
	const endTime = normalizeISO(endStr);

	if (isNaN(endTime) || (startTime && isNaN(startTime))) {
		el.textContent = "Ngày không hợp lệ";
		return;
	}

	// Tạo HTML nếu chưa có
	if (!el.querySelector(".hours")) {
		el.innerHTML = `
			<span class="hours">00</span> :
			<span class="minutes">00</span> :
			<span class="seconds">00</span>
		`;
	}

	const hoursEl = el.querySelector(".hours");
	const minutesEl = el.querySelector(".minutes");
	const secondsEl = el.querySelector(".seconds");

	let intervalId = null;

	function updateCountdown() {
		const now = Date.now();

		// Chưa bắt đầu
		if (startTime && now < startTime) {
			hoursEl.textContent = minutesEl.textContent = secondsEl.textContent = "00";
			el.dataset.status = "not-started";
			return;
		}

		// Đã kết thúc
		if (now >= endTime) {
			hoursEl.textContent = minutesEl.textContent = secondsEl.textContent = "00";
			el.dataset.status = "ended";
			clearInterval(intervalId);
			return;
		}

		// Đang chạy
		const distance = endTime - now;

		// Tổng số giây còn lại
		const totalSeconds = Math.floor(distance / 1000);

		// Đổi thành giờ:phút:giây
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		hoursEl.textContent = String(hours).padStart(2, "0");
		minutesEl.textContent = String(minutes).padStart(2, "0");
		secondsEl.textContent = String(seconds).padStart(2, "0");
		el.dataset.status = "running";
	}

	updateCountdown();
	intervalId = setInterval(updateCountdown, 1000);
}

// function setupCountdownTimeSale(el) {
// 	const startStr = el.dataset.start;
// 	const endStr = el.dataset.end;

// 	if (!endStr) {
// 		console.warn("Thiếu data-end:", el);
// 		return;
// 	}

// 	const normalizeISO = (str) => {
// 		if (!str) return null;
// 		let s = str;
// 		if (!s.includes(":")) s += "T00:00:00";
// 		else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) s += ":00";
// 		// ❌ bỏ phần thêm "Z" để lấy theo local time
// 		return new Date(s).getTime();
// 	};

// 	const startTime = startStr ? normalizeISO(startStr) : null;
// 	const endTime = normalizeISO(endStr);

// 	if (isNaN(endTime) || (startTime && isNaN(startTime))) {
// 		el.textContent = "Ngày không hợp lệ";
// 		return;
// 	}

// 	// Tạo HTML nếu chưa có
// 	if (!el.querySelector(".hours")) {
// 		el.innerHTML = `
// 			<span class="hours">00</span> :
// 			<span class="minutes">00</span> :
// 			<span class="seconds">00</span>
// 		`;
// 	}

// 	const hoursEl = el.querySelector(".hours");
// 	const minutesEl = el.querySelector(".minutes");
// 	const secondsEl = el.querySelector(".seconds");

// 	let intervalId = null;

// 	function updateCountdown() {
// 		const now = Date.now();

// 		// Chưa bắt đầu
// 		if (startTime && now < startTime) {
// 			hoursEl.textContent = "00";
// 			minutesEl.textContent = "00";
// 			secondsEl.textContent = "00";
// 			el.dataset.status = "not-started";
// 			return;
// 		}

// 		// Đã kết thúc
// 		if (now >= endTime) {
// 			hoursEl.textContent = "00";
// 			minutesEl.textContent = "00";
// 			secondsEl.textContent = "00";
// 			el.dataset.status = "ended";
// 			clearInterval(intervalId);
// 			return;
// 		}

// 		// Đang chạy
// 		const distance = endTime - now;

// 		const hours = Math.floor(distance / (1000 * 60 * 60)); // ✅ tổng giờ
// 		const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
// 		const seconds = Math.floor((distance % (1000 * 60)) / 1000);

// 		hoursEl.textContent = String(hours).padStart(2, "0");
// 		minutesEl.textContent = String(minutes).padStart(2, "0");
// 		secondsEl.textContent = String(seconds).padStart(2, "0");
// 		el.dataset.status = "running";
// 	}

// 	updateCountdown();
// 	intervalId = setInterval(updateCountdown, 1000);
// }

// Gọi lần đầu khi DOM load
document.addEventListener("DOMContentLoaded", () => {
	initCountdowns();
});

// Re-init khi AJAX render xong (ví dụ FacetWP)
document.addEventListener("facetwp-loaded", () => {
	initCountdowns(); // Chỉ định context nếu muốn giới hạn
});

function initCountdownBuyNow() {
	const countdownEls = document.querySelectorAll(".gbw-countdown");
	if (!countdownEls.length) return;

	countdownEls.forEach((countdownEl) => {
		const startTimeStr = countdownEl.dataset.start;
		const endTimeStr = countdownEl.dataset.end;

		if (!endTimeStr) {
			console.warn("Thiếu data-end:", countdownEl);
			return;
		}

		const startTime = startTimeStr ? new Date(startTimeStr).getTime() : null;
		const endTime = new Date(endTimeStr).getTime();

		if (isNaN(endTime) || (startTime && isNaN(startTime))) {
			const el = countdownEl.querySelector(".gbw-countdown-time");
			if (el) el.textContent = "Ngày không hợp lệ";
			return;
		}

		function updateCountdown() {
			const now = Date.now();
			const el = countdownEl.querySelector(".gbw-countdown-time");
			if (!el) return;

			// chưa đến thời gian start
			if (startTime && now < startTime) {
				el.textContent = "Chưa bắt đầu";
				return;
			}

			// đã kết thúc
			if (now >= endTime) {
				el.textContent = "Đã kết thúc";
				clearInterval(intervalId);
				return;
			}

			// trong khoảng start → end
			const distance = endTime - now;
			const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((distance % (1000 * 60)) / 1000);

			el.textContent = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
				2,
				"0"
			)}:${String(seconds).padStart(2, "0")}`;
		}

		updateCountdown();
		const intervalId = setInterval(updateCountdown, 1000);
	});
}

function hoverImage() {
	const toggles = document.querySelectorAll(".about-8 .item-toggle");
	const images = document.querySelectorAll(".about-8 .col-right .img");

	toggles.forEach((item) => {
		const title = item.querySelector(".title");
		const id = item.dataset.id;

		title.addEventListener("click", () => {
			// Reset ảnh
			images.forEach((img) => img.classList.remove("active"));

			// Show ảnh theo data-id
			const targetImg = document.querySelector(`.about-8 .col-right .img[data-id="${id}"]`);
			if (targetImg) targetImg.classList.add("active");
		});
	});

	// 👉 Sync ban đầu: active ảnh đầu tiên
	const firstToggle = document.querySelector(".about-8 .item-toggle");
	if (firstToggle) {
		const id = firstToggle.dataset.id;
		const targetImg = document.querySelector(`.about-8 .col-right .img[data-id="${id}"]`);
		if (targetImg) targetImg.classList.add("active");
	}
}

function toggleCheckbox() {
	document.querySelectorAll(".facetwp-checkbox").forEach((checkbox) => {
		// Đảm bảo checkbox không có class "checked" khi mới load
		checkbox.classList.remove("checked");

		// Thêm sự kiện click để toggle class "checked"
		checkbox.addEventListener("click", function () {
			this.classList.toggle("checked");
		});
	});
}
function toggleFillterProduct() {
	// Bật / tắt class active khi click toggle
	$(".toggle-filter").on("click", function () {
		$(".col-left").toggleClass("active");
	});

	// Xoá class active khi click nút đóng
	$(".btn-close-filter-product-mobile").on("click", function () {
		$(".col-left").removeClass("active");
	});
}
function showMoreContent() {
	$(".product-detail-3 .view-more").on("click", function (e) {
		e.preventDefault();
		$(".format-content").toggleClass("expanded");

		// Đổi icon/label nếu cần
		const isExpanded = $(".product-detail-3 .wrap .format-content").hasClass("expanded");
		$(this)
			.find("span")
			.text(isExpanded ? "Thu gọn" : "Xem thêm");
		$(this).find("i").toggleClass("fa-angle-down fa-angle-up");
	});
}

function loadMoreJobs() {
	const btnMore = document.querySelector(".more");
	if (!btnMore) return;

	const hiddenRows = document.querySelectorAll("tr.hidden");
	let index = 0;
	const showCount = 4;

	function handleLoadMore(event) {
		event.preventDefault();

		for (let i = index; i < index + showCount && i < hiddenRows.length; i++) {
			hiddenRows[i].classList.remove("hidden");
		}
		index += showCount;

		btnMore.style.display = index < hiddenRows.length ? "flex" : "none";
	}

	btnMore.addEventListener("click", handleLoadMore);

	btnMore.style.display = hiddenRows.length > 0 ? "flex" : "none";
}

function getHeightChild() {
	$(".item-var-height").each(function () {
		const height = $(this).outerHeight();
		$(this)
			.closest(".wrap-item-height")
			.css("--height-ele", height + "px");
	});
}

function initDragScrollTabs() {
	const tabContainers = document.querySelectorAll("ul.tabslet-tab");

	tabContainers.forEach((container) => {
		let isDown = false;
		let startX;
		let scrollLeft;

		container.addEventListener("mousedown", (e) => {
			isDown = true;
			container.classList.add("active");
			startX = e.pageX - container.offsetLeft;
			scrollLeft = container.scrollLeft;
		});

		container.addEventListener("mouseleave", () => {
			isDown = false;
			container.classList.remove("active");
		});

		container.addEventListener("mouseup", () => {
			isDown = false;
			container.classList.remove("active");
		});

		container.addEventListener("mousemove", (e) => {
			if (!isDown) return;
			e.preventDefault();
			const x = e.pageX - container.offsetLeft;
			const walk = (x - startX) * 2; // Tốc độ kéo (có thể điều chỉnh)
			container.scrollLeft = scrollLeft - walk;
		});
	});
}

/*==================== Aos Init ====================*/
AOS.init({
	offset: 100,
});
/*==================== Lazyload JS ====================*/
const observer = lozad(); // lazy loads elements with default selector as '.lozad'
observer.observe();
