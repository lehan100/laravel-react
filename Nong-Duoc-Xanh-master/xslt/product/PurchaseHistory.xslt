<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes"/>

  <xsl:template match="/OrderList">
    <div class="account-order">
      <table class="table-order">
        <thead>
          <tr>
            <th>Mã đơn hàng</th>
            <th>Ngày mua</th>
            <th>Sản phẩm</th>
            <th>Tổng tiền</th>
            <th>Trạng thái đơn hàng</th>
          </tr>
        </thead>
        <tbody>
          <xsl:apply-templates select="Order"></xsl:apply-templates>
        </tbody>
      </table> 
    </div>
  </xsl:template>
  <xsl:template match="Order">
    <tr>
      <td>
        <a class="text-orange font-bold" href="#!">
          <xsl:attribute name="href">
            <xsl:text>/account/OrderView.aspx?ordercode=</xsl:text>
            <xsl:value-of select="OrderCode"></xsl:value-of>
          </xsl:attribute>
          <xsl:attribute name="target">
            <xsl:value-of select="Target"></xsl:value-of>
          </xsl:attribute>
          <xsl:attribute name="title">
            <xsl:value-of select="OrderCode"></xsl:value-of>
          </xsl:attribute>
          <xsl:value-of select="OrderCode"></xsl:value-of>
        </a>
      </td>
      <td>
        <xsl:value-of select="OrderDate"></xsl:value-of>
      </td>
      <td>
        <xsl:apply-templates select="Product"></xsl:apply-templates>
      </td>
      <td style="white-space: nowrap">
        <xsl:value-of select="OrderTotal"></xsl:value-of>
      </td>
      <td class="text-center">
        <xsl:value-of select="OrderStatus"></xsl:value-of>
      </td>
    </tr>
  </xsl:template>
  
  <xsl:template match="Product">
    <a class="name" href="#!">
      <xsl:attribute name="href">
        <xsl:value-of select="Url"></xsl:value-of>
      </xsl:attribute>
      <xsl:attribute name="title">
        <xsl:value-of select="Title"></xsl:value-of>
      </xsl:attribute>
      <xsl:value-of select="Title"></xsl:value-of>
    </a>
  </xsl:template>
</xsl:stylesheet>