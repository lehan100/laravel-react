import { headerSearch } from "../../plugins/ComponentsUi/HeaderSearch/HeaderSearch";
import { detectCloseElement } from "./helper";
/*==================== Header ====================*/
/**
 * @param header
 */
const vw = $(window).width();
export const header = {
	scrollActive: function () {
		let height = $("header").height();
		if ($(window).scrollTop() > height) {
			$("header").addClass("active");
		} else {
			$("header").removeClass("active");
		}
	},
	megamenu: function () {
		const isDesktop = window.matchMedia("(min-width: 1199.98px)").matches;
		if (!isDesktop) return;

		// Toggle mega menu khi click vào nút danh mục
		$(document).on("mouseenter", ".dropdown-product", function () {
			const $menu = $(this).find(".menu-mega-main");

			// Ẩn menu khác
			$(".menu-mega-main").not($menu).removeClass("active");

			// Hiện menu hiện tại
			$menu.addClass("active");

			// 👉 Reset tab-content-menu
			const $allTabs = $menu.find(".tab-content-menu");
			const $firstTabContent = $allTabs.first();
			$allTabs.hide();
			$firstTabContent.show();

			// 👉 Reset tab cha (tab-item)
			const $tabItems = $menu.find(".menu-list a.tab-item");
			$tabItems.removeClass("active");
			$tabItems.first().addClass("active");
		});

		$(document).on("mouseleave", ".dropdown-product", function () {
			const $menu = $(this).find(".menu-mega-main");
			$menu.removeClass("active");
		});

		// Hover tab cha
		$(document).on("mouseenter", ".menu-list a.tab-item", function (e) {
			e.preventDefault();
			const targetId = $(this).data("tab");

			const $menuWrapper = $(this).closest(".menu-mega-main");
			$menuWrapper.find(".tab-content-menu").hide();
			$menuWrapper.find(targetId).show();

			// 👉 highlight tab đang hover
			$menuWrapper.find(".menu-list a.tab-item").removeClass("active");
			$(this).addClass("active");
		});

		// Hover tab con
		$(document).on("mouseenter", ".menu-sub-list a.tab-item", function (e) {
			e.preventDefault();
			const targetId = $(this).data("tab");

			const $tabContent = $(this).closest(".tab-content-menu");
			$tabContent.find(".tab-content-sub").hide();
			$tabContent.find(targetId).show();
		});

		// Click ngoài để đóng menu
		$(document).on("click", function (e) {
			if (!$(e.target).closest(".dropdown-product").length) {
				$(".menu-mega-main").removeClass("active");
			}
		});

		// Nút close trong menu
		$(document).on("click", ".menu-mega-main .close", function () {
			$(this).closest(".menu-mega-main").removeClass("active");
		});
	},

	mobile: function () {
		$(".header-bar").on("click", function () {
			$(this).toggleClass("active");
			$("body").toggleClass("isOpenMenu");

			// Đổi icon
			// const $icon = $(this).find("i");
			// $icon.toggleClass("fa-bars fa-xmark");
		});

		// rã lại một cái mega mobile

		if (window.matchMedia("(max-width: 1199.98px)").matches) {
			// Ẩn tất cả sub-menu ban đầu
			$(".header-nav-mobile .sub-menu").hide();

			// Bọc <a> trong .menu-item và thêm icon-arrow
			$(".header-nav-mobile li.menu-item-has-children > a").each(function () {
				$(this)
					.wrap('<div class="menu-item"></div>')
					.parent()
					.append('<div class="icon-arrow"></div>');
			});

			// Click vào icon-arrow để mở/đóng submenu
			$(".header-nav-mobile li.menu-item-has-children .icon-arrow").on("click", function () {
				$(this).closest("li").toggleClass("active");
				$(this).closest("li").find("> .sub-menu").slideToggle();
			});
		}
		// click ra ngoài thì đóng menu
		$(document).on("click", function (e) {
			// kiểm tra nếu click không nằm trong menu và không nằm trong nút hamburger
			if (!$(e.target).closest(".menu, .header-bar").length && $("body").hasClass("isOpenMenu")) {
				$(".header-bar").removeClass("active");
				$("body").removeClass("isOpenMenu");
			}
		});

		if (window.innerWidth < 1198) {
			// Ẩn các menu con ban đầu
			$(
				".header-menu .sub-menu, .header-menu .sub-menu-children, .header-menu .sub-menu-children-dropdown"
			).hide();

			// Bắt sự kiện click vào menu cha
			$('.header-menu li[class*="menu-item-has-children"] > a').on("click", function (e) {
				e.preventDefault();

				$(this)
					.toggleClass("dropdown-active")
					.next()
					.slideToggle()
					.parent()
					.siblings()
					.find("a")
					.removeClass("dropdown-active")
					.next()
					.slideUp();
			});
		}

		$(function () {
			const $menuMobile = $(".header-menu-mobile");

			// Xử lý click mega menu (step navigation)
			$(document).on("click", ".header-menu-mobile .dropdown-product > a", function (e) {
				e.preventDefault();
				const currentStep = parseInt($menuMobile.attr("data-step-index")) || 0;
				const nextStep = currentStep + 1;

				// Ẩn step hiện tại và hiện step mới
				$(this).next(".menu-mega-main").addClass("active").attr("data-step", nextStep);
				$menuMobile.attr("data-step-index", nextStep);

				// Hiện nút close
				$(".header-title-close .close").addClass("show");
			});

			// Xử lý click tab trong mega menu
			$(document).on("click", ".header-menu-mobile .tab-item", function (e) {
				const tabId = $(this).data("tab");
				if (!tabId) return;

				e.preventDefault();
				const currentStep = parseInt($menuMobile.attr("data-step-index")) || 0;
				const nextStep = currentStep + 1;

				$menuMobile.attr("data-step-index", nextStep);
				$(tabId).addClass("active").attr("data-step", nextStep).siblings().removeClass("active");
			});

			// Xử lý nút close (back hoặc đóng menu)
			$(document).on("click", ".header-title-close .close", function () {
				let currentStep = parseInt($menuMobile.attr("data-step-index")) || 0;

				if (currentStep > 0) {
					$(`[data-step="${currentStep}"]`).removeClass("active");
					currentStep -= 1;
					$menuMobile.attr("data-step-index", currentStep);
					if (currentStep === 0) $(this).removeClass("show");
				} else {
					$("body").removeClass("isOpenMenu");
					$(this).removeClass("show");
				}
			});

			// 	// Xử lý menu thường (slideToggle + đổi icon)
			if (window.innerWidth < 1198) {
				$(".header-menu .sub-menu").hide();

				$(document).on("click", ".header-menu li.menu-item-has-children > a", function (e) {
					// Nếu là mega menu thì bỏ qua
					if ($(this).closest(".dropdown-product").length) return;

					e.preventDefault();
					const $icon = $(this).find("i.fa-solid");

					$(this)
						.toggleClass("dropdown-active")
						.next(".sub-menu")
						.slideToggle()
						.parent()
						.siblings()
						.find(".sub-menu")
						.slideUp()
						.prev("a")
						.removeClass("dropdown-active")
						.find("i.fa-solid")
						.removeClass("fa-angle-up")
						.addClass("fa-angle-down");

					// Đổi icon cho menu hiện tại
					if ($(this).hasClass("dropdown-active")) {
						$icon.removeClass("fa-chevron-down ").addClass("fa-angle-up");
					} else {
						$icon.removeClass("fa-angle-up").addClass("fa-angle-down");
					}
				});
			}
		});
	},

	initVariable: function () {
		const $header = document.querySelector("header");
		if (!$header) return;

		// Hàm cập nhật chiều cao header
		function updateHeaderHeight() {
			const height = $header.offsetHeight;
			document.documentElement.style.setProperty("--header-height", `${height}px`);
		}

		// Cập nhật ban đầu
		updateHeaderHeight();

		// Theo dõi mọi thay đổi chiều cao của header
		const ro = new ResizeObserver(updateHeaderHeight);
		ro.observe($header);

		// Phòng trường hợp ảnh hoặc font chưa load xong
		window.addEventListener("load", () => {
			setTimeout(updateHeaderHeight, 100);
		});
	},
	openMiniCart: () => {
		$("header .header-cart").addClass("active");
		$(".mini-cart-wrapper").addClass("active");
	},
	// closeMiniCart: () => {
	// 	$("header .header-cart").removeClass("active");
	// 	$(".mini-cart-wrapper").removeClass("active");
	// },
	// handleOpenMiniCart: () => {
	// 	$("body").on("click", "header .header-cart", function () {
	// 		header.openMiniCart();
	// 	});
	// 	$(document).on("click", function (event) {
	// 		var $trigger = $("header .header-cart");
	// 		var $trigger_2 = $(".mini-cart-wrapper");
	// 		if (
	// 			$trigger !== event.target &&
	// 			!$trigger.has(event.target).length &&
	// 			$trigger_2 !== event.target &&
	// 			!$trigger_2.has(event.target).length &&
	// 			$(".mini-cart-wrapper").hasClass("active")
	// 		) {
	// 			console.log("close");
	// 			header.closeMiniCart();
	// 		}
	// 	});
	// 	$(".close-mini-cart").on("click", function () {
	// 		header.closeMiniCart();
	// 	});
	// },

	init: function () {
		if (window.matchMedia("(max-width: 1199.98px)").matches) {
			$(".header-menu").appendTo(".header-menu-mobile");
		}

		headerSearch();
		header.scrollActive();
		header.megamenu();
		// header.handleOpenMiniCart();
		header.mobile();
		header.initVariable();
	},
};
document.addEventListener(
	"scroll",
	function (e) {
		header.scrollActive();
	},
	true
);
