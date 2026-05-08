<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes" />

  <xsl:template match="/ZoneList">
    <xsl:apply-templates select="Zone[Depth = 1]"></xsl:apply-templates>
  </xsl:template>

  <xsl:template match="Zone">
    <div class="category-list white-wrap">
      <div class="section-heading">
        <div class="section-title">
          <div class="icon">
            <img>
            <xsl:attribute name="src">
              <xsl:value-of select="ImageUrl"></xsl:value-of>
            </xsl:attribute>
            <!-- <xsl:attribute name="alt">
              <xsl:value-of select="Title"></xsl:value-of>
            </xsl:attribute> -->
            </img>
          </div>
          <span class="text">
            <xsl:value-of disable-output-escaping="yes" select="Title"></xsl:value-of>
          </span>
        </div>
        <div class="section-view-more">
          <ul class="category-zone">
            <li>
              <a class="tab-toggle active">
                <xsl:attribute name="data-tab">
                  <xsl:text disable-output-escaping="yes">zone-</xsl:text>
                  <xsl:value-of select="ZoneId"></xsl:value-of>
                </xsl:attribute>
                <xsl:attribute name="target">
                  <xsl:value-of select="Target"></xsl:value-of>
                </xsl:attribute>
                <xsl:attribute name="title">
                  <xsl:value-of select="Title"></xsl:value-of>
                </xsl:attribute>
                <xsl:text disable-output-escaping="yes">Tất cả</xsl:text>
              </a>
            </li>
            <xsl:apply-templates select="Zone" mode="Child"></xsl:apply-templates>
          </ul>
        </div>
      </div>
      <div class="white-wrap-body">
        <div class="tab-content active">
          <xsl:attribute name="data-tab">
            <xsl:text disable-output-escaping="yes">zone-</xsl:text>
            <xsl:value-of select="ZoneId"></xsl:value-of>
          </xsl:attribute>
          <div class="product-slider position-relative">
            <div class="swiper-container">
              <div class="swiper-wrapper">
                <xsl:apply-templates select="Product"></xsl:apply-templates>
              </div>
              <div class="swiper-navigation">
                <div class="swiper-btn swiper-prev swiper-btn-inside"><span class="lnr lnr-chevron-left"></span></div>
                <div class="swiper-btn swiper-next swiper-btn-inside"><span class="lnr lnr-chevron-right"></span></div>
              </div>
            </div>
          </div>
        </div>
        <xsl:apply-templates select="Zone" mode="ChildZone"></xsl:apply-templates>
      </div>
    </div>

  </xsl:template>

  <xsl:template match="Zone" mode="Child">
    <li>
      <a class="tab-toggle">
        <xsl:attribute name="data-tab">
          <xsl:text disable-output-escaping="yes">zone-</xsl:text>
          <xsl:value-of select="ZoneId"></xsl:value-of>
        </xsl:attribute>
        <xsl:attribute name="target">
          <xsl:value-of select="Target"></xsl:value-of>
        </xsl:attribute>
        <xsl:attribute name="title">
          <xsl:value-of select="Title"></xsl:value-of>
        </xsl:attribute>
        <xsl:value-of select="Title"></xsl:value-of>
      </a>
    </li>
  </xsl:template>

  <xsl:template match="Zone" mode="ChildZone">
    <div class="tab-content">
      <xsl:attribute name="data-tab">
        <xsl:text disable-output-escaping="yes">zone-</xsl:text>
        <xsl:value-of select="ZoneId"></xsl:value-of>
      </xsl:attribute>
      <div class="product-slider position-relative">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <xsl:apply-templates select="Product"></xsl:apply-templates>
          </div>
          <div class="swiper-navigation">
            <div class="swiper-btn swiper-prev swiper-btn-inside"><span class="lnr lnr-chevron-left"></span></div>
            <div class="swiper-btn swiper-next swiper-btn-inside"><span class="lnr lnr-chevron-right"></span></div>
          </div>
        </div>
      </div>
    </div>
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
          <xsl:if test="OldPriceDiscountPercentage!=''">
            <div class="product-discount">
              <xsl:text>Giảm </xsl:text>
              <xsl:value-of select="OldPriceDiscountPercentage"></xsl:value-of>
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
      </div>
    </div>
  </xsl:template>


</xsl:stylesheet>