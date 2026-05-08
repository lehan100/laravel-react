<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
	<xsl:output method="html" indent="yes"/>
	<xsl:template match="/NewsList">
		<section class="section-judges section-py !pt-0 !pb-0">
			<div class="container">
				<div class="text-center">
					<h2 class="title-64 mb-8">
						<xsl:value-of disable-output-escaping="yes" select="ZoneTitle"></xsl:value-of>
					</h2>
					<div class="desc-18 mt-8 mb-9">
						<xsl:value-of disable-output-escaping="yes" select="ZoneDescription"></xsl:value-of>
					</div>
				</div>
				<div class="wrap-judges">
					<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-15">
						<xsl:apply-templates select="News"></xsl:apply-templates>
					</div>
				</div>
			</div>
		</section>
	</xsl:template>
	<xsl:template match="News">
		<div class="item-judge">
			<div class="item-judge-image img-ratio zoom-img rounded-style-primary">
				<img >
					<xsl:attribute name="class">
						<xsl:text disable-output-escaping="yes">lozad</xsl:text>
					</xsl:attribute>
					<xsl:attribute name="data-src">
						<xsl:value-of select="ImageUrl"></xsl:value-of>
					</xsl:attribute>
					<xsl:attribute name="alt">
						<xsl:value-of select="Title"></xsl:value-of>
					</xsl:attribute>
				</img>
			</div>
			<div class="item-judge-content mt-5">
				<h2 class="title-40 mb-2">
					<xsl:value-of disable-output-escaping="yes" select="Title"></xsl:value-of>
					<xsl:value-of select="EditLink" disable-output-escaping="yes"></xsl:value-of>
				</h2>
				<div class="desc">
					<xsl:value-of disable-output-escaping="yes" select="BriefContent"></xsl:value-of>
				</div>
			</div>
		</div>
	</xsl:template>
</xsl:stylesheet>