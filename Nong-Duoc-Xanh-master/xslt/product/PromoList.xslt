<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes" />

  <xsl:template match="/ProductList">
    <div class="product-list product-list-promo">
      <div class="row equal-height">
        <xsl:apply-templates select="Product"></xsl:apply-templates>
      </div>
    </div>
  </xsl:template>

  <xsl:template match="Product">
    <div class="col-xl-3 col-md-4 col-6">
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