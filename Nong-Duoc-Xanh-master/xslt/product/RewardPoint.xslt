<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes"/>

  <xsl:template match="/RewardPoints">
    <div class="account-order">
      <p>
        <xsl:text>Bạn có </xsl:text>
        <strong style="color: #41d67e;"> 
          <xsl:value-of select="RewardPointsBalance"/>
        </strong>
        <xsl:text> điểm trong tài khoản của bạn.</xsl:text> 
      </p>
      <table class="table-order">
        <thead>
          <tr>
            <th>Điểm</th>
            <th>Thời gian </th>
            <th>Nội dung  </th>
            <th>Điểm khả dụng tại thời điểm</th>
          </tr>
        </thead>
        <tbody>
          <xsl:apply-templates select="RewardPoint[Type = '20']"></xsl:apply-templates>
        </tbody>
      </table> 
    </div>
  </xsl:template>
  <xsl:template match="RewardPoint">
    <tr>
      <td>
        <xsl:choose>
          <xsl:when test="Type = '0'">
              <xsl:attribute name="style">
                <xsl:text>color: #41d67e;text-align : center;</xsl:text>
              </xsl:attribute>
                <xsl:text>+</xsl:text> 
          </xsl:when> 
          <xsl:when test="Type = '20'">
              <xsl:attribute name="style">
                <xsl:text>color: #e54d42;text-align : center;</xsl:text>
              </xsl:attribute>
          </xsl:when>
          <xsl:otherwise>
          </xsl:otherwise>
        </xsl:choose>
        <xsl:value-of select="Points"/>
      </td>
      <td>
        <xsl:value-of select="CreateDate"/>
      </td>
      <td>
        <xsl:value-of select="Message"/>
      </td>
      <td style="color: #41d67e;text-align : center;"> 
          <xsl:value-of select="PointsBalance"/> 
      </td>
    </tr>
  </xsl:template> 
</xsl:stylesheet>