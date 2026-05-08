<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
    <xsl:output method="html" indent="yes" />

    <xsl:template match="/NewsList">
        <div class="dealer-wrap">
            <div class="row">
                <div class="col-lg-4">
                    <div class="result-wrapper">
                        <h1 class="section-title">
                            <xsl:value-of disable-output-escaping="yes" select="ZoneTitle"></xsl:value-of>
                        </h1>
                        <div class="result-list">
                            <ul id="list">
                                <xsl:apply-templates select="News"></xsl:apply-templates>

                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-lg-8">
                    <div class="map">
                        <div id="map_canvas">
                            <iframe id="contactMap" src="" frameborder="0"></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </xsl:template>

    <xsl:template match="News">
        <li class="contact-item">
            <xsl:attribute name="data-map">
                <xsl:value-of disable-output-escaping="yes" select="FullContent"></xsl:value-of>
            </xsl:attribute>
            <p class="name">
                <xsl:value-of disable-output-escaping="yes" select="Title"></xsl:value-of>
            </p>
            <p class="address">
                <xsl:value-of disable-output-escaping="yes" select="SubTitle"></xsl:value-of>
            </p>
            <p class="phone">
                <xsl:value-of disable-output-escaping="yes" select="BriefContent"></xsl:value-of>
            </p>
        </li>
    </xsl:template>

</xsl:stylesheet>