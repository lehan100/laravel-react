<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes"/>

  <xsl:template match="/">
    <h2 class="section-title text-blue mb-3">
      <xsl:value-of select="/NewsList/ModuleTitle"></xsl:value-of>
    </h2>
    <div class="news-list">
      <div class="row">
        <div class="col-lg-6">
          <div class="news-item big-news">
            <xsl:apply-templates select="/NewsList/News[1]" mode="Big"></xsl:apply-templates>
          </div>
        </div>
        <div class="col-lg-6 side-news-list">
          <div class="row">
            <xsl:apply-templates select="/NewsList/News"></xsl:apply-templates>
          </div>
        </div>
      </div>
    </div>
  </xsl:template>

  <xsl:template match="News" mode="Big">
    <div class="news-item big-news">
      <div class="news-image">
        <a>
          <xsl:attribute name="target">
            <xsl:value-of select="Target"></xsl:value-of>
          </xsl:attribute>
          <xsl:attribute name="href">
            <xsl:value-of select="Url"></xsl:value-of>
          </xsl:attribute>
          <img class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=">
            <xsl:attribute name="data-src">
              <xsl:value-of select="ImageUrl"></xsl:value-of>
            </xsl:attribute>
            <xsl:attribute name="alt">
              <xsl:value-of select="Title" disable-output-escaping="yes"></xsl:value-of>
            </xsl:attribute>
          </img>
        </a>
      </div>
      <div class="news-caption leading-snug">
        <div class="news-title fz-20 font-bold mb-1">
          <a>
            <xsl:attribute name="target">
              <xsl:value-of select="Target"></xsl:value-of>
            </xsl:attribute>
            <xsl:attribute name="href">
              <xsl:value-of select="Url"></xsl:value-of>
            </xsl:attribute>
            <xsl:value-of select="Title"></xsl:value-of>
          </a>
        </div>
        <div class="news-brief text-dark-grey mb-1">
          <xsl:value-of select="BriefContent" disable-output-escaping="yes"></xsl:value-of>
        </div>
        <a class="news-view-more font-bold fz-14 text-blue" href="#">
          <xsl:attribute name="target">
            <xsl:value-of select="Target"></xsl:value-of>
          </xsl:attribute>
          <xsl:attribute name="href">
            <xsl:value-of select="Url"></xsl:value-of>
          </xsl:attribute>
          <xsl:text>Xem thêm</xsl:text>
        </a>
      </div>
    </div>
  </xsl:template>
  
  <xsl:template match="News">
    <xsl:if test="position()>1">
      <div class="col-lg-12">
        <div class="news-item side-news">
          <div class="news-image">
            <a>
              <xsl:attribute name="target">
                <xsl:value-of select="Target"></xsl:value-of>
              </xsl:attribute>
              <xsl:attribute name="href">
                <xsl:value-of select="Url"></xsl:value-of>
              </xsl:attribute>
              <img class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=">
                <xsl:attribute name="data-src">
                  <xsl:value-of select="ImageUrl"></xsl:value-of>
                </xsl:attribute>
                <xsl:attribute name="alt">
                  <xsl:value-of select="Title" disable-output-escaping="yes"></xsl:value-of>
                </xsl:attribute>
              </img>
            </a>
          </div>
          <div class="news-caption leading-snug">
            <div class="news-title fz-18 font-bold mb-1">
              <a>
                <xsl:attribute name="target">
                  <xsl:value-of select="Target"></xsl:value-of>
                </xsl:attribute>
                <xsl:attribute name="href">
                  <xsl:value-of select="Url"></xsl:value-of>
                </xsl:attribute>
                <xsl:value-of select="Title"></xsl:value-of>
              </a>
            </div>
            <div class="news-brief text-dark-grey mb-1">
              <xsl:value-of select="BriefContent" disable-output-escaping="yes"></xsl:value-of>
            </div>
            <a class="news-view-more font-bold fz-14 text-blue" href="#">
              <xsl:attribute name="target">
                <xsl:value-of select="Target"></xsl:value-of>
              </xsl:attribute>
              <xsl:attribute name="href">
                <xsl:value-of select="Url"></xsl:value-of>
              </xsl:attribute>
              <xsl:text>Xem thêm</xsl:text>
            </a>
          </div>
        </div>
      </div>
    </xsl:if>
  </xsl:template>
  
</xsl:stylesheet>