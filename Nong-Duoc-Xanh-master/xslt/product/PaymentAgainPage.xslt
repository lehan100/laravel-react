<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes" />

  <xsl:template match="/OrderDetail">
    <section class="section checkout-section repay-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-8">
            <div class="order-info">
              <div class="order-name">
                <xsl:text>Mã đơn hàng: </xsl:text>
                <strong>
                  <xsl:text>#</xsl:text>
                  <xsl:value-of select="OrderCode"/>
                </strong>
              </div>
              <div class="des order-date">
                <xsl:text>Ngày mua: </xsl:text>
                <xsl:value-of select="OrderDate"/>
              </div>
              <div class="des order-name">
                <xsl:text>Tình trạng: </xsl:text>
                <strong>
                  <xsl:value-of select="OrderStatus"/>
                </strong>
              </div>
              <div class="des order-name">
                <xsl:text>Tình trạng thanh toán: </xsl:text>
                <strong>
                  <xsl:value-of select="PaymentStatus"/>
                </strong>
              </div>
              <div class="des order-name">
                <xsl:text>Phương thức vận chuyển: </xsl:text>
                <strong>
                  <xsl:value-of select="ShippingMethod"/>
                </strong>
              </div>
            </div>
            <div class="order-list">
              <div class="item">
                <div class="order-item">
                  <div class="row order-information-wrapper">
                    <div class="col-12 col-md-6 mt-2 mb-2">
                      <div class="order-information">
                        <div class="title">Thông tin đặt mua</div>
                        <ul>
                          <li class="name">
                            <strong>
                              <xsl:value-of select="BillingFirstName"/>
                            </strong>
                          </li>
                          <li>
                            <xsl:text>Địa chỉ: </xsl:text>
                            <xsl:value-of select="BillingAddress"/>
                          </li>
                          <li>
                            <xsl:text>Email: </xsl:text>
                            <xsl:value-of select="BillingEmail"/>
                          </li>
                          <li>
                            <xsl:text>Điện thoại: </xsl:text>
                            <xsl:value-of select="BillingPhone"/>
                          </li>
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
                </div>
              </div>
            </div>
            <div class="card-item checkout-payment-wrap mt-3">
              <div class="card-heading">
                <div class="card-title">Phương thức thanh toán</div>
              </div>
              <div class="card-body">
                <ul class="checkout-check-list">
                  <xsl:apply-templates select="Payment"></xsl:apply-templates>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="repay-aside">
              <div class="order-total">
                <table>
                  <tr class="group">
                    <td class="label">
                      <xsl:text>Tổng tiền hàng chưa giảm: </xsl:text>
                    </td>
                    <td class="value">
                      <xsl:value-of select="OrderSubTotal"></xsl:value-of>
                    </td>
                  </tr>
                  <tr class="group">
                    <td class="label">
                      <xsl:text>Giảm giá: </xsl:text>
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
                  <tr class="group">
                    <td class="label">
                      Tổng cộng:
                    </td>
                    <td class="value total">
                      <xsl:value-of select="OrderTotal"></xsl:value-of>
                    </td>
                  </tr>
                 <!--  <xsl:if test="DiscountPaymentValue > 0">
                    <tr class="group discount-payment-section">
                      <td class="label"></td>
                      <td class="value discount-payment">
                        <xsl:text>Bạn sẻ được hoàn </xsl:text>
                        <xsl:value-of select="DiscountPaymentTotal"></xsl:value-of>
                        <xsl:text> khi thanh toán cổng VNPAY</xsl:text>
                      </td>
                    </tr>
                  </xsl:if> -->
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
              <div class="button-group cart-group-button mt-3">
                <a class="btn btn-white text-light-grey btn-back" href="#">   
                	<xsl:attribute name="data-code">
                    <xsl:value-of select="OrderCode"/>
                  </xsl:attribute>
                  <xsl:attribute name="onclick">
                    <xsl:text>AjaxCheckout.cancelOrder(this);return false;</xsl:text>
                  </xsl:attribute> 
                  <em class="ri-arrow-left-line"></em>
                  <span class="ml-1">Hủy đơn hàng</span> 
                </a>

                <a class="btn btn-next btn-gradient" href="#">
                  <xsl:attribute name="data-code">
                    <xsl:value-of select="OrderCode"/>
                  </xsl:attribute>
                  <xsl:attribute name="onclick">
                    <xsl:text>AjaxCheckout.paymentAgain(this);return false;</xsl:text>
                  </xsl:attribute>
                  <span>Thanh toán lại</span>
                  <em class="lnr lnr-arrow-right"></em>
                </a>
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
        <a class="product" href="#">
          <xsl:attribute name="href">
            <xsl:value-of select="Url" />
          </xsl:attribute>
          <div class="img">
            <img class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=">
              <xsl:attribute name="data-src">
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
  </xsl:template>
  <xsl:template match="Payment">
    <li class="checkout-check-item">
      <label>
        <input type="radio" name="PaymentMethod" onchange="AjaxCheckout.ordercalculatoronpaymentagain()">
          <xsl:attribute name="id">
            <xsl:value-of select="Id"></xsl:value-of>
          </xsl:attribute>
          <xsl:attribute name="value">
            <xsl:value-of select="Id"></xsl:value-of>
          </xsl:attribute>
          <xsl:if test="IsActive = 'true'"> 
            <xsl:attribute name="checked">
              <xsl:text>checked</xsl:text>
            </xsl:attribute>
          </xsl:if>
        </input>
        <span class="fake-radio"></span>
        <div class="content">
          <xsl:value-of disable-output-escaping="yes" select="Description"></xsl:value-of>

        </div>
      </label>
      

     
      <xsl:if test="Id = 4">
        <div class="vnpay-type-group-wrapper">
          <div class="vnpay-type-group">
            <div class="vnpay-type-group-title">Thanh toán quét mã VNPAYQR</div>
            <div class="bank-list">
              <div class="row row-4">
                <div class="w-100">
                  <label class="select-bank">
                    <input name="BankCode" type="radio" value="VNPAYQR" />
                    <div class="content">
                      <img src="/Data/Sites/1/media/checkout/payment/2.png" />
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="vnpay-type-group vnpay-type-group-dropdown">
            <div class="vnpay-type-group-title">Thẻ ATM hoặc tài khoản ngân hàng
              <i class="ri-arrow-down-s-line"></i>
            </div>
            <div class="bank-list">
              <div class="row row-sm-6 row-4">
                <div class="w-100">
                  <label class="select-bank" for="VIETCOMBANK">
                    <input type="radio" value="VIETCOMBANK" id="VIETCOMBANK" name="BankCode" />
                    <div class="content"><img
                        src="https://sandbox.vnpayment.vn/paymentv2/images/bank/vietcombank_logo.png"
                        alt="VIETCOMBANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="VIETINBANK">
                    <input type="radio" value="VIETINBANK" id="VIETINBANK" name="BankCode" />
                    <div class="content"><img
                        src="https://sandbox.vnpayment.vn/paymentv2/images/bank/vietinbank_logo.png" alt="VIETINBANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100"> <label class="select-bank">
                    <input type="radio" value="BIDV" id="BIDV" name="BankCode" />
                    <div class="content"><img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/bidv_logo.png"
                        alt="BIDV" />
                    </div>
                  </label></div>

                <div class="w-100">
                  <label class="select-bank" for="AGRIBANK">
                    <input type="radio" value="AGRIBANK" id="AGRIBANK" name="BankCode" />
                    <div class="content"><img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/agribank_logo.png"
                        alt="AGRIBANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="SACOMBANK">
                    <input type="radio" value="SACOMBANK" id="SACOMBANK" name="BankCode" />
                    <div class="content"><img
                        src="https://sandbox.vnpayment.vn/paymentv2/images/bank/sacombank_logo.png" alt="SACOMBANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="TECHCOMBANK">
                    <input type="radio" value="TECHCOMBANK" id="TECHCOMBANK" name="BankCode" />
                    <div class="content"><img
                        src="https://sandbox.vnpayment.vn/paymentv2/images/bank/techcombank_logo.png"
                        alt="TECHCOMBANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="MBBANK">
                    <input type="radio" value="MBBANK" id="MBBANK" name="BankCode" />
                    <div class="content"><img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/mbb_logo.png"
                        alt="MBBANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="ACB">
                    <input type="radio" value="ACB" id="ACB" name="BankCode" />
                    <div class="content"><img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/acb_logo.png"
                        alt="ACB" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="VPBANK">
                    <input type="radio" value="VPBANK" id="VPBANK" name="BankCode" />
                    <div class="content"><img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/vpbank_logo.png"
                        alt="VPBANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="SHB">
                    <input type="radio" value="SHB" id="SHB" name="BankCode" />
                    <div class="content"><img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/shb_logo.png"
                        alt="SHB" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="DONGABANK">
                    <input type="radio" value="DONGABANK" id="DONGABANK" name="BankCode" />
                    <div class="content"><img
                        src="https://sandbox.vnpayment.vn/paymentv2/images/bank/dongabank_logo.png" alt="DONGABANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="EXIMBANK">
                    <input type="radio" value="EXIMBANK" id="EXIMBANK" name="BankCode" />
                    <div class="content"><img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/eximbank_logo.png"
                        alt="EXIMBANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="TPBANK">
                    <input type="radio" value="TPBANK" id="TPBANK" name="BankCode" />
                    <div class="content"><img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/tpbank_logo.png"
                        alt="TPBANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="NCB">
                    <input type="radio" value="NCB" id="NCB" name="BankCode" />
                    <div class="content"><img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/ncb_logo.png"
                        alt="NCB" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="OJB">
                    <input type="radio" value="OJB" id="OJB" name="BankCode" />
                    <div class="content"><img
                        src="https://sandbox.vnpayment.vn/paymentv2/images/bank/oceanbank_logo.png" alt="OJB" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="MSBANK">
                    <input type="radio" value="MSBANK" id="MSBANK" name="BankCode" />
                    <div class="content"><img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/msbank_logo.png"
                        alt="MSBANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="HDBANK">
                    <input type="radio" value="HDBANK" id="HDBANK" name="BankCode" />
                    <div class="content"><img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/hdbank_logo.png"
                        alt="HDBANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="NAMABANK">
                    <input type="radio" value="NAMABANK" id="NAMABANK" name="BankCode" />
                    <div class="content"><img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/namabank_logo.png"
                        alt="NAMABANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="OCB">
                    <input type="radio" value="OCB" id="OCB" name="BankCode" />
                    <div class="content"><img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/ocb_logo.png"
                        alt="OCB" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="SCB">
                    <input type="radio" value="SCB" id="SCB" name="BankCode" />
                    <div class="content"><img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/scb_logo.png"
                        alt="SCB" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="IVB">
                    <input type="radio" value="IVB" id="IVB" name="BankCode" />
                    <div class="content"><img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/ivb_logo.png"
                        alt="IVB" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="ABBANK">
                    <input type="radio" value="ABBANK" id="ABBANK" name="BankCode" />
                    <div class="content"><img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/abbank_logo.png"
                        alt="ABBANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="SEABANK">
                    <input type="radio" value="SEABANK" id="SEABANK" name="BankCode" />
                    <div class="content"><img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/seabank_logo.png"
                        alt="SEABANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="VIETBANK">
                    <input type="radio" value="VIETBANK" id="VIETBANK" name="BankCode" />
                    <div class="content"><img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/vietbank_logo.png"
                        alt="VIETBANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="VIETCAPITALBANK">
                    <input type="radio" value="VIETCAPITALBANK" id="VIETCAPITALBANK" name="BankCode" />
                    <div class="content"><img
                        src="https://sandbox.vnpayment.vn/paymentv2/images/bank/vietcapitalbank_logo.png"
                        alt="VIETCAPITALBANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="VIETABANK">
                    <input type="radio" value="VIETABANK" id="VIETABANK" name="BankCode" />
                    <div class="content"><img
                        src="https://sandbox.vnpayment.vn/paymentv2/images/bank/vietabank_logo.png" alt="VIETABANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="BACABANK">
                    <input type="radio" value="BACABANK" id="BACABANK" name="BankCode" />
                    <div class="content"><img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/bacabank_logo.png"
                        alt="BACABANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="SAIGONBANK">
                    <input type="radio" value="SAIGONBANK" id="SAIGONBANK" name="BankCode" />
                    <div class="content"><img
                        src="https://sandbox.vnpayment.vn/paymentv2/images/bank/saigonbank_logo.png" alt="SAIGONBANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="PVCOMBANK">
                    <input type="radio" value="PVCOMBANK" id="PVCOMBANK" name="BankCode" />
                    <div class="content"><img
                        src="https://sandbox.vnpayment.vn/paymentv2/images/bank/PVComBank_logo.png" alt="PVCOMBANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="WOORIBANK">
                    <input type="radio" value="WOORIBANK" id="WOORIBANK" name="BankCode" />
                    <div class="content"><img
                        src="https://sandbox.vnpayment.vn/paymentv2/images/bank/wooribank_logo.png" alt="WOORIBANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="KIENLONGBANK">
                    <input type="radio" value="KIENLONGBANK" id="KIENLONGBANK" name="BankCode" />
                    <div class="content"><img
                        src="https://sandbox.vnpayment.vn/paymentv2/images/bank/kienlongbank_logo.png"
                        alt="KIENLONGBANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="LIENVIETBANK">
                    <input type="radio" value="LIENVIETBANK" id="LIENVIETBANK" name="BankCode" />
                    <div class="content"><img
                        src="https://sandbox.vnpayment.vn/paymentv2/images/bank/lienvietbank_logo.png"
                        alt="LIENVIETBANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="BAOVIETBANK">
                    <input type="radio" value="BAOVIETBANK" id="BAOVIETBANK" name="BankCode" />
                    <div class="content"><img
                        src="https://sandbox.vnpayment.vn/paymentv2/images/bank/baovietbank_logo.png"
                        alt="BAOVIETBANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="PGBANK">
                    <input type="radio" value="PGBANK" id="PGBANK" name="BankCode" />
                    <div class="content"><img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/pgbank_logo.png"
                        alt="PGBANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="GPBANK">
                    <input type="radio" value="GPBANK" id="GPBANK" name="BankCode" />
                    <div class="content"><img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/gpbank_logo.png"
                        alt="GPBANK" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="UOB">
                    <input type="radio" value="UOB" id="UOB" name="BankCode" />
                    <div class="content"><img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/uob_logo.png"
                        alt="UOB" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="VRB">
                    <input type="radio" value="VRB" id="VRB" name="BankCode" />
                    <div class="content"><img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/vrb_logo.png"
                        alt="VRB" />
                    </div>
                  </label>
                </div>

                <div class="w-100">
                  <label class="select-bank" for="VIDBANK">
                    <input type="radio" value="VIDBANK" id="VIDBANK" name="BankCode" />
                    <div class="content"><img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/vidbank_logo.png"
                        alt="VIDBANK" />
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="vnpay-type-group vnpay-type-group-dropdown">
            <div class="vnpay-type-group-title">Thẻ thanh toán quốc tế
              <i class="ri-arrow-down-s-line"></i>
            </div>
            <div class="bank-list">
              <div class="row row-sm-5 row-2">
                <div class="w-100">
                  <label class="select-bank" for="AMEX">
                    <input type="radio" value="AMEX" id="AMEX" name="BankCode" />
                    <div class="content">
                      <img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/amex_logo.png" alt="AMEX" />

                    </div>
                  </label>
                </div>
                <div class="w-100">
                  <label class="select-bank" for="VISA">
                    <input type="radio" value="VISA" id="VISA" name="BankCode" />
                    <div class="content">
                      <img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/visa_logo.png" alt="VISA" />

                    </div>
                  </label>
                </div>
                <div class="w-100">
                  <label class="select-bank" for="MASTERCARD">
                    <input type="radio" value="MASTERCARD" id="MASTERCARD" name="BankCode" />
                    <div class="content">
                      <img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/mastercard_logo.png"
                        alt="MASTERCARD" />

                    </div>
                  </label>
                </div>
                <div class="w-100">
                  <label class="select-bank" for="JCB">
                    <input type="radio" value="JCB" id="JCB" name="BankCode" />
                    <div class="content">
                      <img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/jcb_logo.png" alt="JCB" />

                    </div>
                  </label>
                </div>
                <div class="w-100">
                  <label class="select-bank" for="UPI">
                    <input type="radio" value="UPI" id="UPI" name="BankCode" />
                    <div class="content">
                      <img src="https://sandbox.vnpayment.vn/paymentv2/images/bank/upi_logo.png" alt="UPI" />

                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="vnpay-type-group">
            <div class="vnpay-type-group-title">Ví điện tử VNPAY</div>
            <div class="bank-list">
              <div class="row row-4">
                <div class="w-100">
                  <label class="select-bank">
                    <input name="BankCode" type="radio" value="ABBANK" />
                    <div class="content">
                      <img src="https://sandbox.vnpayment.vn/paymentv2/Styles/images/paytype_ewallet.png" />
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </xsl:if>
    </li>
  </xsl:template>
</xsl:stylesheet>