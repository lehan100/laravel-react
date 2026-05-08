<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes"/>

  <xsl:template match="/">
    <div class="news-detail-lastest-news">
      <h2 class="lastest-title text-main fz-18 font-bold text-uppercase mb-3">
        <xsl:value-of select="/NewsList/ModuleTitle" disable-output-escaping="yes"></xsl:value-of>
      </h2>
      <div class="lastest-news-list">
        <xsl:apply-templates select="/NewsList/News"></xsl:apply-templates>
      </div>
    </div>
  </xsl:template>

  <xsl:template match="News">
    <div class="lastest-news-item">
      <div class="img">
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
      <div class="caption">
        <div class="date text-dark-grey fz-14">
          <em class="ri-calendar-line fz-16"></em>
          <time>
            <xsl:value-of select="CreatedDate"></xsl:value-of>
          </time>
        </div>
        <div class="title mt-1 leading-snug fz-14">
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
      </div>
    </div>
  </xsl:template>
</xsl:stylesheet>