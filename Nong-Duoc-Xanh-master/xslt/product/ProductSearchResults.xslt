<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
	<xsl:output method="html" indent="yes" />

	<xsl:template match="/SearchResults">
		<div class="search-result-wrap product-result">
			<div class="search-top">
				<div class="row">
					<div class="col-12">
						<div class="search-title section-title text-blue">
							Kết quả tìm kiếm “<span class="text-main">
								<xsl:value-of select="Keyword"></xsl:value-of>
							</span>”
						</div>
						<div class="searchresultsummary">
							Tìm thấy <span>
								<xsl:value-of select="TotalNews"></xsl:value-of>
							</span> kết quả phù hợp với từ khóa “<xsl:value-of select="Keyword"></xsl:value-of>”
						</div>
					</div>
				</div>
			</div>
			<div class="searchresults">
				<div class="product-list">
					<div class="row row-lg-5 row-md-3 row-2">
						<xsl:apply-templates select="Product"></xsl:apply-templates>
					</div>
				</div>
			</div>
		</div>
		<xsl:if test="count(News)>0">
			<section class="section-candinate section-py !pt-0">
				<div class="container">
					<div class="grid md:grid-cols-2 lg:lg:grid-cols-4 gap-8">
						<xsl:apply-templates select="News"></xsl:apply-templates>
					</div>
				</div>
			</section>

		</xsl:if>

	</xsl:template>

	<xsl:template match="Zone">
		<li>
			<a class="filter-link" href="#">
				<xsl:attribute name="data-id">
					<xsl:value-of select="ZoneId"></xsl:value-of>
				</xsl:attribute>
				<xsl:attribute name="data-url">
					<xsl:value-of select="Url"></xsl:value-of>
				</xsl:attribute>
				<div class="check-box"></div>
				<div class="text">
					<xsl:value-of select="Title"></xsl:value-of>
				</div>
			</a>
		</li>

		<!--<div class="col-xs-12 col-md-6 col-lg-6 col-xl-3 nopadding">
      <h3 class="title">
        <a>
          <xsl:attribute name="href">
            <xsl:value-of select="Url"></xsl:value-of>
          </xsl:attribute>
          <xsl:value-of select="Title" disable-output-escaping="yes"></xsl:value-of>
        </a>
      </h3>
      <div class="resultitem">
        <xsl:text>Có </xsl:text>
        <strong>
          <xsl:value-of select="TotalProducts"></xsl:value-of>
        </strong>
        <xsl:text> kết quả tìm được</xsl:text>
      </div>
      <div class="itemlist clearfix">
        <xsl:apply-templates select="Product"></xsl:apply-templates>
      </div>
      <xsl:if test="TotalPages>1">
        <a class="ajaxsearchviewmore" data-next="2">
          <xsl:attribute name="data-zoneid">
            <xsl:value-of select="ZoneId"></xsl:value-of>
          </xsl:attribute>
          <xsl:attribute name="data-totalpages">
            <xsl:value-of select="TotalPages"></xsl:value-of>
          </xsl:attribute>
          <xsl:attribute name="data-keyword">
            <xsl:value-of select="/SearchResults/Keyword"></xsl:value-of>
          </xsl:attribute>
          <xsl:text>Xem thêm</xsl:text>
        </a>
      </xsl:if>
    </div>-->
	</xsl:template>

	<xsl:template match="Product">
		<div class="w-100">
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

	<xsl:template match="News">
		<div class="item-candidate relative">
			<a class="img img-ratio pt-[calc(480/360*(100%))]">
				<xsl:attribute name="href">
					<xsl:value-of select="Url"/>
				</xsl:attribute>
				<img >
					<xsl:attribute name="class">
						<xsl:text disable-output-escaping="yes">lozad rem:rounded-[40px]rounded-br-[0px]</xsl:text>
					</xsl:attribute>
					<xsl:attribute name="data-src">
						<xsl:value-of select="ImageUrl"></xsl:value-of>
					</xsl:attribute>
					<xsl:attribute name="alt">
						<xsl:value-of select="Title"></xsl:value-of>
					</xsl:attribute>
				</img>
			</a>
			<!--<a class="btn btn-discovery white !min-w-[auto]" href="">
				<xsl:attribute name="href">
					<xsl:value-of select="Url"></xsl:value-of>
				</xsl:attribute>
				<xsl:attribute name="title">
					<xsl:value-of select="Title"></xsl:value-of>
				</xsl:attribute>
				<span>Đề cử</span>
				<img class="w-5 h-5 svg" data-src="/Data/Sites/1/skins/default/img/icon/arrow-primary.svg" alt=""/>
			</a>-->
			<xsl:choose>
				<xsl:when test="//NominationStatus = 'true'">
					<a class="btn btn-discovery white !min-w-[auto]" href="">
						<xsl:attribute name="href">
							<!--<xsl:value-of select="Url"></xsl:value-of>-->
							<xsl:text>/de-cu/content-creator-of-the-year-2?FormZoneID=</xsl:text>
							<xsl:value-of select="//FormZoneID"/>
							<xsl:text>&amp;AwardID=</xsl:text>
							<xsl:value-of select="//AwardID"/>
						</xsl:attribute>
						<xsl:attribute name="title">
							<xsl:value-of select="Title"></xsl:value-of>
						</xsl:attribute>
						<span>Đề cử</span>
						<img class="w-5 h-5 svg" data-src="/Data/Sites/1/skins/default/img/icon/arrow-primary.svg" alt=""/>
					</a>
				</xsl:when>
				<xsl:when test="//VotingStatus = 'true'">
					<a class="btn btn-discovery white !min-w-[auto]" href="#">
						<!--<xsl:attribute name="href">
								<xsl:value-of select="Url"></xsl:value-of>
							</xsl:attribute>-->
						<xsl:attribute name="title">
							<xsl:value-of select="Title"></xsl:value-of>
						</xsl:attribute>
						<span>Bình chọn</span>
						<img class="w-5 h-5 svg" data-src="/Data/Sites/1/skins/default/img/icon/arrow-primary.svg" alt=""/>
					</a>
				</xsl:when>
				<xsl:otherwise>

				</xsl:otherwise>
			</xsl:choose>
			<div class="name absolute rem:bottom-[10px] rem:right-[10px] rem:rounded-[80px] overflow-hidden px-8 py-5 !rounded-br-none text-right">
				<h3>
					<xsl:value-of disable-output-escaping="yes" select="Title"></xsl:value-of>
					<xsl:value-of select="EditLink" disable-output-escaping="yes"></xsl:value-of>
				</h3>
				<p>
					<xsl:value-of disable-output-escaping="yes" select="SubTitle"></xsl:value-of>
				</p>
			</div>
		</div>
	</xsl:template>
</xsl:stylesheet>