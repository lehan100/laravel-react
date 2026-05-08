export function headerSearch() {
	function closeSearch() {
		$(".header-search-form").removeClass("active");
		$(".header-search, .header-search-mobile").removeClass("active");
		$("body").removeClass("disable");
	}

	// Mở thanh tìm kiếm khi click vào .header-search hoặc .header-search-mobile
	$(".header-search, .header-search-mobile").on("click", function (e) {
		e.preventDefault();
		$(".header-search-form").addClass("active");
		$(".header-search, .header-search-mobile").addClass("active");
		$("body").addClass("disable");

		// Focus vào input sau 400ms
		setTimeout(() => {
			$(".header-search-form .searchinput").focus();
		}, 400);
	});

	// Nút đóng trong form
	$(".header-search-form .close").on("click", function () {
		closeSearch();
	});

	// Bấm Escape để thoát
	$(document).on("keyup", function (e) {
		if (e.key === "Escape") {
			closeSearch();
		}
	});

	// Bấm ra ngoài để đóng
	$(document).on("click", function (e) {
		if ($(".header-search-form").hasClass("active")) {
			if (
				!$(e.target).closest(".productsearchbox").length &&
				!$(e.target).closest(".header-search").length &&
				!$(e.target).closest(".header-search-mobile").length
			) {
				closeSearch();
			}
		}
	});
}
