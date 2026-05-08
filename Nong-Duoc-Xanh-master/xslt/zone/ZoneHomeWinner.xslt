<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
	<xsl:output method="html" indent="yes"/>
	<xsl:template match="/ZoneList">
		<div class="wrap lg:w-6/12">
			<h2 class="title-64 mb-5  is-split-text" data-scroll="dt" data-scroll-offset="30%">
				<xsl:value-of disable-output-escaping="yes" select="Zone[1]/Title"></xsl:value-of>
			</h2>
			<div class="desc-18 transition-top" data-scroll="" data-scroll-offset="30%">
				<xsl:value-of disable-output-escaping="yes" select="Zone[1]/Description"></xsl:value-of>
			</div>
			<div class="flex mt-10 gap-5 overflow-auto transition-bottom" data-scroll="" data-scroll-offset="30%">
				<xsl:apply-templates select="Zone/Zone" mode="Years"></xsl:apply-templates>
			</div>
		</div>
	</xsl:template>
	<xsl:template match="Zone" mode="Years">
		<a class="btn btn-discovery white !min-w-[auto]">
			<xsl:attribute name="href">
				<xsl:value-of select="Url"></xsl:value-of>
			</xsl:attribute>
			<xsl:attribute name="title">
				<xsl:value-of select="Title"></xsl:value-of>
			</xsl:attribute>
			<span>
				<xsl:value-of disable-output-escaping="yes" select="Title"></xsl:value-of>
			</span>
			<img class="w-5 h-5 svg" data-src="/Data/Sites/1/skins/default/img/icon/arrow-primary.svg" alt=""/>
		</a>
	</xsl:template>
</xsl:stylesheet>