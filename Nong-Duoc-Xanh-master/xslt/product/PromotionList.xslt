<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes" />
  <xsl:template match="/">
    <div class="promo-list-heading flex justify-between items-center">
      <div class="promo-title flex items-center">
        <div class="icon flex flex-center">
          <img class="lazyload" alt="khuyến mãi" data-src="/Data/Sites/1/skins/default/img/promo/icon-title.png"
            src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" />
        </div>
        <div class="section-title text-blue ml-2">
          <xsl:value-of select="/PromotionList/PromotionMenuLink" disable-output-escaping="yes"></xsl:value-of>
        </div>
      </div>
    </div>
    <xsl:if test="count(/PromotionList/Promotion) > 0">
      <div class="promo-list-body">
        <div class="promo-list">
          <div class="row row-sm-2">
            <xsl:apply-templates select="/PromotionList/Promotion"></xsl:apply-templates>
          </div>
        </div>
      </div>
    </xsl:if>
  </xsl:template>

  <xsl:template match="Promotion">
    <xsl:if test="position()=1">
      <div class="promo-col w-100">
        <a class="promo-item">
          <xsl:attribute name="href">
            <xsl:value-of select="Url"></xsl:value-of>
          </xsl:attribute>
          <div class="promo-img">
            <xsl:if test="BannerUrl!=''">
              <img class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=">
              <xsl:attribute name="data-src">
                <xsl:value-of select="BannerUrl"></xsl:value-of>
              </xsl:attribute>
              <xsl:attribute name="data-src-small">
                <xsl:value-of select="ImageUrl"></xsl:value-of>
              </xsl:attribute>
              <xsl:attribute name="alt">
                <xsl:value-of select="Title"></xsl:value-of>
              </xsl:attribute>
              </img>
            </xsl:if>
          </div>
          <div class="promo-caption">
            <div class="promo-title">
              <xsl:value-of select="Title"></xsl:value-of>
            </div>
            <div class="promo-desc">
              <xsl:value-of select="BriefContent" disable-output-escaping="yes"></xsl:value-of>
            </div>
          </div>
        </a>
      </div>
    </xsl:if>
    <xsl:if test="position()>1">
      <div class="promo-col w-100">
        <a class="promo-item">
          <xsl:attribute name="href">
            <xsl:value-of select="Url"></xsl:value-of>
          </xsl:attribute>
          <div class="promo-img">
            <xsl:if test="ImageUrl!=''">
              <img class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=">
              <xsl:attribute name="data-src">
                <xsl:value-of select="ImageUrl"></xsl:value-of>
              </xsl:attribute>
              <xsl:attribute name="alt">
                <xsl:value-of select="Title"></xsl:value-of>
              </xsl:attribute>
              </img>
            </xsl:if>
          </div>
          <div class="promo-caption">
            <div class="promo-title">
              <xsl:value-of select="Title"></xsl:value-of>
            </div>
            <div class="promo-desc">
              <xsl:value-of select="BriefContent" disable-output-escaping="yes"></xsl:value-of>
            </div>
          </div>
        </a>
      </div>
    </xsl:if>
  </xsl:template>

</xsl:stylesheet>