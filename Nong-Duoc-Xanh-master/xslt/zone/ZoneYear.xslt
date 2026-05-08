<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
	<xsl:output method="html" indent="yes"/>
	<xsl:template match="/ZoneList">
		<section class="section-winner-wrapper title section-py !pt-0 !pb-0">
			<div class="container">
				<div class="wrap xl:w-6/12 mx-auto text-center">
					<h2 class="title-64 xs:max-lg:mt-5 md:mb-5 !text-white">
						<xsl:value-of disable-output-escaping="yes" select="ModuleTitle"></xsl:value-of>
					</h2>
					<ul class="wrap-tab-white tab-center mb-10 pt-4">
						<xsl:apply-templates select="Zone" mode="Zone-1"></xsl:apply-templates>
					</ul>
					<ul class="wrap-tab-primary tab-center flex items-center gap-4 mb-10">
						<xsl:apply-templates select="Zone[IsActive='true']/Zone" mode="Zone-1-Zone"></xsl:apply-templates>
					</ul>
				</div>
			</div>
		</section>
	</xsl:template>
	<xsl:template match="Zone" mode="Zone-1">
		<li>
			<xsl:if test="IsActive='true'">
				<xsl:attribute name="class">
					<xsl:text>active</xsl:text>
				</xsl:attribute>
			</xsl:if>
			<a>
				<xsl:attribute name="href">
					<xsl:value-of select="Url"></xsl:value-of>
				</xsl:attribute>
				<xsl:attribute name="title">
					<xsl:value-of select="Title"></xsl:value-of>
				</xsl:attribute>
				<xsl:value-of disable-output-escaping="yes" select="Title"></xsl:value-of>
			</a>
		</li>
	</xsl:template>
	<xsl:template match="Zone" mode="Zone-1-Zone">
		<li>
			<xsl:if test="IsActive='true'">
				<xsl:attribute name="class">
					<xsl:text>active</xsl:text>
				</xsl:attribute>
			</xsl:if>
			<a class="btn btn-discovery white">
					<xsl:attribute name="href">
						<xsl:value-of select="Url"></xsl:value-of>
					</xsl:attribute>
					<xsl:attribute name="title">
						<xsl:value-of select="Title"></xsl:value-of>
					</xsl:attribute>
				<xsl:if test="IsActive='true'">
					<xsl:attribute name="class">
						<xsl:text>btn btn-discovery white active</xsl:text>
					</xsl:attribute>
				</xsl:if>
				<span>
					<xsl:value-of disable-output-escaping="yes" select="Title"></xsl:value-of>
				</span>
				<img class="w-5 h-5 svg" data-src="/Data/Sites/1/skins/default/img/icon/arrow-primary.svg" alt=""/>
			</a>
		</li>
	</xsl:template>
</xsl:stylesheet>