<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
	<xsl:output method="html" indent="yes" />

	<xsl:template match="/ProductDetail">
		<section class="section-small section-grey">
			<div class="container">
				<div class="product-detail-top">
					<div class="row">
						<div class="col-lg-6">
							<div class="product-detail-images">
								<div class="swiper-container">
									<div class="swiper-wrapper">
										<xsl:apply-templates select="ProductImages"></xsl:apply-templates>
									</div>
								</div>
								<xsl:if test="DiscountPercentage!=''">
									<div class="product-detail-discount">
										<xsl:text>-</xsl:text>
										<xsl:value-of disable-output-escaping="yes" select="DiscountPercentage">
										</xsl:value-of>
										<xsl:text>%</xsl:text>
									</div>

								</xsl:if>
							</div>
							<div class="product-detail-thumbnail">
								<div class="swiper-container">
									<div class="swiper-wrapper">
										<xsl:apply-templates select="ProductImages" mode="thumbnail">
										</xsl:apply-templates>
									</div>
									<div class="swiper-scrollbar"></div>
								</div>
							</div>
						</div>
						<div class="col-lg-6">
							<h1 class="product-detail-title product-name">
								<xsl:value-of disable-output-escaping="yes" select="Title"></xsl:value-of>
							</h1> 
							<xsl:value-of disable-output-escaping="yes" select="EditLink"></xsl:value-of>
							<div class="flex justify-between items-center">
								<div class="product-detail-price">
									<strong class="text-main price product-price">
										<xsl:value-of disable-output-escaping="yes" select="Price"></xsl:value-of>
									</strong>
									<del class="old-price product-oldprice">
										<xsl:value-of disable-output-escaping="yes" select="OldPrice">
										</xsl:value-of>
									</del>
								</div>
								<div class="product-detail-rating">
									<div class="rating-star">
										<div>
											<xsl:attribute name="style">
												<xsl:text>width:</xsl:text>
												<xsl:value-of select="/ProductDetail/RatingPercent"></xsl:value-of>
												<xsl:text>%</xsl:text>
											</xsl:attribute>
										</div>
									</div>
									<div class="rating-number">
										<xsl:text disable-output-escaping="yes">(</xsl:text>
										<xsl:value-of select="RatingVotes"></xsl:value-of>
										<xsl:text disable-output-escaping="yes">)</xsl:text>
									</div>
								</div>
							</div>
							<div class="product-detail-data">
								<table>
									<xsl:if test="ManufacturerTitle != ''">
										<tr>
											<td>Thương hiệu:</td>
											<td>
												<a>
													<xsl:attribute name="href">
														<xsl:value-of select="ManufacturerUrl" />
													</xsl:attribute>
													<xsl:attribute name="title">
														<xsl:value-of select="ManufacturerTitle" />
													</xsl:attribute>
													<strong>
														<xsl:value-of select="ManufacturerTitle"></xsl:value-of>
													</strong>
												</a>
											</td>
										</tr>
									</xsl:if>
									<tr>
										<td>Tình trạng:</td>
										<td>
											<xsl:choose>
												<xsl:when test="StockAvailability = 'True'">
													<div class="status available">Hàng có sẵn</div>
												</xsl:when>
												<xsl:otherwise>
													<div class="status out-stock">Hết hàng</div>
												</xsl:otherwise>
											</xsl:choose>

										</td>
									</tr>
									<xsl:if test="BriefContent != ''">
										<tr>
											<td>Vận chuyển:</td> 
											<td class="product-briefContent">
												<xsl:value-of disable-output-escaping="yes" select="BriefContent" />
											</td>
										</tr>
									</xsl:if>
								</table>
							</div>
							<xsl:if test="count(ProductProperties[EnableShoppingCart='True'])>0">
								<div class="product-detail-opt-list product-attributes">
									<xsl:apply-templates select="ProductProperties[EnableShoppingCart='True']"/>
								</div>
							</xsl:if> 
							<div class="product-detail-quantity">
								<strong class="fz-18">Số lượng</strong>
								<div class="spin-input-wrap">
									<div class="spin-btn" data-spin="dec">
										<em class="ri-subtract-fill"></em>
									</div>
									<input type="text" value="1">
									<xsl:attribute name="name">
										<xsl:text>addtocart_</xsl:text>
										<xsl:value-of select="ProductId" disable-output-escaping="yes" />
										<xsl:text>.EnteredQuantity</xsl:text>
									</xsl:attribute>
									</input>
									<div class="spin-btn" data-spin="inc">
										<em class="ri-add-fill"></em>
									</div>
								</div>
							</div>
							<div class="product-detail-btn">
								<a class="btn-buy-now" href="#"
									onclick="AjaxCart.addproducttocart_details(this, true); return false;">
									<xsl:attribute name="data-productid">
										<xsl:value-of select="ProductId" />
									</xsl:attribute>
									<xsl:text>Mua ngay</xsl:text>
									<!-- <span>tiết kiệm đến 800.000 đ (chưa ráp)</span> -->
								</a>
								<a class="btn-addtocart" href="#"
									onclick="AjaxCart.addproducttocart_details(this); return false;">
									<xsl:attribute name="data-productid">
										<xsl:value-of select="ProductId" />
									</xsl:attribute>
									<xsl:text>Thêm vào giỏ hàng</xsl:text>
								</a>
							</div>
						</div>
					</div>
				</div>
				<div class="product-detail-bottom">
					<div class="product-detail-info">
						<div class="title">Thông tin sản phẩm</div>
						<div class="content">
							<div class="article-content expand-content">
								<xsl:value-of disable-output-escaping="yes" select="FullContent"></xsl:value-of>
							</div>
							<a class="expand-toggle" href="#">
								<strong>Xem thêm</strong>
								<span class="ri-arrow-down-s-line"></span>
							</a>
						</div>
					</div>
				</div>

				<xsl:if test="count(ProductRelated) > 0">
					<div class="product-detail-related">
						<div class="section-title text-center">Sản phẩm đi kèm</div>
						<div class="product-slider position-relative">
							<div class="swiper-container">
								<div class="swiper-wrapper">
									<xsl:apply-templates select="ProductRelated"></xsl:apply-templates>
								</div>
							</div>
							<div class="swiper-navigation">
								<div class="swiper-btn swiper-prev"><span class="lnr lnr-chevron-left"></span></div>
								<div class="swiper-btn swiper-next"><span class="lnr lnr-chevron-right"></span></div>
							</div>
						</div>
					</div>
				</xsl:if>

				<div class="product-comment-wrap">
					
				</div>

			</div>
			<input type="hidden" id="hdProductId">
			<xsl:attribute name="value">
				<xsl:choose>
					<xsl:when test="ParentProductId != '0' and ParentProductId != ''">
						<xsl:value-of select="ParentProductId"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="ProductId"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:attribute>
		</input>
		</section>
	</xsl:template>

	<!--TEMPLATES-->

	<xsl:template match="ProductImages">
		<div class="swiper-slide">
			<div class="img">
				<a data-fancybox="">
					<xsl:attribute name="href">
						<xsl:value-of select="ImageUrl"></xsl:value-of>
					</xsl:attribute>
					<img class="zoom-img swiper-lazy">
					<xsl:attribute name="src">
						<xsl:value-of select="ImageUrl"></xsl:value-of>
					</xsl:attribute>
					<xsl:attribute name="data-zoom-image">
						<xsl:value-of select="ImageUrl"></xsl:value-of>
					</xsl:attribute>
					<xsl:attribute name="alt">
						<xsl:value-of select="Title"></xsl:value-of>
					</xsl:attribute>
					</img>
				</a>
			</div>
		</div>
	</xsl:template>

	<xsl:template match="ProductImages" mode="thumbnail">
		<div class="swiper-slide">
			<div class="img">
				<img class="swiper-lazy">
				<xsl:attribute name="src">
					<xsl:value-of select="ImageUrl"></xsl:value-of>
				</xsl:attribute>
				<xsl:attribute name="alt">
					<xsl:value-of select="Title"></xsl:value-of>
				</xsl:attribute>
				</img>
			</div>
		</div>
	</xsl:template>

	<xsl:template match="ProductVideos">
		<li>
			<a>
				<xsl:attribute name="href">
					<xsl:value-of select="VideoUrl"></xsl:value-of>
				</xsl:attribute>
				<xsl:attribute name="data-fancybox">
					<xsl:text></xsl:text>
				</xsl:attribute>
				<img class="lazyload">
				<xsl:attribute name="data-src">
					<xsl:value-of select="ThumbnailUrl"></xsl:value-of>
				</xsl:attribute>
				<xsl:attribute name="src">
					<xsl:text>data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=</xsl:text>
				</xsl:attribute>
				<xsl:attribute name="alt">
					<xsl:value-of select="Title"></xsl:value-of>
				</xsl:attribute>
				</img>
				<em class="ri-play-circle-line"></em>
			</a>
		</li>
	</xsl:template>

	<xsl:template match="ProductRelated">
		<div class="swiper-slide">
			<div class="product-item">
				<a class="product-img" href="#">
					<xsl:attribute name="href">
						<xsl:value-of select="Url"></xsl:value-of>
					</xsl:attribute>
					<xsl:attribute name="target">
						<xsl:value-of select="Target"></xsl:value-of>
					</xsl:attribute>
					<xsl:attribute name="title">
						<xsl:value-of select="Title"></xsl:value-of>
					</xsl:attribute>
					<img>
					<xsl:attribute name="src">
						<xsl:value-of select="ImageUrl"></xsl:value-of>
					</xsl:attribute>
					<xsl:attribute name="alt">
						<xsl:value-of select="Title"></xsl:value-of>
					</xsl:attribute>
					</img>
					<xsl:if test="DiscountPercentage!=''">
						<div class="product-discount">
							<xsl:text>Giảm </xsl:text>
							<xsl:value-of select="DiscountPercentage"></xsl:value-of>
							<xsl:text>%</xsl:text>
						</div>
					</xsl:if>
				</a>
				<xsl:if test="ShowOption>0">
					<div class="product-icon">
						<xsl:if test="floor(ShowOption div 1) mod 2 = 1">
							<span class="icon icon-new">new</span>
						</xsl:if>
					</div>
				</xsl:if>
				<div class="product-name leading-snug">
					<a>
						<xsl:attribute name="href">
							<xsl:value-of select="Url"></xsl:value-of>
						</xsl:attribute>
						<xsl:attribute name="target">
							<xsl:value-of select="Target"></xsl:value-of>
						</xsl:attribute>
						<xsl:attribute name="title">
							<xsl:value-of select="Title"></xsl:value-of>
						</xsl:attribute>
						<xsl:value-of select="Title"></xsl:value-of>
					</a>
				</div>
				<div class="product-price">
					<strong class="price text-main">
						<xsl:value-of disable-output-escaping="yes" select="Price"></xsl:value-of>
					</strong>
					<xsl:if test="OldPrice != ''">
						<del class="old-price">
							<xsl:value-of disable-output-escaping="yes" select="OldPrice"></xsl:value-of>
						</del>

					</xsl:if>
				</div>
			</div>
		</div>
	</xsl:template>

	<xsl:template match="ProductAttributes">
		<div class="product-detail-wrap">
			<div class="product-detail-data">
				<h2 class="section-title text-blue">
					<xsl:value-of select="Title" />
				</h2>
				<xsl:value-of disable-output-escaping="yes" select="Content"></xsl:value-of>
			</div>
		</div>
	</xsl:template>

	<xsl:template match="Images360">
		<img>
		<xsl:attribute name="src">
			<xsl:value-of select="ImageUrl"></xsl:value-of>
		</xsl:attribute>
		</img>
	</xsl:template>


	<xsl:template match="ProductViewed">
		<div class="swiper-slide">
			<div class="product-item">
				<a class="product-img">
					<xsl:attribute name="href">
						<xsl:value-of select="Url" />
					</xsl:attribute>
					<img class="swiper-lazy" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=">
					<xsl:attribute name="data-src">
						<xsl:value-of select="ImageUrl"></xsl:value-of>
					</xsl:attribute>
					<xsl:attribute name="alt">
						<xsl:value-of select="Title"></xsl:value-of>
					</xsl:attribute>
					</img>
					<xsl:if test="DiscountPercentage!=''">
						<div class="product-deal-coupon">
							<xsl:text>Giảm </xsl:text>
							<xsl:value-of select="DiscountPercentage"></xsl:value-of>
							<xsl:text>%</xsl:text>
						</div>
					</xsl:if>
					<xsl:if test="ShowOption>0">
						<div class="product-icon">
							<ul>
								<xsl:if test="floor(ShowOption div 1) mod 2 = 1">
									<li>
										<span class="icon-brown">new</span>
									</li>
								</xsl:if>
								<xsl:if test="floor(ShowOption div 2) mod 2 = 1">
									<li>
										<span class="icon-blue">Mua 1 tặng 1</span>
									</li>
								</xsl:if>
								<xsl:if test="floor(ShowOption div 4) mod 2 = 1">
									<li>
										<span class="icon-blue">Mua 2 tặng 2</span>
									</li>
								</xsl:if>
								<xsl:if test="floor(ShowOption div 8) mod 2 = 1">
									<li>
										<span class="icon-blue">Mua 3 tặng 1</span>
									</li>
								</xsl:if>
								<xsl:if test="floor(ShowOption div 16) mod 2 = 1">
									<li>
										<span class="icon-blue">Mua 4 tặng 1</span>
									</li>
								</xsl:if>
								<xsl:if test="floor(ShowOption div 32) mod 2 = 1">
									<li>
										<span class="icon-blue">Mua 5 tặng 1</span>
									</li>
								</xsl:if>
								<xsl:if test="floor(ShowOption div 64) mod 2 = 1">
									<li>
										<span class="icon-blue">Mua 6 tặng 1</span>
									</li>
								</xsl:if>
								<xsl:if test="floor(ShowOption div 128) mod 2 = 1">
									<li>
										<span class="icon-blue">Mua 3 tặng 2</span>
									</li>
								</xsl:if>
								<xsl:if test="floor(ShowOption div 256) mod 2 = 1">
									<li>
										<span class="icon-blue">Mua 4 tặng 2</span>
									</li>
								</xsl:if>
								<xsl:if test="floor(ShowOption div 512) mod 2 = 1">
									<li>
										<span class="icon-blue">Mua 5 tặng 2</span>
									</li>
								</xsl:if>
								<xsl:if test="floor(ShowOption div 1024) mod 2 = 1">
									<li>
										<span class="icon-blue">Mua 1 tặng 2</span>
									</li>
								</xsl:if>
								<xsl:if test="floor(ShowOption div 2048) mod 2 = 1">
									<li>
										<span class="icon-blue">Mua 1 tặng 3</span>
									</li>
								</xsl:if>
								<xsl:if test="floor(ShowOption div 4096) mod 2 = 1">
									<li>
										<span class="icon-blue">Mua 2 tặng 3</span>
									</li>
								</xsl:if>
								<xsl:if test="GiftDescription2!=''">
									<li class="gift-icon">
										<xsl:value-of disable-output-escaping="yes" select="GiftDescription2">
										</xsl:value-of>
									</li>
								</xsl:if>
							</ul>
						</div>
					</xsl:if>
				</a>
				<div class="product-name leading-snug">
					<a>
						<xsl:attribute name="href">
							<xsl:value-of select="Url" />
						</xsl:attribute>
						<xsl:value-of select="Title"></xsl:value-of>
					</a>
					<xsl:value-of select="EditLink" disable-output-escaping="yes"></xsl:value-of>
				</div>
				<div class="product-price flex items-end">
					<strong class="price text-main">
						<xsl:value-of disable-output-escaping="yes" select="Price"></xsl:value-of>
					</strong>
					<xsl:if test="OldPrice != ''">
						<del class="old-price">
							<xsl:value-of disable-output-escaping="yes" select="OldPrice"></xsl:value-of>
						</del>
					</xsl:if>
				</div>
				<xsl:apply-templates select="Promotion"></xsl:apply-templates>
				<xsl:if test="StockQuantity > 0">
					<a class="btn-buy background-main" style="cursor: pointer;"
						onclick="AjaxCart.addproducttocart_catalog(this);return false;">
						<xsl:attribute name="data-productid">
							<xsl:value-of select="ProductId" />
						</xsl:attribute>
						<img src="/Data/Sites/1/skins/default/img/cart-white.png" alt="Buy" />
					</a>
				</xsl:if>
				<xsl:if test="StockQuantity &lt;= 0">
					<a class="btn-buy background-dark-grey" style="cursor: pointer;">
						Liên hệ Sakuko
					</a>
				</xsl:if>
			</div>
		</div>
	</xsl:template>

	<xsl:template match="Promotion">
		<xsl:if test="floor(Option div 1) mod 2 = 1">
			<xsl:if test="DiscountPrice!=''">
				<div class="product-vnpay-price">
					<strong>Giá VnPay: </strong>
					<strong class="text-main">
						<xsl:value-of select="DiscountPrice"></xsl:value-of>
					</strong>
				</div>
			</xsl:if>
		</xsl:if>
	</xsl:template>

	<xsl:template match="ProductProperties">
		<div class="opt-list product-options">
			<strong class="title fz-18"><xsl:value-of select="DisplayName" disable-output-escaping="yes"/>:</strong>
			<ul class="list-option product-options">
				<xsl:apply-templates select="Options"/>
			</ul>
			<input type="hidden" class="product-option-input">
				<xsl:attribute name="name">
					<xsl:text>product_option_</xsl:text>
					<xsl:value-of select="FieldId"/>
				</xsl:attribute>
				<xsl:attribute name="value">
					<xsl:value-of select="ActiveOptionId"/>
				</xsl:attribute>
			</input>
		</div>
	</xsl:template>

	<xsl:template match="Options">
		<li >
			<xsl:attribute name="class">
				<xsl:text>product-option</xsl:text>
			</xsl:attribute>
			<xsl:attribute name="data-id">
				<xsl:value-of select="OptionId"/>
			</xsl:attribute>
			<xsl:attribute name="data-name">
				<xsl:value-of select="Title"/>
			</xsl:attribute>
			<a href="" onclick="AjaxCart.selectproductoption(this);return false;">
				<xsl:if test="IsActive='true'">
					<xsl:attribute name="class">
						<xsl:text> active</xsl:text>
					</xsl:attribute>
				</xsl:if> 
				<xsl:attribute name="href">#</xsl:attribute>
				<xsl:attribute name="data-name">
					<xsl:value-of select="Title"/>
				</xsl:attribute>
				<xsl:attribute name="data-id">
					<xsl:value-of select="OptionId"/>
				</xsl:attribute>
				<xsl:value-of select="Title" disable-output-escaping="yes"/>
			</a>
		</li>
	</xsl:template>

</xsl:stylesheet>