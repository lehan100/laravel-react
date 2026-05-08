<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes"/>

  <xsl:template match="/">
    <xsl:if test="count(/BannerList/Banner)>0">
      <div class="banner">
        <xsl:apply-templates select="/BannerList/Banner"></xsl:apply-templates>
        <h1 class="caption">
          <xsl:value-of select="/BannerList/ZoneTitle" disable-output-escaping="yes"></xsl:value-of>
        </h1>
      </div>
    </xsl:if>
  </xsl:template>

  <xsl:template match="Banner">
    <img class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=">
      <xsl:attribute name="data-src">
        <xsl:value-of select="ImageUrl"></xsl:value-of>
      </xsl:attribute>
      <xsl:attribute name="alt">
        <xsl:value-of select="Title" disable-output-escaping="yes"></xsl:value-of>
      </xsl:attribute>
    </img>
  </xsl:template>
  
</xsl:stylesheet>