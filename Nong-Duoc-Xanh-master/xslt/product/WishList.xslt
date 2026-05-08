<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes" />
  <xsl:template match="/ShoppingCart">
    <xsl:choose>
      <xsl:when test="count(CartItem)=0">
        <div class="posttitle">
          <xsl:text disable-output-escaping="yes">Bạn chưa có sản phẩm yêu thích</xsl:text>
        </div>
      </xsl:when>
      <xsl:otherwise>
        <div class="cart-inner">
          <div class="card-heading">
            <div class="card-title">
              <a href="#">
                <span class="ri-arrow-left-s-line"></span>
              </a>
              <div class="posttitle">
                <xsl:text>Danh sách yêu thích của bạn (</xsl:text>
                <xsl:value-of select="count(CartItem)"></xsl:value-of>
                <xsl:text> sản phẩm)</xsl:text>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="cart-product-list">
              <div class="cart-product-list-body">
                <xsl:apply-templates select="CartItem"></xsl:apply-templates>
              </div>

            </div>
          </div>
        </div>
      </xsl:otherwise>
    </xsl:choose>

  </xsl:template>

  <xsl:template match="CartItem">
    <div class="cart-product-item flex">
      <div class="cart-product-item-img flex items-center">
        <a>
          <xsl:attribute name="href">
            <xsl:value-of select="Url"></xsl:value-of>
          </xsl:attribute>
          <xsl:attribute name="target">
            <xsl:value-of select="target"></xsl:value-of>
          </xsl:attribute>
          <img  src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=">
            <xsl:attribute name="src">
              <xsl:value-of select="ImageUrl"></xsl:value-of>
            </xsl:attribute>
            <xsl:attribute name="alt">
              <xsl:value-of select="Title"></xsl:value-of>
            </xsl:attribute>
          </img>
        </a>
      </div>
      <div class="cart-product-item-content flex flex-wrap">
        <div class="cart-product-item-content-left">
          <div class="cart-product-item-content-top flex">
            <div class="cart-product-item-detail flex flex-wrap justify-between">
              <div class="cart-product-item-caption">
                <a class="cart-product-item-name">
                  <xsl:attribute name="href">
                    <xsl:value-of select="Url"></xsl:value-of>
                  </xsl:attribute>
                  <xsl:value-of select="Title"></xsl:value-of>
                </a>
              </div>
              <div class="cart-product-item-price leading-snug text-right">
                <p class="fz-18">
                  <xsl:value-of select="Price"></xsl:value-of>
                </p>
                <p class="flex items-center justify-end">
                  <xsl:if test="OldPrice!=''">
                    <del class="text-light-grey">
                      <xsl:value-of select="OldPrice"></xsl:value-of>
                    </del>
                    <span class="ml-1 mr-1 fz-14 text-light-grey">| </span>
                  </xsl:if>
                  <span class="text-main">
                    <xsl:if test="DiscountPercentage !=''">
                      <span class="discount">
                        <xsl:text>- </xsl:text>
                        <xsl:value-of select="DiscountPercentage"></xsl:value-of>
                        <xsl:text>%</xsl:text>
                      </span>
                    </xsl:if>
                  </span>
                </p>
                <p class="mt-1 text-light-grey text-right">
                  <a class="fz-20" href="#" onclick="AjaxCart.removefromwishlist(this);return false;">
                    <xsl:attribute name="data-itemguid">
                      <xsl:value-of select="ItemGuid"></xsl:value-of>
                    </xsl:attribute>
                    <span class="ri-delete-bin-line"></span>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </xsl:template>


  <xsl:template match="Attributes">
    <xsl:if test="count(Options[IsActive='true']) > 0 ">
      <div class="size">
        <xsl:value-of select="Title"></xsl:value-of>
        <xsl:text>: </xsl:text>
        <xsl:apply-templates select="Options"></xsl:apply-templates>
      </div>
    </xsl:if>
  </xsl:template>
  <xsl:template match="Options">
    <xsl:if test="IsActive='true'">
      <xsl:value-of select="Title"></xsl:value-of>
    </xsl:if>
  </xsl:template>
</xsl:stylesheet>