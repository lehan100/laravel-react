<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes" />

  <xsl:template match="/NewsList">
    <div class="section-small">
      <div class="container ajaxresponse">
        <h1 class="section-title text-center">
          <xsl:value-of disable-output-escaping="yes" select="ZoneTitle"></xsl:value-of>
        </h1>
        <div class="news-list ajaxresponsewrap">
          <xsl:apply-templates select="News"></xsl:apply-templates>
        </div>
        <xsl:if test="NextPageUrl!=''">
          <div class="btn-wrap text-center ajaxpagerlinkwrap">
            <a class="view-more ajaxpagerlink" href="#">
              <xsl:attribute name="href">
                <xsl:value-of disable-output-escaping="yes" select="NextPageUrl"></xsl:value-of>
              </xsl:attribute>
              <xsl:text disable-output-escaping="yes"> Xem thêm</xsl:text>
              <span class="material-icons">expand_more
              </span>
            </a>
          </div>
        </xsl:if>
      </div>
    </div>
  </xsl:template>

  <xsl:template match="News">
    <div class="news-col">
      <a class="news-item news-item-small" href="#">
        <xsl:attribute name="href">
          <xsl:value-of select="Url"></xsl:value-of>
        </xsl:attribute>
        <xsl:attribute name="target">
          <xsl:value-of select="Target"></xsl:value-of>
        </xsl:attribute>
        <xsl:attribute name="title">
          <xsl:value-of select="Title"></xsl:value-of>
        </xsl:attribute>
        <div class="news-img object-fit-img">
          <img>
          <xsl:attribute name="src">
            <xsl:value-of select="ImageUrl"></xsl:value-of>
          </xsl:attribute>
          <xsl:attribute name="alt">
            <xsl:value-of select="Title"></xsl:value-of>
          </xsl:attribute>
          </img>
        </div>
        <div class="news-caption">
          <div class="title">
            <xsl:value-of select="Title"></xsl:value-of>
          </div>
        </div>
      </a>
      <xsl:value-of select="EditLink" disable-output-escaping="yes"></xsl:value-of>
    </div>
  </xsl:template>
</xsl:stylesheet>