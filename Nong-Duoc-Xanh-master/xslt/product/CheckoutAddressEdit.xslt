<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes" />

  <xsl:template match="/CheckoutAddress">
    <div class="card-item checkout-info-wrap">
      <div class="card-heading">
        <div class="card-title">Thông tin giao hàng</div>
      </div>
      <div class="card-body">
        <div class="checkout-info-form">
          <div class="form-group">
            <label>
              <xsl:value-of select="FullNameText"></xsl:value-of>
              <small> *</small>
            </label>
            <div class="form-control">
              <input type="text" name="Address_FirstName" placeholder="Vui lòng nhập họ tên">
              <xsl:attribute name="value">
                <xsl:value-of select="FirstName"></xsl:value-of>
              </xsl:attribute>
              </input>
            </div>
          </div>
          <div class="form-group">
            <label>
              <xsl:value-of select="PhoneText"></xsl:value-of>
              <small> *</small>
            </label>
            <div class="form-control">
              <input type="text" name="Address_Phone">
              <xsl:attribute name="value">
                <xsl:value-of select="Phone"></xsl:value-of>
              </xsl:attribute>
              </input>
            </div>
          </div>
          <div class="form-group">
            <label>
              <xsl:value-of select="EmailText"></xsl:value-of>
              <small> *</small>
            </label>
            <div class="form-control">
              <input type="text" name="Address_Email">
              <xsl:attribute name="value">
                <xsl:value-of select="Email"></xsl:value-of>
              </xsl:attribute>
              </input>
            </div>
          </div>

          <div class="form-group">
            <label>
              <xsl:value-of select="ProvinceText"></xsl:value-of>
              <small> *</small>
            </label>
            <div class="form-control">
              <select name="Address_Province"
                onchange="AjaxCheckout.getdistrictsbyprovinceguid(this, 'Address_District')">
                <option value="">
                  <xsl:value-of select="SelectProvinceText"></xsl:value-of>
                </option>
                <xsl:apply-templates select="Provinces"></xsl:apply-templates>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>
              <xsl:value-of select="DistrictText"></xsl:value-of>
              <small> *</small>
            </label>
            <div class="form-control">
              <select name="Address_District" onchange="AjaxCheckout.loadShippingServiceList();return false;">
                <option value="">
                  <xsl:value-of select="SelectDistrictText"></xsl:value-of>
                </option>
                <xsl:apply-templates select="Districts"></xsl:apply-templates>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>
              <!--<xsl:value-of select="AddressText"></xsl:value-of>-->
              Địa chỉ giao hàng
              <small> *</small>
            </label>
            <div class="form-control">
              <input type="text" name="Address_Address" placeholder="Số nhà, tên đường">
              <xsl:attribute name="value">
                <xsl:value-of select="Address"></xsl:value-of>
              </xsl:attribute>
              </input>
            </div>
          </div>
          <div class="form-group">
            <label>Ghi chú</label>
            <div class="form-control">
              <textarea name="OrderNote" cols="30" rows="10">
                <xsl:value-of select="OrderNote"></xsl:value-of>
              </textarea>
              <div class="note text-light-grey fz-14 mt-1">Vui lòng ghi rõ thông tin nếu bạn là người nước ngoài</div>
            </div>
          </div>
          <xsl:if test="count(UserAddress) > 0">
            <div class="add-new-address mt-4">
              Bạn muốn giao hàng đến địa chỉ khác? <a href="#">Chọn địa chỉ giao hàng</a>
            </div>
            <div class="address-list mt-4 hidden">
              <ul class="checkout-check-list">
                <xsl:apply-templates select="UserAddress"/>
              </ul>
            </div>
          </xsl:if>
        </div>
      </div>
    </div>

    <div class="card-item checkout-issue-invoice-wrap">
      <div class="card-heading">
        <div class="checkout-check-item">
          <label>
            <input class="issueInvoice" id="Invoice_Required" type="checkbox" name="Invoice_Required">
            <xsl:attribute name="onclick">
              <xsl:text>AjaxCheckout.toggleCompany()</xsl:text>
            </xsl:attribute>
            </input>
            <span class="fake-radio"></span>
            <div class="content">
              <div class="card-title">Xuất hóa đơn đỏ</div>
            </div>
          </label>
        </div>
      </div>
      <div class="card-body">
        <div class="checkout-info-form">
          <div class="form-group">
            <label>
              <xsl:value-of select="CompanyNameText"></xsl:value-of>
              <small> *</small>
            </label>
            <div class="form-control">
              <input type="text" name="Invoice_CompanyName" placeholder="Vui lòng nhập tên công ty">
              <xsl:attribute name="value">
                <xsl:value-of select="CompanyName"></xsl:value-of>
              </xsl:attribute>
              </input>
            </div>
          </div>
          <div class="form-group">
            <label>
              <xsl:value-of select="CompanyTaxCodeText"></xsl:value-of>
              <small> *</small>
            </label>
            <div class="form-control">
              <input type="text" name="Invoice_CompanyTaxCode">
              <xsl:attribute name="value">
                <xsl:value-of select="CompanyTaxCode"></xsl:value-of>
              </xsl:attribute>
              </input>
            </div>
          </div>
          <div class="form-group">
            <label>
              <xsl:value-of select="CompanyAddressText"></xsl:value-of>
              <small> *</small>
            </label>
            <div class="form-control">
              <textarea name="Invoice_CompanyAddress" cols="30" rows="10" placeholder="Số nhà, địa chỉ">
                <xsl:attribute name="value">
                  <xsl:value-of select="CompanyAddress"></xsl:value-of>
                </xsl:attribute>
                <xsl:value-of select="CompanyAddress"></xsl:value-of>
              </textarea>
            </div>
          </div>
        </div>
      </div>
    </div>

  </xsl:template>
  <xsl:template match="UserAddress">
    <li class="checkout-check-item">
      <label>
        <input type="radio"  name="UserAddress" onchange="AjaxCart.selectUserAddress(this);return false;">  
          <xsl:attribute name="data-name"> 
            <xsl:value-of select="FirstName"/>
          </xsl:attribute>
          <xsl:attribute name="data-phone"> 
            <xsl:value-of select="Phone"/>
          </xsl:attribute>
          <xsl:attribute name="data-email">
            <xsl:value-of select="Email"/>
          </xsl:attribute>
          <xsl:attribute name="data-province">
            <xsl:value-of select="ProvinceGuid"/>
          </xsl:attribute>
          <xsl:attribute name="data-district">
            <xsl:value-of select="DistrictGuid"/>
          </xsl:attribute>
          <xsl:attribute name="data-address">
            <xsl:value-of select="Address"/>
          </xsl:attribute> 
        </input>
        <span class="fake-radio"></span>
        <div class="content">
          <div class="text address-item leading-snug">
            <p><xsl:value-of select="FirstName"/></p>
            <p>
              <xsl:text>Địa chỉ: </xsl:text>
              <xsl:value-of select="Address"/>
            </p>
            <p>
              <xsl:text>Điện thoại: </xsl:text>   
              <xsl:value-of select="Phone"/>
              </p> 
          </div>
        </div>
      </label>
    </li>
  </xsl:template>
  <!--<xsl:template match="Stores">
    <option>
      <xsl:attribute name="value">
        <xsl:value-of select="StoreID"></xsl:value-of>
      </xsl:attribute>
      <xsl:value-of select="Name"></xsl:value-of>
    </option>
  </xsl:template>-->

  <xsl:template match="Provinces">
    <option>
      <xsl:if test="IsActive='true'">
        <xsl:attribute name="selected">
          <xsl:text>selected</xsl:text>
        </xsl:attribute>
      </xsl:if>
      <xsl:attribute name="value">
        <xsl:value-of select="Guid"></xsl:value-of>
      </xsl:attribute>
      <xsl:value-of select="Title"></xsl:value-of>
    </option>
  </xsl:template>

  <xsl:template match="Provinces" mode="Shipping">
    <option>
      <xsl:if test="ShippingIsActive='true'">
        <xsl:attribute name="selected">
          <xsl:text>selected</xsl:text>
        </xsl:attribute>
      </xsl:if>
      <xsl:attribute name="value">
        <xsl:value-of select="Guid"></xsl:value-of>
      </xsl:attribute>
      <xsl:value-of select="Title"></xsl:value-of>
    </option>
  </xsl:template>

  <xsl:template match="Districts">
    <option>
      <xsl:if test="IsActive='true'">
        <xsl:attribute name="selected">
          <xsl:text>selected</xsl:text>
        </xsl:attribute>
      </xsl:if>
      <xsl:attribute name="value">
        <xsl:value-of select="Guid"></xsl:value-of>
      </xsl:attribute>
      <xsl:value-of select="Title"></xsl:value-of>
    </option>
  </xsl:template>
  <xsl:template match="Districts" mode="Shipping">
    <option>
      <xsl:if test="ShippingIsActive='true'">
        <xsl:attribute name="selected">
          <xsl:text>selected</xsl:text>
        </xsl:attribute>
      </xsl:if>
      <xsl:attribute name="value">
        <xsl:value-of select="Guid"></xsl:value-of>
      </xsl:attribute>
      <xsl:value-of select="Title"></xsl:value-of>
    </option>
  </xsl:template>

</xsl:stylesheet>