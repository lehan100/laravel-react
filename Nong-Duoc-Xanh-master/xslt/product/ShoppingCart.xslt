<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes" />
  <xsl:template match="/ShoppingCart">
    <div class="container">
      <xsl:choose>
        <xsl:when test="count(CartItem)=0">
          <div class="text-center">Không có sản phẩm nào trong giỏ hàng của bạn.</div>
          <div class="cart-group-button justify-center mt-2">
            <a class="btn btn-white text-light-grey btn-back">
              <xsl:attribute name="href">
                <xsl:value-of select="ContinueShoppingUrl"></xsl:value-of>
              </xsl:attribute>
              <span class="ml-1">Tiếp tục mua hàng</span>
            </a>
          </div>
        </xsl:when>
        <xsl:otherwise>
          <div class="row">
            <div class="col-lg-8">
              <div class="cart-inner card-item">
                <div class="card-heading">
                  <div class="card-title">
                    <a href="#">
                      <span class="ri-arrow-left-s-line"></span>
                    </a>
                    <xsl:text>Giỏ hàng của bạn (</xsl:text>
                    <xsl:value-of select="TotalProducts"></xsl:value-of>
                    <xsl:text> sản phẩm)</xsl:text>
                  </div>
                </div>
                <div class="card-body">
                  <div class="cart-product-list">
                    <div class="cart-product-list-body">
                      <xsl:apply-templates select="CartItem"></xsl:apply-templates>
                    </div>
                    <xsl:if test="/ShoppingCart/GiftDescription!=''">
                      <div class="product-detail-promo leading-snug">
                        <strong class="block text-blue mb-1">Quà tặng</strong>
                        <div class="fz-14 text-dark-grey mb-1">
                          <xsl:value-of select="/ShoppingCart/GiftDescription" disable-output-escaping="yes">
                          </xsl:value-of>
                        </div>
                      </div>
                    </xsl:if>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="cart-aside flex flex-column">
                <div class="card-item cart-order-info">
                  <div class="card-heading">
                    <div class="card-title">Thông tin đơn hàng</div>
                  </div>
                  <div class="card-body">
                    <ul>
                      <li>
                        <div class="flex justify-between">

                          <strong>
                            <xsl:text>Tổng tiền hàng chưa giảm </xsl:text>
                            <br />
                            <p>
                              <xsl:text>(</xsl:text>
                              <xsl:value-of select="TotalProducts"></xsl:value-of>
                              <xsl:text> sản phẩm)</xsl:text>
                            </p>
                          </strong>

                          <span>
                            <xsl:value-of select="SubTotal"></xsl:value-of>
                          </span>
                        </div>
                      </li>
                      <li>
                        <div class="flex justify-between">
                          <strong>Giảm giá</strong>
                          <span class="res-discount-total">
                            <xsl:value-of select="DiscountTotal"></xsl:value-of>
                          </span>
                        </div>
                      </li>
                      <xsl:if test="CouponTotal  != ''">
                        <li>
                          <div class="flex justify-between">
                            <strong>Giảm giá Coupon</strong>
                            <span class="">
                              <xsl:value-of select="CouponTotal"></xsl:value-of>
                            </span>
                          </div>
                        </li>
                      </xsl:if>
                      <li>
                        <div class="flex justify-between">
                          <strong>Phí vận chuyển</strong>
                          <span class="res-shipping-total">
                            <xsl:value-of select="ShippingTotal"></xsl:value-of>
                          </span>
                        </div>
                      </li>
                    </ul>
                    <hr />
                    <xsl:if test="PointIsAvailable = 'True' ">
                      <div class="flex justify-between ">
                        <strong>Quy đổi điểm:</strong>
                        <strong class="text-main fz-20 cart-total res-rewardPoint-total">
                          <xsl:value-of select="RewardPointTotal"></xsl:value-of>
                        </strong>
                      </div>
                      <br />
                    </xsl:if>
                    <div class="flex justify-between total-price">
                      <strong>Tổng cộng:</strong>
                      <strong class="text-main fz-20">
                        <xsl:value-of select="Total"></xsl:value-of>
                      </strong>
                    </div>
                  </div>
                </div>
                <div class="card-item cart-coupon">
                  <div class="card-heading">
                    <div class="card-title">Mã coupon</div>
                  </div>
                  <div class="card-body">
                    <div class="cart-coupon-input">
                      <xsl:choose>
                        <xsl:when test="CouponCode!=''">
                          <!-- <label>Mã coupon </label> -->
                          <span class="code">
                            <xsl:value-of select="CouponCode" />
                          </span>
                          <span class="title">
                            <xsl:value-of select="CouponTitle" />
                          </span>
                          <button onclick="AjaxCart.removecoupon();return false;">Xóa</button>
                        </xsl:when>
                        <xsl:otherwise>
                          <!-- <label>Nhập mã coupon</label>  -->
                          <div class="form-inline">
                            <input type="text" id="couponCode" autocomplete="off" max-length="20"
                              placeholder="Nhập mã coupon">
                            </input>
                            <button onclick="AjaxCart.applycoupon();return false;">Áp dụng</button>
                          </div>
                          <div class="coupon-apply-error" />
                        </xsl:otherwise>
                      </xsl:choose>
                    </div>
                    <!--  <div class="cart-coupon-note leading-snug mt-2">
                  <p class="text-light-grey fz-14">Sau khi áp dụng, Mã giảm giá có thể không dùng được trong vòng 15
                    phút.</p>
                  <p>Trong quá trình thanh toán, sẽ tạm khóa mã giảm giá của quý khách để đảm bảo phiên giao dịch được
                    ổn định. Mã giảm giá sẽ được mở lại ngay khi phiên giao dịch kết thúc</p>
                </div> -->
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-8">
              <div class="button-group cart-group-button">
                <xsl:if test="ContinueShoppingUrl!=''">
                  <a class="btn btn-white text-light-grey btn-back">
                    <xsl:attribute name="href">
                      <xsl:value-of select="ContinueShoppingUrl"></xsl:value-of>
                    </xsl:attribute>
                    <em class="ri-arrow-left-line"></em>
                    <span class="ml-1">Tiếp tục mua hàng</span>
                  </a>
                </xsl:if>
                <a class="btn btn-next btn-gradient">
                  <xsl:attribute name="href">
                    <!-- <xsl:value-of select="CheckoutUrl"></xsl:value-of> -->
                    <xsl:text disable-output-escaping="yes">/dang-nhap</xsl:text>
                  </xsl:attribute>
                  <span class="mr-1">Tiến hành thanh toán</span>
                  <em class="ri-arrow-right-line"></em>
                </a>
              </div>
            </div>
          </div>
        </xsl:otherwise>
      </xsl:choose>
    </div>


  </xsl:template>

  <xsl:template match="CartItem">
    <div class="cart-product-item flex">
      <div class="cart-product-item-img flex items-center">
        <!--<div class="cart-product-item-check">
          <input type="checkbox" name="" />
        </div>-->
        <a>
          <xsl:attribute name="href">
            <xsl:value-of select="Url"></xsl:value-of>
          </xsl:attribute>
          <xsl:attribute name="target">
            <xsl:value-of select="target"></xsl:value-of>
          </xsl:attribute>
          <img class="lazyload">
          <xsl:attribute name="src">
            <xsl:value-of select="ThumbnailUrl"></xsl:value-of>
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
                <p class="barcode mt-1">
                  <xsl:value-of select="BarCode"></xsl:value-of>
                </p>
                <xsl:if test="GiftDescription!=''">
                  <div class="product-detail-promo leading-snug">
                    <strong class="block text-blue mb-1">Quà tặng</strong>
                    <div class="fz-14 text-dark-grey mb-1">
                      <xsl:value-of select="GiftDescription" disable-output-escaping="yes"></xsl:value-of>
                    </div>
                  </div>
                </xsl:if>
              </div>
              <div class="cart-product-item-price leading-snug text-right">
                <p class="fz-18">
                  <xsl:value-of select="OriginalPrice"></xsl:value-of>
                </p>
                <p class="flex items-center justify-end">
                  <!--<xsl:if test="OldPrice!=''">
                    <del class="text-light-grey">
                      <xsl:value-of select="OldPrice"></xsl:value-of>
                    </del>
                    <span class="ml-1 mr-1 fz-14 text-light-grey">| </span>
                  </xsl:if>-->
                  <span class="text-main">
                    <xsl:if test="DiscountAmount !=''">
                      <span class="discount">
                        <xsl:text>-</xsl:text>
                        <xsl:value-of select="DiscountAmount"></xsl:value-of>
                      </span>
                      <!-- <span class="ml-1 mr-1 fz-14 text-light-grey">| </span> -->
                    </xsl:if>
                    <!--<xsl:if test="DiscountPercentage !=''">
                      <span class="discount">
                        <xsl:text>-</xsl:text>
                        <xsl:value-of select="DiscountPercentage"></xsl:value-of>
                        <xsl:text>%</xsl:text>
                      </span>
                    </xsl:if>-->
                  </span>
                </p>
                <p class="mt-1 text-light-grey text-right">
                  <a class="fz-20 mr-2" onclick="AjaxCart.addproducttowishlist(this);return false;" href="#">
                    <xsl:if test="AddedWishList = 'True'">
                      <xsl:attribute name="class">
                        <xsl:text>fz-20 mr-2 cart-add-wishlist active text-main</xsl:text>
                      </xsl:attribute>
                      <xsl:attribute name="onclick">
                        <xsl:text>AjaxCart.removefromwishlist(this);return false;</xsl:text>
                      </xsl:attribute>
                      <xsl:attribute name="data-itemguid">
                        <xsl:value-of select="WishItemGuid" />
                      </xsl:attribute>
                    </xsl:if>
                    <xsl:attribute name="data-productid">
                      <xsl:value-of select="ProductId"></xsl:value-of>
                    </xsl:attribute>
                    <span class="ri-heart-3-line"></span>
                  </a>
                  <a class="fz-20" href="#" onclick="AjaxCart.removefromcart(this);return false;">
                    <xsl:attribute name="data-itemguid">
                      <xsl:value-of select="ItemGuid"></xsl:value-of>
                    </xsl:attribute>
                    <span class="ri-delete-bin-line"></span>
                  </a>
                </p>
              </div>
            </div>
          </div>
          <!-- <div class="cart-product-item-content-bottom">
            
          </div> -->
        </div>
        <div class="cart-product-item-amount">
          <div class="spin-input-wrap">
            <div class="spin-btn" data-spin="dec">
              <em class="ri-subtract-fill"></em>
            </div>
            <input type="text" maxlength="3" onchange="AjaxCart.updatecart();return false;">
            <xsl:attribute name="name">
              <xsl:text>itemquantity</xsl:text>
              <xsl:value-of select="ItemGuid"></xsl:value-of>
            </xsl:attribute>
            <xsl:attribute name="value">
              <xsl:value-of select="Quantity"></xsl:value-of>
            </xsl:attribute>
            </input>
            <div class="spin-btn" data-spin="inc">
              <em class="ri-add-fill"></em>
            </div>
          </div>
        </div>
      </div>
    </div>




    <!--<tr>
      <td>
        <div class="product-item">
          <div class="image">
            <a>
              <xsl:attribute name="href">
                <xsl:value-of select="Url"></xsl:value-of>
              </xsl:attribute>
              <xsl:attribute name="target">
                <xsl:value-of select="target"></xsl:value-of>
              </xsl:attribute>
              <img>
                <xsl:attribute name="src">
                  <xsl:value-of select="ThumbnailUrl"></xsl:value-of>
                </xsl:attribute>
                <xsl:attribute name="alt">
                  <xsl:value-of select="Title"></xsl:value-of>
                </xsl:attribute>
              </img>
            </a>
          </div>
          <div class="caption">
            <div class="title">
              <a>
                <xsl:attribute name="href">
                  <xsl:value-of select="Url"></xsl:value-of>
                </xsl:attribute>
                <xsl:value-of select="Title" disable-output-escaping="yes"></xsl:value-of>
              </a>
            </div>
            <a class="remove-item" onclick="AjaxCart.removefromcart(this);return false;">
              <xsl:attribute name="data-itemguid">
                <xsl:value-of select="ItemGuid"></xsl:value-of>
              </xsl:attribute>
              <em class="lnr lnr-cross-circle"></em>
              <span>Bỏ sản phẩm</span>
            </a>
          </div>
          <xsl:apply-templates select="Attributes"></xsl:apply-templates>
          <xsl:if test="GiftProduct !=''">
            <div class="miniGift">
              <xsl:value-of select="GiftProduct" disable-output-escaping="yes"></xsl:value-of>
            </div>
          </xsl:if>
        </div>
      </td>
      <td>
        <div class="price">
          <div class="current">
            <xsl:value-of select="Price"></xsl:value-of>
          </div>
          <div class="old-wrap">
            <xsl:if test="OldPrice!=''">
              <span class="old">
                <xsl:value-of select="OldPrice"></xsl:value-of>
              </span>
            </xsl:if>
            <xsl:if test="DiscountPercentage !=''">
              <span class="discount">
                <xsl:text>- </xsl:text>
                <xsl:value-of select="DiscountPercentage"></xsl:value-of>
                <xsl:text>%</xsl:text>
              </span>
            </xsl:if>
          </div>
        </div>
      </td>
      <td>
        <div class="quantity-wrapper">
          <div class="item-quantity">
            <div class="input-group">
              <div class="input-group-btn">
                <div class="qty-minus btn-number">
                  <em class="mdi mdi-minus"></em>
                </div>
              </div>
              <input type="text" maxlength="10" class="product-details-quantity form-control input-number" onchange="AjaxCart.updatecart();return false;">
                <xsl:attribute name="name">
                  <xsl:text>itemquantity</xsl:text>
                  <xsl:value-of select="ItemGuid"></xsl:value-of>
                </xsl:attribute>
                <xsl:attribute name="value">
                  <xsl:value-of select="Quantity"></xsl:value-of>
                </xsl:attribute>
              </input>
              <div class="input-group-btn">
                <div class="qty-plus btn-number">
                  <em class="mdi mdi-plus"></em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </td>
      <td>
        <div class="total">
          <xsl:value-of select="ItemTotal"></xsl:value-of>
        </div>
      </td>
    </tr>-->
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