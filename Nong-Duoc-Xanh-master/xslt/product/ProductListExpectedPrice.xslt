<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes" />

  <xsl:template match="/">

    <div class="product-list-heading justify-between flex flex-wrap">
      <div class="product-list-title flex items-center">
        <div class="icon flex flex-center">
          <xsl:if test="/ProductList/ZoneImageUrl!=''">
            <img class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=">
            <xsl:attribute name="data-src">
              <xsl:value-of select="/ProductList/ZoneImageUrl"></xsl:value-of>
            </xsl:attribute>
            <xsl:attribute name="alt">
              <xsl:value-of select="/ProductList/ZoneTitle"></xsl:value-of>
            </xsl:attribute>
            </img>
          </xsl:if>
        </div>
        <h1 class="section-title text-blue ml-2">
          <xsl:value-of select="/ProductList/ZoneTitle"></xsl:value-of>
        </h1>
      </div>
      <div class="product-list-util flex items-center">
        <div class="product-list-sort">
          <strong class="text-blue mr-1">Sắp xếp: </strong>
          <select class="ajaxsort">
            <xsl:apply-templates select="/ProductList/SortBy"></xsl:apply-templates>
          </select>
        </div>
        <div class="product-list-display ml-3 hidden-mobile">
          <strong class="text-blue mr-1">Hiển thị: </strong>
          <select class="ajaxsort">
            <xsl:apply-templates select="/ProductList/PageSize" />
          </select>
        </div>
        <div class="filter-mobile-toggle flex flex-center hidden-desktop text-blue">
          <em class="ri-filter-fill"></em>
          <strong class="ml-1">Bộ lọc</strong>
        </div>
      </div>
    </div>
    <xsl:if test="ProductList/ZoneDescription != ''">
      <div class="product-list-desc">
        <div class="article-content">
          <xsl:value-of disable-output-escaping="yes" select="ProductList/ZoneDescription"></xsl:value-of>
        </div>
        <a style="cursor: pointer" class="view-more-desc">Xem thêm<i class="ri-arrow-down-s-fill"></i>
        </a>
      </div>

    </xsl:if>
    <div class="product-list-body">
      <div class="product-list">
        <div class="row row-2 row-md-3 row-lg-4 ajaxresponse">
          <xsl:apply-templates select="ProductList/Product"></xsl:apply-templates>
        </div>
      </div>
    </div>

  </xsl:template>

  <xsl:template match="SortBy">
    <option>
      <xsl:if test="IsActive='true'">
        <xsl:attribute name="selected">
          <xsl:text>selected</xsl:text>
        </xsl:attribute>
      </xsl:if>
      <xsl:attribute name="value">
        <xsl:value-of select="Url"></xsl:value-of>
      </xsl:attribute>
      <xsl:value-of select="Title"></xsl:value-of>
    </option>
  </xsl:template>

  <xsl:template match="PageSize">
    <option>
      <xsl:if test="IsActive='true'">
        <xsl:attribute name="selected">
          <xsl:text>selected</xsl:text>
        </xsl:attribute>
      </xsl:if>
      <xsl:attribute name="value">
        <xsl:value-of select="Url"></xsl:value-of>
      </xsl:attribute>
      <xsl:value-of select="Title"></xsl:value-of>
    </option>
  </xsl:template>

  <xsl:template match="Product">
    <div class="w-100">
      <div class="product-item">
        <a class="product-img">
          <xsl:attribute name="href">
            <xsl:value-of select="Url" />
          </xsl:attribute>
          <img class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=">
          <xsl:attribute name="data-src">
            <xsl:value-of select="ImageUrl"></xsl:value-of>
          </xsl:attribute>
          <xsl:attribute name="alt">
            <xsl:value-of select="Title"></xsl:value-of>
          </xsl:attribute>
          </img>
          <xsl:if test="DiscountPercentage!=''">
            <div class="product-deal-coupon">
              <xsl:text>Giảm </xsl:text>
              <xsl:value-of select="DiscountPercentage"></xsl:value-of>
              <xsl:text>%</xsl:text>
            </div>
          </xsl:if>
          <xsl:if test="ShowOption>0">
            <div class="product-icon">
              <ul>
                <xsl:if test="floor(ShowOption div 1) mod 2 = 1">
                  <li>
                    <span class="icon-brown">new</span>
                  </li>
                </xsl:if>
                <xsl:if test="floor(ShowOption div 2) mod 2 = 1">
                  <li>
                    <span class="icon-blue">Mua 1 tặng 1</span>
                  </li>
                </xsl:if>
                <xsl:if test="floor(ShowOption div 4) mod 2 = 1">
                  <li>
                    <span class="icon-blue">Mua 2 tặng 2</span>
                  </li>
                </xsl:if>
                <xsl:if test="floor(ShowOption div 8) mod 2 = 1">
                  <li>
                    <span class="icon-blue">Mua 3 tặng 1</span>
                  </li>
                </xsl:if>
                <xsl:if test="floor(ShowOption div 16) mod 2 = 1">
                  <li>
                    <span class="icon-blue">Mua 4 tặng 1</span>
                  </li>
                </xsl:if>
                <xsl:if test="floor(ShowOption div 32) mod 2 = 1">
                  <li>
                    <span class="icon-blue">Mua 5 tặng 1</span>
                  </li>
                </xsl:if>
                <xsl:if test="floor(ShowOption div 64) mod 2 = 1">
                  <li>
                    <span class="icon-blue">Mua 6 tặng 1</span>
                  </li>
                </xsl:if>
                <xsl:if test="floor(ShowOption div 128) mod 2 = 1">
                  <li>
                    <span class="icon-blue">Mua 3 tặng 2</span>
                  </li>
                </xsl:if>
                <xsl:if test="floor(ShowOption div 256) mod 2 = 1">
                  <li>
                    <span class="icon-blue">Mua 4 tặng 2</span>
                  </li>
                </xsl:if>
                <xsl:if test="floor(ShowOption div 512) mod 2 = 1">
                  <li>
                    <span class="icon-blue">Mua 5 tặng 2</span>
                  </li>
                </xsl:if>
                <xsl:if test="floor(ShowOption div 1024) mod 2 = 1">
                  <li>
                    <span class="icon-blue">Mua 1 tặng 2</span>
                  </li>
                </xsl:if>
                <xsl:if test="floor(ShowOption div 2048) mod 2 = 1">
                  <li>
                    <span class="icon-blue">Mua 1 tặng 3</span>
                  </li>
                </xsl:if>
                <xsl:if test="floor(ShowOption div 4096) mod 2 = 1">
                  <li>
                    <span class="icon-blue">Mua 2 tặng 3</span>
                  </li>
                </xsl:if>
                <xsl:if test="GiftDescription2!=''">
                  <li class="gift-icon">
                    <xsl:value-of disable-output-escaping="yes" select="GiftDescription2"></xsl:value-of>
                  </li>
                </xsl:if>
              </ul>
            </div>
          </xsl:if>
        </a>
        <h2 class="product-name leading-snug">
          <a>
            <xsl:attribute name="href">
              <xsl:value-of select="Url" />
            </xsl:attribute>
            <xsl:value-of select="Title"></xsl:value-of>
          </a>
          <xsl:value-of select="EditLink" disable-output-escaping="yes"></xsl:value-of>
        </h2>
        <div class="product-price flex items-end">
          <strong class="price text-main leading-tight">
            <xsl:text disable-output-escaping="yes">Giá dự kiến: </xsl:text>
            <br />
            <xsl:value-of disable-output-escaping="yes" select="Price"></xsl:value-of>
          </strong>
          <xsl:if test="OldPrice != ''">
            <del class="old-price">
              <xsl:value-of disable-output-escaping="yes" select="OldPrice"></xsl:value-of>
            </del>
          </xsl:if>
        </div>
        <xsl:apply-templates select="Promotion"></xsl:apply-templates>
        <xsl:if test="StockQuantity > 0">
          <a class="btn-buy background-main" style="cursor: pointer;"
            onclick="AjaxCart.addproducttocart_catalog(this);return false;">
            <xsl:attribute name="data-productid">
              <xsl:value-of select="ProductId" />
            </xsl:attribute>
            <img src="/Data/Sites/1/skins/default/img/cart-white.png" alt="Buy" />
          </a>
        </xsl:if>
        <xsl:if test="StockQuantity &lt;= 0">
          <a class="btn-buy background-dark-grey" style="cursor: pointer">
            Liên hệ Sakuko
          </a>
        </xsl:if>
      </div>
    </div>
  </xsl:template>

  <xsl:template match="Promotion">
    <xsl:if test="floor(Option div 1) mod 2 = 1">
      <xsl:if test="DiscountPrice!=''">
        <div class="product-vnpay-price">
          <strong>Giá VnPay: </strong>
          <strong class="text-main">
            <xsl:value-of select="DiscountPrice"></xsl:value-of>
          </strong>
        </div>
      </xsl:if>
    </xsl:if>
  </xsl:template>

</xsl:stylesheet>