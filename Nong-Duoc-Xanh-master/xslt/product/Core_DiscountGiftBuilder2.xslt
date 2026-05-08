<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes"/>

  <xsl:template match="/">
    <xsl:if test="count(/GiftList/Gift[ImageUrl!=''])>0">
      <xsl:apply-templates select="/GiftList/Gift[ImageUrl!=''][1]"></xsl:apply-templates>
    </xsl:if>
  </xsl:template>

  <xsl:template match="Gift">
    <img class="lazyload">
      <xsl:attribute name="src">
        <xsl:text>data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=</xsl:text>
      </xsl:attribute>
      <xsl:attribute name="data-src">
        <xsl:value-of select="ImageUrl"></xsl:value-of>
      </xsl:attribute>
      <xsl:attribute name="alt">
        <xsl:value-of select="Title"></xsl:value-of>
      </xsl:attribute>
    </img>
  </xsl:template>

</xsl:stylesheet>