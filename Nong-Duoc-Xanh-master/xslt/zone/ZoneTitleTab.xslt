<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
	<xsl:output method="html" indent="yes"/>
	<xsl:template match="/ZoneList">
		<section class="section-candinate-tabs">
			<div class="container">
				<div class="rem:max-w-[1110px] mx-auto">
					<div class="text-center">
						<h2 class="title-64 mb-8">
							<xsl:value-of disable-output-escaping="yes" select="ModuleTitle"></xsl:value-of>
						</h2>
						<xsl:if test="Description">
							<div class="desc-18 mt-8 mb-9 format-content">
								<xsl:value-of disable-output-escaping="yes" select="Description"></xsl:value-of>
							</div>
						</xsl:if>
					</div>
					<ul class="wrap-tab-primary tab-center flex items-center gap-4 mb-10">
						<xsl:apply-templates select="Zone"></xsl:apply-templates>
					</ul>
				</div>
			</div>
		</section>
	</xsl:template>
	<xsl:template match="Zone">
		<li>
			<xsl:if test="IsActive='true'">
				<xsl:attribute name="class">
					<xsl:text>active</xsl:text>
				</xsl:attribute>
			</xsl:if>
			<a class="btn btn-discovery white" href="">
				<xsl:if test="IsActive='true'">
					<xsl:attribute name="class">
						<xsl:text>btn btn-discovery white active</xsl:text>
					</xsl:attribute>
				</xsl:if>
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
</xsl:stylesheet>