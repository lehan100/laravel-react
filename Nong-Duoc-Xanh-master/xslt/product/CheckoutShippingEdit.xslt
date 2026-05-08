<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes" />

  <xsl:template match="/">

    <xsl:if test="count(/CheckoutMethod/Shipping)>0">
      <div class="card-item checkout-shipping-wrap">
        <div class="card-heading">
          <div class="card-title">Phương thức vận chuyển</div>
        </div>
        <div class="card-body">
          <ul class="checkout-check-list">
            <xsl:apply-templates select="/CheckoutMethod/Shipping"></xsl:apply-templates>
          </ul>
        </div>
      </div>
    </xsl:if>
    <xsl:if test="count(/CheckoutMethod/Payment)>0">
      <div class="card-item checkout-payment-wrap">
        <div class="card-heading">
          <div class="card-title">Phương thức thanh toán</div>
        </div>
        <div class="card-body">
          <ul class="checkout-check-list">
            <xsl:apply-templates select="/CheckoutMethod/Payment"></xsl:apply-templates>
          </ul>
        </div>
      </div>
    </xsl:if>

    <div class="button-group cart-group-button mt-4">
      <a class="btn btn-white text-light-grey btn-back" href="#">
        <xsl:attribute name="href">
          <xsl:value-of select="/CheckoutMethod/CartUrl" />
        </xsl:attribute>
        <em class="ri-arrow-left-line"></em>
        <span class="ml-1">Quay lại</span>
      </a>
      <a class="btn btn-next btn-gradient" href="#">
        <xsl:attribute name="onclick">
          <xsl:text>AjaxCheckout.saveorder(true, '</xsl:text>
          <xsl:value-of select="/CheckoutMethod/NextPageUrl" />
          <xsl:text>');return false;</xsl:text>
        </xsl:attribute>
        <span class="mr-1">Tiến hành thanh toán</span>
        <em class="ri-arrow-right-line"></em>
      </a>
    </div>

  </xsl:template>

  <xsl:template match="Shipping">
    <li class="checkout-check-item option">
      <xsl:if test="IsFastMethodId = 'true'">
        <xsl:attribute name="style">
          <xsl:text>display:none;</xsl:text>
        </xsl:attribute>
      </xsl:if>
      <label>
        <input type="radio" name="ShippingMethod" onchange="AjaxCheckout.ordercalculator()">
        <xsl:if test="position()=1">
          <xsl:attribute name="checked">
            <xsl:text>checked</xsl:text>
          </xsl:attribute>
        </xsl:if>
        <xsl:if test="IsFastMethodId = 'true'">
          <xsl:attribute name="data-isfast">
            <xsl:text>true</xsl:text>
          </xsl:attribute>
        </xsl:if>
        <xsl:attribute name="value">
          <xsl:value-of select="Id"></xsl:value-of>
        </xsl:attribute>
        <xsl:attribute name="provider">
          <xsl:value-of select="ShippingProvider"></xsl:value-of>
        </xsl:attribute>
        </input>
        <span class="fake-radio"></span>
        <div class="content">
          <div class="text">
            <p>
              <strong>
                <xsl:value-of select="Title"></xsl:value-of>
              </strong>
            </p>
            <xsl:if test="Description!=''">
              <div class="leading-snug">
                <xsl:value-of select="Description" disable-output-escaping="yes"></xsl:value-of>
              </div>
            </xsl:if>
            <div class="des-small">

            </div>
          </div>
          <!-- <xsl:if test="Description!=''">
            <div class="des">
              <xsl:value-of select="Description" disable-output-escaping="yes"></xsl:value-of>
            </div>
          </xsl:if> -->
          <xsl:if test="ShippingProvider = '16' ">
            <div class="services">
              <select name="ShippingService" onchange="AjaxCheckout.ordercalculator()">
                <xsl:apply-templates select="Service" />
              </select>
            </div>
          </xsl:if>
        </div>
      </label>
    </li>
  </xsl:template>

  <xsl:template match="Payment">
    <li class="checkout-check-item">
      <label>
        <input type="radio" name="PaymentMethod" onchange="AjaxCheckout.ordercalculator()">
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
        </xsl:if>
        </input>
        <span class="fake-radio"></span>
        <div class="content">
          <xsl:value-of disable-output-escaping="yes" select="Description"></xsl:value-of>
          <!-- <div class="img">
            
          </div>
          <div class="text-wrap">
            <div class="text">
              <xsl:value-of select="Title"></xsl:value-of>
            </div>
          </div> -->
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