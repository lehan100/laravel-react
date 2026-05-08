<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes" />

  <xsl:template match="/">
    <div class="cart">
      <div class="cart-toggle position-relative inline-block">
        <img src="/Data/Sites/1/skins/default/img/cart.png" alt="Cart icon" />
        <div class="cart-amount flex flex-center rounded position-absolute background-main text-white">
          <xsl:value-of select="/ShoppingCart/TotalProducts"></xsl:value-of>
        </div>
      </div>
      <div class="cart-dropdown">
        <div class="cart-container">
          <xsl:choose>
            <xsl:when test="count(/ShoppingCart/CartItem) > 0">
              <div class="cart-heading">
                <div class="cart-total">
                  <span>Tổng cộng: </span>
                  <strong class="text-main">
                    <xsl:value-of select="/ShoppingCart/Total" />
                  </strong>
                </div>
                <div class="cart-close">
                  <em class="ri-close-line"></em>
                </div>
              </div>
              <div class="cart-body">
                <ul>
                  <xsl:apply-templates select="/ShoppingCart/CartItem" />
                </ul>
              </div>
              <div class="cart-button">
                <a class="flex flex-center checkout-url">
                  <xsl:attribute name="href">
                    <xsl:value-of select="/ShoppingCart/CartPageUrl" />
                  </xsl:attribute>
                  <xsl:text>Tiến hành thanh toán</xsl:text>
                  <em class="ri-arrow-right-line"></em>
                </a>
              </div>
            </xsl:when>
            <xsl:otherwise>
              <div class="cart-empty">
                <p>Không có sản phẩm trong giỏ hàng</p>
              </div>
              <div class="cart-button">
                <a class="flex flex-center cart-empty-btn">
                  <xsl:text>Tiếp tục mua hàng</xsl:text>
                  <em class="ri-arrow-right-line"></em>
                </a>
              </div>
            </xsl:otherwise>
          </xsl:choose>
        </div>
      </div>
    </div>
  </xsl:template>

  <xsl:template match="CartItem">
    <li>
      <div class="cart-product flex">
        <a class="img">
          <xsl:attribute name="href">
            <xsl:value-of select="Url" />
          </xsl:attribute>
          <img class="lazyload">
            <xsl:attribute name="src">
              <xsl:value-of select="ThumbnailUrl" />
            </xsl:attribute>
            <xsl:attribute name="alt">
              <xsl:value-of select="Title" />
            </xsl:attribute>
          </img>
        </a>
        <div class="caption leading-tight">
          <a class="name">
            <xsl:attribute name="href">
              <xsl:value-of select="Url" />
            </xsl:attribute>
            <xsl:value-of select="Title" />
          </a>
          <div class="flex justify-between fz-14">
            <div class="quantity">
              <span>
                <xsl:text disable-output-escaping="yes">Số lượng: </xsl:text>
                <xsl:value-of select="Quantity" />
                <!-- <xsl:text> x </xsl:text>
                <xsl:value-of select="Price"/> -->
              </span>
            </div>
            <div class="price">
              <strong>
                <xsl:value-of select="ItemTotal" />
              </strong>
            </div>
          </div>
        </div>
      </div>
    </li>
  </xsl:template>

  <xsl:template match="CartItem" mode="LastAddedItem">
    <xsl:if test="LastAddedItem='true'">
      <div class="productAddedToCartWindowImage">
        <a>
          <xsl:attribute name="href">
            <xsl:value-of select="Url" />
          </xsl:attribute>
          <xsl:attribute name="target">
            <xsl:value-of select="Target" />
          </xsl:attribute>
          <xsl:attribute name="title">
            <xsl:value-of select="Title" />
          </xsl:attribute>
          <img>
          <xsl:attribute name="src">
            <xsl:value-of select="ImageUrl" />
          </xsl:attribute>
          <xsl:attribute name="alt">
            <xsl:value-of select="Title" />
          </xsl:attribute>
          </img>
        </a>
        <h3>
          <a>
            <xsl:attribute name="href">
              <xsl:value-of select="Url" />
            </xsl:attribute>
            <xsl:attribute name="target">
              <xsl:value-of select="Target" />
            </xsl:attribute>
            <xsl:value-of select="Title" />
          </a>
        </h3>
      </div>
      <div class="productAddedToCartWindowDescription">
        <xsl:apply-templates select="Attributes" />
        <div class="briefContent">
          <xsl:value-of select="BriefContent" disable-output-escaping="yes" />
          <div>
            <strong class="price">
              <xsl:value-of select="Price" />
            </strong>
          </div>
        </div>
      </div>
    </xsl:if>
  </xsl:template>

</xsl:stylesheet>