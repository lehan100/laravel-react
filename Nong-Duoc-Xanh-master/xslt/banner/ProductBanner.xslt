<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes" />

  <xsl:template match="/">
    <xsl:if test="count(/BannerList/Banner)>0">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <xsl:apply-templates select="/BannerList/Banner"></xsl:apply-templates>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </xsl:if>
  </xsl:template>

  <xsl:template match="Banner">
    <div class="swiper-slide">
      <a class="object-fit-img banner">
        <xsl:attribute name="href">
          <xsl:value-of select="Url"></xsl:value-of>
        </xsl:attribute>
        <img class="swiper-lazy">
        <xsl:attribute name="alt">
          <xsl:value-of select="Title"></xsl:value-of>
        </xsl:attribute>
        <xsl:choose>
          <xsl:when test="position() > 1">
            <xsl:attribute name="data-src">
              <xsl:value-of select="ImageUrl"></xsl:value-of>
            </xsl:attribute>
            <xsl:attribute name="data-srcset">
              <xsl:if test="ThumbnailUrl != ''">
                <xsl:value-of select="ThumbnailUrl"></xsl:value-of>
                <xsl:text> 1024w, </xsl:text>
              </xsl:if>
              <xsl:value-of select="ImageUrl"></xsl:value-of>
            </xsl:attribute>
          </xsl:when>
          <xsl:otherwise>
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
          </xsl:otherwise>
        </xsl:choose>
        </img>
      </a>
    </div>
  </xsl:template>

</xsl:stylesheet>