<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes" />

  <xsl:template match="/ProductList">
    <xsl:if test="count(Product)>0">
      <section class="home-2 section-small">
        <div class="container">
          <div class="flash-deal-slider position-relative">
            <div class="swiper-container">
              <div class="swiper-wrapper">
                <xsl:apply-templates select="Product"></xsl:apply-templates>
              </div>
            </div>
            <div class="swiper-navigation">
              <div class="swiper-btn swiper-prev"><span class="lnr lnr-chevron-left"></span></div>
              <div class="swiper-btn swiper-next"><span class="lnr lnr-chevron-right"></span></div>
            </div>
          </div>
        </div>
      </section>
    </xsl:if>
  </xsl:template>

  <xsl:template match="Product">
    <div class="swiper-slide">
      <div class="product-item">
        <a class="product-img" href="#">
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
          <xsl:attribute name="alt">
            <xsl:value-of select="Title"></xsl:value-of>
          </xsl:attribute>
          </img>
          <xsl:if test="DiscountPercentage!=''">
            <div class="product-discount">
              <xsl:text>Giảm </xsl:text>
              <xsl:value-of select="DiscountPercentage"></xsl:value-of>
              <xsl:text>%</xsl:text>
            </div>
          </xsl:if>
        </a>
        <xsl:if test="ShowOption>0">
          <div class="product-icon">
            <xsl:if test="floor(ShowOption div 1) mod 2 = 1">
              <span class="icon icon-new">new</span>
            </xsl:if>
          </div>
        </xsl:if>
        <div class="product-name leading-snug">
          <a>
            <xsl:attribute name="href">
              <xsl:value-of select="Url"></xsl:value-of>
            </xsl:attribute>
            <xsl:attribute name="target">
              <xsl:value-of select="Target"></xsl:value-of>
            </xsl:attribute>
            <xsl:attribute name="title">
              <xsl:value-of select="Title"></xsl:value-of>
            </xsl:attribute>
            <xsl:value-of select="Title"></xsl:value-of>
          </a>
        </div>
        <div class="product-price">
          <strong class="price text-main">
            <xsl:value-of disable-output-escaping="yes" select="Price"></xsl:value-of>
          </strong>
          <xsl:if test="OldPrice != ''">
            <del class="old-price">
              <xsl:value-of disable-output-escaping="yes" select="OldPrice"></xsl:value-of>
            </del>
          </xsl:if>
        </div>
        <div class="product-deal-progress">
          <div class="deal-progress-bar">
            <xsl:if test="DealSoldPercent!=''">
              <div class="deal-progress-bar-inner">
                <xsl:attribute name="style">
                  <xsl:text>width:</xsl:text>
                  <xsl:value-of select="DealSoldPercent"></xsl:value-of>
                  <xsl:text>%</xsl:text>
                </xsl:attribute>
              </div>
            </xsl:if>
          </div>
          <div class="deal-progress-bar-text flex justify-between">
            <div class="sold-deal">
              <span>Đã bán:</span>
              <strong>
                <xsl:value-of select="DealSoldQty"></xsl:value-of>
              </strong>
            </div>
            <xsl:if test="DealEndDay != ''">
              <strong class="deal-countdown">
                <xsl:attribute name="data-countdown">
                  <xsl:value-of select="DealEndDay"></xsl:value-of>
                  <xsl:text>/</xsl:text>
                  <xsl:value-of select="DealEndMonth"></xsl:value-of>
                  <xsl:text>/</xsl:text>
                  <xsl:value-of select="DealEndYear"></xsl:value-of>
                  <xsl:text> </xsl:text>
                  <xsl:value-of select="DealEndHour"></xsl:value-of>
                  <xsl:text>:</xsl:text>
                  <xsl:value-of select="DealEndMinute"></xsl:value-of>
                  <xsl:text>:</xsl:text>
                  <xsl:value-of select="DealEndSecond"></xsl:value-of>
                </xsl:attribute>
              </strong>
            </xsl:if>
          </div>
        </div>
      </div>
    </div>
  </xsl:template>



</xsl:stylesheet>