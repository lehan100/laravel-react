import Swiper from "swiper";
import { Autoplay, Grid, Navigation, Pagination, Mousewheel, Thumbs } from "swiper/modules";
/**
 * @param swiperInit
 */
export function swiperInit() {
	swiperBanner();
	swiperTreePlan();
	swiperSale();
	swiperPartner();
	swiperAbout7();
	swiperAboutGlobal();
	swiperProductDetail();
	swiperProductDetail6();
	swiperProductDealGoing();
	// swiperHomeBannerMobile();
	swiperProductList();
	swiperProductGroupBuy();
	swiperDealUpComing();
	swiperDealComplete();
}
function swiperBanner() {
	// Kiểm tra Swiper đã được import chưa
	if (typeof Swiper === "undefined") {
		console.warn("Swiper chưa được load!");
		return;
	}

	// Kiểm tra element tồn tại
	const el = document.querySelector(".home-1 .swiper");
	if (!el) {
		console.warn("Không tìm thấy .home-1 .swiper");
		return;
	}

	// Khởi tạo Swiper
	const swiper = new Swiper(el, {
		slidesPerView: 1,
		spaceBetween: 12,
		modules: [Autoplay, Navigation, Pagination],
		loop: true,
		autoplay: {
			delay: 4500,
			disableOnInteraction: false,
		},
		pagination: {
			el: ".home-1 .pagination",
			clickable: true,
		},
		speed: 1000,
		navigation: {
			nextEl: ".home-1 .btn-next",
			prevEl: ".home-1 .btn-prev",
		},
	});
}

function swiperTreePlan() {
	// Kiểm tra Swiper đã load chưa
	if (typeof Swiper === "undefined") {
		return;
	}

	// Kiểm tra element tồn tại
	const el = document.querySelector(".home-2 .swiper");
	if (!el) {
		return;
	}

	// Khởi tạo Swiper
	const swiper = new Swiper(el, {
		slidesPerView: 2,
		spaceBetween: 8,
		modules: [Autoplay, Navigation, Grid],
		loop: true,
		autoplay: {
			delay: 4500,
			disableOnInteraction: false,
		},
		speed: 1000,
		navigation: {
			nextEl: ".home-2 .btn-next",
			prevEl: ".home-2 .btn-prev",
		},
		breakpoints: {
			0: {
				slidesPerView: 4,
				spaceBetween: 8,
				grid: {
					rows: 2, // mobile có 2 dòng
					fill: "row",
				},
			},
			768: {
				slidesPerView: 4,
				spaceBetween: 12,
				grid: {
					rows: 1, // tablet trở lên chỉ 1 dòng
				},
			},
			1200: {
				slidesPerView: 8,
				spaceBetween: 20,
				grid: {
					rows: 1,
				},
			},
		},
	});
}

function initDealSwiper() {
	const container = document.querySelector(".home-1 .wrapper-deal");
	if (!container) return;

	// Nếu đã init rồi thì bỏ qua
	if (container.classList.contains("swiper-initialized")) return;

	if (window.innerWidth < 768) {
		// Container là swiper
		container.classList.add("swiper");

		// Tạo wrapper
		const wrapper = document.createElement("div");
		wrapper.classList.add("swiper-wrapper");

		// Move tất cả item vào wrapper
		const items = Array.from(container.children);
		items.forEach((el) => {
			el.classList.add("swiper-slide");
			wrapper.appendChild(el);
		});

		// Xóa flex layout cũ để Swiper quản lý
		container.classList.remove("flex", "flex-col", "gap-3", "overflow-y-auto");

		// Append wrapper vào container
		container.appendChild(wrapper);

		// Init swiper
		new Swiper(container, {
			slidesPerView: 1.2,
			spaceBetween: 12,
			freeMode: true,
		});
	}
}

window.addEventListener("load", initDealSwiper);
window.addEventListener("resize", () => {
	// Chỉ init 1 lần cho mobile
	if (window.innerWidth < 768) {
		initDealSwiper();
	}
});

function swiperProductList() {
	document.querySelectorAll(".home-5 .home-5-list").forEach((sliderWrapper, index) => {
		const swiperEl = sliderWrapper.querySelector(".swiper");
		const btnPrev = sliderWrapper.querySelector(".btn-prev");
		const btnNext = sliderWrapper.querySelector(".btn-next");

		// Gán class unique cho nav và swiper
		swiperEl.classList.add(`home-5-swiper-${index}`);
		btnPrev?.classList.add(`btn-prev-${index}`);
		btnNext?.classList.add(`btn-next-${index}`);

		const swiper = new Swiper(swiperEl, {
			slidesPerView: 2,
			spaceBetween: 8,
			modules: [Autoplay, Navigation, Grid],
			rewind: true,
			// autoplay: { delay: 4500, disableOnInteraction: false },
			speed: 1000,
			grid: {
				fill: "row",
				rows: 2,
			},
			navigation: {
				prevEl: `.btn-prev-${index}`,
				nextEl: `.btn-next-${index}`,
			},
			breakpoints: {
				768: { spaceBetween: 2, slidesPerView: 4 },
				1024: { slidesPerView: 4, spaceBetween: 12 },
				1200: { slidesPerView: 5, spaceBetween: 20 },
			},
			on: {
				init: function () {
					toggleNav(this);
				},
				resize: function () {
					toggleNav(this);
				},
			},
		});

		function toggleNav(swiperInstance) {
			const totalSlides =
				swiperInstance.slides.length -
				(swiperInstance.params.loop ? 2 * swiperInstance.loopedSlides : 0);
			const width = window.innerWidth;
			let slidesPerView = swiperInstance.params.slidesPerView;

			// Xác định slidesPerView theo breakpoints
			if (width >= 1200 && swiperInstance.params.breakpoints[1200])
				slidesPerView = swiperInstance.params.breakpoints[1200].slidesPerView;
			else if (width >= 1024 && swiperInstance.params.breakpoints[1024])
				slidesPerView = swiperInstance.params.breakpoints[1024].slidesPerView;
			else if (width >= 768 && swiperInstance.params.breakpoints[768])
				slidesPerView = swiperInstance.params.breakpoints[768].slidesPerView;

			if (totalSlides > slidesPerView) {
				btnPrev?.style.setProperty("display", "flex");
				btnNext?.style.setProperty("display", "flex");
			} else {
				btnPrev?.style.setProperty("display", "none");
				btnNext?.style.setProperty("display", "none");
			}
		}
	});
}

function swiperSale() {
	const swiperEl = document.querySelector(".home-4 .slide .swiper");
	if (!swiperEl) {
		return; // thoát nếu không có element
	}

	// Kiểm tra Swiper có được định nghĩa chưa
	if (typeof Swiper === "undefined") {
		return;
	}

	const swiper = new Swiper(swiperEl, {
		slidesPerView: 1,
		modules: [Autoplay, Navigation],
		loop: true,
		autoplay: {
			delay: 4500,
			disableOnInteraction: false,
		},
		speed: 1000,
		navigation: {
			nextEl: ".home-4 .slide .btn-next",
			prevEl: ".home-4 .slide .btn-prev",
		},
	});
}

function swiperPartner() {
	const $swiperEl = document.querySelector(".home-4 .col-right .slide-partner .swiper");

	if ($swiperEl) {
		const swiper = new Swiper($swiperEl, {
			slidesPerView: 2,
			modules: [Autoplay, Navigation, Grid],
			rewind: true,
			autoplay: {
				delay: 4500,
				disableOnInteraction: false,
			},
			speed: 1000,
			grid: {
				fill: "row",
				rows: 2,
			},
			breakpoints: {
				768: {
					spaceBetween: 2,
					slidesPerView: 4,
				},
				1024: {
					slidesPerView: 4,
					spaceBetween: 12,
				},
				1200: {
					slidesPerView: 4,
					spaceBetween: 20,
				},
			},
		});
	}
}

function swiperAboutGlobal() {
	// Kiểm tra Swiper đã load chưa
	if (typeof Swiper === "undefined") {
		console.warn("Swiper chưa được load!");
		return;
	}

	// Kiểm tra element tồn tại
	const el = document.querySelector(".section-about-global .swiper");
	if (!el) {
		return;
	}

	// Khởi tạo Swiper
	const swiper = new Swiper(el, {
		slidesPerView: 1,
		spaceBetween: 12,
		modules: [Autoplay, Navigation, Pagination],
		loop: true,
		pagination: {
			el: ".section-about-global .swiper-pagination",
			clickable: true,
		},
		autoplay: {
			delay: 5500,
			disableOnInteraction: false,
		},
		speed: 1000,
		navigation: {
			nextEl: ".home-1 .btn-next",
			prevEl: ".home-1 .btn-prev",
		},
	});
}

function swiperAbout7() {
	const swiper = new Swiper(".about-7 .swiper", {
		slidesPerView: 2,
		modules: [Autoplay, Navigation],
		loop: true,
		autoplay: {
			delay: 4500,
			disableOnInteraction: false,
		},
		speed: 1000,
		navigation: {
			nextEl: ".about-7 .btn-next",
			prevEl: ".about-7 .btn-prev",
		},
		breakpoints: {
			768: {
				spaceBetween: 3,
				slidesPerView: 4,
			},
			1024: {
				slidesPerView: 4,
				spaceBetween: 12,
			},
			1200: {
				slidesPerView: 6,
				spaceBetween: 40,
			},
		},
	});
}

function swiperProductDetail() {
	// Kiểm tra Swiper đã load chưa
	if (typeof Swiper === "undefined") {
		console.warn("Swiper chưa được load!");
		return;
	}

	const thumbEl = document.querySelector(".product-detail-1 .thumb .swiper");
	const mainEl = document.querySelector(".product-detail-1 .main .swiper");

	if (!thumbEl || !mainEl) {
		return;
	}

	const swiperThumb = new Swiper(thumbEl, {
		modules: [Mousewheel],
		speed: 500,
		observer: true,
		observeParents: true,
		slideToClickedSlide: true,
		rewind: true,
		allowTouchMove: false,
		slidesPerView: 4,
		spaceBetween: 4,
		breakpoints: {
			576: { slidesPerView: 5, spaceBetween: 8 },
			768: { slidesPerView: 4, spaceBetween: 12 },
			1024: { slidesPerView: 5, spaceBetween: 12 },
			1200: { slidesPerView: 6, spaceBetween: 20 },
		},
	});

	const swiperDetail = new Swiper(mainEl, {
		modules: [Thumbs, Navigation, Autoplay],
		spaceBetween: 0,
		slidesPerView: 1,
		rewind: true,
		thumbs: { swiper: swiperThumb },
		speed: 500,
		observer: true,
		observeParents: true,
		navigation: {
			prevEl: ".product-detail-1 .arrow-button .btn-prev",
			nextEl: ".product-detail-1 .arrow-button .btn-next",
		},
	});

	// Gán ra window để sử dụng bên ngoài
	window.productDetailSwiper = { swiperThumb, swiperDetail };
}

function swiperProductDetail6() {
	const swiper = new Swiper(".product-detail-6 .swiper", {
		slidesPerView: 2,
		spaceBetween: 8,
		modules: [Autoplay, Navigation],
		loop: true,
		autoplay: {
			delay: 4500,
			disableOnInteraction: false,
		},
		speed: 1000,
		navigation: {
			nextEl: ".product-detail-6 .btn-next",
			prevEl: ".product-detail-6 .btn-prev",
		},
		breakpoints: {
			768: {
				spaceBetween: 20,
				slidesPerView: 2,
			},
			1024: {
				slidesPerView: 3,
				spaceBetween: 20,
			},
			1200: {
				slidesPerView: 5,
				spaceBetween: 20,
			},
		},
	});
}

function swiperProductDealGoing() {
	if (typeof Swiper === "undefined") {
		console.warn("Swiper chưa được load!");
		return;
	}

	const swiperEl = document.querySelector(".buy-deal-going .swiper");
	if (!swiperEl) {
		return;
	}

	const swiper = new Swiper(swiperEl, {
		slidesPerView: 2,
		spaceBetween: 8,
		modules: [Autoplay, Navigation],
		loop: true,
		// autoplay: {
		// 	delay: 4500,
		// 	disableOnInteraction: false,
		// },
		speed: 1000,
		navigation: {
			nextEl: ".buy-deal-going .btn-next",
			prevEl: ".buy-deal-going .btn-prev",
		},
		breakpoints: {
			768: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
			1024: {
				slidesPerView: 4,
				spaceBetween: 12,
			},
			1200: {
				slidesPerView: 4,
				spaceBetween: 40,
			},
		},
	});
}

function swiperProductGroupBuy() {
	if (typeof Swiper === "undefined") {
		console.warn("Swiper chưa được load!");
		return;
	}

	const swiperEl = document.querySelector(".deal-hot .swiper");
	if (!swiperEl) {
		return;
	}

	const swiper = new Swiper(swiperEl, {
		slidesPerView: 2.1,
		spaceBetween: 8,
		modules: [Autoplay, Navigation],
		loop: true,
		// autoplay: {
		// 	delay: 4500,
		// 	disableOnInteraction: false,
		// },
		speed: 1000,
		navigation: {
			nextEl: ".deal-hot .btn-next",
			prevEl: ".deal-hot .btn-prev",
		},
		breakpoints: {
			768: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
			1024: {
				slidesPerView: 4,
				spaceBetween: 12,
			},
			1200: {
				slidesPerView: 4,
				spaceBetween: 26,
			},
		},
	});
}

function swiperDealUpComing() {
	if (typeof Swiper === "undefined") {
		console.warn("Swiper chưa được load!");
		return;
	}

	const swiperEl = document.querySelector(".deal-upcoming .swiper");
	if (!swiperEl) {
		return;
	}

	const swiper = new Swiper(swiperEl, {
		slidesPerView: 1,
		spaceBetween: 12,
		modules: [Autoplay, Navigation],
		loop: true,
		autoplay: {
			delay: 4500,
			disableOnInteraction: false,
		},
		speed: 1000,
		navigation: {
			nextEl: ".deal-upcoming .btn-next",
			prevEl: ".deal-upcoming .btn-prev",
		},
		breakpoints: {
			768: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
			1024: {
				slidesPerView: 4,
				spaceBetween: 12,
			},
			1200: {
				slidesPerView: 4,
				spaceBetween: 26,
			},
		},
	});
}

function swiperDealComplete() {
	if (typeof Swiper === "undefined") {
		console.warn("Swiper chưa được load!");
		return;
	}

	const swiperEl = document.querySelector(".deal-completed .swiper");
	if (!swiperEl) {
		return;
	}

	const swiper = new Swiper(swiperEl, {
		slidesPerView: 2,
		spaceBetween: 8,
		modules: [Autoplay, Navigation],
		loop: true,
		autoplay: {
			delay: 4500,
			disableOnInteraction: false,
		},
		speed: 1000,
		navigation: {
			nextEl: ".deal-completed .btn-next",
			prevEl: ".deal-completed .btn-prev",
		},
		breakpoints: {
			768: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
			1024: {
				slidesPerView: 4,
				spaceBetween: 12,
			},
			1200: {
				slidesPerView: 4,
				spaceBetween: 26,
			},
		},
	});
}
