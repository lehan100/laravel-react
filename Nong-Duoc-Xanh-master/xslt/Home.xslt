<?xml version="1.0" encoding="utf-8"?><xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl"><xsl:output method="html" indent="yes"/><xsl:template match="/"><section>
			<section class="section-news">
				<div class="container">
					<xsl:apply-templates select="Zone"/>
				</div>
			</section>
		</section></xsl:template><xsl:template match="Zone"><div class="wrap-section-category" x-loop-item="Zone">
						<div class="title"><xsl:value-of disable-output-escaping="yes" select="Title"/></div>
						<div class="desc"><xsl:value-of disable-output-escaping="yes" select="Description"/></div>
						<div class="item-news-main" x-loop-item="Product">
							<div class="title-product"><xsl:value-of disable-output-escaping="yes" select="Title"/></div>
							<div class="img-product" x-loop-item="ProductImages"><img>
		<xsl:attribute name="data-src">
			<xsl:value-of select="ImageUrl"/>
		</xsl:attribute>
		<xsl:attribute name="class">
		<xsl:text disable-output-escaping="yes"> lozad</xsl:text>
		</xsl:attribute>
		<xsl:attribute name="alt">
			<xsl:value-of select="Title"/>
		</xsl:attribute>
		</img></div>
						</div>
					</div></xsl:template><xsl:template match="Product"><div class="item-news-main" x-loop-item="Product">
							<div class="title-product"><xsl:value-of disable-output-escaping="yes" select="Title"/></div>
							<div class="img-product" x-loop-item="ProductImages"><img>
		<xsl:attribute name="data-src">
			<xsl:value-of select="ImageUrl"/>
		</xsl:attribute>
		<xsl:attribute name="class">
		<xsl:text disable-output-escaping="yes"> lozad</xsl:text>
		</xsl:attribute>
		<xsl:attribute name="alt">
			<xsl:value-of select="Title"/>
		</xsl:attribute>
		</img></div>
						</div></xsl:template><xsl:template match="ProductImages"><div class="img-product" x-loop-item="ProductImages"><img>
		<xsl:attribute name="data-src">
			<xsl:value-of select="ImageUrl"/>
		</xsl:attribute>
		<xsl:attribute name="class">
		<xsl:text disable-output-escaping="yes"> lozad</xsl:text>
		</xsl:attribute>
		<xsl:attribute name="alt">
			<xsl:value-of select="Title"/>
		</xsl:attribute>
		</img></div></xsl:template></xsl:stylesheet>