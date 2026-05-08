export default function HeaderSearchForm() {
  return (
    <>
		<div className="header-search-form">
			<div className="close flex items-center justify-center absolute top-0 right-0 bg-white text-3xl cursor-pointer w-12.5 h-12.5"><i className="fa-light fa-xmark"></i></div>
			<div className="container">
				<div className="wrap-form-search-product">
					<div className="productsearchbox">
						<input type="text" placeholder="Tìm kiếm thông tin" />
						<button><i className="fa-light fa-magnifying-glass"></i></button>
					</div>
				</div>
			</div>
		</div>
    </>
  );
}
