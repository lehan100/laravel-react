<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
<xsl:output method="html" indent="yes"/>

    <xsl:template match="/NewsList">
        <div class="partner-slider position-relative">
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    <xsl:apply-templates select="News"></xsl:apply-templates>
                </div>
            </div>
            <div class="swiper-navigation">
                <div class="swiper-btn swiper-prev"><span class="lnr lnr-chevron-left"></span></div>
                <div class="swiper-btn swiper-next"><span class="lnr lnr-chevron-right"></span></div>
            </div>
        </div>
    </xsl:template>

    <xsl:template match="News">
        <div class="swiper-slide">
            <div class="img">
              <div class="logo">
                <a>
                  <xsl:attribute name="href">
                    <xsl:value-of select="SubTitle"></xsl:value-of>
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
                  <xsl:attribute name="alt">
                    <xsl:value-of select="Title"></xsl:value-of>
                  </xsl:attribute>
                  </img>
                </a>
              </div>
              <div class="title">
                <a>
                  <xsl:attribute name="href">
                    <xsl:value-of select="SubTitle"></xsl:value-of>
                  </xsl:attribute>
                  <xsl:attribute name="target">
                    <xsl:value-of select="Target"></xsl:value-of>
                  </xsl:attribute>
                  <xsl:attribute name="title">
                    <xsl:value-of select="Title"></xsl:value-of>
                  </xsl:attribute>
                  <xsl:value-of select="Title"></xsl:value-of>
                </a>
                <xsl:value-of select="EditLink" disable-output-escaping="yes"></xsl:value-of>
              </div>
            </div>
          </div>
    </xsl:template>

</xsl:stylesheet>