<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes" />

  <xsl:template match="/ShoppingCart">
    <div class="card-item checkout-cart-summary">
      <div class="card-heading">
        <div class="card-title">Thông tin đơn hàng</div>
      </div>
      <div class="card-body">
        <xsl:apply-templates select="CartItem"></xsl:apply-templates>
        <div class="cart-summary-price">
          <ul>
            <li>
              <div class="flex justify-between">

                <strong>
                  <xsl:text>Tổng tiền hàng chưa giảm </xsl:text>
                  <br/>
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
            <xsl:if test="VoucherTotal  != ''">
              <li>
                <div class="flex justify-between">
                  <strong>Voucher</strong>
                  <span class="">
                    <xsl:value-of select="VoucherTotal"></xsl:value-of>
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
            <br/>
          </xsl:if>
          <div class="flex justify-between cart-summary-total-price">
            <strong>Tổng cộng:</strong>
            <strong class="text-main fz-20 cart-total res-cart-total">
              <xsl:value-of select="Total"></xsl:value-of>
            </strong>
          </div>
          <xsl:if test="/ShoppingCart/GiftDescription!=''">
            <div class="product-detail-promo leading-snug">
              <strong class="block text-blue mb-1">Quà tặng</strong>
              <div class="fz-14 text-dark-grey mb-1">
                <xsl:value-of select="/ShoppingCart/GiftDescription" disable-output-escaping="yes"></xsl:value-of>
              </div>
            </div>
          </xsl:if>
         <!--  <div class="flex justify-between cart-summary-payment-discount-price">
            <span class="res-discount-payment"></span>
          </div> -->
        </div>
      </div>
    </div>
    <xsl:if test="VoucherEnable = 'True' ">
      <div class="card-item cart-coupon">
        <div class="card-heading">
          <div class="card-title">Mã voucher</div>
        </div>
        <div class="card-body">
          <div class="cart-coupon-input">
            <!-- <label>Nhập mã voucher</label>  --> 
            <div class="form-inline">
              <input type="text" id="voucherCode" autocomplete="off" max-length="20"
                placeholder="Nhập mã voucher"> 
              </input>
              <a onclick="AjaxCart.applyvoucher();return false;" href="#">Áp dụng</a> 
            </div>
            <div class="coupon-apply-error voucher-apply-error" />
          </div>
          <xsl:if test="count(Vouchers) > 0">
            <div class="voucher-codes-applied">
              <xsl:apply-templates select="Vouchers"/>
            </div>
          </xsl:if>
          <div class="cart-coupon-note leading-snug mt-2">
            <xsl:value-of select="VoucherShoppingCartDescription"  disable-output-escaping="yes"/>
          </div>
        </div>
      </div>
    </xsl:if>
    <xsl:if test="PointIsAvailable = 'True' ">
      <div class="card-item checkout-point-wrap">
        <div class="card-heading">
          <div class="card-title">Điểm tích lũy</div>
        </div>
        <div class="card-body leading-snug">
          <div class="point-summary">
            <p>
              <xsl:text>Điểm đã có </xsl:text>
              <xsl:value-of select="RewardPointsBalance"/>
              <xsl:text> điểm</xsl:text> 
            </p>
            <p>
              <xsl:text>Điểm khả dụng </xsl:text>
              <xsl:value-of select="RewardPointsAvailable"/>
              <xsl:text> điểm</xsl:text>
            </p>
            <p>
              <xsl:value-of select="SpendingPointsInfoText"/>
            </p>
          </div>
          <div class="point-used-total text-main mt-3">
            <p>
              <xsl:text>Số điểm sử dụng: </xsl:text>
              <span id="usedPoints">
                <xsl:value-of select="SpendingPoints"/>
              </span>
            </p>
          </div>
          <div class="point-slider-wrap mt-3">
            <div class="point-slider"></div>
            <div class="point-slider-text flex justify-between mt-1">
              <span class="point-min">0</span>
              <span class="point-max">
                <xsl:value-of select="RewardPointsAvailable"/>
              </span>
            </div>
          </div>
          <div class="point-slider-input flex mt-2">
            <label>Nhập số điểm bạn cần sử dụng</label>
            <input name="RedeemedRewardPoints" type="number" min="0" >
              <xsl:attribute name="max">
                <xsl:value-of select="RewardPointsAvailable"/>
              </xsl:attribute>
            </input>
          </div>
        </div>
      </div>
    </xsl:if>
  </xsl:template>

  <xsl:template match="Vouchers">
    <div class="voucher-code">
      <span class="voucher-text">
        <xsl:value-of select="VoucherCode" />
      </span>
      <a href="#" class="voucher-remove"  onclick="AjaxCart.removevoucher(this); return false;"> 
        <xsl:attribute name="data-code">
          <xsl:value-of select="VoucherCode"/>
        </xsl:attribute>
        <i class="fa fa-remove"></i>
        X
      </a>
    </div>
  </xsl:template>


  <xsl:template match="CartItem">
    <div class="cart-summary-item">
      <a class="product-link">
        <xsl:attribute name="href">
          <xsl:value-of select="Url"></xsl:value-of>
        </xsl:attribute>
        <xsl:attribute name="target">
          <xsl:value-of select="target"></xsl:value-of>
        </xsl:attribute>
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
        <div class="text">
          <xsl:value-of select="Title"></xsl:value-of>
        </div>
      </a>
      <div class="product-price">
        <div class="price">
          <xsl:value-of select="OriginalPrice"></xsl:value-of>
          <xsl:if test="DiscountAmount !=''">
            <br/>
            <span style="color: red;font-size : 0.875rem">
              <xsl:text>-</xsl:text> 
              <xsl:value-of select="DiscountAmount"/>
   <!--            <xsl:text> | </xsl:text> 
                          <xsl:text>-</xsl:text>
                          <xsl:value-of select="DiscountPercentage"></xsl:value-of>
                          <xsl:text>%</xsl:text> -->
        		</span>
        	</xsl:if> 
        </div>
        <div class="ammount">
          x <xsl:value-of select="Quantity"></xsl:value-of>
        </div>
        <div class="total-price">
          <strong> 
            <xsl:value-of select="ItemSubTotal"></xsl:value-of>
          </strong>
        </div>
      </div>
      <xsl:if test="GiftDescription!=''">
        <div class="product-detail-promo leading-snug">
          <strong class="block text-blue mb-1">Quà tặng</strong>
          <div class="fz-14 text-dark-grey mb-1">
            <xsl:value-of select="GiftDescription" disable-output-escaping="yes"></xsl:value-of>
          </div>
        </div>
      </xsl:if>
    </div>

  </xsl:template>

</xsl:stylesheet>