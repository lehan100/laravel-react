<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes" />

  <xsl:template match="/">
    <xsl:if test="count(/CheckoutMethod/Shipping)>0">
      <div class="admin-title">
        <div class="text">Phương thức vận chuyển</div>
      </div>
      <div class="wrapper-form shipping-method">
        <xsl:apply-templates select="/CheckoutMethod/Shipping"></xsl:apply-templates>
      </div>
    </xsl:if>
    <xsl:if test="count(/CheckoutMethod/Payment)>0">
      <div class="admin-title">
        <div class="text">Phương thức thanh toán</div>
      </div>
      <div class="wrapper-form payment-method">
        <xsl:apply-templates select="/CheckoutMethod/Payment"></xsl:apply-templates>
      </div>
    </xsl:if>
    <div class="form-group">
      <div class="setting-control">
        <div class="btn-right">
          <a class="btn btn-primary grey">
            <xsl:attribute name="href">
              <xsl:value-of select="/CheckoutMethod/CartUrl" />
            </xsl:attribute>
            <em class="lnr lnr-arrow-left"></em>
            <span>Trở lại</span>
          </a>
          <a class="btn btn-primary red">
            <xsl:attribute name="onclick">
              <xsl:text>AjaxCheckout.saveorder(true, '</xsl:text>
              <xsl:value-of select="/CheckoutMethod/NextPageUrl" />
              <xsl:text>');return false;</xsl:text>
            </xsl:attribute>
            <span>Thanh toán</span>
            <em class="lnr lnr-arrow-right"></em>
          </a>
        </div>
      </div>
    </div>
  </xsl:template>

  <xsl:template match="Shipping">
    <div class="qradio">
      <input type="radio" name="ShippingMethod" onchange="AjaxCheckout.loadShippingServiceList(this);return false;">
        <xsl:attribute name="id">
          <xsl:value-of select="Id"></xsl:value-of>
        </xsl:attribute>
        <xsl:attribute name="provider">
          <xsl:value-of select="ShippingProvider"></xsl:value-of>
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
      <label>
        <xsl:if test="Description!=''"> 
          <div class="image-wrapper">
            <xsl:value-of select="Description" disable-output-escaping="yes"></xsl:value-of>
          </div>
        </xsl:if>
        <div class="content">
          <div class="text">
            <xsl:value-of select="Title" disable-output-escaping="yes"></xsl:value-of>
          </div>
        </div>
      </label>
      <xsl:if test="ShippingProvider = '16' ">
        <div class="services">
          <select name="ShippingService" onchange="AjaxCheckout.ordercalculator()">
            <xsl:apply-templates select="Service"/>
          </select>
        </div>
      </xsl:if>
    </div>
  </xsl:template>
  <xsl:template match="Service">
    <option>
      <xsl:attribute name="value">
        <xsl:value-of select="Value"/>
      </xsl:attribute>
      <xsl:value-of select="Name"/>
    </option>
  </xsl:template>
  <xsl:template match="Payment">
    <div class="qradio">
      <input type="radio" name="PaymentMethod" onchange="AjaxCheckout.ordercalculator()">
        <xsl:attribute name="id">
          <xsl:text>paymenth-method-</xsl:text>
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
      <label>
        <xsl:attribute name="for">
          <xsl:text>paymenth-method-</xsl:text>
          <xsl:value-of select="Id"></xsl:value-of>
        </xsl:attribute>
        <xsl:value-of disable-output-escaping="yes" select="Description"></xsl:value-of>
      </label>
    </div>


    <!--<div class="method">
			<input type="radio" name="PaymentMethod">
				<xsl:attribute name="id">
					<xsl:value-of select="Id"></xsl:value-of>
				</xsl:attribute>
				<xsl:attribute name="value">
					<xsl:value-of select="Id"></xsl:value-of>
				</xsl:attribute>
			</input>
			<label style="text-align: start;">
				<xsl:attribute name="for">
					<xsl:value-of select="Id"></xsl:value-of>
				</xsl:attribute>
				<xsl:if test="Description!=''">
					<xsl:value-of select="Description" disable-output-escaping="yes"></xsl:value-of>
				</xsl:if>
				<xsl:if test="Title = ''">
					<xsl:value-of select="Title" disable-output-escaping="yes"></xsl:value-of>
				</xsl:if>
			</label>
			<xsl:if test="PaymentProvider = '10'">

				<div class="sub-method" style="display:none;">
					<p class="term-service">
						<xsl:value-of disable-output-escaping="yes" select="/CheckoutMethod/sTermService"></xsl:value-of>
					</p>
					<div class="method">
						<input type="radio" name="PaymentMethod" value="100"
							onchange="AjaxCheckout.getpaymenttotal(this)">
							<xsl:attribute name="name">
								<xsl:text>SubPaymentMethod_</xsl:text>
								<xsl:value-of select="Id" />
							</xsl:attribute>
							<xsl:attribute name="id">
								<xsl:text>SubPaymentMethod_</xsl:text>
								<xsl:value-of select="Id" />
								<xsl:text>_100</xsl:text>
							</xsl:attribute>
						</input>
						<label style="text-align: start;" for="6">
							<xsl:attribute name="for">
								<xsl:text>SubPaymentMethod_</xsl:text>
								<xsl:value-of select="Id" />
								<xsl:text>_100</xsl:text>
							</xsl:attribute>
							<xsl:text>100% Payment</xsl:text>
						</label>
					</div>
					<div class="method">
						<input type="radio" name="PaymentMethod" value="50"
							onchange="AjaxCheckout.getpaymenttotal(this)">
							<xsl:attribute name="name">
								<xsl:text>SubPaymentMethod_</xsl:text>
								<xsl:value-of select="Id" />
							</xsl:attribute>
							<xsl:attribute name="id">
								<xsl:text>SubPaymentMethod_</xsl:text>
								<xsl:value-of select="Id" />
								<xsl:text>_50</xsl:text>
							</xsl:attribute>
						</input>
						<label style="text-align: start;" for="6">
							<xsl:attribute name="for">
								<xsl:text>SubPaymentMethod_</xsl:text>
								<xsl:value-of select="Id" />
								<xsl:text>_50</xsl:text>
							</xsl:attribute>
							<xsl:text>Deposit 50%</xsl:text>
						</label>
					</div>
				</div>
			</xsl:if>

		</div>-->

  </xsl:template>

</xsl:stylesheet>
