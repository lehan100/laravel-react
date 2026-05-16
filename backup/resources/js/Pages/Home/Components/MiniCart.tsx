export default function MiniCart() {
  return (
    <>
		<div className="mini-cart-wrapper fixed top-0 right-0 w-full bg-neutral-50 h-full z-[160] px-4 py-6 flex flex-col transition-all duration-300 translate-x-full shadow-light" id="mini-cart-wrapper">
			<div className="top relative">
				<div className="close-mini-cart w-10 h-10 flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 group bg-Primary-1 hover:bg-Primary-Brown transition-300 cursor-pointer"><i className="fa-regular fa-arrow-left text-Neutral-White text-xl font-bold group-hover:text-white"></i></div>
				<div className="title rem:text-[28px] uppercase font-bold text-center">Giỏ hàng</div>
			</div>
			<div className="middle border-t border-t-neutral-200 mt-3 py-3 flex-1 h-full flex flex-col overflow-hidden">
				<div className="list overflow-auto"><p className="woocommerce-mini-cart__empty-message">No products in the cart.</p>
					<div className="mini-cart-item">
						<div className="img"> <a className="img-ratio" href="#"><img className="lozad undefined" data-src="/home-template/img/1.jpg" alt=""/></a></div>
						<div className="content">
							<div className="remove-item"><i className="fa-regular fa-trash-can"></i></div>
							<div className="title">Thực phẩm chay</div>
							<div className="price-wrapper"> 
								<div className="quantity">1x</div>
								<div className="price">30.000 đ</div>
							</div>
						</div>
					</div>
					<div className="mini-cart-item">
						<div className="img"> <a className="img-ratio" href="#"><img className="lozad undefined" data-src="/home-template/img/1.jpg" alt=""/></a></div>
						<div className="content">
							<div className="remove-item"><i className="fa-regular fa-trash-can"></i></div>
							<div className="title">Thực phẩm chay</div>
							<div className="price-wrapper"> 
								<div className="quantity">1x</div>
								<div className="price">30.000 đ</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="bottom pt-3 border-t border-t-neutral-200 space-y-4">
				<div className="cart-quantity flex items-center justify-between gap-2">
					<div className="title text-xl font-bold">Số lượng</div>
					<div className="ctn font-medium">3 sản phẩm</div>
				</div>
				<div className="total flex items-center justify-between gap-2">
					<div className="title subheader-20 font-bold">Tổng thanh toán</div>
					<div className="ctn font-medium">250.000 đ</div>
				</div>
				<div className="checkout border-t border-t-neutral-200 pt-3 flex items-center justify-center"><a className="btn btn-primary  w-full" href="#"> <span>Xem giỏ hàng </span></a></div>
			</div>
		</div>
    </>
  );
}
