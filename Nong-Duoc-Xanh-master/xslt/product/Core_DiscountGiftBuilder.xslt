<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
	<xsl:output method="html" indent="yes"/>

	<xsl:template match="/">
		<xsl:if test="count(/GiftList/Gift)>0">
			<ul>
				<xsl:apply-templates select="/GiftList/Gift"></xsl:apply-templates>
			</ul>
		</xsl:if>
	</xsl:template>

	<xsl:template match="Gift">
		<li>
			<xsl:choose>
				<xsl:when test="Url!=''">
					<a>
						<xsl:if test="ImageUrl!=''">
							<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=">
								<xsl:attribute name="src">
									<xsl:value-of select="ImageUrl"></xsl:value-of>
								</xsl:attribute>
								<xsl:attribute name="alt">
									<xsl:value-of select="Title"></xsl:value-of>
								</xsl:attribute>
							</img>
						</xsl:if>
						<xsl:attribute name="href">
							<xsl:value-of select="Url"></xsl:value-of>
						</xsl:attribute>
						<xsl:value-of select="Title"></xsl:value-of>
						<xsl:if test="Quantity>1">
						<xsl:text> x </xsl:text>
						<xsl:value-of select="Quantity"></xsl:value-of>
					</xsl:if>
					</a>
				</xsl:when>
				<xsl:otherwise>
					<xsl:if test="ImageUrl!=''">
						<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=">
							<xsl:attribute name="src">
								<xsl:value-of select="ImageUrl"></xsl:value-of>
							</xsl:attribute>
							<xsl:attribute name="alt">
								<xsl:value-of select="Title"></xsl:value-of>
							</xsl:attribute>
						</img>
					</xsl:if>
					<xsl:value-of select="Title"></xsl:value-of>
					<xsl:if test="Quantity>1">
						<xsl:text> x </xsl:text>
						<xsl:value-of select="Quantity"></xsl:value-of>
					</xsl:if>
				</xsl:otherwise>
			</xsl:choose>
		</li>
	</xsl:template>

</xsl:stylesheet>