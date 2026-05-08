<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
	<xsl:output method="html" indent="yes" />

	<xsl:template match="/">
		<div class="section">
			<div class="container">
				<xsl:apply-templates select="/PromotionDetail/Content"></xsl:apply-templates>
				<xsl:if test="count(/PromotionDetail/OtherPromotion)>0">
					<div class="promo-section mt-10">
						<div class="promo-list">
							<div class="row">
								<xsl:apply-templates select="/PromotionDetail/OtherPromotion"></xsl:apply-templates>
							</div>
						</div>
					</div>
				</xsl:if>
			</div>
		</div>
	</xsl:template>

	<xsl:template match="Content">
		<xsl:value-of select="EditLink" disable-output-escaping="yes"></xsl:value-of>
		<xsl:choose>
			<xsl:when test="LoadType=-1">
				<xsl:apply-templates select="Zone"></xsl:apply-templates>
			</xsl:when>
			<xsl:when test="LoadType=2">
				<div class="landing-page-1-item ajax-response-parent">
					<xsl:if test="ImageUrl!=''">
						<div class="landing-page-1-banner">
							<img class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=">
							<xsl:attribute name="data-src">
								<xsl:value-of select="ImageUrl"></xsl:value-of>
							</xsl:attribute>
							</img>
						</div>
					</xsl:if>
					<div class="product-list">
						<div class="row row-2 row-md-3 row-lg-5 no-gutter ajax-response">
							<xsl:apply-templates select="Product">
								<xsl:with-param name="numberProduct">5</xsl:with-param>
							</xsl:apply-templates>
						</div>
					</div>
					<xsl:if test="count(Product)>5">
						<div class="view-more-wrap">
							<a class="btn btn-gradient ajax-promo-next-page" data-zoneid="-1" data-pagesize="5"
								data-page="2" href="#">
								<xsl:attribute name="data-promoid">
									<xsl:value-of select="/PromotionDetail/PromotionId" />
								</xsl:attribute>
								<xsl:attribute name="data-zoneids">
									<xsl:value-of select="ZoneIds" />
								</xsl:attribute>
								Xem thêm
							</a>
						</div>
					</xsl:if>
				</div>
			</xsl:when>
			<xsl:when test="LoadType=3">
				<section class="landing-flashsale-list section background-white pb-0">
					<div class="landing-page-product-list">
						<div class="section-title text-blue text-center mb-4">
							<xsl:value-of select="Title"></xsl:value-of>
						</div>
						<div class="row ajax-response-parent">
							<div class="w-100 banner-col">
								<xsl:if test="ImageUrl!=''">
									<div class="banner">
										<img class="lazyload"
											src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=">
										<xsl:attribute name="data-src">
											<xsl:value-of select="ImageUrl"></xsl:value-of>
										</xsl:attribute>
										</img>
									</div>
								</xsl:if>
							</div>
							<div class="w-100 product-col">
								<div class="product-list">
									<div class="row row-2 row-md-3 row-xl-4 no-gutter ajax-response">
										<xsl:apply-templates select="Product">
											<xsl:with-param name="numberProduct">6</xsl:with-param>
										</xsl:apply-templates>
									</div>
								</div>
								<xsl:if test="count(Product)>6">
									<div class="view-more-wrap">
										<a class="btn btn-gradient ajax-promo-next-page" data-zoneid="-1"
											data-pagesize="6" data-page="2" href="#">
											<xsl:attribute name="data-promoid">
												<xsl:value-of select="/PromotionDetail/PromotionId" />
											</xsl:attribute>
											<xsl:attribute name="data-zoneids">
												<xsl:value-of select="ZoneIds" />
											</xsl:attribute>
											Xem thêm
										</a>
									</div>
								</xsl:if>
							</div>
						</div>
					</div>
				</section>
			</xsl:when>
			<xsl:when test="LoadType=4">
				<section class="landing-page-3">
					<div class="row ajax-response-parent">
						<div class="nav-col">
							<div class="nav">
								<ul>
									<li class="active">
										<a href="#" class="ajax-promo-zone-link" data-zoneid="-1">
											<xsl:attribute name="data-promoid">
												<xsl:value-of select="/PromotionDetail/PromotionId" />
											</xsl:attribute>
											<xsl:attribute name="data-zoneids">
												<xsl:value-of select="ZoneIds" />
											</xsl:attribute>
											<xsl:text>Tất cả sản phẩm</xsl:text>
										</a>
									</li>
									<xsl:apply-templates select="Zone" mode="Filter"></xsl:apply-templates>
								</ul>
							</div>
						</div>
						<div class="product-col">
							<div class="landing-page-product-list">
								<div class="heading">
									<div class="section-title text-blue text-center">Sản phẩm Khuyến mãi</div>
								</div>
								<div class="product-list-wrap ajax-response-parent">
									<div class="product-list">
										<div class="row row-2 row-md-3 row-lg-4 no-gutter ajax-response">
											<xsl:apply-templates select="Product">
												<xsl:with-param name="numberProduct">8</xsl:with-param>
											</xsl:apply-templates>
										</div>
										<xsl:if test="count(Product)>8">
											<div class="view-more-wrap">
												<a class="btn btn-gradient ajax-promo-next-page" data-zoneid="-1"
													data-pagesize="8" data-page="2" href="#">
													<xsl:attribute name="data-promoid">
														<xsl:value-of select="/PromotionDetail/PromotionId" />
													</xsl:attribute>
													<xsl:attribute name="data-zoneids">
														<xsl:value-of select="ZoneIds" />
													</xsl:attribute>
													Xem thêm
												</a>
											</div>
										</xsl:if>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</xsl:when>
			<xsl:otherwise>
				<xsl:if test="ImageUrl!=''">
					<section class="landing-page-banner">
						<img class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=">
						<xsl:attribute name="data-src">
							<xsl:value-of select="ImageUrl"></xsl:value-of>
						</xsl:attribute>
						</img>
					</section>
				</xsl:if>
				<xsl:if test="Description!=''">
					<section class="landing-page-banner">
						<xsl:value-of select="Description" disable-output-escaping="yes"></xsl:value-of>
					</section>
				</xsl:if>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="Zone" mode="Filter">
		<li>
			<a href="#" class="ajax-promo-zone-link">
				<xsl:attribute name="data-promoid">
					<xsl:value-of select="/PromotionDetail/PromotionId" />
				</xsl:attribute>
				<xsl:attribute name="data-zoneid">
					<xsl:value-of select="ZoneId" />
				</xsl:attribute>
				<xsl:value-of select="Title" disable-output-escaping="yes"></xsl:value-of>
			</a>
		</li>
	</xsl:template>

	<xsl:template match="Zone">
		<xsl:if test="count(Product)>0">
			<section class="landing-page-banner">
				<div class="landing-page-product-list">
					<div class="heading">
						<div class="section-title text-blue text-center">
							<xsl:value-of select="Title" disable-output-escaping="yes"></xsl:value-of>
						</div>
					</div>
					<div class="product-list-wrap ajax-response-parent">
						<div class="product-list">
							<div class="row row-2 row-md-3 row-lg-5 no-gutter ajax-response">
								<xsl:apply-templates select="Product">
									<xsl:with-param name="numberProduct">10</xsl:with-param>
								</xsl:apply-templates>
							</div>
						</div>
						<xsl:if test="count(Product)>10">
							<div class="view-more-wrap">
								<a class="btn btn-gradient ajax-promo-next-page" data-zoneid="-1" data-pagesize="10"
									data-page="2" href="#">
									<xsl:attribute name="data-zoneid">
										<xsl:value-of select="ZoneId" />
									</xsl:attribute>
									<xsl:attribute name="data-promoid">
										<xsl:value-of select="/PromotionDetail/PromotionId" />
									</xsl:attribute>
									Xem thêm
								</a>
							</div>
						</xsl:if>
					</div>
				</div>
			</section>
		</xsl:if>
	</xsl:template>

	<xsl:template match="Product">
		<xsl:param name="numberProduct" />
		<xsl:if test="$numberProduct>=position()">
			<div class="w-100">
				<div class="product-item">
					<a class="product-img">
						<xsl:attribute name="href">
							<xsl:value-of select="Url" />
						</xsl:attribute>
						<img class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=">
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
						<a class="btn-buy background-main" href="#"
							onclick="AjaxCart.addproducttocart_catalog(this);return false;">
							<xsl:attribute name="data-productid">
								<xsl:value-of select="ProductId" />
							</xsl:attribute>
							<img src="/Data/Sites/1/skins/default/img/cart-white.png" alt="Buy" />
						</a>
					</xsl:if>
					<xsl:if test="StockQuantity &lt;= 0">
						<a class="btn-buy background-dark-grey" href="javascript:;">
							Liên hệ Sakuko
						</a>
					</xsl:if>
				</div>
			</div>
		</xsl:if>
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

	<xsl:template match="OtherPromotion">
		<div class="col-sm-6">
			<a class="promo-item " style="border-radius: 10px; overflow: hidden;">
				<xsl:attribute name="href">
					<xsl:value-of select="Url"></xsl:value-of>
				</xsl:attribute>
				<div class="promo-img" style="border-radius: 0px">
					<xsl:if test="ImageUrl!=''">
						<img class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=">
						<xsl:attribute name="data-src">
							<xsl:value-of select="ImageUrl"></xsl:value-of>
						</xsl:attribute>
						<xsl:attribute name="alt">
							<xsl:value-of select="Title"></xsl:value-of>
						</xsl:attribute>
						</img>
					</xsl:if>
				</div>
				<div class="promo-caption" style="padding-bottom: 10px;">
					<div class="promo-title">
						<xsl:value-of select="Title"></xsl:value-of>
					</div>
					<div class="promo-desc">
						<xsl:value-of select="BriefContent" disable-output-escaping="yes"></xsl:value-of>
					</div>
				</div>
			</a>
		</div>
	</xsl:template>

</xsl:stylesheet>