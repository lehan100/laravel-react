export default function Header() {
  return (
    <>
		<header className="header">
			<div className="header-top bg-Primary-1">
				<div className="container"> 
					<div className="header-top-wrapper flex items-center justify-between">
						<div className="header-top-left rem:max-w-[560px] w-full flex items-center rem:gap-[63px]">
							<div className="header-logo rem:w-[139px]"><a className="img-ratio ratio:pt-[55_139]" href="#"> <img className="lozad undefined" data-src="/home-template/img/logo.svg" alt=""/></a></div>
							<div className="header-top-search xl:block hidden">
								<form action=""> 
									<div className="product-search-box">
										<input type="text" placeholder="Bạn tìm gì..." />
										<button>
											 <i className="fa-light fa-magnifying-glass"></i></button>
									</div>
								</form>
							</div>
						</div>
						<div className="header-top-right flex-1 w-full flex justify-end">
							<div className="header-cart flex items-center gap-3">
								<div className="icon text-xl text-Primary-1">
									 <i className="fa-regular fa-cart-shopping"></i>
									<div className="cart-quantity">1</div>
								</div>
							</div>
							<div className="header-search"> <i className="fa-regular fa-magnifying-glass"></i></div>
							<div className="header-bar"> <i className="fa-solid fa-bars"></i></div>
							<div className="header-right-auth xl:flex hidden items-center gap-3">
								<div className="header-auth-item group"><a href="#"> 
										<div className="icon rem:w-[32px]  [&>svg]:rem:h-[32px] transition-all"> <img className="img-svg" src="/home-template/img/1.svg" alt="" /></div><span className="group-hover:text-Primary-2 transition-all">Đăng nhập</span></a></div>
								<div className="header-auth-item group"><a href="#"> 
										<div className="icon rem:w-[32px]  [&>svg]:rem:h-[32px] transition-all"> <img className="img-svg" src="/home-template/img/1.svg" alt="" /></div><span className="group-hover:text-Primary-2 transition-all">Đăng nhập</span></a></div>
								<div className="header-auth-item group"><a href="#"> 
										<div className="icon rem:w-[32px]  [&>svg]:rem:h-[32px] transition-all"> <img className="img-svg" src="/home-template/img/1.svg" alt="" /></div><span className="group-hover:text-Primary-2 transition-all">Đăng nhập</span></a></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="header-bottom"> 
				<div className="container"> 
					<div className="header-bottom-wrapper">
						<div className="header-logo-mobile rem:w-[139px] xl:hidden block"><a className="img-ratio ratio:pt-[55_139]" href="#"> <img className="lozad undefined" data-src="/home-template/img/logo.svg" alt=""/></a></div>
						<div className="wrapper xl:hidden flex">
							<div className="header-cart-mobile flex items-center gap-3">
								<div className="icon text-xl text-Primary-1">
									 <i className="fa-regular fa-cart-shopping"></i>
									<div className="cart-quantity">1			</div>
								</div>
							</div>
							<div className="header-search"> <i className="fa-regular fa-magnifying-glass"></i></div>
							<div className="header-bar"> <i className="fa-solid fa-bars"></i></div>
						</div>
						<div className="header-menu"> 
							<ul className="header-nav">
								<li className="dropdown-product menu-item-has-children"><a href="#"> 
										<div className="icon-bar"> <img src="/home-template/img/bar.png" alt="" /></div><span>Danh mục sản phẩm</span><i className="fa-solid fa-angle-down"></i></a>
									<div className="dropdown-product-list menu-mega-main">
										<div className="close"></div>
										<div className="menu-list"> 
											<ul> 
												<li> <a className="tab-item" href="#tab-1" data-tab="#tab-1">
														<div className="icon">
															 <i className="fa-regular fa-seedling"></i></div><span>Phân bón</span></a></li>
												<li> <a className="tab-item" href="#tab-2" data-tab="#tab-2">
														<div className="icon">
															 <i className="fa-regular fa-seedling"></i></div><span>Thuốc bảo vệ thực vật</span></a></li>
												<li> <a className="tab-item" href="#tab-3" data-tab="#tab-3">
														<div className="icon">
															 <i className="fa-regular fa-seedling"></i></div><span>Giải pháp cây trồng</span></a></li>
											</ul>
										</div>
										<div className="menu-content">
											<div className="tab-content-menu" id="tab-1">
												<div className="tab-content">
													<div className="menu-sub-list">
														<div className="title-style-primary rem:text-[24px] text-Primary-1 font-bold mb-3">Thuốc bảo vệ thực vật</div>
														<ul> 
															<li> <a className="tab-item" href="#">Thuốc trừ bệnh</a></li>
															<li> <a className="tab-item" href="#">Thuốc trừ sâu</a></li>
															<li> <a className="tab-item" href="#">Thuốc diệt cỏ</a></li>
														</ul>
													</div>
													<div className="menu-sub-list">
														<div className="title-style-primary rem:text-[24px] text-Primary-1 font-bold mb-3">Thuốc bảo vệ thực vật</div>
														<ul> 
															<li> <a className="tab-item" href="#">Thuốc trừ bệnh</a></li>
															<li> <a className="tab-item" href="#">Thuốc trừ sâu</a></li>
															<li> <a className="tab-item" href="#">Thuốc diệt cỏ</a></li>
														</ul>
													</div>
													<div className="menu-sub-list">
														<div className="title-style-primary rem:text-[24px] text-Primary-1 font-bold mb-3">Thuốc bảo vệ thực vật</div>
														<ul> 
															<li> <a className="tab-item" href="#">Thuốc trừ bệnh</a></li>
															<li> <a className="tab-item" href="#">Thuốc trừ sâu</a></li>
															<li> <a className="tab-item" href="#">Thuốc diệt cỏ</a></li>
														</ul>
													</div>
												</div>
											</div>
											<div className="tab-content-menu" id="tab-2" style={{ display: 'none' }}>
												<div className="title-style-primary rem:text-[24px] text-Primary-1 font-bold mb-3">Thuốc bảo vệ thực vật</div>
												<div className="tab-content">
													<div className="menu-sub-list">
														<ul> 
															<li> <a className="tab-item" href="#">Thuốc trừ bệnh</a></li>
															<li> <a className="tab-item" href="#">Thuốc trừ sâu</a></li>
															<li> <a className="tab-item" href="#">Thuốc diệt cỏ</a></li>
														</ul>
													</div>
													<div className="menu-sub-list">
														<ul> 
															<li> <a className="tab-item" href="#">Thuốc trừ bệnh</a></li>
															<li> <a className="tab-item" href="#">Thuốc trừ sâu</a></li>
															<li> <a className="tab-item" href="#">Thuốc diệt cỏ</a></li>
														</ul>
													</div>
													<div className="menu-sub-list">
														<ul> 
															<li> <a className="tab-item" href="#">Thuốc trừ bệnh</a></li>
															<li> <a className="tab-item" href="#">Thuốc trừ sâu</a></li>
															<li> <a className="tab-item" href="#">Thuốc diệt cỏ</a></li>
														</ul>
													</div>
												</div>
											</div>
										</div>
									</div>
								</li>
								<li className="menu-item-has-children">  <a href="#"> 
										<div className="icon rem:h-[24px] rem:w-[24px]"> <img className="img-svg w-full h-full object-cover" src="/home-template/img/2.svg" alt="" /></div><span>
											Phân bón<i className="fa-solid fa-chevron-down"></i></span></a>
									<ul className="sub-menu"> 
										<li> <a href="./about-us.html"> 
												<div className="icon"> 
													<div className="img"> <img className="lozad undefined" data-src="/home-template/img/phanbon.svg" alt=""/>
													</div>
												</div><span>Phân NPK</span></a></li>
										<li> <a href="./about-us.html"> 
												<div className="icon"> 
													<div className="img"> <img className="lozad undefined" data-src="/home-template/img/phanbon.svg" alt=""/>
													</div>
												</div><span>Phân NPK</span></a></li>
										<li> <a href="./about-us.html"> 
												<div className="icon"> 
													<div className="img"> <img className="lozad undefined" data-src="/home-template/img/phanbon.svg" alt=""/>
													</div>
												</div><span>Phân NPK</span></a></li>
									</ul>
								</li>
								<li> <a href="#"> 
										<div className="icon rem:h-[24px]"> <img className="img-svg w-full h-full object-cover" src="/home-template/img/2.svg" alt="" /></div><span>Thuốc bảo vệ thực vật</span></a></li>
								<li> <a href="#"> 
										<div className="icon rem:h-[24px]"> <img className="img-svg w-full h-full object-cover" src="/home-template/img/2.svg" alt="" /></div><span>Giải pháp cây trồng</span></a></li>
								<li className="sale"><a href="#"> 
										<div className="icon rem:h-[24px]"> <img className="img-svg w-full h-full object-cover" src="/home-template/img/2.svg" alt="" /></div><span>Mua chung giá tốt</span></a></li>
							</ul>
						</div>
						<div className="header-cart flex items-center gap-3">
							<div className="icon text-xl text-Primary-1">
								 <i className="fa-regular fa-cart-shopping"></i>
								<div className="cart-quantity">1</div>
							</div><span className="text-xl font-semibold text-Primary-1">Giỏ hàng</span>
						</div>
					</div>
				</div>
			</div>
			<div className="header-nav-mobile">
				<ul>
					<li className="menu-item-has-children"><a href="./home.html">Trang chủ</a>
						<ul className="sub-menu"> 
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
						</ul>
					</li>
					<li className="menu-item-has-children"><a href="./about.html">Giới thiệu</a>
						<ul className="sub-menu"> 
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
						</ul>
					</li>
					<li className="menu-item-has-children"><a href="./about.html">Lĩnh vực hoạt động</a>
						<ul className="sub-menu"> 
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
						</ul>
					</li>
					<li className="menu-item-has-children"><a href="./sustainable.html">Phát triển bền vững</a>
						<ul className="sub-menu"> 
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
						</ul>
					</li>
					<li className="menu-item-has-children"><a href="./sustainable.html">Phát triển bền vững</a>
						<ul className="sub-menu"> 
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
						</ul>
					</li>
					<li className="menu-item-has-children"><a href="./sustainable.html">Phát triển bền vững</a>
						<ul className="sub-menu"> 
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
							<li> <a href="#">Thuoc 1</a></li>
						</ul>
					</li>
					<li><a href="./newsList.html">Tin tức</a></li>
					<li><a href="./careerList.html">Tuyển dụng</a></li>
					<li><a href="./contact.html">Liên hệ</a></li>
				</ul>
			</div>
		</header>
    </>
  );
}
