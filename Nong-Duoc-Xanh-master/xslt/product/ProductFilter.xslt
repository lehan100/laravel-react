<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes" />

  <xsl:template match="/ProductFilter">
    <div class="product-filter-wrap ">
      <div class="product-filter-heading">
        <div class="flex items-center justify-between">
          <div class="filter-close hidden-desktop">
            <em class="ri-close-line"></em>
          </div>
          <div class="filter-title flex items-center">
            <strong>
              <xsl:value-of disable-output-escaping="yes" select="ModuleTitle"></xsl:value-of>
            </strong>
          </div>
          <div class="filter-reset hidden-desktop">Bỏ chọn</div>
        </div>
      </div>
      <!--Giá-->
      <div class="product-filter-container ajaxfilterresponse">
        <xsl:apply-templates select="Group" />
      </div>
      <!-- <div class=" ajaxfilterresponse" style="margin-top: 10px;">
        Filter khác
        <xsl:apply-templates select="/ProductFilter/Group" />
      </div> -->
    </div>


  </xsl:template>

  <xsl:template match="Group">
    <div class="product-filter-item">
      <div class="product-filter-title flex items-center justify-between">
        <xsl:attribute name="class">
          <xsl:text>product-filter-title flex items-center justify-between</xsl:text>
          <xsl:if test="count(Option[IsActive='true'])>0">
            <xsl:text> active</xsl:text>
          </xsl:if>
        </xsl:attribute>
        <strong class="text">
          <xsl:value-of disable-output-escaping="yes" select="Title"></xsl:value-of>
        </strong>
        <div class="arrow">
          <em class="material-icons">expand_more</em>
        </div>
      </div>
      <div class="product-filter-body">
        <xsl:if test="count(Option[IsActive='true'])>0">
          <xsl:attribute name="style">
            <xsl:text>display:block</xsl:text>
          </xsl:attribute>
        </xsl:if>
        <div class="product-filter-group">
          <ul>
            <xsl:apply-templates select="Option" mode="SelectBox"></xsl:apply-templates>
          </ul>
          <xsl:if test="count(Zone) > 5">
            <a class="filter-view-more" href="#">+ Xem tất cả</a>
          </xsl:if>
        </div>
      </div>
    </div>
  </xsl:template>

  <xsl:template match="Option" mode="SelectBox">
    <li>
      <a class="filter-link ajaxlink">
        <xsl:choose>
          <xsl:when test="IsActive='true'">
            <xsl:attribute name="class">
              <xsl:text>filter-link ajaxlink active</xsl:text>
            </xsl:attribute>
            <xsl:attribute name="href">
              <xsl:value-of select="ClearUrl" />
            </xsl:attribute>
          </xsl:when>
          <xsl:otherwise>
            <xsl:attribute name="href">
              <xsl:value-of select="Url" />
            </xsl:attribute>
          </xsl:otherwise>
        </xsl:choose>
        <div class="check-box"></div>
        <div class="text">
          <xsl:value-of select="Title" />
        </div>
      </a>
    </li>
  </xsl:template>

</xsl:stylesheet>