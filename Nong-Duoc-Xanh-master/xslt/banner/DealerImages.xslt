<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
	<xsl:output method="html" indent="yes" />

	<xsl:template match="/BannerList">
		<section class="dealer-slider-section section pt-0">
			<div class="container">
				<div class="dealer-slider">
					<div class="swiper-container">
						<div class="swiper-wrapper">
							<xsl:apply-templates select="Banner"></xsl:apply-templates>
						</div>
						<div class="swiper-navigation">
							<div class="swiper-btn swiper-btn-prev"><span class="ri-arrow-left-line"></span></div>
							<div class="swiper-btn swiper-btn-next"><span class="ri-arrow-right-line"></span></div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</xsl:template>
	
	<xsl:template match="Banner">
		<div class="swiper-slide">
			<div class="img"><img class="swiper-lazy">
			<xsl:attribute name="data-src">
				<xsl:value-of select="ImageUrl"></xsl:value-of>
			</xsl:attribute>
			<xsl:attribute name="alt">
				<xsl:value-of select="Title"></xsl:value-of>
			</xsl:attribute>
			</img>
			</div>
		</div>
	</xsl:template>

</xsl:stylesheet>