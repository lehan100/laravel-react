<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
	<xsl:output method="html" indent="yes" />

	<xsl:template match="/NewsDetail">
		<xsl:if test="FullContent != ''">

			<div class="product-list-more-desc">
				<div class="article-content">
					<xsl:value-of disable-output-escaping="yes" select="FullContent"></xsl:value-of>
				</div>
				<a style="cursor: pointer" class="view-more-desc"><span>Xem thêm</span><i class="ri-arrow-down-s-fill"></i></a>
			</div>
		</xsl:if>
	</xsl:template>

</xsl:stylesheet>