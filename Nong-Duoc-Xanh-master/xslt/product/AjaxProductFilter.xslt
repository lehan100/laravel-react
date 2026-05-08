<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
	<xsl:output method="html" indent="yes" />

	<xsl:template match="/ProductFilter">
		<xsl:apply-templates select="/ProductFilter/Group" />
	</xsl:template>

	<xsl:template match="Group">
		<div class="product-filter-item field">
			<div class="product-filter-title flex items-center justify-between">
				<strong class="text">
					<xsl:value-of disable-output-escaping="yes" select="Title"></xsl:value-of>
				</strong>
				<div class="arrow">
					<em class="ri-arrow-down-s-fill"></em>
				</div>
			</div>
			<div class="product-filter-body">
				<div class="product-filter-group">
					<ul>
						<xsl:apply-templates select="Option"></xsl:apply-templates>
					</ul>
					<!--<a class="filter-view-more flex items-center mt-2 text-blue" href="#">
                      <strong>Xem thêm</strong>
                      <em class="ri-arrow-down-s-fill"></em>
                    </a>-->
				</div>
			</div>
		</div>
	</xsl:template>

	<xsl:template match="Option">
		<li>
			<a class="filter-link ajaxfilterlink" href="#">
				<xsl:attribute name="data-url">
					<xsl:value-of select="Url" />
				</xsl:attribute>
				<div class="check-box"></div>
				<div class="text">
					<xsl:value-of select="Title" />
				</div>
			</a>
		</li>
	</xsl:template>

</xsl:stylesheet>