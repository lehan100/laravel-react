<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
    <xsl:output method="html" indent="yes" />

    <xsl:template match="/NewsList">
        <div class="ajaxresponse">
            <h1 class="section-title text-center">
                <xsl:value-of disable-output-escaping="yes" select="ModuleTitle"></xsl:value-of>
            </h1>
            <div class="review-list ajaxresponsewrap">
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

    </xsl:template>

    <xsl:template match="News">
        <div class="review-item">
            <div class="row items-center">
                <div class="col-lg-7">
                    <div class="review-content leading-normal">
                        <div class="title">
                            <xsl:value-of disable-output-escaping="yes" select="Title"></xsl:value-of>
                            <xsl:value-of select="EditLink" disable-output-escaping="yes"></xsl:value-of>
                        </div>
                        <div class="content">
                            <xsl:value-of disable-output-escaping="yes" select="BriefContent"></xsl:value-of>
                        </div>
                        <div class="author">
                            <span>Khách hàng</span>
                            <div class="name">
                                <xsl:value-of disable-output-escaping="yes" select="FullContent"></xsl:value-of>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-5">
                    <div class="review-img">
                        <img>
                        <xsl:attribute name="src">
                            <xsl:value-of select="ImageUrl"></xsl:value-of>
                        </xsl:attribute>
                        <xsl:attribute name="alt">
                            <xsl:value-of select="Title"></xsl:value-of>
                        </xsl:attribute>
                        </img>
                        <xsl:if test="SubTitle != ''">
                            <a class="video" href="#">
                                <xsl:attribute name="href">
                                    <xsl:value-of select="SubTitle"></xsl:value-of>
                                </xsl:attribute>
                                <em class="ri-play-circle-line"></em>
                                <span>Video </span>
                            </a>
                        </xsl:if>
                    </div>
                </div>
            </div>
        </div>
    </xsl:template>

</xsl:stylesheet>