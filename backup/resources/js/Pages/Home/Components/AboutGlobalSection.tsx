export default function AboutGlobalSection() {
  return (
    <>
				<section className="section-about-global pt-15 rem:pb-[97px] relative">
					<div className="bg rem:w-[179px] absolute rem:bottom-[14px] rem:left-[37px]"><a className="img-ratio ratio:pt-[261_179]" href="#"> <img className="lozad undefined" data-src="/home-template/img/icon-about.png" alt=""/></a></div>
					<div className="container"> 
						<div className="wrapper grid lg:grid-cols-2 grid-cols-1">
							<div className="col-left xl:pr-25">
								<h2 className="title-40 text-Primary-1 !font-semibold mb-base"> Giới thiệu về NÔNG DƯỢC <span className="text-Primary-2">XANH</span></h2>
								<div className="format-content text-lg font-normal mb-base">
									<p>Chuỗi cửa hàng vật tư nông nghiệp Chính hãng – Chất lượng vượt trội – Đồng hành cùng nhà nông</p>
									<p>CÔNG TY TNHH THƯƠNG MẠI NÔNG DƯỢC XANH là chuỗi cửa hàng cung cấp vật tư nông nghiệp chính hãng với chất lượng vượt trội, chuyên phục vụ người nông dân trên hành trình canh tác bền vững và hiệu quả. Với triết lý “Farmer-centric – Lấy lợi ích của người nông dân làm trung tâm của mọi hành động”, chúng tôi cam kết mang đến giá trị thực sự và lâu dài cho nhà nông.</p>
								</div>
								<div className="btn-view-shop"><a className="btn-primary btn " href=""><span>Xem hệ thống cửa hàng</span></a></div>
							</div>
							<div className="col-right xl:pl-10"> 
								<div className="slide relative">
									<div className="swiper"> 
										<div className="swiper-wrapper">
											<div className="swiper-slide"> 
												<div className="img"> <a className="img-ratio ratio:pt-[453_679] zoom-img rounded-5" href="#"> <img className="lozad undefined" data-src="/home-template/img/1.jpg" alt=""/></a></div>
											</div>
											<div className="swiper-slide"> 
												<div className="img"> <a className="img-ratio ratio:pt-[453_679] zoom-img rounded-5" href="#"> <img className="lozad undefined" data-src="/home-template/img/1.jpg" alt=""/></a></div>
											</div>
											<div className="swiper-slide"> 
												<div className="img"> <a className="img-ratio ratio:pt-[453_679] zoom-img rounded-5" href="#"> <img className="lozad undefined" data-src="/home-template/img/1.jpg" alt=""/></a></div>
											</div>
										</div>
									</div>
									<div className="pagination flex-center left-2/4 -translate-x-2/4 bottom-10 absolute z-10">
										<div className="swiper-pagination"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
    </>
  );
}
