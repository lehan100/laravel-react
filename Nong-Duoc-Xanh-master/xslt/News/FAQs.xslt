<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes" />

  <xsl:template match="/NewsList">
    <h1 class="section-title">
      <xsl:value-of disable-output-escaping="yes" select="ZoneTitle"></xsl:value-of>
    </h1>
    <div class="faq-list">
      <xsl:apply-templates select="News"></xsl:apply-templates>
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
  </xsl:template>

  <xsl:template match="News">
    <div class="faq-item">
      <div class="faq-trigger collapse-trigger">
        <div class="faq-title">
          <div class="number">
            <xsl:if test="position() &lt; 10">
              <xsl:text disable-output-escaping="yes">0</xsl:text>
            </xsl:if>
            <xsl:value-of disable-output-escaping="yes" select="position()"></xsl:value-of>
          </div>
          <div class="title">
            <xsl:value-of disable-output-escaping="yes" select="Title"></xsl:value-of>
            <xsl:value-of select="EditLink" disable-output-escaping="yes"></xsl:value-of>
          </div>
        </div><span class="ri-arrow-down-s-line"></span>
      </div>
      <div class="faq-body">
        <xsl:value-of disable-output-escaping="yes" select="BriefContent"></xsl:value-of>
      </div>
    </div>
  </xsl:template>
</xsl:stylesheet>