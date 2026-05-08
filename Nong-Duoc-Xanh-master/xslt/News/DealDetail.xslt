<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
    <xsl:output method="html" indent="yes" />

    <xsl:template match="/NewsDetail">
        <div class="deal-detail">
            <h1 class="section-title">
                <xsl:value-of disable-output-escaping="yes" select="Title"></xsl:value-of>
                <xsl:value-of select="EditLink" disable-output-escaping="yes"></xsl:value-of>
            </h1>
            <div class="article-content brief">
                <xsl:value-of disable-output-escaping="yes" select="FullContent"></xsl:value-of>
            </div>
            <xsl:if test="count(ProductRelated) > 0">
                <div class="deal-product">
                    <div class="row">
                        <xsl:apply-templates select="ProductRelated"></xsl:apply-templates>
                    </div>
                </div>
            </xsl:if>
        </div>
        <div class="deal-form-wrap"></div>
    </xsl:template>

    <xsl:template match="ProductRelated">
        <div class="col-lg-3 col-6">
            <div class="item">
                <div class="img">
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
                        <img>
                        <xsl:attribute name="src">
                            <xsl:value-of select="ImageUrl"></xsl:value-of>
                        </xsl:attribute>
                        <xsl:attribute name="alt">
                            <xsl:value-of select="Title"></xsl:value-of>
                        </xsl:attribute>
                        </img>
                    </a>
                </div>
                <div class="title">
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
            </div>
        </div>
    </xsl:template>

</xsl:stylesheet>