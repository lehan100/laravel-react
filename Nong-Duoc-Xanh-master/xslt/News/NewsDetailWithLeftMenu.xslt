<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes" />

  <xsl:template match="/NewsDetail">
    <div class="support-detail">
      <h1 class="section-title">
        <xsl:value-of disable-output-escaping="yes" select="Title"></xsl:value-of>
        <xsl:value-of select="EditLink" disable-output-escaping="yes"></xsl:value-of>
      </h1>
      <div class="content">
        <div class="article-content">
          <xsl:value-of disable-output-escaping="yes" select="BriefContent"></xsl:value-of>
        </div>
      </div>
    </div>
  </xsl:template>
</xsl:stylesheet>