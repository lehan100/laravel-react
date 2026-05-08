<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes" />

  <xsl:template match="/PaymentMethod">
    <div style="display: none;" id="payment-again">
      <div class="section checkout-section">
       <div class="card-item checkout-payment-wrap">
        <div class="card-heading">
          <div class="card-title">Phương thức thanh toán</div>
        </div>
        <div class="card-body">
          <ul class="checkout-check-list">
            <xsl:apply-templates select="Payment"></xsl:apply-templates>
          </ul>
        </div>
      </div>
      <div calss="checkout-button">
      <div class="button-group cart-group-button">
        <a class="btn btn-next btn-gradient">
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
    </li>
  </xsl:template>
</xsl:stylesheet>