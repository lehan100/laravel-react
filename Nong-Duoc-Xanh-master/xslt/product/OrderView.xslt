<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes" />

  <xsl:template match="/OrderDetail">
    <section class="user-page">
      <div class="user-order">
        <div class="order-detail">
          <!-- <div class="tracking-progressbar">
            <div class="progress-item done">
              <xsl:if test="OrderStatusValue = 0">
                <xsl:attribute name="class">
                  <xsl:text>progress-item done</xsl:text>
                </xsl:attribute>
              </xsl:if>
              <div class="text">
                <span>Đang xác nhận</span>
              </div> 
              <div class="circle">
                <em class="ri-article-line"></em>
              </div>
              <div class="bar">
                <div class="fill-color"></div>
              </div>
            </div>
            <div class="progress-item ">
              <xsl:if test="OrderStatusValue = 10">
                <xsl:attribute name="class">
                  <xsl:text>progress-item active</xsl:text>
                </xsl:attribute>
              </xsl:if>
              <xsl:if test="OrderStatusValue > 10">
                <xsl:attribute name="class">
                  <xsl:text>progress-item done</xsl:text>
                </xsl:attribute>
              </xsl:if>
              <div class="text">
                <span>
                  Đã xác nhận 
                </span>
              </div>
              <div class="circle">
                <em class="ri-check-line"></em> 
              </div>
              <div class="bar">
                <div class="fill-color"></div>
              </div>
            </div>
             <div class="progress-item ">
              <xsl:if test="OrderStatusValue = 15">
                <xsl:attribute name="class">
                  <xsl:text>progress-item active</xsl:text>
                </xsl:attribute>
              </xsl:if>
              <xsl:if test="OrderStatusValue > 15">
                <xsl:attribute name="class">
                  <xsl:text>progress-item done</xsl:text>
                </xsl:attribute>
              </xsl:if> 
              <div class="text">
                <span>
                  Đã đóng gói hàng hóa
                </span>
              </div>
              <div class="circle">
                <em class="ri-archive-line"></em>
              </div> 
              <div class="bar">
                <div class="fill-color"></div>
              </div>
            </div>
            <div class="progress-item">
              <xsl:if test="OrderStatusValue = 20">
                <xsl:attribute name="class">
                  <xsl:text>progress-item active</xsl:text>
                </xsl:attribute>
              </xsl:if>
              <xsl:if test="OrderStatusValue > 20">
                <xsl:attribute name="class">
                  <xsl:text>progress-item done</xsl:text>
                </xsl:attribute>
              </xsl:if>
              <div class="text">
                <span>
                  Đã giao cho <br/>đơn vị vận chuyển
                </span>
              </div>
              <div class="circle">
                <em class="ri-truck-line"></em>
              </div>
              <div class="bar">
                <div class="fill-color"></div>
              </div>
            </div>
            <div class="progress-item">
              <xsl:if test="OrderStatusValue = 25">
                <xsl:attribute name="class">
                  <xsl:text>progress-item active</xsl:text>
                </xsl:attribute> 
              </xsl:if>
              <xsl:if test="OrderStatusValue > 25">
                <xsl:attribute name="class">
                  <xsl:text>progress-item done</xsl:text>
                </xsl:attribute>
              </xsl:if>
              <div class="text">
                <span>
                  Đã giao hàng thành công
                </span>
              </div>
              <div class="circle">
                <em class="ri-shield-user-line"></em>
              </div> 
              <div class="bar">
                <div class="fill-color"></div>
              </div>
            </div>
            <div class="progress-item">
              <xsl:if test="OrderStatusValue = 25">
                <xsl:attribute name="class">
                  <xsl:text>progress-item active</xsl:text>
                </xsl:attribute>
              </xsl:if>
              <xsl:if test="OrderStatusValue = 99">
                <xsl:attribute name="class">
                  <xsl:text>progress-item done</xsl:text>
                </xsl:attribute>
              </xsl:if>
              <div class="text">
                <span>Đơn hàng đã nhận</span>
              </div>
              <div class="circle">
                <em class="ri-shield-check-line"></em>
              </div>
              <div class="bar">
                <div class="fill-color"></div>
              </div>
            </div>
          </div> -->
          <div class="order-info">
            <div class="order-name">
              <xsl:text disable-output-escaping="yes">Mã đơn hàng:</xsl:text>
              <strong>
                <xsl:text disable-output-escaping="yes"> #</xsl:text>
                <xsl:value-of select="OrderCode"></xsl:value-of>
              </strong>
            </div>
            <div class="des order-date">
              <xsl:text disable-output-escaping="yes">Ngày mua: </xsl:text>
              <xsl:value-of select="CreatedDate"></xsl:value-of>
            </div>
            <div class="des order-name">
              <xsl:text disable-output-escaping="yes">Tình trạng: </xsl:text>
              <strong>
                <xsl:value-of select="OrderStatus"></xsl:value-of>
              </strong>
            </div> 
            <div class="des order-name">
              <xsl:text disable-output-escaping="yes">Tình trạng thanh toán: </xsl:text>
              <strong>
                <xsl:value-of select="PaymentStatus"></xsl:value-of> 
              </strong>
            </div>
            <div class="des order-name">
              <xsl:text disable-output-escaping="yes">Phương thức vận chuyển: </xsl:text>
              <strong>
                <xsl:value-of select="ShippingMethod"></xsl:value-of> 
              </strong> 
            </div>
          </div>
          <div class="order-list">
            <div class="item">
              <div class="order-item">
                <!-- <div class="order-title">
                  <div class="alert alert-success">
                    <xsl:if test="PaymentStatus='Unpaid'">
                      <xsl:attribute name="class">
                        <xsl:text>alert alert-warning</xsl:text>
                      </xsl:attribute>
                    </xsl:if>
                    <xsl:value-of select="PaymentStatus"></xsl:value-of>
                  </div>
                </div> -->
                <div class="row order-information-wrapper">
                  <div class="col-12 col-md-6 mt-2 mb-2">
                    <div class="order-information">
                      <div class="title">Thông tin đặt mua</div>
                      <ul>
                        <li class="name">
                          <strong>
                            <xsl:value-of select="BillingFirstName"></xsl:value-of>
                          </strong>
                        </li>
                        <li>
                          Địa chỉ: <xsl:value-of select="BillingAddress"></xsl:value-of>
                          <xsl:if test="BillingDistrict!=''">
                            <xsl:text>, </xsl:text>
                            <xsl:value-of select="BillingDistrict"></xsl:value-of>
                          </xsl:if>
                          <xsl:if test="BillingProvince!=''">
                            <xsl:text>, </xsl:text>
                            <xsl:value-of select="BillingProvince"></xsl:value-of>
                          </xsl:if>
                        </li>
                        <li>
                          Email: <xsl:value-of select="BillingEmail"></xsl:value-of>
                        </li>
                        <li>
                          Điện thoại: <xsl:value-of select="BillingPhone"></xsl:value-of>
                        </li>
                        <!-- <li>
                          Shipping method: <xsl:value-of select="ShippingMethod"></xsl:value-of>
                          <xsl:if test="TrackingFrameUrl!=''">
                            <a target="_blank" style="color:#2cbde5;font-weight:bold">
                              <xsl:attribute name="href">
                                <xsl:value-of select="TrackingFrameUrl"></xsl:value-of>
                              </xsl:attribute>
                              Schedule of orders
                            </a>
                          </xsl:if>
                          <xsl:if test="ShippingFee!=''">
                            <p>
                              Shipping fee: <xsl:value-of select="ShippingFee"></xsl:value-of>
                            </p>
                          </xsl:if>
                        </li> -->
                        <!-- <li>
                          Payment Method: <xsl:value-of select="PaymentMethod"></xsl:value-of>
                          <p class="payment-status">
                            Status: 
                            <xsl:value-of select="PaymentStatus"></xsl:value-of>
                          </p>
                          <xsl:choose>
                            <xsl:when test="AllowRepaid='true'">
                              <a class="userpanel-btn repaid-order-btn" href="#">Thanh toán lại</a>
                              <div class="popup-tragop">
                                <div class="bank-list">
                                  <div class="content clearfix">
                                    <h3 class="title">Select the payment method again</h3>
                                    <div class="cart-form clearfix">
                                      <xsl:apply-templates select="Payment"></xsl:apply-templates>
                                    </div>
                                  </div>
                                  <div class="btn-wrap clearfix">
                                    <a class="userpanel-btn btn-success repaid-button"
                                      onclick="AjaxCheckout.repaidorder(this);return false;" href="#">
                                      <xsl:attribute name="data-orderid">
                                        <xsl:value-of select="OrderId"></xsl:value-of>
                                      </xsl:attribute>
                                      Payment
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </xsl:when>
                          </xsl:choose>
                        </li> -->
                      </ul>
                    </div>
                  </div>
                  <div class="col-12 col-md-6 mt-2 mb-2">
                    <div class="order-information">
                      <div class="title">Thông tin giao hàng</div>
                      <ul>
                        <li class="name">
                          <strong>
                            <xsl:choose>
                              <xsl:when test="ShippingFirstName != ''">
                                <xsl:value-of select="ShippingFirstName"></xsl:value-of>
                              </xsl:when>
                              <xsl:otherwise>
                                <xsl:value-of select="BillingFirstName"></xsl:value-of>
                              </xsl:otherwise>
                            </xsl:choose>
                          </strong>
                        </li>
                        <li>
                          Địa chỉ:
                          <xsl:choose>
                            <xsl:when test="ShippingAddress != ''">
                              <xsl:value-of select="ShippingAddress"></xsl:value-of>
                              <xsl:if test="ShippingDistrict!=''">
                                <xsl:text>, </xsl:text>
                                <xsl:value-of select="ShippingDistrict"></xsl:value-of>
                              </xsl:if>
                              <xsl:if test="ShippingProvince!=''">
                                <xsl:text>, </xsl:text>
                                <xsl:value-of select="ShippingProvince"></xsl:value-of>
                              </xsl:if>
                            </xsl:when>
                            <xsl:otherwise>
                              <xsl:value-of select="BillingAddress"></xsl:value-of>
                              <xsl:if test="BillingDistrict!=''">
                                <xsl:text>, </xsl:text>
                                <xsl:value-of select="BillingDistrict"></xsl:value-of>
                              </xsl:if>
                              <xsl:if test="BillingProvince!=''">
                                <xsl:text>, </xsl:text>
                                <xsl:value-of select="BillingProvince"></xsl:value-of>
                              </xsl:if>
                            </xsl:otherwise>
                          </xsl:choose>
                        </li>
                        <li>
                          Email:
                          <xsl:choose>
                            <xsl:when test="ShippingEmail != ''">
                              <xsl:value-of select="ShippingEmail"></xsl:value-of>
                            </xsl:when>
                            <xsl:otherwise>
                              <xsl:value-of select="BillingEmail"></xsl:value-of>
                            </xsl:otherwise>
                          </xsl:choose>
                        </li>
                        <li>
                          Điện thoại:
                          <xsl:choose>
                            <xsl:when test="ShippingPhone != ''">
                              <xsl:value-of select="ShippingPhone"></xsl:value-of>
                            </xsl:when>
                            <xsl:otherwise>
                              <xsl:value-of select="BillingPhone"></xsl:value-of>
                            </xsl:otherwise>
                          </xsl:choose>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <xsl:if test="InvoiceCompanyTaxCode !=''">
                    <div class="col-12">
                      <h3>Billing information</h3>
                      <div class="address-col">
                        <p>
                          <span>Tax code: </span>
                          <xsl:value-of select="InvoiceCompanyTaxCode"></xsl:value-of>
                        </p>
                        <p>
                          <span>Company name: </span>
                          <xsl:value-of select="InvoiceCompanyName"></xsl:value-of>
                        </p>
                        <p>
                          <span>Address: </span>
                          <xsl:value-of select="InvoiceCompanyAddress"></xsl:value-of>
                        </p>
                      </div>
                    </div>
                  </xsl:if>
                </div>
                <div class="order-product">
                  <table>
                    <thead>
                      <tr>
                        <th class="text-left">Sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Tổng cộng</th>
                      </tr>
                    </thead>
                    <tbody>
                      <xsl:apply-templates select="Product"></xsl:apply-templates>
                    </tbody>
                  </table>
                </div>
                <div class="order-total">
                  <table>
                    <tr class="group">
                      <td class="label">
                        <xsl:text>Tổng tiền hàng chưa giảm:</xsl:text>
                      </td>
                      <td class="value">
                        <xsl:value-of select="OrderSubTotal"></xsl:value-of>
                      </td>
                    </tr>
                    <tr class="group">
                      <td class="label"> 
                        <xsl:text>Giảm giá:</xsl:text>
                      </td>
                      <td class="value discount-total">
                        <xsl:value-of select="OrderDiscount"></xsl:value-of>
                      </td>
                    </tr>
                    <xsl:if test="OrderCouponAmountValue > 0"> 
                    <tr class="group">
                      <td class="label">
                       Giảm giá Coupon:
                      </td>
                      <td class="value shipping-total">
                        <xsl:value-of select="OrderCouponAmount"></xsl:value-of>
                      </td>
                    </tr>
                  </xsl:if>
                    <tr class="group">
                      <td class="label">
                        Phí vận chuyển:
                      </td>
                      <td class="value shipping-total">
                        <xsl:value-of select="ShippingFee"></xsl:value-of>
                      </td>
                    </tr>
                    <xsl:if test="RedeemedRewardPointsAmountValue > 0">
                      <tr class="group">
                        <td class="label">
                          Quy đổi điểm:
                        </td> 
                        <td class="value total">
                          <xsl:value-of select="RedeemedRewardPointsAmount"></xsl:value-of>
                        </td>
                      </tr>
                    </xsl:if>
                    <xsl:if test="VoucherAmountValue > 0">
                      <tr class="group">
                        <td class="label">
                          Voucher:
                        </td>  
                        <td class="value total">
                          <xsl:value-of select="VoucherAmount"></xsl:value-of>
                        </td>
                      </tr>
                    </xsl:if>
                    <tr class="group">
                      <td class="label">
                       Tổng cộng:
                      </td>
                      <td class="value total">
                        <xsl:value-of select="OrderTotal"></xsl:value-of>
                      </td>
                    </tr>
                    <xsl:if test="Link != ''">
                      <tr class="group ">
                        <td class="label">
                          VAT invoice for this order :
                        </td>
                        <td class="value">
                          <a>
                            <xsl:attribute name="href">
                              <xsl:value-of select="Link"></xsl:value-of>
                            </xsl:attribute>
                            Link
                          </a>
                        </td>
                      </tr>
                    </xsl:if>
                  </table>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </xsl:template>

  <xsl:template match="Product">
    <tr>
      <td>
        <a class="product">
          <xsl:attribute name="href">
            <xsl:value-of select="Url"></xsl:value-of>
          </xsl:attribute>
          <div class="img">
            <img>
              <xsl:attribute name="src">
                <xsl:value-of select="ImageUrl"></xsl:value-of>
              </xsl:attribute>
              <xsl:attribute name="alt">
                <xsl:value-of select="Title"></xsl:value-of>
              </xsl:attribute>
            </img>
          </div>
          <div class="caption">
            <xsl:value-of select="Title"></xsl:value-of>
          </div>
        </a>
      </td>
      <td style="white-space: nowrap;">
        <xsl:value-of select="Price"></xsl:value-of>
      </td>
      <td>
        <xsl:value-of select="Quantity"></xsl:value-of>
      </td>
      <td>
        <xsl:value-of select="ItemTotal"></xsl:value-of>
      </td>
    </tr>
    <!-- <a class="product">
      <xsl:attribute name="href">
        <xsl:value-of select="Url"></xsl:value-of>
      </xsl:attribute>
      <div class="img">
        <img>
        <xsl:attribute name="src">
          <xsl:value-of select="ImageUrl"></xsl:value-of>
        </xsl:attribute>
        <xsl:attribute name="alt">
          <xsl:value-of select="Title"></xsl:value-of>
        </xsl:attribute>
        </img>
      </div>
      <div class="caption">
        <div class="name">
          <xsl:value-of select="Title"></xsl:value-of>
          <xsl:if test="Code!=''">
            <div class="serial">
              Serial: <xsl:value-of select="Code"></xsl:value-of>
            </div>
          </xsl:if>
        </div>
        <div class="attribute">

          <xsl:apply-templates select="Attributes"></xsl:apply-templates>
        </div>
        <div class="amount">
          Quantity: <xsl:value-of select="Quantity"></xsl:value-of>
        </div>
        <div class="price">
          Total:
          <div class="new">
            <xsl:value-of select="ItemTotal"></xsl:value-of>
          </div>
        </div>
      </div>
    </a> -->
  </xsl:template>

  <xsl:template match="Payment">
    <div class="payment-method">
      <div class="select-group checkbox">
        <input type="radio" name="PaymentMethod">
          <xsl:attribute name="id">
            <xsl:value-of select="Id"></xsl:value-of>
          </xsl:attribute>
          <xsl:attribute name="value">
            <xsl:value-of select="Id"></xsl:value-of>
          </xsl:attribute>
          <xsl:if test="position()=1">
            <xsl:attribute name="checked">
              <xsl:text>checked</xsl:text>
            </xsl:attribute>
            <xsl:attribute name="value">
              <xsl:value-of select="Id"></xsl:value-of>
            </xsl:attribute>
          </xsl:if>
        </input>
        <label>
          <xsl:attribute name="for">
            <xsl:value-of select="Id"></xsl:value-of>
          </xsl:attribute>
          <div class="method-info">
            <xsl:value-of select="Title" disable-output-escaping="yes"></xsl:value-of>
          </div>
        </label>
      </div>
    </div>
  </xsl:template>
  <xsl:template match="Attributes">
    <xsl:if test="Options/Title != ''">
      <div class="size">
        <xsl:value-of select="Title"></xsl:value-of>
        <xsl:text>: </xsl:text>
        <xsl:apply-templates select="Options"></xsl:apply-templates>
      </div>
    </xsl:if>
  </xsl:template>
  <xsl:template match="Options">
    <xsl:value-of select="Title"></xsl:value-of>
  </xsl:template>
</xsl:stylesheet>