<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes" />

  <xsl:template match="/BannerList">
    <div class="big-banner">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <xsl:apply-templates select="Banner"></xsl:apply-templates>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </div>
  </xsl:template>

  <xsl:template match="Banner">
    <div class="swiper-slide">
      <div class="item">
        <a class="img" href="#">
          <xsl:attribute name="href">
            <xsl:value-of select="Url"></xsl:value-of>
          </xsl:attribute>
          <xsl:attribute name="target">
            <xsl:value-of select="Target"></xsl:value-of>
          </xsl:attribute>
          <xsl:attribute name="title">
            <xsl:value-of select="Title"></xsl:value-of>
          </xsl:attribute>
          <img>
            <xsl:attribute name="src">
              <xsl:value-of select="ImageUrl"></xsl:value-of>
            </xsl:attribute>
            <xsl:attribute name="srcset">
              <xsl:if test="ThumbnailUrl != ''">
                <xsl:value-of select="ThumbnailUrl"></xsl:value-of>
                <xsl:text> 1024w, </xsl:text>
              </xsl:if>
              <xsl:value-of select="ImageUrl"></xsl:value-of>
            </xsl:attribute>
            <xsl:attribute name="alt">
              <xsl:value-of select="Title"></xsl:value-of>
            </xsl:attribute>
          </img>
        </a>
      </div>
    </div>
  </xsl:template>

</xsl:stylesheet>