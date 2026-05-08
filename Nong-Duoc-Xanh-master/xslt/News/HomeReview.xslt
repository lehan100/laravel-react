<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
    <xsl:output method="html" indent="yes" />

    <xsl:template match="/NewsList">
        <h2 class="fz-20 font-bold text-main">
            <xsl:value-of disable-output-escaping="yes" select="ModuleTitle"></xsl:value-of>
        </h2>
        <div class="feedback-list">
            <div class="row equal-height">
                <xsl:apply-templates select="News"></xsl:apply-templates>
            </div>
        </div>
    </xsl:template>

    <xsl:template match="News">
        <div class="col-lg-4 col-sm-6">
            <div class="item">
                <div class="content leading-snug">
                    <div class="title font-bold">
                        <xsl:value-of disable-output-escaping="yes" select="Title"></xsl:value-of>
                    </div>
                    <div class="text">
                        <xsl:value-of disable-output-escaping="yes" select="BriefContent"></xsl:value-of>
                    </div>
                </div>
                <div class="author">
                    <div class="img">
                        <img>
                        <xsl:attribute name="src">
                            <xsl:value-of select="ThumbnailUrl"></xsl:value-of>
                        </xsl:attribute>
                        <xsl:attribute name="alt">
                            <xsl:value-of select="Title"></xsl:value-of>
                        </xsl:attribute>
                        </img>
                    </div>
                    <div class="info">
                        <div class="subtitle">Khách hàng</div>
                        <div class="name">
                            <xsl:value-of disable-output-escaping="yes" select="FullContent"></xsl:value-of>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </xsl:template>

</xsl:stylesheet>